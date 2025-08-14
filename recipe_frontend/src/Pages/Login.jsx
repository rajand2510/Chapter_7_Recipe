import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'
const Login = () => {
    const { login } = useAuth();

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        login(email, password);
    };

    return (
        <div className='mt-18 h-[calc(100vh-72px)] flex'>
            <div className='lg:w-1/2  lg:block hidden'>
                <img
                    className='h-full w-full object-cover'
                    src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?&w=780&auto=format&fit=crop"
                    alt="Pizza"
                />
            </div>
            <div className='lg:w-1/2 md:w-full py-15 px-36'>
                <h3 className='font-archivo   text-3xl font-[900]'>FLAVORFIND </h3>
                <div className='my-8 space-y-3'>
                    <h3 className='font-archivo   text-5xl font-[900]'>WELCOME BACK </h3>
                    <p className='text-lg font-inter text-gray-600'>Login to access your saved recipes.</p>
                </div>
                <div className='flex flex-col'>
                    <label className='font-archivo text-sm font-bold py-2' htmlFor="">EMAIL</label>
                    <input className='px-4 py-3 border-2 rounded-lg focus:outline-2 focus:outline-pink-400' type="text"
                      value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label className='font-archivo text-sm font-bold py-2' htmlFor="">PASSWORD</label>
                    <input className='px-4 py-3 border-2 rounded-lg focus:outline-2 focus:outline-pink-400'
                      value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
                </div>
                <button onClick={handleLogin} className='py-4 mt-8 px-4 w-full font-bold bg-black rounded-lg text-white font-inter'>LOGIN</button>
                <div className='flex justify-center items-center'>
                    <Link to={'/signup'} className='text-lg py-8 font-inter text-[16px]'>Don't have an account?<span className='text-pink-500 font-bold'>Sign Up</span> </Link>
                </div>
            </div>
        </div>
    )
}

export default Login
