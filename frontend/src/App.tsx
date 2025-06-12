import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import AppRouter from "./router/main.routes";
import { ToastContainer } from "react-toastify";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
    <ToastContainer/>
      <AppRouter />
    </>
  );
}

export default App;
