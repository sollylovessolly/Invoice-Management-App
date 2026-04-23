import { createContext, useReducer, useEffect, useRef } from "react";
import { invoiceReducer } from "../reducer/invoiceReducer";
import { initialInvoices } from "../data/invoices";

export const InvoiceContext = createContext();

export const InvoiceProvider = ({ children }) => {
  const [invoices, dispatch] = useReducer(invoiceReducer, []);
  
  const isFirstLoad = useRef(true);

  // 🔥 LOAD
  useEffect(() => {
    const stored = localStorage.getItem("invoices");

    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed) && parsed.length > 0) {
          dispatch({ type: "LOAD", payload: parsed });
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }

    dispatch({ type: "LOAD", payload: initialInvoices });
  }, []);

  // 🔥 SAVE (skip first render)
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    localStorage.setItem("invoices", JSON.stringify(invoices));
  }, [invoices]);

  return (
    <InvoiceContext.Provider value={{ invoices, dispatch }}>
      {children}
    </InvoiceContext.Provider>
  );
};