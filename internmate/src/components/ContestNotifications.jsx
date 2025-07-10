import React, { useEffect, useState } from "react";
import ContestCard from "./ContestCard";
import Layout from "../components/Layout";
import "../styles/Layout.css";

const mockContests = [
  {
    id: 1,
    platform: "Codeforces",
    name: "Codeforces Round #900 (Div. 3)",
    start: "2025-06-27T14:35:00Z",
    duration: "2h",
    link: "https://codeforces.com/contest/900",
  },
  {
    id: 2,
    platform: "LeetCode",
    name: "LeetCode Weekly Contest 450",
    start: "2025-06-28T01:00:00Z",
    duration: "1.5h",
    link: "https://leetcode.com/contest/weekly-contest-450",
  },
  {
    id: 3,
    platform: "AtCoder",
    name: "AtCoder Beginner Contest 360",
    start: "2025-06-29T12:00:00Z",
    duration: "2h",
    link: "https://atcoder.jp/contests/abc360",
  },
];

const ContestNotifications = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState("All");

  useEffect(() => {
    document.body.setAttribute("data-page", "contest");

    fetch("http://localhost:5000/api/contests")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setContests(data))
      .catch((err) => {
        console.error("💥 Fetch error in ContestPage:", err);
        setContests(mockContests); // fallback
      })
      .finally(() => setLoading(false));

    return () => {
      document.body.removeAttribute("data-page");
    };
  }, []);

  const uniquePlatforms = ["All", ...new Set(contests.map(c => c.platform))];

  const filteredContests =
    selectedPlatform === "All"
      ? contests
      : contests.filter(c => c.platform === selectedPlatform);

  return (
    <Layout title="Contests">
      <div className="contest-page min-h-screen bg-violet-50 dark:bg-violet-950 text-violet-900 dark:text-violet-100">
        <h2 className="contest-heading text-center text-2xl font-bold my-4">
          📢 Upcoming Contests
        </h2>

        {/* 🔽 Platform filter */}
        <div className="text-center my-4">
          <label htmlFor="platform-filter" className="mr-2 font-semibold">Filter by Platform:</label>
          <select
            id="platform-filter"
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="p-2 rounded border border-violet-300 dark:border-violet-700 bg-violet-100 dark:bg-violet-800 text-violet-900 dark:text-violet-50"
          >
            {uniquePlatforms.map(platform => (
              <option key={platform} value={platform}>
                {platform}
              </option>
            ))}
          </select>
        </div>

        {/* 🔁 Contest List */}
        {loading ? (
          <p className="text-center">⏳ Loading contests...</p>
        ) : (
          <div className="contest-banner-list px-4 grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredContests.map((contest, index) => (
              <ContestCard
                key={contest.id}
                index={index}
                platform={contest.platform}
                name={contest.name}
                start={contest.start}
                duration={contest.duration}
                link={contest.link}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ContestNotifications;
