import { useState, useContext, useEffect } from "react";
import { InvoiceContext } from "../context/InvoiceContext";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const createEmptyForm = () => ({
  createdAt: "",
  paymentTerms: "30",
  paymentDue: "",
  description: "",
  clientName: "",
  clientEmail: "",
  senderAddress: {
    street: "",
    city: "",
    postCode: "",
    country: "",
  },
  clientAddress: {
    street: "",
    city: "",
    postCode: "",
    country: "",
  },
  items: [
    {
      id: crypto.randomUUID(),
      name: "",
      quantity: 1,
      price: 0,
      total: 0,
    },
  ],
  total: 0,
  status: "pending",
});

export default function InvoiceForm() {
  const { invoices, dispatch } = useContext(InvoiceContext);
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);
  const existingInvoice = invoices.find(
    (invoice) => String(invoice.id) === String(id)
  );

  const [form, setForm] = useState(createEmptyForm());
  const [errors, setErrors] = useState({});
  const [showTermsDropdown, setShowTermsDropdown] = useState(false);

  // ── ESC key closes the form ──────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        navigate(isEdit ? `/invoice/${id}` : "/");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isEdit, id, navigate]);

  // ── Populate form when editing ───────────────────────────────────────────
  useEffect(() => {
    if (isEdit) {
      if (existingInvoice) {
        setForm({
          ...existingInvoice,
          senderAddress: existingInvoice.senderAddress || {
            street: "",
            city: "",
            postCode: "",
            country: "",
          },
          clientAddress: existingInvoice.clientAddress || {
            street: "",
            city: "",
            postCode: "",
            country: "",
          },
          items:
            existingInvoice.items && existingInvoice.items.length > 0
              ? existingInvoice.items.map((item) => ({
                  id: item.id || crypto.randomUUID(),
                  name: item.name || "",
                  quantity: Number(item.quantity || 1),
                  price: Number(item.price || 0),
                  total: Number(item.total || 0),
                }))
              : [
                  {
                    id: crypto.randomUUID(),
                    name: "",
                    quantity: 1,
                    price: 0,
                    total: 0,
                  },
                ],
        });
      }
    } else {
      setForm(createEmptyForm());
    }
  }, [isEdit, existingInvoice]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // FIX: accepts explicit `dataField` so the HTML `name` attr can be unique
  // (prevents browser autofill from cross-filling sender ↔ client fields)
  const handleAddressChange = (e, type, dataField) => {
    const { value } = e.target;
    setForm((prev) => ({
      ...prev,
      [type]: { ...prev[type], [dataField]: value },
    }));
  };

  const handleItemChange = (itemId, field, value) => {
    setForm((prev) => {
      const updatedItems = prev.items.map((item) => {
        if (item.id !== itemId) return item;
        const updatedItem = {
          ...item,
          [field]:
            field === "quantity" || field === "price" ? Number(value) : value,
        };
        updatedItem.total =
          Number(updatedItem.quantity || 0) * Number(updatedItem.price || 0);
        return updatedItem;
      });
      return { ...prev, items: updatedItems };
    });
  };

  const paymentTermOptions = [
    { value: "1", label: "Net 1 Day" },
    { value: "7", label: "Net 7 Days" },
    { value: "14", label: "Net 14 Days" },
    { value: "30", label: "Net 30 Days" },
  ];

  const selectedPaymentTerm =
    paymentTermOptions.find((opt) => opt.value === form.paymentTerms)?.label ||
    "Net 30 Days";

  const addItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: crypto.randomUUID(), name: "", quantity: 1, price: 0, total: 0 },
      ],
    }));
  };

  const removeItem = (itemId) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };

  const calculateItemTotal = (item) =>
    Number(item.quantity || 0) * Number(item.price || 0);

  const calculateInvoiceTotal = () =>
    form.items.reduce((sum, item) => sum + calculateItemTotal(item), 0);

  const validateForm = () => {
    const nextErrors = {};

    if (!form.senderAddress.street.trim())
      nextErrors.senderStreet = "can't be empty";
    if (!form.senderAddress.city.trim())
      nextErrors.senderCity = "can't be empty";
    if (!form.senderAddress.postCode.trim())
      nextErrors.senderPostCode = "can't be empty";
    if (!form.senderAddress.country.trim())
      nextErrors.senderCountry = "can't be empty";

    if (!form.clientName.trim()) nextErrors.clientName = "can't be empty";

    if (!form.clientEmail.trim()) {
      nextErrors.clientEmail = "can't be empty";
    } else if (!/\S+@\S+\.\S+/.test(form.clientEmail)) {
      nextErrors.clientEmail = "invalid email";
    }

    if (!form.clientAddress.street.trim())
      nextErrors.clientStreet = "can't be empty";
    if (!form.clientAddress.city.trim())
      nextErrors.clientCity = "can't be empty";
    if (!form.clientAddress.postCode.trim())
      nextErrors.clientPostCode = "can't be empty";
    if (!form.clientAddress.country.trim())
      nextErrors.clientCountry = "can't be empty";

    if (!form.createdAt) nextErrors.createdAt = "can't be empty";
    if (!form.paymentTerms) nextErrors.paymentTerms = "can't be empty";
    if (!form.description.trim()) nextErrors.description = "can't be empty";

    if (!form.items.length) nextErrors.items = "An item must be added";

    form.items.forEach((item, index) => {
      if (!item.name.trim()) nextErrors[`itemName-${index}`] = "can't be empty";
      if (Number(item.quantity) <= 0)
        nextErrors[`itemQuantity-${index}`] = "can't be empty";
      if (Number(item.price) <= 0)
        nextErrors[`itemPrice-${index}`] = "can't be empty";
    });

    return nextErrors;
  };

  const handleSubmit = (status) => {
    if (status !== "draft") {
      const validationErrors = validateForm();
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) return;
    }

    const total = calculateInvoiceTotal();
    const paymentDue = form.createdAt
      ? new Date(
          new Date(form.createdAt).setDate(
            new Date(form.createdAt).getDate() + Number(form.paymentTerms)
          )
        )
          .toISOString()
          .split("T")[0]
      : "";

    const payload = {
      ...form,
      id: isEdit
        ? String(id)
        : Math.random().toString(36).substring(2, 8).toUpperCase(),
      status,
      paymentDue,
      total,
      items: form.items.map((item) => ({
        ...item,
        quantity: Number(item.quantity),
        price: Number(item.price),
        total: calculateItemTotal(item),
      })),
    };

    dispatch({ type: isEdit ? "UPDATE" : "ADD", payload });
    setTimeout(() => {
      navigate(isEdit ? `/invoice/${payload.id}` : "/");
    }, 0);
  };

  if (isEdit && !existingInvoice) {
    return <p>Loading invoice...</p>;
  }

  const hasErrors = Object.keys(errors).length > 0;

  // Reusable labeled field wrapper
  const Field = ({ label, errorKey, children }) => (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label
          className="text-xs"
          style={{ color: errors[errorKey] ? "#EC5757" : "var(--subtext)" }}
        >
          {label}
        </label>
        {errors[errorKey] && (
          <span className="text-xs text-[#EC5757]">{errors[errorKey]}</span>
        )}
      </div>
      {children}
    </div>
  );

  const inputStyle = (errorKey) => ({
    background: "var(--input)",
    borderColor: errors[errorKey] ? "#EC5757" : "var(--border)",
    color: "var(--text)",
  });

  const inputCls =
    "w-full rounded-md border px-4 py-3 text-sm font-bold outline-none focus:border-[#7C5DFA]";

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex md:pl-[88px] font-spartan">

      <div
        className="w-full max-w-xl h-full rounded-r-[20px] shadow-xl flex flex-col"
        style={{ background: "var(--bg)", color: "var(--text)" }}
      >

        <div className="overflow-y-auto px-8 py-10 flex-1">
          <h2 className="text-2xl font-bold mb-6">
            {isEdit ? `Edit #${id}` : "New Invoice"}
          </h2>

          <h3 className="text-[#7C5DFA] text-sm font-bold mb-4">Bill To</h3>

          <div className="space-y-4 mb-8">
            <Field label="Street Address" errorKey="senderStreet">
              <input
                name="sender-street"
                autoComplete="off"
                placeholder="Street Address"
                value={form.senderAddress.street}
                onChange={(e) => handleAddressChange(e, "senderAddress", "street")}
                className={inputCls}
                style={inputStyle("senderStreet")}
              />
            </Field>

            <div className="grid grid-cols-3 gap-4">
              <Field label="City" errorKey="senderCity">
                <input
                  name="sender-city"
                  autoComplete="off"
                  placeholder="City"
                  value={form.senderAddress.city}
                  onChange={(e) => handleAddressChange(e, "senderAddress", "city")}
                  className={inputCls}
                  style={inputStyle("senderCity")}
                />
              </Field>
              <Field label="Post Code" errorKey="senderPostCode">
                <input
                  name="sender-postCode"
                  autoComplete="off"
                  placeholder="Post Code"
                  value={form.senderAddress.postCode}
                  onChange={(e) => handleAddressChange(e, "senderAddress", "postCode")}
                  className={inputCls}
                  style={inputStyle("senderPostCode")}
                />
              </Field>
              <Field label="Country" errorKey="senderCountry">
                <input
                  name="sender-country"
                  autoComplete="off"
                  placeholder="Country"
                  value={form.senderAddress.country}
                  onChange={(e) => handleAddressChange(e, "senderAddress", "country")}
                  className={inputCls}
                  style={inputStyle("senderCountry")}
                />
              </Field>
            </div>
          </div>

          <h3 className="text-[#7C5DFA] text-sm font-bold mb-4">Bill From</h3>

          <div className="space-y-4 mb-8">
            <Field label="Client's Name" errorKey="clientName">
              <input
                name="clientName"
                autoComplete="off"
                placeholder="Client's Name"
                value={form.clientName}
                onChange={handleChange}
                className={inputCls}
                style={inputStyle("clientName")}
              />
            </Field>

            <Field label="Client's Email" errorKey="clientEmail">
              <input
                name="clientEmail"
                autoComplete="off"
                placeholder="e.g. email@example.com"
                value={form.clientEmail}
                onChange={handleChange}
                className={inputCls}
                style={inputStyle("clientEmail")}
              />
            </Field>

            <Field label="Street Address" errorKey="clientStreet">
              <input
                name="client-street"
                autoComplete="off"
                placeholder="Street Address"
                value={form.clientAddress.street}
                onChange={(e) => handleAddressChange(e, "clientAddress", "street")}
                className={inputCls}
                style={inputStyle("clientStreet")}
              />
            </Field>

            <div className="grid grid-cols-3 gap-4">
              <Field label="City" errorKey="clientCity">
                <input
                  name="client-city"
                  autoComplete="off"
                  placeholder="City"
                  value={form.clientAddress.city}
                  onChange={(e) => handleAddressChange(e, "clientAddress", "city")}
                  className={inputCls}
                  style={inputStyle("clientCity")}
                />
              </Field>
              <Field label="Post Code" errorKey="clientPostCode">
                <input
                  name="client-postCode"
                  autoComplete="off"
                  placeholder="Post Code"
                  value={form.clientAddress.postCode}
                  onChange={(e) => handleAddressChange(e, "clientAddress", "postCode")}
                  className={inputCls}
                  style={inputStyle("clientPostCode")}
                />
              </Field>
              <Field label="Country" errorKey="clientCountry">
                <input
                  name="client-country"
                  autoComplete="off"
                  placeholder="Country"
                  value={form.clientAddress.country}
                  onChange={(e) => handleAddressChange(e, "clientAddress", "country")}
                  className={inputCls}
                  style={inputStyle("clientCountry")}
                />
              </Field>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

            <Field label="Invoice Date" errorKey="createdAt">
              <div
                className="relative rounded-md border px-4 py-3"
                style={{
                  background: "var(--input)",
                  borderColor: errors.createdAt ? "#EC5757" : "var(--border)",
                  color: "var(--text)",
                }}
              >
                <DatePicker
                  selected={form.createdAt ? new Date(form.createdAt) : null}
                  onChange={(date) => {
                    if (!date) return;
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const day = String(date.getDate()).padStart(2, "0");
                    setForm((prev) => ({
                      ...prev,
                      createdAt: `${year}-${month}-${day}`,
                    }));
                  }}
                  dateFormat="dd MMM yyyy"
                  placeholderText="Select date"
                  className="w-full bg-transparent pr-8 text-sm font-bold outline-none"
                  style={{ color: "var(--text)" }}
                />
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M14 2H13V0H11V2H5V0H3V2H2C0.9 2 0 2.9 0 4V14C0 15.1 0.9 16 2 16H14C15.1 16 16 15.1 16 14V4C16 2.9 15.1 2 14 2ZM14 14H2V7H14V14ZM14 5H2V4H14V5Z" fill="#7E88C3" />
                  </svg>
                </span>
              </div>
            </Field>

            <Field label="Payment Terms" errorKey="paymentTerms">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowTermsDropdown((prev) => !prev)}
                  className="w-full rounded-md border px-4 py-3 text-left text-sm font-bold"
                  style={{
                    background: "var(--input)",
                    borderColor: errors.paymentTerms ? "#EC5757" : "var(--border)",
                    color: "var(--text)",
                  }}
                >
                  {selectedPaymentTerm}
                </button>
                <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                  <svg width="11" height="7" viewBox="0 0 11 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5.5 5L10 1" stroke="#7C5DFA" strokeWidth="2" />
                  </svg>
                </span>
                {showTermsDropdown && (
                  <div
                    className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-lg shadow-lg"
                    style={{ background: "var(--card)" }}
                  >
                    {paymentTermOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setForm((prev) => ({ ...prev, paymentTerms: option.value }));
                          setShowTermsDropdown(false);
                        }}
                        className="block w-full border-b px-6 py-4 text-left text-sm font-bold last:border-b-0 hover:text-[#7C5DFA]"
                        style={{
                          color: form.paymentTerms === option.value ? "#7C5DFA" : "var(--text)",
                          borderColor: "var(--border)",
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Field>
          </div>

          <div className="mb-8">
            <Field label="Project Description" errorKey="description">
              <input
                name="description"
                placeholder="e.g. Graphic Design Service"
                value={form.description}
                onChange={handleChange}
                className={inputCls}
                style={inputStyle("description")}
              />
            </Field>
          </div>

          <h3 className="text-lg font-bold mb-4" style={{ color: "#777F98" }}>
            Item List
          </h3>

          <div className="grid grid-cols-12 gap-2 mb-2">
            <span className="col-span-5 text-xs" style={{ color: "var(--subtext)" }}>Item Name</span>
            <span className="col-span-2 text-xs" style={{ color: "var(--subtext)" }}>Qty.</span>
            <span className="col-span-2 text-xs" style={{ color: "var(--subtext)" }}>Price</span>
            <span className="col-span-2 text-xs" style={{ color: "var(--subtext)" }}>Total</span>
            <span className="col-span-1" />
          </div>

          <div className="space-y-4">
            {form.items.map((item, index) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                <input
                  className="col-span-5 rounded-md border px-4 py-3 text-sm font-bold outline-none"
                  placeholder="Item Name"
                  value={item.name}
                  onChange={(e) => handleItemChange(item.id, "name", e.target.value)}
                  style={{
                    background: "var(--input)",
                    borderColor: errors[`itemName-${index}`] ? "#EC5757" : "var(--border)",
                    color: "var(--text)",
                  }}
                />
                <input
                  type="number"
                  className="col-span-2 rounded-md border px-3 py-3 text-sm font-bold outline-none"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(item.id, "quantity", e.target.value)}
                  style={{
                    background: "var(--input)",
                    borderColor: errors[`itemQuantity-${index}`] ? "#EC5757" : "var(--border)",
                    color: "var(--text)",
                  }}
                />
                <input
                  type="number"
                  className="col-span-2 rounded-md border px-3 py-3 text-sm font-bold outline-none"
                  value={item.price}
                  onChange={(e) => handleItemChange(item.id, "price", e.target.value)}
                  style={{
                    background: "var(--input)",
                    borderColor: errors[`itemPrice-${index}`] ? "#EC5757" : "var(--border)",
                    color: "var(--text)",
                  }}
                />
                <p
                  className="col-span-2 text-sm font-bold text-right"
                  style={{ color: "var(--subtext)" }}
                >
                  {calculateItemTotal(item).toFixed(2)}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="col-span-1 flex justify-center items-center hover:opacity-70 transition-opacity"
                  aria-label="Remove item"
                >
                  <svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M8.47225 0L9.36117 0.888875H12.4722V2.66663H0.027832V0.888875H3.13892L4.02783 0H8.47225ZM0.916748 14.2222C0.916748 15.2 1.71675 16 2.6945 16H9.80561C10.7834 16 11.5834 15.2 11.5834 14.2222V3.55554H0.916748V14.2222Z" fill="#888EB0" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {errors.items && (
            <p className="text-[#EC5757] text-xs mt-2">{errors.items}</p>
          )}

          <button
            onClick={addItem}
            className="w-full mt-4 py-3 rounded-full text-sm font-bold hover:opacity-80 transition-opacity"
            style={{
              background: "var(--btn-add-item-bg, #F9FAFE)",
              color: "var(--btn-add-item-text, #7E88C3)",
            }}
          >
            + Add New Item
          </button>
        </div>

        <div
          className="px-8 py-6 border-t flex justify-between items-center"
          style={{ background: "var(--bg)", borderColor: "var(--border)" }}
        >
          <div>
            {hasErrors && (
              <p className="text-[#EC5757] text-xs">- All fields must be added</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {!isEdit && (
              <>
                <button
                  onClick={() => navigate("/")}
                  className="px-6 py-3 rounded-full text-sm font-bold hover:opacity-80 transition-opacity"
                  style={{ background: "var(--btn-discard-bg, #F9FAFE)", color: "var(--subtext)" }}
                >
                  Discard
                </button>
                <button
                  onClick={() => handleSubmit("draft")}
                  className="px-6 py-3 rounded-full text-sm font-bold text-white hover:opacity-80 transition-opacity"
                  style={{ background: "#373B53" }}
                >
                  Save as Draft
                </button>
                <button
                  onClick={() => handleSubmit("pending")}
                  className="px-6 py-3 rounded-full text-sm font-bold text-white hover:opacity-80 transition-opacity"
                  style={{ background: "#7C5DFA" }}
                >
                  Save &amp; Send
                </button>
              </>
            )}

            {isEdit && (
              <>
                <button
                  onClick={() => navigate(`/invoice/${id}`)}
                  className="px-6 py-3 rounded-full text-sm font-bold hover:opacity-80 transition-opacity"
                  style={{ background: "var(--btn-discard-bg, #F9FAFE)", color: "var(--subtext)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSubmit(form.status || "pending")}
                  className="px-6 py-3 rounded-full text-sm font-bold text-white hover:opacity-80 transition-opacity"
                  style={{ background: "#7C5DFA" }}
                >
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}