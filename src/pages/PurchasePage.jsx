import { useEffect, useState } from "react";
import axios from "axios";
import RestaurantLayout from "../layouts/RestaurantLayout";
import "./DashboardPage.css";

function PurchasePage() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [employees, setEmployees] = useState([]);

  const [vendor, setVendor] = useState("");
  const [handledBy, setHandledBy] = useState("");
  const [gst, setGst] = useState(5);
  const [purchaseItems, setPurchaseItems] = useState([]);

  const vendors = [
    "Ramesh Traders",
    "Fresh Foods Supplier",
    "Daily Grocery Mart",
    "Meat Vendor",
    "Vegetable Market",
    "Dairy Supplier",
  ];

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/inventory/items/")
      .then((res) => setInventoryItems(res.data));

    axios
      .get("http://127.0.0.1:8000/api/employees/employees/")
      .then((res) => setEmployees(res.data));
  }, []);

  const addPurchaseItem = () => {
    setPurchaseItems([
      ...purchaseItems,
      {
        inventory_item: "",
        quantity: "",
        unit_price: "",
      },
    ]);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...purchaseItems];
    updated[index][field] = value;
    setPurchaseItems(updated);
  };

  const removeItem = (index) => {
    const updated = [...purchaseItems];
    updated.splice(index, 1);
    setPurchaseItems(updated);
  };

  const subtotal = purchaseItems.reduce(
    (total, item) =>
      total + Number(item.quantity || 0) * Number(item.unit_price || 0),
    0
  );

  const gstAmount = subtotal * (Number(gst) / 100);
  const grandTotal = subtotal + gstAmount;

  const savePurchase = () => {
    if (!vendor || !handledBy || purchaseItems.length === 0) {
      alert("Please select vendor, handled by employee and add items");
      return;
    }

    alert("Purchase saved successfully");
  };

  return (
    <RestaurantLayout>
      <div className="page-box">
        <div className="page-header">
          <div>
            <h1>Purchase Management</h1>
            <p>Purchase stock from vendors and update inventory automatically.</p>
          </div>

          <button className="add-btn" onClick={addPurchaseItem}>
            + Add Item
          </button>
        </div>

        <div className="purchase-info">
          <select value={vendor} onChange={(e) => setVendor(e.target.value)}>
            <option value="">Select Vendor</option>
            {vendors.map((v, index) => (
              <option key={index} value={v}>
                {v}
              </option>
            ))}
          </select>

          <select value={handledBy} onChange={(e) => setHandledBy(e.target.value)}>
            <option value="">Handled By Employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.name}>
                {emp.name} - {emp.role}
              </option>
            ))}
          </select>

          <input type="date" defaultValue={new Date().toISOString().slice(0, 10)} />

          <select value={gst} onChange={(e) => setGst(e.target.value)}>
            <option value="0">GST 0%</option>
            <option value="5">GST 5%</option>
            <option value="12">GST 12%</option>
            <option value="18">GST 18%</option>
          </select>
        </div>

        <div className="purchase-scroll-box">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Inventory Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {purchaseItems.map((item, index) => (
                <tr key={index}>
                  <td>
                    <select
                      value={item.inventory_item}
                      onChange={(e) =>
                        handleItemChange(index, "inventory_item", e.target.value)
                      }
                    >
                      <option value="">Select Item</option>
                      {inventoryItems.map((inv) => (
                        <option key={inv.id} value={inv.id}>
                          {inv.name} ({inv.unit})
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    <input
                      type="number"
                      placeholder="Price"
                      value={item.unit_price}
                      onChange={(e) =>
                        handleItemChange(index, "unit_price", e.target.value)
                      }
                    />
                  </td>

                  <td>
                    ₹
                    {(
                      Number(item.quantity || 0) * Number(item.unit_price || 0)
                    ).toFixed(2)}
                  </td>

                  <td>
                    <button className="delete-btn" onClick={() => removeItem(index)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="purchase-summary">
          <p>Vendor: <b>{vendor || "-"}</b></p>
          <p>Handled By: <b>{handledBy || "-"}</b></p>
          <p>Total Employees: <b>{employees.length}</b></p>
          <p>Subtotal: <b>₹{subtotal.toFixed(2)}</b></p>
          <p>GST: <b>₹{gstAmount.toFixed(2)}</b></p>
          <h2>Grand Total: ₹{grandTotal.toFixed(2)}</h2>

          <button className="add-btn" onClick={savePurchase}>
            Save Purchase
          </button>
        </div>
      </div>
    </RestaurantLayout>
  );
}

export default PurchasePage;