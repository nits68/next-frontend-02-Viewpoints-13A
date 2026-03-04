"use client";

import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export type ViewpointItems = {
  id: number;
  viewpointName: string;
  mountain: string;
};

export type RateItems = {
  viewpointId: number;
  rating: number;
  email: string;
  comment: string;
};

export type ResponeItems = {
  count: number;
  average: number;
};

export default function RatingPage() {
  const [viewpoints, setViewpoints] = useState<ViewpointItems[]>([]);
  const [rating, setRating] = useState<RateItems>({
    viewpointId: 0,
    rating: 1,
    email: "",
    comment: "",
  });
  const [accept, setAccept] = useState<boolean>(false);

  async function setViewpointRating() {
    try {
      const res = await axios.post("http://localhost:3000/api/rate", rating);
      const data: ResponeItems = res.data;
      toast.success(
        `A kilátó eddigi értékelése ${data.average}, ${data.count} látogató véleménye alapján!`,
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        toast(error.response?.data.message || error.message || "Ismeretlen axios hiba!");
      } else {
        toast((error as Error).message || "Ismeretlen hiba!");
      }
    }
  }

  useEffect(() => {
    async function getViewpoints() {
      const res = await axios.get("http://localhost:3000/api/viewpoints");
      setViewpoints(res.data);
    }
    getViewpoints();
  }, []);
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="flex flex-col space-y-4 rounded-2xl bg-white p-10 shadow-2xl">
        <h1 className="text-3xl font-bold">Kilátók értékelése</h1>
        <div>
          <label htmlFor="viewpoint">Kilátó:</label>
          <select
            className="select select-primary"
            id="viewpoint"
            value={rating.viewpointId}
            onChange={(e) => setRating({ ...rating, viewpointId: Number(e.target.value) })}
          >
            <option value="0">Válasszon kilátót!</option>
            {viewpoints.map((e) => (
              <option key={e.id} value={e.id}>
                {e.viewpointName}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="email">Az Ön e-mail címe:</label>
          <input
            className="input input-primary"
            id="email"
            type="email"
            value={rating.email}
            onChange={(e) => setRating({ ...rating, email: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="rate">Értékelés: {rating.rating} pont</label>
          <input
            className="range range-primary"
            id="rate"
            max="10"
            min="1"
            type="range"
            value={rating.rating}
            onChange={(e) => setRating({ ...rating, rating: Number(e.target.value) })}
          />
        </div>
        <div>
          <label htmlFor="comment">Megjegyzés:</label>
          <textarea
            className="textarea textarea-primary"
            id="comment"
            rows={3}
            value={rating.comment}
            onChange={(e) => setRating({ ...rating, comment: e.target.value })}
          />
        </div>
        <div>
          <input
            checked={accept}
            id="acceptedConditions"
            type="checkbox"
            onChange={(e) => setAccept(e.target.checked)}
          />
          <label className="ml-2" htmlFor="acceptedConditions">
            Felhasználási feltételeket elfogadom
          </label>
        </div>
        <div className="mx-auto">
          <button
            className="btn btn-primary"
            disabled={!accept}
            type="button"
            onClick={() => setViewpointRating()}
          >
            Küldés
          </button>
        </div>
      </div>
      {/* {JSON.stringify(rating)} */}
    </div>
  );
}
