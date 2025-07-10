const express = require("express");
const axios = require("axios");
const router = express.Router();

const CLIST_USER = process.env.CLIST_USERNAME;
const CLIST_KEY = process.env.CLIST_API_KEY;

if (!CLIST_USER || !CLIST_KEY) {
    console.warn("🟠 Warning: CLIST credentials not set in env");
}

function formatDuration(rawDuration) {
    try {
        // If it's a string like "01:30:00"
        if (typeof rawDuration === "string" && rawDuration.includes(":")) {
            const parts = rawDuration.split(":");
            const h = parseInt(parts[0]);
            const m = parseInt(parts[1]);
            return `${h}h ${m}m`;
        }

        // If it's ISO string like "PT1H30M"
        if (typeof rawDuration === "string" && rawDuration.startsWith("PT")) {
            const h = rawDuration.match(/(\d+)H/)?.[1] || 0;
            const m = rawDuration.match(/(\d+)M/)?.[1] || 0;
            return `${h}h ${m}m`;
        }

        // If it's number (seconds)
        if (typeof rawDuration === "number") {
            const h = Math.floor(rawDuration / 3600);
            const m = Math.floor((rawDuration % 3600) / 60);
            return `${h}h ${m}m`;
        }

        return "—";
    } catch (e) {
        return "—";
    }
}


router.get("/contests", async (req, res) => {
  try {
    const now = new Date();
    const monthAhead = new Date(now);
    monthAhead.setMonth(now.getMonth() + 1);

    const startISO = now.toISOString().split(".")[0];
    const endISO = monthAhead.toISOString().split(".")[0];

    const url = `https://clist.by/api/v2/contest/?username=${CLIST_USER}&api_key=${CLIST_KEY}&start__gte=${startISO}&start__lt=${endISO}&order_by=start`;

    const response = await axios.get(url);

    console.log("🔍 Sample contest object:", response.data.objects[0]);


    const uniqueMap = new Map();

    response.data.objects.forEach((c) => {
      const key = `${c.event}-${c.resource.name}-${c.start}`;
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, {
          id: c.id,
          platform: c.resource.split(".")[0] || "Unknown",
          name: c.event,
          start: c.start,
          duration: c.duration,
          link: c.href,
        });
      }
    });

    const uniqueContests = Array.from(uniqueMap.values());

    res.json(uniqueContests);
  } catch (err) {
    console.error("❌ CLIST fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch contests" });
  }
});


module.exports = router;
