import React from 'react';
import * as apiClient from '../pages/api-clients';
import { useQuery } from 'react-query';
import LatestDestinationCard from '../components/LatestDestinationCard';

const Home = () => {
  const { data: hotels } = useQuery("fetchQuery", () => apiClient.fetchHotels());

  const topRowHotels = hotels?.slice(0, 2) || [];
  const bottomRowHotels = hotels?.slice(2) || [];

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-center text-gray-800">Latest Destinations</h2>
      
      <div className="grid gap-6">
        {/* Top Row */}
        <div className="grid sm:grid-cols-2 grid-cols-1 gap-6">
          {topRowHotels.map((hotel, index) => (
            <LatestDestinationCard key={index} hotel={hotel} />
          ))}
        </div>

        {/* Bottom Row */}
        <div className="grid sm:grid-cols-3 grid-cols-1 gap-6">
          {bottomRowHotels.map((hotel, index) => (
            <LatestDestinationCard key={index} hotel={hotel} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
