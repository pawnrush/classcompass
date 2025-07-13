"use client";

import React from 'react';

// A simple icon for the logo
const CompassIcon = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="64" 
        height="64" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="text-blue-600"
    >
        <circle cx="12" cy="12" r="10"></circle>
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
    </svg>
);

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100 font-sans">
      <div className="text-center">
        <div className="flex justify-center mb-6">
            <CompassIcon />
        </div>
        <h1 className="text-5xl font-bold text-gray-800">
          Welcome to ClassCompass
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          The foundation is set. Ready for the next sprint.
        </p>
        <div className="mt-8">
            <div className="p-4 bg-white rounded-2xl shadow-md inline-block">
                <p className="text-gray-700">Deployment Status: <span className="font-semibold text-green-600">Stable</span></p>
            </div>
        </div>
      </div>
    </main>
  );
}
