import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import profile from "../assets/Oval.png"
import lightmode from "../assets/lightmode.png"
import darkmode from "../assets/darkmode.png"

export default function Sidebar() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[80px] bg-[#373B53] rounded-r-[20px] flex-col justify-between z-50">

      <div className="h-[88px] w-full bg-[#7C5DFA] flex items-center justify-center relative rounded-r-[20px]">
        <div className="absolute bottom-0 right-0 h-1/2 w-full bg-[#9277FF] rounded-tl-[20px]" />
        <img src={logo} className="relative z-10 h-8" />
      </div>

      <div className="flex flex-col items-center">
        <button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="h-20 w-full flex items-center justify-center border-b border-[#494E6E] text-[#7E88C3]"
        >
          <img
            src={theme === "light" ? darkmode : lightmode}
            alt="theme toggle"
            className="h-5 w-5"
            /> 
        </button>

        <div className="h-[88px] flex items-center justify-center">
          <img src={profile} className="h-10 w-10 rounded-full" />
        </div>
      </div>
    </aside>
  );
}