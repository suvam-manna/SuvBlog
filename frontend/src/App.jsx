import React from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import { Toaster } from 'react-hot-toast'

import Navbar from "../src/components/Navbar"
import Home from "../src/components/Home"
import Footer from "../src/components/Footer"

import Blogs from "../src/pages/Blogs"
import Contact from "../src/pages/Contact"
import Creators from "../src/pages/Creators"
import Login from "../src/pages/Login"
import Register from "../src/pages/Register"
import Dashboard from "../src/pages/Dashboard"
import UpdateBlog from "./dashboard/UpdateBlog"
import Detail from "./pages/Detail"
import Notfound from "./pages/Notfound"

import { useAuth } from "./context/AuthProvider"

function App() {
  const location = useLocation();
  const hideNavbarFooter = ["/dashboard", "/login", "/register"].includes(location.pathname);
  const { blogs, isAuthenticated } = useAuth();
  let token = localStorage.getItem("jwt"); // Retrieve the token directly from the localStorage to maintain the routes protect (Go to login.jsx)
  console.log(blogs);
  console.log(isAuthenticated); // it is not using because every page refresh it was redirected to /login

  return (
    <div>      
      {!hideNavbarFooter && <Navbar />} {/* hiding navbar in "/dashboard", "/login", "/register" routes */}
      
      {/* Defining routes */}
      <Routes>
        <Route exact path="/" element={ <Home /> } />
        <Route exact path="/blogs" element={ <Blogs /> } />        
        <Route exact path="/contact" element={ <Contact /> } />
        <Route exact path="/creators" element={ <Creators /> } />
        <Route exact path="/login" element={ <Login /> } />
        <Route exact path="/register" element={ <Register /> } />
        <Route exact path="/dashboard" element={ <Dashboard /> } />

        <Route exact path="/blog/update/:id" element={<UpdateBlog />} />
        <Route exact path="/blog/:id" element={<Detail />} />

        <Route path="*" element={<Notfound />} /> {/* Universal route */}
      </Routes>
      <Toaster />

      {!hideNavbarFooter && <Footer />} {/* hiding footer in "/dashboard", "/login", "/register" routes */}
    </div>
  )
}

export default App