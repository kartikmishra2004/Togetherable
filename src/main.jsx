import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client';
import './index.css'
import App from './App.jsx'
import { FirebaseProvider } from './context/firebase.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FirebaseProvider>
      <div className="relative text-primary">
        <div className="fixed top-0 z-[-2] md:h-screen h-full w-full bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <App />
      </div>
    </FirebaseProvider>
  </StrictMode>,
)

