// import "./DashboardPage.css";

// function DashboardPage() {
//   return (
//     <div className="restaurant-dashboard">
//       <nav className="restaurant-navbar">
//         <div className="restaurant-logo">
//           <h1>SmartDine Pro</h1>
//           <p>Premium Restaurant Management</p>
//         </div>

//         <div className="restaurant-links">
//           <a href="/dashboard">Home</a>
//           <a href="/orders">Orders</a>
//           <a href="/menu">Menu</a>
//           <a href="/tables">Tables</a>
//           <a href="/reports">Reports</a>
//         </div>
//       </nav>

//       <section className="restaurant-hero">
//         <h2>Welcome to SmartDine Pro</h2>
//         <p>Luxury Restaurant & Hotel Management System</p>
//         <button>Start New Order</button>
//       </section>

//       <section className="restaurant-cards">
//         <div className="restaurant-card">
//           <h3>🍽 Menu Items</h3>
//           <h1>2</h1>
//         </div>

//         <div className="restaurant-card">
//           <h3>🪑 Tables</h3>
//           <h1>4</h1>
//         </div>

//         <div className="restaurant-card">
//           <h3>🧾 Orders</h3>
//           <h1>1</h1>
//         </div>

//         <div className="restaurant-card">
//           <h3>💰 Revenue</h3>
//           <h1>₹15,000</h1>
//         </div>
//       </section>

//       <section className="restaurant-bottom">
//         <div className="restaurant-panel">
//           <h2>Today's Summary</h2>
//           <p>Total Orders : 15</p>
//           <p>Available Tables : 3</p>
//           <p>Best Selling Item : Biryani</p>
//           <p>Kitchen Status : Running Smoothly</p>
//         </div>

//         <div className="restaurant-panel">
//           <h2>Quick Actions</h2>
//           <button>Create Bill</button>
//           <button>Add Menu</button>
//           <button>Book Table</button>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default DashboardPage;

import { useEffect, useState } from "react";
import axios from "axios";
import "./DashboardPage.css";

function DashboardPage() {
  const [menuCount, setMenuCount] = useState(0);
  const [tableCount, setTableCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const menuRes = await axios.get(
        "http://127.0.0.1:8000/api/restaurant/menu-items/"
      );

      const tableRes = await axios.get(
        "http://127.0.0.1:8000/api/restaurant/tables/"
      );

      const orderRes = await axios.get(
        "http://127.0.0.1:8000/api/restaurant/orders/"
      );

      const billRes = await axios.get(
        "http://127.0.0.1:8000/api/restaurant/bills/"
      );

      setMenuCount(menuRes.data.length);
      setTableCount(tableRes.data.length);
      setOrderCount(orderRes.data.length);

      const totalRevenue = billRes.data.reduce(
        (total, bill) => total + Number(bill.final_amount || 0),
        0
      );

      setRevenue(totalRevenue);
    } catch (error) {
      console.log("Dashboard API error", error);
    }
  };

  return (
    <div className="restaurant-dashboard">
      <nav className="restaurant-navbar">
        <div className="restaurant-logo">
          <h1>SmartDine Pro</h1>
          <p>Premium Restaurant Management</p>
        </div>

        <div className="restaurant-links">
          <a href="/dashboard">Home</a>
          <a href="/orders">Orders</a>
          <a href="/menu">Menu</a>
          <a href="/tables">Tables</a>
          <a href="/billing">Billing</a>
          <a href="/inventory">Inventory</a>
          <a href="/rooms">Rooms</a>
          <a href="/reports">Reports</a>
        </div>
      </nav>

      <section className="restaurant-hero">
        <h2>Welcome to SmartDine Pro</h2>
        <p>Luxury Restaurant & Hotel Management System</p>
        <button onClick={() => (window.location.href = "/orders")}>
          Start New Order
        </button>
      </section>

      <section className="restaurant-cards">
        <div className="restaurant-card">
          <h3>🍽 Menu Items</h3>
          <h1>{menuCount}</h1>
        </div>

        <div className="restaurant-card">
          <h3>🪑 Tables</h3>
          <h1>{tableCount}</h1>
        </div>

        <div className="restaurant-card">
          <h3>🧾 Orders</h3>
          <h1>{orderCount}</h1>
        </div>

        <div className="restaurant-card">
          <h3>💰 Revenue</h3>
          <h1>₹{revenue.toFixed(2)}</h1>
        </div>
      </section>

      <section className="restaurant-bottom">
        <div className="restaurant-panel">
          <h2>Today's Summary</h2>
          <p>Total Orders : {orderCount}</p>
          <p>Total Tables : {tableCount}</p>
          <p>Total Menu Items : {menuCount}</p>
          <p>System Status : Running Smoothly</p>
        </div>

        <div className="restaurant-panel">
          <h2>Quick Actions</h2>
          <button onClick={() => (window.location.href = "/billing")}>
            Create Bill
          </button>
          <button onClick={() => (window.location.href = "/menu")}>
            Add Menu
          </button>
          <button onClick={() => (window.location.href = "/tables")}>
            Manage Tables
          </button>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;