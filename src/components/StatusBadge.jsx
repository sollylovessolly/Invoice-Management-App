import { useEffect, useState } from "react";

export default function StatusBadge({ status }) {
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme") || "light"
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute("data-theme") || "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  const styles = {
    paid: {
      light: "bg-[#F3FDFA] text-[#33D69F]",
      dark: "bg-[rgba(51,214,159,0.08)] text-[#33D69F]",
      dot: "bg-[#33D69F]",
      label: "Paid",
    },
    pending: {
      light: "bg-[rgba(255,143,0,0.06)] text-[#FF8F00]",
      dark: "bg-[rgba(255,143,0,0.08)] text-[#FF8F00]",
      dot: "bg-[#FF8F00]",
      label: "Pending",
    },
    draft: {
      light: "bg-[#F4F4F5] text-[#373B53]",
      dark: "bg-[#252945] text-[#DFE3FA]",
      dot: "bg-current",
      label: "Draft",
    },
  };

  const current = styles[status] || styles.draft;
  const wrapper = theme === "dark" ? current.dark : current.light;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-md px-4 py-3 min-w-[104px] justify-center font-bold text-xs ${wrapper}`}
    >
      <span className={`h-2 w-2 rounded-full ${current.dot}`} />
      <span>{current.label}</span>
    </div>
  );
}