import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Cart from "../pages/Cart";
import Login from "../pages/Login";
import Register from "../pages/Register";

import DashboardHome from "../pages/dashboard/DashboardHome";

import Orders from "../pages/dashboard/Orders";
import Users from "../pages/dashboard/Users";
import CommonLayout from "../layouts/CommonLayouts";
import DashboardLayout from "../layouts/DashboardLayouts";
import Shope from "../pages/Shope";
import Product from "../pages/dashboard/Product";
import OurBrand from "../pages/OurBrand";

import Contact from "../pages/Contact";
import Newsfeed from "../pages/NewsFeed";
import BusinessValue from "../pages/BusinessValue";
import MediaDetails from "../pages/MediaDetails";
import Images from "../pages/Images";
import Videos from "../pages/Videos";
import Audio from "../pages/Audio";
import Blog from "../pages/Blog";
import BlogDetails from "../pages/BlogDetails";
import BlogAdmin from "../pages/dashboard/BlogAdmin";

import Categories from "../pages/dashboard/Categories";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<CommonLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<BusinessValue />} />
        <Route path="/projects" element={<Shope />} />
        <Route path="/about" element={<OurBrand />} />
        <Route path="/insights" element={<Newsfeed />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/media/:id" element={<MediaDetails />} />
        <Route path="/images" element={<Images />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/audio" element={<Audio />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetails />} />
      </Route>

      {/* Dashboard Routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="media" element={<Product />} />
        <Route path="blog" element={<BlogAdmin />} />
        <Route path="categories" element={<Categories />} />
        <Route path="downloads" element={<Orders />} />
        <Route path="products" element={<Product />} />
        <Route path="orders" element={<Orders />} />
        <Route path="users" element={<Users />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
