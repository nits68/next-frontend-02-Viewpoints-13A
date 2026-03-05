"use client";

import axios from "axios";
import { Search } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useGlobalStore } from "@/store/globalStore";

export type ViewpointItems = {
  id: number;
  viewpointName: string;
  mountain: string;
  locationId: number;
  height: number;
  description: string;
  built: string;
  imageUrl: string;
  location: Location;
};

export type Location = {
  id: number;
  locationName: string;
};

export default function PaginationExamplePage() {
  const limit: number = 4;
  const [viewpoints, setViewpoints] = useState<ViewpointItems[]>([]);
  const { gs, set } = useGlobalStore();

  useEffect(() => {
    async function getViewpoints() {
      const res = await axios.get(
        `http://localhost:3000/api/viewpoints/${gs.actualPage}/${limit}/${gs.searchTerm || "*"}`,
      );
      setViewpoints(res.data);
      set("numberOfRecords", res.headers["number-of-records"]);
      set("numberOfPages", Math.ceil(gs.numberOfRecords / limit));
      set("actualPage", gs.actualPage > gs.numberOfPages ? 1 : gs.actualPage);
    }
    getViewpoints();
  }, [gs.searchTerm, gs.actualPage, gs.numberOfRecords, gs.numberOfPages, set]);

  return (
    <div className="justify-top flex flex-col items-center">
      {/* Input serch term */}
      <div className="m-3">
        <label className="input">
          <Search className="input-icon" />
          <input
            placeholder="Keresés..."
            required
            type="search"
            value={gs.searchTerm}
            onChange={(e) => set("searchTerm", e.target.value)}
          />
        </label>
      </div>
      {/* First, previous, next, last buttons */}
      <div className="flex space-x-2">
        <button
          className="btn btn-primary"
          disabled={gs.actualPage === 1}
          onClick={() => set("actualPage", 1)}
        >
          First
        </button>
        <button
          className="btn btn-primary"
          disabled={gs.actualPage === 1}
          onClick={() => set("actualPage", gs.actualPage - 1)}
        >
          Previous
        </button>
        <button
          className="btn btn-primary"
          disabled={gs.actualPage === gs.numberOfPages}
          onClick={() => set("actualPage", gs.actualPage + 1)}
        >
          Next
        </button>
        <button
          className="btn btn-primary"
          disabled={gs.actualPage === gs.numberOfPages}
          onClick={() => set("actualPage", gs.numberOfPages)}
        >
          Last
        </button>
      </div>
      <div className="grid grid-cols-1 gap-10 p-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Kártya példa */}
        {viewpoints.map((wp) => (
          <div className="overflow-hidden rounded-xl bg-blue-200 shadow-md" key={wp.id}>
            {/* Title bar */}
            <div className="bg-blue-200 px-3 py-2 text-center font-semibold">
              {wp.viewpointName} - ({wp.height} m) - {wp.mountain}
            </div>

            <div className="flex items-center justify-center">
              <Image
                alt={wp.viewpointName}
                className="w-50 rounded-lg"
                height={200}
                src={wp.imageUrl}
                width={100}
              />
            </div>

            <div className="m-4 rounded-md bg-yellow-100 p-3">{wp.description}</div>

            <div className="mx-4 mb-4 rounded-md bg-blue-200 p-2 text-sm font-medium">
              Hegység: {wp.location.locationName}, épült: {wp.built}
            </div>
          </div>
        ))}
      </div>
      {/* {JSON.stringify(viewpoints)} */}
    </div>
  );
}
