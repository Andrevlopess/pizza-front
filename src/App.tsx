
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ClientsPage from "./pages/clients";
import CustomerOrderPage from "./pages/customer-order";
import DashboardPage from "./pages/dashboard";
import OrdersPage from "./pages/orders";
import ProductsPage from "./pages/products";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/clients" element={<ClientsPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/customer" element={<CustomerOrderPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
