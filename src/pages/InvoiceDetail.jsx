import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DeleteModal from "../components/DeleteModal";
import StatusBadge from "../components/StatusBadge";
import { InvoiceContext } from "../context/InvoiceContext";

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { invoices, dispatch } = useContext(InvoiceContext);
  const [showModal, setShowModal] = useState(false);

  const invoice = invoices.find((inv) => String(inv.id) === String(id));

  if (!invoice) {
    return (
      <div
        className="min-h-screen px-6 py-10 md:pl-[120px]"
        style={{ background: "var(--bg)", color: "var(--text)" }}
      >
        <div className="mx-auto max-w-[730px]">
          <p>Invoice not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen px-6 py-8 md:pl-[120px] md:pr-10 md:pt-16"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <div className="mx-auto w-full max-w-[730px]">
        <button
          onClick={() => navigate("/")}
          className="mb-8 flex items-center gap-4 text-sm font-bold transition hover:text-[#7C5DFA]"
        >
          <span className="text-[#7C5DFA]">‹</span>
          Go back
        </button>

        <div
          className="mb-6 flex flex-col gap-4 rounded-lg px-6 py-6 shadow-sm md:flex-row md:items-center md:justify-between"
          style={{ background: "var(--card)" }}
        >
          <div className="flex items-center justify-between md:justify-start md:gap-5">
            <span className="text-sm" style={{ color: "var(--subtext)" }}>
              Status
            </span>
            <StatusBadge status={invoice.status} />
          </div>

          <div className="hidden gap-2 md:flex">
            <button
              onClick={() => navigate(`/edit/${invoice.id}`)}
              className="rounded-full px-6 py-4 text-sm font-bold transition hover:brightness-95"
              style={{ background: "var(--input)", color: "var(--subtext)" }}
            >
              Edit
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="rounded-full bg-[#EC5757] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#FF9797]"
            >
              Delete
            </button>

            <button
              disabled={invoice.status === "paid"}
              onClick={() => dispatch({ type: "MARK_PAID", payload: invoice.id })}
              className="rounded-full bg-[#7C5DFA] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#9277FF] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Mark as Paid
            </button>
          </div>
        </div>

        <div
          className="rounded-lg p-6 shadow-sm md:p-8"
          style={{ background: "var(--card)" }}
        >
          <div className="mb-8 flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="mb-2 text-sm font-bold">
                <span style={{ color: "var(--subtext)" }}>#</span>
                {invoice.id}
              </h2>
              <p className="text-sm" style={{ color: "var(--subtext)" }}>
                {invoice.description}
              </p>
            </div>

            <div
              className="text-sm leading-5 md:text-right"
              style={{ color: "var(--subtext)" }}
            >
              <p>{invoice.senderAddress?.street}</p>
              <p>{invoice.senderAddress?.city}</p>
              <p>{invoice.senderAddress?.postCode}</p>
              <p>{invoice.senderAddress?.country}</p>
            </div>
          </div>

          <div className="mb-10 grid grid-cols-1 gap-8 text-sm md:grid-cols-3">
            <div>
              <p className="mb-3" style={{ color: "var(--subtext)" }}>
                Invoice Date
              </p>
              <p className="mb-8 font-bold">{invoice.createdAt}</p>

              <p className="mb-3" style={{ color: "var(--subtext)" }}>
                Payment Due
              </p>
              <p className="font-bold">{invoice.paymentDue}</p>
            </div>

            <div>
              <p className="mb-3" style={{ color: "var(--subtext)" }}>
                Bill To
              </p>
              <p className="mb-2 font-bold">{invoice.clientName}</p>
              <div className="leading-5" style={{ color: "var(--subtext)" }}>
                <p>{invoice.clientAddress?.street}</p>
                <p>{invoice.clientAddress?.city}</p>
                <p>{invoice.clientAddress?.postCode}</p>
                <p>{invoice.clientAddress?.country}</p>
              </div>
            </div>

            <div>
              <p className="mb-3" style={{ color: "var(--subtext)" }}>
                Sent to
              </p>
              <p className="font-bold break-all">{invoice.clientEmail}</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg">
            <div className="p-6 md:p-8" style={{ background: "var(--input)" }}>
              <div
                className="mb-8 hidden grid-cols-4 text-xs md:grid"
                style={{ color: "var(--subtext)" }}
              >
                <span>Item Name</span>
                <span className="text-center">QTY.</span>
                <span className="text-center">Price</span>
                <span className="text-right">Total</span>
              </div>

              <div className="space-y-6">
                {invoice.items?.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4"
                  >
                    <div>
                      <p className="font-bold">{item.name}</p>
                      <p
                        className="mt-1 text-xs md:hidden"
                        style={{ color: "var(--subtext)" }}
                      >
                        {item.quantity} x £ {item.price}
                      </p>
                    </div>

                    <p
                      className="hidden text-center md:block"
                      style={{ color: "var(--subtext)" }}
                    >
                      {item.quantity}
                    </p>

                    <p
                      className="hidden text-center md:block"
                      style={{ color: "var(--subtext)" }}
                    >
                      £ {item.price}
                    </p>

                    <p className="text-right font-bold">£ {item.total}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between bg-[#373B53] px-6 py-8 text-white md:px-8">
              <span className="text-xs">Amount Due</span>
              <span className="text-2xl font-bold">
                £ {Number(invoice.total).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div
          className="fixed bottom-0 left-0 right-0 flex gap-2 px-6 py-5 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] md:hidden"
          style={{ background: "var(--card)" }}
        >
          <button
            onClick={() => navigate(`/edit/${invoice.id}`)}
            className="rounded-full px-6 py-4 text-sm font-bold transition hover:brightness-95"
            style={{ background: "var(--input)", color: "var(--subtext)" }}
          >
            Edit
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="rounded-full bg-[#EC5757] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#FF9797]"
          >
            Delete
          </button>

          <button
            disabled={invoice.status === "paid"}
            onClick={() => dispatch({ type: "MARK_PAID", payload: invoice.id })}
            className="ml-auto rounded-full bg-[#7C5DFA] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#9277FF] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Mark as Paid
          </button>
        </div>

        {showModal && (
          <DeleteModal
            invoiceId={invoice.id}
            onCancel={() => setShowModal(false)}
            onConfirm={() => {
              dispatch({ type: "DELETE", payload: invoice.id });
              navigate("/");
            }}
          />
        )}
      </div>
    </div>
  );
}