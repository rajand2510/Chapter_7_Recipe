import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const Navbar = () => {
  const { user, darkMode } = useAuth();

  return (
    <div
      className={`z-10 fixed flex justify-between items-center h-18 px-15 top-0 left-0 right-0 backdrop-blur-md transition-colors duration-300 ${
        darkMode
          ? 'bg-gray-900/80 text-white'
          : 'bg-[#f5f5f5]/40 text-gray-800'
      }`}
    >
      <Link
        to={'/'}
        className={`font-archivo py-1.5 px-4 text-2xl font-[900] ${
          darkMode ? 'text-white' : 'text-black'
        }`}
      >
        FLAVORFIND
      </Link>
      <div className='space-x-5 flex'>
        {user ? (
          <>
            <Link
              to={'/'}
              className={`font-inter font-extrabold py-2 px-4 transition-colors duration-300 ${
                darkMode
                  ? 'text-gray-200 hover:text-white'
                  : 'text-gray-800 hover:text-black'
              }`}
            >
              Home
            </Link>
            <Link
              to={'/favorite'}
              className={`font-inter font-extrabold py-2 px-4 transition-colors duration-300 ${
                darkMode
                  ? 'text-gray-200 hover:text-white'
                  : 'text-gray-800 hover:text-black'
              }`}
            >
              Favorite
            </Link>
            <Link
              to={'/profile'}
              className={`font-inter font-extrabold py-2 px-4 transition-colors duration-300 ${
                darkMode
                  ? 'text-gray-200 hover:text-white'
                  : 'text-gray-800 hover:text-black'
              }`}
            >
              Profile
            </Link>
          </>
        ) : (
          <>
            <Link
              to={'/'}
              className={`font-inter font-extrabold py-2 px-4 transition-colors duration-300 ${
                darkMode
                  ? 'text-gray-200 hover:text-white'
                  : 'text-gray-800 hover:text-black'
              }`}
            >
              Home
            </Link>
            <Link
              to={'/login'}
              className={`font-inter font-extrabold py-2 px-4 transition-colors duration-300 ${
                darkMode
                  ? 'text-gray-200 hover:text-white'
                  : 'text-gray-800 hover:text-black'
              }`}
            >
              Login
            </Link>
            <Link
              to={'/signup'}
              className={`font-inter font-extrabold py-2 px-4 transition-colors duration-300 ${
                darkMode
                  ? 'text-gray-200 hover:text-white'
                  : 'text-gray-800 hover:text-black'
              }`}
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
