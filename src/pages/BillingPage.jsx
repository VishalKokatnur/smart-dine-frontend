import { useEffect, useState } from "react";
import axios from "axios";
import RestaurantLayout from "../layouts/RestaurantLayout";
import "./DashboardPage.css";

function BillingPage() {
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedTableId, setSelectedTableId] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentInfo, setPaymentInfo] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/restaurant/tables/")
      .then((res) => setTables(res.data));

    axios.get("http://127.0.0.1:8000/api/restaurant/orders/")
      .then((res) => setOrders(res.data));

    axios.get("http://127.0.0.1:8000/api/restaurant/menu-items/")
      .then((res) => setMenuItems(res.data));
  }, []);

  const handleTableChange = (e) => {
    const tableId = Number(e.target.value);
    setSelectedTableId(tableId);

    const tableOrders = orders.filter((order) => order.table === tableId);

    if (tableOrders.length > 0) {
      setSelectedOrder(tableOrders[tableOrders.length - 1]);
    } else {
      setSelectedOrder(null);
    }
  };

  const getSelectedItems = () => {
    if (!selectedOrder) return [];

    return selectedOrder.items
      .map((itemId) => {
        const item = menuItems.find((m) => m.id === itemId);
        return item ? { ...item, qty: 1 } : null;
      })
      .filter(Boolean);
  };

  const billItems = getSelectedItems();

  const subtotal = billItems.reduce(
    (total, item) => total + Number(item.price) * item.qty,
    0
  );

  const gst = subtotal * 0.05;
  const grandTotal = subtotal + gst - Number(discount || 0);

  const selectedTable = tables.find(
    (table) => table.id === Number(selectedTableId)
  );

  const saveBill = async () => {
  if (!selectedOrder) {
    alert("Please select a table with order");
    return;
  }

  try {
    await axios.post("http://127.0.0.1:8000/api/restaurant/bills/", {
      order: selectedOrder.id,
      total_amount: subtotal.toFixed(2),
      discount: Number(discount || 0).toFixed(2),
      tax_amount: gst.toFixed(2),
      final_amount: grandTotal.toFixed(2),
      payment_method: paymentMethod,
      payment_status: "Paid",
    });

    alert("Bill saved successfully");
  } catch (error) {
    console.log(error);
    alert("Error saving bill");
  }
};



  return (
    <RestaurantLayout>
      <div className="pos-container">
        <div className="pos-left">
          <h1>Billing / POS</h1>

          <div className="customer-section">
            <input
              type="text"
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <select value={selectedTableId} onChange={handleTableChange}>
              <option value="">Select Table</option>
              {tables.map((table) => (
                <option key={table.id} value={table.id}>
                  Table {table.table_number}
                </option>
              ))}
            </select>
          </div>

          {!selectedOrder && selectedTableId && (
            <p className="no-order-msg">No order found for this table.</p>
          )}

          <h2 className="section-title">Auto Loaded Order Items</h2>

          <table className="premium-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {billItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.qty}</td>
                  <td>₹{item.price}</td>
                  <td>₹{Number(item.price) * item.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="payment-row">
            <select
              value={paymentMethod}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setPaymentInfo("");
              }}
            >
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Online">Online</option>
            </select>

            {paymentMethod === "Cash" && (
              <input
                type="number"
                placeholder="Cash Received"
                value={paymentInfo}
                onChange={(e) => setPaymentInfo(e.target.value)}
              />
            )}

            {paymentMethod === "UPI" && (
              <input
                type="text"
                placeholder="UPI Transaction ID"
                value={paymentInfo}
                onChange={(e) => setPaymentInfo(e.target.value)}
              />
            )}

            {paymentMethod === "Card" && (
              <input
                type="text"
                placeholder="Card Last 4 Digits"
                value={paymentInfo}
                onChange={(e) => setPaymentInfo(e.target.value)}
              />
            )}

            {paymentMethod === "Online" && (
              <input
                type="text"
                placeholder="Reference Number"
                value={paymentInfo}
                onChange={(e) => setPaymentInfo(e.target.value)}
              />
            )}

            <input
              type="number"
              placeholder="Discount"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
            <button className="add-btn" onClick={saveBill}>
  Save Bill
</button>

            <button className="add-btn" onClick={() => window.print()}>
              Print Bill
            </button>
          </div>
        </div>

        <div className="bill-receipt">
          <h2>SMARTDINE PRO</h2>
          <p>Premium Restaurant Management</p>

          <div className="line"></div>

          <p><b>Customer:</b> {customerName || "Walk-in Customer"}</p>
          <p><b>Phone:</b> {phone || "-"}</p>
          <p><b>Table:</b> {selectedTable ? selectedTable.table_number : "-"}</p>
          <p><b>Date:</b> {new Date().toLocaleString()}</p>

          <div className="line"></div>

          <h3>Items</h3>

          {billItems.map((item) => (
            <div className="receipt-item" key={item.id}>
              <span>{item.name}</span>
              <span>{item.qty}</span>
              <span>₹{Number(item.price) * item.qty}</span>
            </div>
          ))}

          <div className="line"></div>

          <div className="receipt-total">
            <p>Subtotal <b>₹{subtotal.toFixed(2)}</b></p>
            <p>GST 5% <b>₹{gst.toFixed(2)}</b></p>
            <p>Discount <b>₹{Number(discount || 0).toFixed(2)}</b></p>
            <h3>Grand Total <b>₹{grandTotal.toFixed(2)}</b></h3>
            <p>Payment Mode <b>{paymentMethod}</b></p>

            {paymentInfo && (
              <p>
                {paymentMethod === "Cash"
                  ? "Cash Received"
                  : paymentMethod === "UPI"
                  ? "UPI Txn ID"
                  : paymentMethod === "Card"
                  ? "Card Last 4"
                  : "Reference No"}
                <b>{paymentInfo}</b>
              </p>
            )}
          </div>

          <div className="line"></div>

          <h4>Thank You, Visit Again!</h4>
        </div>
      </div>
    </RestaurantLayout>
  );
}

export default BillingPage;