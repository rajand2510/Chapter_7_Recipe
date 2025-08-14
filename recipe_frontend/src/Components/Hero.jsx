import React from 'react'
import food3 from "../assets/zoshua-colah-nNIHe72pa60-unsplash.jpg"
import { useAuth } from '../Context/AuthContext'
const Hero = () => {
  const {darkMode} = useAuth();
  return (
    <div className="flex mx-12 mt-24 h-screen gap-4">
      <div className='space-y-4 h-full w-[50%]'>
        <div className="border-2 bg-[#F472B6] lg:px-8  md:px-4 sm:px-3 h-[50%] rounded-lg overflow-hidden">
          <h1 style={{color: darkMode ? '#f5f5f5' : '#111827'  }} className="font-archivo lg:-mt-7 md:-mt-2 overflow-y-hidden  overflow-x-hidden sm:2xl text-5xl md:text-5xl lg:text-7xl font-black uppercase leading-none mb-4">
            Stop Guessing. <br /> Start Cooking.
          </h1>
          <p className="text-lg mb-6 max-w-sm">
            Find your next favorite meal. Right here, right now.
          </p>
        </div>
        <div className="border-2  h-[25%] rounded-lg overflow-hidden">
         <img className=' w-full h-full object-cover' src="https://images.unsplash.com/photo-1504674900247-0877df9cc836" alt="" />
        </div>
      </div>
      <div className='space-y-4 h-full w-[50%]'>
       
        <div className="border-2  h-[30%] rounded-lg overflow-hidden">
         <img className='h-full w-full object-cover' src={food3} alt="" />
        </div>
         <div className="border-2  h-[45%] rounded-lg overflow-hidden">
         <img className='h-full w-full object-cover' src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38" alt="" />
        </div>
      </div>
    </div>
  )
}

export default Hero