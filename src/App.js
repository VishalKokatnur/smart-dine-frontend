import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import MenuPage from "./pages/MenuPage";
import TablesPage from "./pages/TablesPage";
import OrdersPage from "./pages/OrdersPage";
import InventoryPage from "./pages/InventoryPage";
import RoomsPage from "./pages/RoomsPage";
import EmployeesPage from "./pages/EmployeesPage";
import ReportsPage from "./pages/ReportsPage";
import BillingPage from "./pages/BillingPage";
import BillHistoryPage from "./pages/BillHistoryPage";
import KitchenPage from "./pages/KitchenPage";
import CustomersPage from "./pages/CustomersPage";
import ReservationPage from "./pages/ReservationPage";
import PurchasePage from "./pages/PurchasePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/tables" element={<TablesPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/employees" element={<EmployeesPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/bills" element={<BillHistoryPage />} />
        <Route path="/kitchen" element={<KitchenPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/reservations" element={<ReservationPage />} />
        <Route path="/purchase" element={<PurchasePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;