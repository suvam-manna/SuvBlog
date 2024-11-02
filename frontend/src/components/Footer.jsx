import React from "react";
import { FaGithub } from "react-icons/fa";
import { BsYoutube } from "react-icons/bs";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <footer className="border py-5">
        <div className=" container mx-auto  flex flex-col md:flex-row justify-between items-center">
          <div className="text-xl font-semibold hidden md:flex">
            Suv<span className="text-blue-500 font-bold">Blog</span>
          </div>
          <div className="text-gray-400 text-sm hidden md:flex">
            <p>&copy; 2024 Suvam Manna</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <a href="https://github.com/suvam-manna">
              <FaGithub className="h-6" />
            </a>            
            <a href="https://www.linkedin.com/in/suvam-manna-2bb8a6283/">
              <FaLinkedin className="h-6" />
            </a>
          </div>
        </div>
      </footer>
      
    </>
  );
};

export default Footer;