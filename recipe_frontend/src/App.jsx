
import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Navbar from './Components/Navbar'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Profile from './Pages/Profile'
import NotFound from './Pages/NotFound'
import { AnimatePresence, motion } from 'framer-motion';

import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'

import Favorite from './Pages/Favorite'
import { useEffect } from 'react'
import { useAuth } from './Context/AuthContext'
import { SearchProvider } from './context/SearchContext'


function App() {
  const location = useLocation();
  const { darkMode } = useAuth();
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);
  const pageAnimation = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1], // standard ease-in-out
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.97,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };



  return (
    <>

      <SearchProvider>
        <Navbar />

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <motion.div {...pageAnimation}>
                  <Home />
                </motion.div>
              }
            />

           
            <Route
              path="/profile"
              element={
                <motion.div {...pageAnimation}>
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                </motion.div>
              }
            />
            <Route
              path="/favorite"
              element={
                <motion.div {...pageAnimation}>
                  <ProtectedRoute>
                    <Favorite />
                  </ProtectedRoute>
                </motion.div>
              }
            />


            <Route
              path="/login"
              element={
                <motion.div {...pageAnimation}>
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                </motion.div>
              }
            />

            <Route
              path="/signup"
              element={
                <motion.div {...pageAnimation}>
                  <PublicRoute>
                    <Signup />
                  </PublicRoute>
                </motion.div>
              }
            />

            <Route
              path="*"
              element={
                <motion.div {...pageAnimation}>
                  <NotFound />
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </SearchProvider>


      <Toaster position="top-right" />
    </>
  );
}

export default App;
