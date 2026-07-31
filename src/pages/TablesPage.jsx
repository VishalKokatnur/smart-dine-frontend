import { useEffect, useState } from "react";
import axios from "axios";
import RestaurantLayout from "../layouts/RestaurantLayout";
import "./DashboardPage.css";

function TablesPage() {
  const [tables, setTables] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    table_number: "",
    capacity: "",
    status: "Available",
  });

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    const response = await axios.get(
      "http://127.0.0.1:8000/api/restaurant/tables/"
    );
    setTables(response.data);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(
        `http://127.0.0.1:8000/api/restaurant/tables/${editingId}/`,
        formData
      );
      alert("Table updated successfully");
    } else {
      await axios.post(
        "http://127.0.0.1:8000/api/restaurant/tables/",
        formData
      );
      alert("Table added successfully");
    }

    setFormData({
      table_number: "",
      capacity: "",
      status: "Available",
    });

    setEditingId(null);
    fetchTables();
  };

  const handleEdit = (table) => {
    setEditingId(table.id);
    setFormData({
      table_number: table.table_number,
      capacity: table.capacity,
      status: table.status,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this table?")) {
      await axios.delete(`http://127.0.0.1:8000/api/restaurant/tables/${id}/`);
      alert("Table deleted successfully");
      fetchTables();
    }
  };

  const filteredTables = tables.filter((table) =>
    table.table_number.toLowerCase().includes(search.toLowerCase()) ||
    table.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <RestaurantLayout>
      <div className="page-box">
        <div className="page-header">
          <div>
            <h1>Tables Management</h1>
            <p>Add, edit, delete and update restaurant table status.</p>
          </div>
        </div>

        <form className="menu-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="table_number"
            placeholder="Table Number"
            value={formData.table_number}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={handleChange}
            required
          />

          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Available">Available</option>
            <option value="Reserved">Reserved</option>
            <option value="Occupied">Occupied</option>
            <option value="Cleaning">Cleaning</option>
          </select>

          <button type="submit" className="add-btn">
            {editingId ? "Update Table" : "+ Add Table"}
          </button>
        </form>

        <div className="toolbar">
          <input
            type="text"
            placeholder="Search table number or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="premium-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Table Number</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredTables.map((table) => (
              <tr key={table.id}>
                <td>#{table.id}</td>
                <td className="item-name">🪑 {table.table_number}</td>
                <td>{table.capacity} Persons</td>
                <td>
                  <span className="category-badge">{table.status}</span>
                </td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(table)}>
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(table.id)}
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

export default TablesPage;