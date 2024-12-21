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
              className="p-2 border rounded-lg focus:outline-none bg-transparent text-primary placeholder:text-zinc-700 border-zinc-500"
            />
            <div className="relative">
              <input
                autoComplete="off"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="p-2 w-full border rounded-lg focus:outline-none bg-transparent text-primary placeholder:text-zinc-700 border-zinc-500"
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
              className={`p-2 bg-main rounded-lg hover:bg-[#9036c8] focus:outline-none disabled:bg-gray-800 ${(formData.email === '' || formData.password === '') ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={(formData.email === '' || formData.password === '' | loading)}>
              {
                loading ? 'Please wait...' : 'Login'
              }
            </button>
          </form>
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
