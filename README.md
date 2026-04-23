# 🧾 Invoice Management App

A responsive, full-featured invoice management application built with React, following modern UI/UX principles and best practices.

---

## 🚀 Live Demo

  
👉 [GitHub Repository](https://github.com/sollylovessolly/Invoice-Management-App)

---

## 📌 Overview

This application allows users to:

- Create invoices
- View invoice list and details
- Edit existing invoices
- Delete invoices (with confirmation)
- Save drafts
- Mark invoices as paid
- Filter invoices by status
- Toggle between light and dark themes
- Persist data across sessions

The UI is implemented to closely match the provided Figma design across mobile, tablet, and desktop.

---

## ⚙️ Setup Instructions

### 1. Clone the repository


git clone https://github.com/sollylovessolly/Invoice-Management-App.git
cd Invoice-Management-App
2. Install dependencies
npm install
3. Run development server
npm run dev
4. Build for production
npm run build
🏗️ Architecture Explanation

The app follows a component-driven architecture using React.

Key Structure
src/
├── components/
│   ├── InvoiceForm.jsx
│   ├── StatusBadge.jsx
│   ├── Sidebar.jsx
│   ├── Topbar.jsx
│   └── DeleteModal.jsx
│
├── pages/
│   ├── InvoiceList.jsx
│   └── InvoiceDetail.jsx
│
├── context/
│   └── InvoiceContext.jsx
│
├── reducer/
│   └── invoiceReducer.js
│
├── data/
│   └── invoices.js
State Management
Uses React Context + useReducer
Centralized state in InvoiceContext
Actions handled via invoiceReducer
ADD
UPDATE
DELETE
MARK_PAID
LOAD
Data Persistence
Uses localStorage
Prevents overwriting during initial load
Persists invoices across reloads
Routing
React Router used for navigation
/                → Invoice List
/invoice/:id     → Invoice Detail
/new             → Create Invoice
/edit/:id        → Edit Invoice (overlay)
## Trade-offs & Decisions
# 1. Context vs External State Library
Used Context + useReducer instead of Redux/Zustand
Reason: lighter setup and sufficient for app scale
#2. Custom Dropdown vs Native Select
Implemented custom dropdown for Payment Terms
Reason: native <select> cannot match Figma design
# 3. Date Picker
Used react-datepicker for better UX
Trade-off: additional dependency, but closer to design
# 4. LocalStorage as Backend
Chosen for simplicity and offline support
Trade-off: no real backend persistence or multi-user support
# 5. Overlay Form (Edit/New)
Form implemented as a sliding overlay
Matches Figma behavior and improves UX
# Accessibility Notes
Semantic HTML used where applicable (button, input, etc.)
Labels added to all form inputs
Keyboard support:
ESC closes modal
Tab navigation works across inputs
Sufficient color contrast for light and dark modes
Error messages are visible and descriptive

# Potential Future Improvements
Backend integration (Node.js / Firebase)
Authentication system
Export invoices (PDF)
Search functionality
Pagination for large datasets
# Tech Stack
React
Tailwind CSS
React Router
React DatePicker
LocalStorage
 # Author

Built by solly
Frontend Developer 

 License

This project is for assessment and learning purposes.


---

