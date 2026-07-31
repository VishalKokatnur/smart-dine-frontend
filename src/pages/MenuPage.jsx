import { useEffect, useState } from "react";
import axios from "axios";
import RestaurantLayout from "../layouts/RestaurantLayout";
import "./DashboardPage.css";

function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    available: true,
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    const response = await axios.get(
      "http://127.0.0.1:8000/api/restaurant/menu-items/"
    );
    setMenuItems(response.data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await axios.put(
        `http://127.0.0.1:8000/api/restaurant/menu-items/${editingId}/`,
        formData
      );
      alert("Menu item updated successfully");
    } else {
      await axios.post(
        "http://127.0.0.1:8000/api/restaurant/menu-items/",
        formData
      );
      alert("Menu item added successfully");
    }

    setFormData({
      name: "",
      category: "",
      price: "",
      available: true,
    });
    setEditingId(null);
    fetchMenuItems();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      available: item.available,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this menu item?")) {
      await axios.delete(
        `http://127.0.0.1:8000/api/restaurant/menu-items/${id}/`
      );
      alert("Menu item deleted successfully");
      fetchMenuItems();
    }
  };

  const filteredItems = menuItems.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <RestaurantLayout>
      <div className="page-box">
        <div className="page-header">
          <div>
            <h1>Menu Management</h1>
            <p>Add, edit, delete and search restaurant menu items.</p>
          </div>
        </div>

        <form className="menu-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <label className="check-label">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
            />
            Available
          </label>

          <button type="submit" className="add-btn">
            {editingId ? "Update Item" : "+ Add Item"}
          </button>
        </form>

        <div className="toolbar">
          <input
            type="text"
            placeholder="Search menu item or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="premium-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td>#{item.id}</td>
                <td className="item-name">🍽️ {item.name}</td>
                <td>
                  <span className="category-badge">{item.category}</span>
                </td>
                <td className="price">₹{item.price}</td>
                <td>
                  {item.available ? (
                    <span className="available">Available</span>
                  ) : (
                    <span className="not-available">Not Available</span>
                  )}
                </td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(item)}>
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item.id)}
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

export default MenuPage;