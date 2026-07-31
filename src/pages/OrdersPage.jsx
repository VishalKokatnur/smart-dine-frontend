import { useEffect, useState } from "react";
import axios from "axios";
import RestaurantLayout from "../layouts/RestaurantLayout";
import "./DashboardPage.css";

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    table: "",
    items: [],
    status: "Pending",
  });

  useEffect(() => {
    fetchOrders();
    fetchTables();
    fetchMenuItems();
  }, []);

  const fetchOrders = async () => {
    const response = await axios.get("http://127.0.0.1:8000/api/restaurant/orders/");
    setOrders(response.data);
  };

  const fetchTables = async () => {
    const response = await axios.get("http://127.0.0.1:8000/api/restaurant/tables/");
    setTables(response.data);
  };

  const fetchMenuItems = async () => {
    const response = await axios.get("http://127.0.0.1:8000/api/restaurant/menu-items/");
    setMenuItems(response.data);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleItemsChange = (e) => {
    const selectedItems = Array.from(e.target.selectedOptions, (option) =>
      Number(option.value)
    );

    setFormData({
      ...formData,
      items: selectedItems,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(
        `http://127.0.0.1:8000/api/restaurant/orders/${editingId}/`,
        formData
      );
      alert("Order updated successfully");
    } else {
      await axios.post("http://127.0.0.1:8000/api/restaurant/orders/", formData);
      alert("Order created successfully");
    }

    setFormData({
      table: "",
      items: [],
      status: "Pending",
    });

    setEditingId(null);
    fetchOrders();
  };

  const handleEdit = (order) => {
    setEditingId(order.id);
    setFormData({
      table: order.table,
      items: order.items,
      status: order.status,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      await axios.delete(`http://127.0.0.1:8000/api/restaurant/orders/${id}/`);
      alert("Order deleted successfully");
      fetchOrders();
    }
  };

  const getTableName = (tableId) => {
    const table = tables.find((t) => t.id === tableId);
    return table ? table.table_number : tableId;
  };

  return (
    <RestaurantLayout>
      <div className="page-box">
        <div className="page-header">
          <div>
            <h1>Orders Management</h1>
            <p>Create, update, track and manage restaurant orders.</p>
          </div>
        </div>

        <form className="order-form" onSubmit={handleSubmit}>
          <select
            name="table"
            value={formData.table}
            onChange={handleChange}
            required
          >
            <option value="">Select Table</option>
            {tables.map((table) => (
              <option key={table.id} value={table.id}>
                Table {table.table_number} - {table.status}
              </option>
            ))}
          </select>

<div className="menu-selection">
  {menuItems.map((item) => (
    <label key={item.id} className="menu-item-card">

      <input
        type="checkbox"
        checked={formData.items.includes(item.id)}
        onChange={(e) => {
          if (e.target.checked) {
            setFormData({
              ...formData,
              items: [...formData.items, item.id],
            });
          } else {
            setFormData({
              ...formData,
              items: formData.items.filter(
                (id) => id !== item.id
              ),
            });
          }
        }}
      />

      <div>
        <h4>{item.name}</h4>
        <p>{item.category}</p>
      </div>

      <span>₹{item.price}</span>

    </label>
  ))}
</div>

          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="Preparing">Preparing</option>
            <option value="Ready">Ready</option>
            <option value="Served">Served</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <button type="submit" className="add-btn">
            {editingId ? "Update Order" : "+ Create Order"}
          </button>
        </form>

        <table className="premium-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Table</th>
              <th>Items</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>Table {getTableName(order.table)}</td>
                <td>{order.items.length} Items</td>
                <td>
                  <span className="category-badge">{order.status}</span>
                </td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(order)}>
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(order.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </RestaurantLayout>
  );
}

export default OrdersPage;