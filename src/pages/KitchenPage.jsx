import { useEffect, useState } from "react";
import axios from "axios";
import RestaurantLayout from "../layouts/RestaurantLayout";
import "./DashboardPage.css";

function KitchenPage() {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const orderRes = await axios.get("http://127.0.0.1:8000/api/restaurant/orders/");
    const tableRes = await axios.get("http://127.0.0.1:8000/api/restaurant/tables/");
    const menuRes = await axios.get("http://127.0.0.1:8000/api/restaurant/menu-items/");

    setOrders(orderRes.data);
    setTables(tableRes.data);
    setMenuItems(menuRes.data);
  };

  const getTableName = (id) => {
    const table = tables.find((t) => t.id === id);
    return table ? table.table_number : id;
  };

  const getItemNames = (items) => {
    return items
      .map((id) => {
        const item = menuItems.find((m) => m.id === id);
        return item ? item.name : "";
      })
      .filter(Boolean);
  };

  const updateStatus = async (order, status) => {
    await axios.put(`http://127.0.0.1:8000/api/restaurant/orders/${order.id}/`, {
      table: order.table,
      items: order.items,
      status: status,
    });

    fetchData();
  };

  return (
    <RestaurantLayout>
      <div className="page-box">
        <div className="page-header">
          <div>
            <h1>Kitchen Display System</h1>
            <p>Manage live kitchen orders and update cooking status.</p>
          </div>
        </div>

        <div className="kitchen-grid">
          {orders.map((order) => (
            <div className="kot-card" key={order.id}>
              <div className="kot-header">
                <h2>Order #{order.id}</h2>
                <span>{order.status}</span>
              </div>

              <p><b>Table:</b> {getTableName(order.table)}</p>

              <div className="kot-items">
                {getItemNames(order.items).map((name, index) => (
                  <p key={index}>🍽 {name}</p>
                ))}
              </div>

              <div className="kot-actions">
                <button onClick={() => updateStatus(order, "Pending")}>Pending</button>
                <button onClick={() => updateStatus(order, "Preparing")}>Preparing</button>
                <button onClick={() => updateStatus(order, "Ready")}>Ready</button>
                <button onClick={() => updateStatus(order, "Served")}>Served</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </RestaurantLayout>
  );
}

export default KitchenPage;