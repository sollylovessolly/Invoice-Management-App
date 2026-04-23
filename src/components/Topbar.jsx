import logo from "../assets/logo.png";
import profile from "../assets/Oval.png";
import { useEffect, useState } from "react";
import lightmode from "../assets/lightmode.png"
import darkmode from "../assets/darkmode.png"

export default function Topbar() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  return (
    <div className="md:hidden flex items-center justify-between h-[72px] px-0 bg-[#373B53]">
      <div className="h-[80px] w-[73px] bg-[#7C5DFA] flex items-center justify-center relative rounded-br-[20px] rounded-tl-[20px] rotate-90">
        <div className="absolute right-0 w-1/2 h-full bg-[#9277FF] rounded-bl-[20px] rotate-270" />
        <img src={logo} className="relative z-10 h-6 rotate-90" />
      </div>

      <div className="flex items-center gap-4">
        <button onClick={toggleTheme} className="text-[#7E88C3]">
          <img
            src={theme === "light" ? darkmode : lightmode}
            alt="theme toggle"
            className="h-5 w-5"
            /> 
        </button>
        <img src={profile} className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}