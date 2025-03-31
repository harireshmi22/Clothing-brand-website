import React from 'react';
import "../src/index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { UserLayout } from "../src/components/Layout/UserLayout"
import AdminLayout from "../src/components/Admin/AdminLayout";
import Home from './pages/Home';
import { Toaster } from "sonner";
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CollectionPage from './pages/CollectionPage';
import ProductDetails from './components/Products/ProductDetails';
import Checkout from './components/Cart/Checkout';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminHomePage from './components/Admin/AdminHomePage';
import UserManagement from './components/Admin/UserManagement';
import ProductManagement from './components/Admin/ProductManagement';
import EditProductPage from './components/Admin/EditProductPage';
import OrderManagement from './components/Admin/OrderManagement';

function App() {
  return (
    // We are using router for enable client side routing 
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}> {/* To help us to route the pages  */}
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<UserLayout />}>
          {/* User Layout */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="collections/:collection" element={<CollectionPage />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="my-orders" element={<MyOrdersPage />} />
          <Route path="order/:id" element={<OrderDetailsPage />} />
        </Route>

        {/* Admin Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* Add admin routes here */}
          <Route index element={<AdminHomePage />}></Route>
          <Route path="users" element={<UserManagement />}></Route>
          <Route path="products" element={<ProductManagement />}></Route>
          <Route path="products/:id/edit" element={<EditProductPage />}></Route>
          <Route path='orders' element={<OrderManagement />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
