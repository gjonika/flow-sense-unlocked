import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const searchParams = new URLSearchParams(window.location.search);
const accessCode = searchParams.get("code");
const allowedCode = "letmein123";

if (accessCode !== allowedCode) {
  document.body.innerHTML = "<h1 style='text-align:center;margin-top:20vh;'>🔒 Access Denied</h1>";
  throw new Error("Unauthorized access");
}



createRoot(document.getElementById("root")!).render(<App />);
