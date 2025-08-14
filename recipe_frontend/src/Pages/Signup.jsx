import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const Signup = () => {
  const { signup } = useAuth();

  // Controlled input state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    await signup(username, email, password);
  };

  return (
    <div className="mt-18 h-[calc(100vh-72px)] flex">
      <div className="lg:w-1/2 lg:block hidden">
        <img
          className="h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?&w=780&auto=format&fit=crop"
          alt="Pizza"
        />
      </div>

      <div className="lg:w-1/2 md:w-full py-15 px-36">
        <h3 className="font-archivo text-3xl font-[900]">FLAVORFIND</h3>
        <div className="my-2 space-y-3">
          <h3 className="font-archivo text-5xl font-[900]">JOIN US TODAY</h3>
          <p className="text-lg font-inter text-gray-600">
            Create an account to save and share your favorite recipes.
          </p>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col">
          <label className="font-archivo text-sm font-bold py-2">FULL NAME</label>
          <input
            className="px-4 py-3 border-2 rounded-lg focus:outline-2 focus:outline-pink-400"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label className="font-archivo text-sm font-bold py-2">EMAIL</label>
          <input
            className="px-4 py-3 border-2 rounded-lg focus:outline-2 focus:outline-pink-400"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="font-archivo text-sm font-bold py-2">PASSWORD</label>
          <input
            className="px-4 py-3 border-2 rounded-lg focus:outline-2 focus:outline-pink-400"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="py-4 mt-8 px-4 w-full font-bold bg-black rounded-lg text-white font-inter"
          >
            SIGNUP
          </button>
        </form>

        <div className="flex justify-center items-center">
          <Link
            to="/login"
            className="text-lg py-8 font-inter text-[16px]"
          >
            Already have an account?{' '}
            <span className="text-pink-500 font-bold">Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
