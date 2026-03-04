"use client";

import axios, { AxiosError } from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export type LocationItems = {
  id: number;
  locationName: string;
};

export type ViewpointItems = {
  id: number;
  viewpointName: string;
  mountain: string;
  locationId: number;
  height: number;
  description: string;
  built: string;
  imageUrl: string;
};

export default function HomePage() {
  const [locations, setLocations] = useState<LocationItems[]>([]);
  const [viewpoints, setViewpoints] = useState<ViewpointItems[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>("Bükk");

  useEffect(() => {
    async function getLocations() {
      try {
        const res = await axios.get<LocationItems[]>("http://localhost:3000/api/locations");
        setLocations(res.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          toast(error.response?.data.message || error.message || "Ismeretlen axios hiba!");
        } else {
          toast((error as Error).message || "Ismeretlen hiba!");
        }
      }
    }
    getLocations();
  }, []);

  useEffect(() => {
    async function getViewpoints() {
      const res = await axios.get(`http://localhost:3000/api/${selectedLocation}/viewpoints`);
      setViewpoints(res.data);
    }
    getViewpoints();
  }, [selectedLocation]);

  return (
    <div className="flex min-h-screen flex-col bg-gray-200">
      {/* Helység kiválasztása legördülő listával */}
      <div className="my-4 flex items-center justify-center">
        <h1 className="mr-2 text-2xl">Hegység:</h1>
        <select
          className="select select-primary"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          {locations.map((e) => (
            <option key={e.id}>{e.locationName}</option>
          ))}
        </select>
      </div>
      {/* Kilátók megjelenítése */}
      <div className="items-top flex flex-wrap justify-center space-y-10 space-x-10">
        {viewpoints.map((e) => (
          <div className="w-1/4 rounded-lg border border-sky-600 bg-sky-200 shadow-lg" key={e.id}>
            <div className="rounded-t-lg bg-sky-400 p-2 text-center text-xl font-bold">
              {e.viewpointName}
            </div>
            <div className="py-5 pl-10">
              <ul className="list-disc">
                <li>
                  Hegy: <b>{e.mountain}</b>
                </li>
                <li>
                  Magasság: <b>{e.height} m</b>
                </li>
                <li>
                  Épült: <b>{e.built}</b>
                </li>
              </ul>
            </div>
            <div className="bg-sky-400 p-5">
              <p className="text-justify">{e.description}</p>
            </div>
            <div className="flex items-center justify-center p-5">
              <Image
                alt="Avas kilátó"
                className="rounded-lg"
                height={0}
                src={e.imageUrl}
                width={150}
              />
            </div>
          </div>
        ))}
      </div>
      {/* {JSON.stringify(vewpoints)} */}
    </div>
  );
}
