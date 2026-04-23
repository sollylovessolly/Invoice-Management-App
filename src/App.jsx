import { Routes, Route } from "react-router-dom";
import InvoiceList from "./pages/InvoiceList";
import InvoiceDetail from "./pages/InvoiceDetail";
import InvoiceForm from "./components/InvoiceForm";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function App() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile / Tablet Topbar */}
      <Topbar />

      {/* Main Content */}
      <main className="md:ml-[80px]">
        <Routes>
          <Route path="/" element={<InvoiceList />} />
          <Route path="/invoice/:id" element={<InvoiceDetail />} />
          <Route path="/new" element={<InvoiceForm />} />
          <Route path="/edit/:id" element={
              <>
                <InvoiceDetail />
                <InvoiceForm />
              </>
            } />
        </Routes>
      </main>
    </div>
  );
}