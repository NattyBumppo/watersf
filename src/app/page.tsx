"use client";

// import Image from "next/image";
import { useState } from "react";
import { UserLocation, getLocationAsync } from "./geolocation";
import { WaterResourceComputed, getResults } from "./api/api";
import { SearchResults } from "./searchResults";

export default function Home() {
  const [loading, setLoading] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  const [searchResultsWater, setSearchResultsWater] = useState<
    WaterResourceComputed[]
  >([]);
  const [searchResultsRestroom, setSearchResultsRestroom] = useState<
    WaterResourceComputed[]
  >([]);

  async function onClick() {
    setLoading(true);
    const userLocation = await getLocationAsync(setLoading, setError);
    setUserLocation(userLocation);

    if (!userLocation) {
      setLoading(false);
      setError("Could not get location");
      return;
    }

    // Update results
    const searchResultsWater = getResults(userLocation, "drinking_water");
    const searchResultsRestroom = getResults(userLocation, "restroom");

    setSearchResultsWater(searchResultsWater);
    setSearchResultsRestroom(searchResultsRestroom);
  }

  return (
    <main className="flex min-h-screen flex-col items-center px-8 py-4">
      {/* Top logo and location */}
      <div className="text-center">
        <div className="py-3">
          <h1 className="text-4xl py-2">Water SF</h1>
          <h3>Find Water Fountains & Bathrooms in San Francisco</h3>
          <a
            className="italic text-blue-500 hover:underline"
            href="https://tapwatersafe.com/san-francisco-us#:~:text=Yes%2C%20San%20Francisco%20has%20numerous,schools%2C%20and%20other%20public%20facilities."
          >
            Is it safe? - <strong>YES!</strong>
          </a>
        </div>
        {loading === null ? (
          <div className="w-100">
            <img src="./map.png" alt="Map" className="max-w-screen-sm" />
          </div>
        ) : loading ? (
          <p className="py-3">Loading...</p>
        ) : error !== null ? (
          <p>Error: {error}</p>
        ) : (
          <p>
            📍 {userLocation?.latitude}, {userLocation?.longitude}
          </p>
        )}
      </div>

      {/* List of results */}
      <div>
        <SearchResults
          title="Water Fountains 🚰"
          searchResults={searchResultsWater}
        />
        <SearchResults
          title="Restrooms 🚻"
          searchResults={searchResultsRestroom}
        />
      </div>

      {/* Button to find water */}
      {!loading && (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 my-8 px-12 rounded"
          onClick={onClick}
        >
          Find Water 🚰
        </button>
      )}
    </main>
  );
}
