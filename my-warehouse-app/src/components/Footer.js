import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <Image
              src="/logo-nobg.png"
              alt="Company Logo"
              width={100}
              height={100}
              className=""
            />
          </div>

          <div className="flex flex-col md:flex-row items-center">
            <div className="px-4 py-2 md:py-0">
              <ul className="flex space-x-4">
                <li>
                  <a href="#" className="hover:text-gray-300">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div className="mt-2 md:mt-0 md:ml-4">
              <p className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} My Warehouse App. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
