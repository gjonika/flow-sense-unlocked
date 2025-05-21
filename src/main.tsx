
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const searchParams = new URLSearchParams(window.location.search);
const accessCode = searchParams.get("code");
const allowedCode = "letmein123";

if (accessCode !== allowedCode) {
  document.body.innerHTML = "<h1 style='text-align:center;margin-top:20vh;color:#808355;font-family:sans-serif;'>🔒 Access Denied</h1><p style='text-align:center;font-family:sans-serif;color:#64748b;'>This app requires an access code.</p>";
  throw new Error("Unauthorized access");
}

// Apply theme colors to the document
document.documentElement.style.setProperty('--background', '#fdfcf7');
document.documentElement.style.setProperty('--primary', '#d1b37f');
document.documentElement.style.setProperty('--primary-foreground', '#ffffff');
document.documentElement.style.setProperty('--secondary', '#808355');
document.documentElement.style.setProperty('--secondary-foreground', '#ffffff');

createRoot(document.getElementById("root")!).render(<App />);
