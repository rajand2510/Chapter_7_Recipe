import React from "react";

const NotFound = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5F5F5] text-[#171717] font-inter">
    
      {/* 404 Content */}
      <main className="flex-grow flex items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Background "404" */}
          <h1 className="font-archivo font-black uppercase tracking-wider absolute inset-0 flex items-center justify-center -z-10 text-[10rem] leading-none text-gray-200">
            404
          </h1>

          {/* Illustration */}
          <div className="relative w-[300px] h-[200px] mx-auto mb-4">
            <svg
              viewBox="0 0 200 120"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <g transform="translate(100, 60) rotate(15)">
                {/* Spoon */}
                <path
                  d="M -40 -30 C -50 -50, -20 -60, 0 -50 C 20 -60, 50 -50, 40 -30 L 20 20 L -20 20 Z"
                  fill="#D1D5DB"
                />
                <rect
                  x="-5"
                  y="15"
                  width="10"
                  height="40"
                  rx="5"
                  fill="#A16207"
                />
                {/* Spilled food/sauce */}
                <path
                  d="M -60 20 C -80 0, -70 40, -40 50 C -10 60, 20 60, 50 40 C 80 20, 70 -10, 40 5 C 10 20, -20 30, -60 20 Z"
                  fill="#F472B6"
                  opacity="0.8"
                />
              </g>
            </svg>
          </div>

          {/* Subheading */}
          <p className="font-archivo text-2xl sm:text-3xl font-bold uppercase text-neutral-800 mt-2 relative">
            Something&apos;s Missing
          </p>

          {/* Helper Text */}
          <p className="mt-3 max-w-md mx-auto text-neutral-600">
            It seems this page has been whisked away. Don&apos;t worry, we can
            help you find your way back to our delicious recipes.
          </p>

          {/* Call to Action Button */}
          <a
            href="/"
            className="mt-8 inline-block bg-[#171717] text-white font-bold py-3 px-6 rounded-lg text-lg uppercase tracking-wider transition-all duration-300 hover:bg-[#404040] hover:-translate-y-0.5"
          >
            Back to Homepage
          </a>
        </div>
      </main>
    </div>
  );
};

export default NotFound;
