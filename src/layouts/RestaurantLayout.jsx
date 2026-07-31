import { Link } from "react-router-dom";
import "./RestaurantLayout.css";

function RestaurantLayout({ children }) {
  return (
    <div className="restaurant-dashboard">

      <nav className="restaurant-navbar">

        <div className="restaurant-logo">
          <h1>SmartDine Pro</h1>
          <p>Premium Restaurant Management</p>
        </div>

        <div className="restaurant-links">
          <Link to="/dashboard">Home</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/tables">Tables</Link>
          <Link to="/inventory">Inventory</Link>
          <Link to="/rooms">Rooms</Link>
          <Link to="/employees">Employees</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/billing">Billing</Link>
          <Link to="/bills">Bills</Link>
          <Link to="/kitchen">Kitchen</Link>
          <Link to="/customers">Customers</Link>
          <Link to="/reservations">Reservations</Link>
          <Link to="/purchase">Purchase</Link>
        </div>

      </nav>

      {children}

    </div>
  );
}

export default RestaurantLayout;