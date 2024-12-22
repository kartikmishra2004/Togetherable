import React, { useState } from 'react';
import { useFirebase } from '../context/firebase.jsx';
import { Link, Navigate } from 'react-router-dom';

const Login = () => {
  const firebase = useFirebase();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    firebase.signinWithEmailAndPassword(formData.email, formData.password)
      .then(() => setLoading(false))
      .catch((err) => { console.log(err); setLoading(false) });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const { user } = useFirebase();

  if (user === null) {
    return (
      <div className="flex h-[100vh] flex-col items-center justify-center font-main">
        <div className='flex  flex-col items-center justify-center border border-zinc-800 bg-secondary p-14 rounded-lg'>
          <h2 className="mb-6 text-2xl font-semibold">Login</h2>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-72">
            <input
              autoComplete="off"
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="px-2 py-3 border rounded-lg focus:outline-none bg-transparent text-primary placeholder:text-zinc-700 border-zinc-500"
            />
            <div className="relative">
              <input
                autoComplete="off"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="px-2 py-3 w-full border rounded-lg focus:outline-none bg-transparent text-primary placeholder:text-zinc-700 border-zinc-500"
              />
              <span
                className="absolute inset-y-0 right-3 flex items-center text-zinc-500 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? '◉' : '◠'}
              </span>
            </div>
            <button
              type="submit"
              className={`px-2 py-3 bg-main rounded-lg hover:bg-[#9036c8] focus:outline-none disabled:bg-gray-800 ${(formData.email === '' || formData.password === '') ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={(formData.email === '' || formData.password === '' | loading)}>
              {
                loading ? 'Please wait...' : 'Login'
              }
            </button>
          </form>
          <div className='w-full h-[1px] bg-zinc-500 my-6 flex justify-center items-center'><p className='bg-secondary px-2 text-xs'>OR</p></div>
          <div className="flex items-center w-full justify-center rounded-lg">
            <button onClick={() => firebase.continueWithGoogle()} className="flex justify-center items-center bg-gray-800 rounded-lg w-full py-3 text-sm font-medium text-primary">
              <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="-0.5 0 48 48" version="1.1"> <title>Google-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Color-" transform="translate(-401.000000, -860.000000)"> <g id="Google" transform="translate(401.000000, 860.000000)"> <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"> </path> <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"> </path> <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"> </path> <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"> </path> </g> </g> </g> </svg>
              <span>Continue with Google</span>
            </button>
          </div>
          <Link className="mt-4 text-zinc-400" to={'/signup'}>
            Don't have an account?
          </Link>
        </div>
      </div>
    );
  }
  return <Navigate to={'/'} />;
};

export default Login;
