import React, { useState } from 'react'
import { useAuth } from '../context/AuthProvider'
import { Link, useNavigate } from "react-router-dom"
import { AiOutlineMenu } from "react-icons/ai";
import { IoCloseSharp } from "react-icons/io5";
import axios from "axios";
import toast from "react-hot-toast";

function Navbar() {  
  const [show, setShow] = useState(false) // to handle reponsiveness
  
  const { profile, isAuthenticated, setIsAuthenticated } = useAuth();
  console.log(profile);
  console.log(isAuthenticated);
  const navigateTo = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get(
        "https://suvblog.onrender.com/api/users/logout",
        { withCredentials: true }
      );
      console.log(data);
      localStorage.removeItem("jwt"); // deleting token in localStorage so that if user logged out it will goes to login page
      toast.success(data.message);
      setIsAuthenticated(false);
      navigateTo("/login");
    } catch (error) {
      console.log(error);
      toast.error("Failed to logout");
    }
  };

  return (
    <>
      <nav className="fixed top-0 w-full shadow-lg px-4 py-3 bg-[#f0f8ff] z-50 mb-4"> {/* 'className' is class of tailwind-css */}
        <div className="flex items-center justify-between container mx-auto"> {/* "flex" -> child 'div's will be shown in same line */}
          <div className="font-semibold text-xl">
            Suv<span className="text-blue-500">Blog</span>
          </div>

          {/* Desktop navbar */}
          <div className="mx-6">
            <ul className="hidden md:flex space-x-6"> {/* remains hidden in small devices */}
              <Link to="/" className="hover:text-blue-500">HOME</Link>
              <Link to="/blogs" className="hover:text-blue-500">BLOGS</Link>
              <Link to="/creators" className="hover:text-blue-500">CREATORS</Link>              
              <Link to="/contact" className="hover:text-blue-500">CONTACT</Link>
            </ul>
            <div className="md:hidden" onClick={() => setShow(!show)}>
              {show ? <IoCloseSharp size={24} /> : <AiOutlineMenu size={24} />} {/* onclicking, the icons interchanges */}
            </div>
          </div>

          {/* Desktop navbar */}
          <div className="hidden md:flex space-x-2">
            {isAuthenticated && profile?.role === "admin" ? (
              <Link to="/dashboard" className="bg-blue-600 text-white font-semibold hover:bg-blue-800 duration-300 px-4 py-2 rounded">
                DASHBOARD
              </Link>
            ) : (
              ""
            )}

            {!isAuthenticated ? (
              <Link to="/login" className="bg-red-600 text-white font-semibold hover:bg-red-800 duration-300 px-4 py-2 rounded">
                LOGIN
              </Link>
            ) : (
              <div>
                <button onClick={handleLogout} className="bg-red-600 text-white font-semibold hover:bg-red-800 duration-300 px-4 py-2 rounded">
                  LOGOUT
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile navbar */}
        {show && (
          <div className="bg-white">
            <ul className="flex flex-col h-screen items-center justify-center space-y-3 md:hidden text-xl"> {/* remains hidden in medium & large devices */}
              <Link to="/" onClick={() => setShow(!show)} smooth="true" duration={500} offset={-70} activeClass="active" className="hover:text-blue-500">
                HOME
              </Link>
              <Link to="/blogs" onClick={() => setShow(!show)} smooth="true" duration={500} offset={-70} activeClass="active" className="hover:text-blue-500">
                BLOGS
              </Link>
              <Link to="/creators" onClick={() => setShow(!show)} smooth="true" duration={500} offset={-70} activeClass="active" className="hover:text-blue-500">
                CREATORS
              </Link>              
              <Link to="/contact" onClick={() => setShow(!show)} smooth="true" duration={500} offset={-70} activeClass="active" className="hover:text-blue-500">
                CONTACT
              </Link>
            </ul>
          </div>
        )}
      </nav>
    </>
  )
}

export default Navbar
