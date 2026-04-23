import { useContext, useMemo, useRef, useState, useEffect } from "react";
import { InvoiceContext } from "../context/InvoiceContext";
import { Link, useNavigate } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import empty from "../assets/Group.png";

const STATUS_OPTIONS = ["draft", "pending", "paid"];

export default function InvoiceList() {
  const { invoices } = useContext(InvoiceContext);
  const totalInvoices = invoices.length;
  const navigate = useNavigate();

  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleStatus = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((item) => item !== status)
        : [...prev, status]
    );
  };

  const filtered = useMemo(() => {
    if (selectedStatuses.length === 0) return invoices;
    return invoices.filter((invoice) =>
      selectedStatuses.includes(invoice.status)
    );
  }, [invoices, selectedStatuses]);

  return (
    <div
      className="min-h-screen max-w-[900px] mx-auto px-6 py-8 md:px-10 md:py-14"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <div className="mb-8 flex items-center justify-between md:mb-14">
        <div>
          <h1 className="text-2xl font-bold md:text-[32px] md:leading-[36px]">
            Invoices
          </h1>

          <p
            className="mt-1 text-xs md:text-sm"
            style={{ color: "var(--subtext)" }}
          >
            <span className="md:hidden">{totalInvoices} invoices</span>
            <span className="hidden md:inline">
              There are {totalInvoices} total invoices
            </span>
          </p>
        </div>

        <div className="flex items-center gap-4 md:gap-10">
          <div className="relative" ref={filterRef}>
            <button
              type="button"
              onClick={() => setIsFilterOpen((prev) => !prev)}
              className="flex items-center gap-3 text-xs font-bold md:text-sm"
              style={{ color: "var(--text)" }}
            >
              <span className="md:hidden">Filter</span>
              <span className="hidden md:inline">Filter by status</span>

              <svg
                className={`h-2.5 w-4 transition-transform ${
                  isFilterOpen ? "rotate-180" : ""
                }`}
                viewBox="0 0 11 7"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L5.5 5L10 1"
                  stroke="#7C5DFA"
                  strokeWidth="2"
                />
              </svg>
            </button>

            {isFilterOpen && (
              <div
                className="absolute right-0 top-[calc(100%+24px)] z-50 w-[192px] rounded-lg px-6 py-6 shadow-[0_10px_20px_rgba(72,84,159,0.25)]"
                style={{ background: "var(--card)" }}
              >
                <div className="flex flex-col gap-4">
                  {STATUS_OPTIONS.map((status) => {
                    const checked = selectedStatuses.includes(status);

                    return (
                      <label
                        key={status}
                        className="flex cursor-pointer items-center gap-3 text-[15px] font-bold"
                        style={{ color: "var(--text)" }}
                      >
                        <span className="relative flex h-4 w-4 items-center justify-center">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleStatus(status)}
                            className="peer sr-only"
                          />

                          <span
                            className={`h-4 w-4 rounded-[2px] border transition ${
                              checked
                                ? "border-[#7C5DFA] bg-[#7C5DFA]"
                                : ""
                            }`}
                            style={{
                              borderColor: checked ? "#7C5DFA" : "var(--border)",
                              background: checked ? "#7C5DFA" : "var(--input)",
                            }}
                          />

                          {checked && (
                            <svg
                              className="absolute h-2.5 w-2.5"
                              viewBox="0 0 10 8"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1 4.30435L3.69565 7L9 1"
                                stroke="white"
                                strokeWidth="2"
                              />
                            </svg>
                          )}
                        </span>

                        <span className="capitalize">{status}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate("/new")}
            className="flex items-center gap-2 rounded-full bg-[#7C5DFA] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#9277FF] md:px-4 md:py-3 md:text-sm"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-sm font-bold text-[#7C5DFA]">
              +
            </span>
            <span className="md:hidden">New</span>
            <span className="hidden md:inline">New Invoice</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-20 text-center md:py-28">
            <img src={empty} alt="No invoices" className="mb-10 w-[193px]" />

            

            
          </div>
        ) : (
          filtered.map((inv) => (
            <Link key={inv.id} to={`/invoice/${inv.id}`}>
              <div
                className="rounded-lg border border-transparent px-6 py-6 shadow-sm transition hover:border-[#7C5DFA]"
                style={{ background: "var(--card)" }}
              >
                <div className="flex flex-col gap-6 md:hidden">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-bold">
                        <span style={{ color: "var(--subtext)" }}>#</span>
                        {inv.id}
                      </p>
                      <p
                        className="mt-6 text-sm"
                        style={{ color: "var(--subtext)" }}
                      >
                        Due {inv.paymentDue || "N/A"}
                      </p>
                    </div>

                    <p
                      className="text-sm text-right"
                      style={{ color: "var(--subtext)" }}
                    >
                      {inv.clientName}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <p className="text-2xl font-bold tracking-[-0.5px]">
                      £ {Number(inv.total).toLocaleString()}
                    </p>

                    <StatusBadge status={inv.status} />
                  </div>
                </div>

                <div className="hidden md:flex md:items-center md:justify-between md:gap-6">
                  <div className="flex items-center gap-8 lg:gap-10">
                    <p className="min-w-[60px] font-bold">
                      <span style={{ color: "var(--subtext)" }}>#</span>
                      {inv.id}
                    </p>

                    <p
                      className="min-w-[100px] text-sm"
                      style={{ color: "var(--subtext)" }}
                    >
                      Due {inv.paymentDue || "N/A"}
                    </p>

                    <p
                      className="min-w-[120px] text-sm"
                      style={{ color: "var(--subtext)" }}
                    >
                      {inv.clientName}
                    </p>
                  </div>

                  <div className="flex items-center gap-8">
                    <p className="min-w-[100px] text-right font-bold">
                      £ {Number(inv.total).toLocaleString()}
                    </p>

                    <StatusBadge status={inv.status} />

                    <span className="text-lg text-[#7C5DFA]">›</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}