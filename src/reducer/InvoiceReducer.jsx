export const invoiceReducer = (state, action) => {
  switch (action.type) {
    case "LOAD":
      return action.payload;

    case "ADD":
      return [...state, action.payload];

    case "UPDATE":
      return state.map((invoice) =>
        String(invoice.id) === String(action.payload.id)
          ? action.payload
          : invoice
      );

    case "DELETE":
      return state.filter(
        (invoice) => String(invoice.id) !== String(action.payload)
      );

    case "MARK_PAID":
      return state.map((invoice) =>
        String(invoice.id) === String(action.payload)
          ? { ...invoice, status: "paid" }
          : invoice
      );

    default:
      return state;
  }
};