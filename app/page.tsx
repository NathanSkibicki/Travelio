'use client';

import dynamic from 'next/dynamic';

// Dynamically import the Map component to avoid SSR issues with Leaflet
const Map = dynamic(() => import('./components/Map'), {
  ssr: false,
  loading: () => <div className="w-full h-[500px] bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">Loading map...</div>
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Travelio</h1>
          <p className="text-lg text-gray-600">Your interactive travel companion</p>
        </header>
        
        <main className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Interactive Map</h2>
            <Map />
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Plan Your Trip</h3>
              <p className="text-gray-600 mb-4">
                Explore destinations, mark points of interest, and plan your perfect journey with our interactive map.
              </p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Start Planning
              </button>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Discover Places</h3>
              <p className="text-gray-600 mb-4">
                Find amazing destinations, restaurants, hotels, and attractions around the world.
              </p>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                Explore Now
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
