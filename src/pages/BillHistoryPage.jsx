import { useEffect, useState } from "react";
import axios from "axios";
import RestaurantLayout from "../layouts/RestaurantLayout";
import "./DashboardPage.css";

function BillHistoryPage() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/restaurant/bills/"
      );
      setBills(response.data);
    } catch (error) {
      console.log("Error fetching bills", error);
    }
  };

  return (
    <RestaurantLayout>
      <div className="page-box">
        <div className="page-header">
          <div>
            <h1>Bill History</h1>
            <p>View all saved restaurant bills and payment details.</p>
          </div>
        </div>

        <table className="premium-table">
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Order</th>
              <th>Total</th>
              <th>Discount</th>
              <th>GST</th>
              <th>Final Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {bills.map((bill) => (
              <tr key={bill.id}>
                <td>#{bill.id}</td>
                <td>Order #{bill.order}</td>
                <td>₹{bill.total_amount}</td>
                <td>₹{bill.discount}</td>
                <td>₹{bill.tax_amount}</td>
                <td className="price">₹{bill.final_amount}</td>
                <td>{bill.payment_method}</td>
                <td>
                  <span className="available">{bill.payment_status}</span>
                </td>
                <td>{new Date(bill.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </RestaurantLayout>
  );
}

export default BillHistoryPage;