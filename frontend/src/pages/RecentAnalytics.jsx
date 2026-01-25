import { useEffect, useState } from "react";
import api from "../api/api";

export default function RecentAnalytics() {
  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    api.get("/user/recent-analytics", {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setData(res.data));
  }, []);

  if (!data) return null;

  return (
    <div className="max-w-3xl mx-auto mt-8 px-6">
      <h2 className="text-2xl font-bold text-white mb-4">
        📊 Listening Analytics
      </h2>

      <div className="bg-neutral-900 rounded p-4 space-y-2">
        {Object.entries(data).map(([songId, count]) => (
          <div
            key={songId}
            className="flex justify-between text-gray-300"
          >
            <span>Song ID: {songId}</span>
            <span>{count} plays</span>
          </div>
        ))}
      </div>
    </div>
  );
}
