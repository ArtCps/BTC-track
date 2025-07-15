import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  TimeScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(LineElement, TimeScale, LinearScale, PointElement, Tooltip);

export default function App() {
  const [dataPoints, setDataPoints] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);

  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=eur&days=7"
    )
      .then((res) => res.json())
      .then((data) => {
        const prices = data.prices.map(([ts, price]) => ({
          x: new Date(ts),
          y: price,
        }));
        setDataPoints(prices);
        const start = prices[0].y,
          end = prices[prices.length - 1].y;
        if ((start - end) / start >= 0.08) setAlertVisible(true);
      });
  }, []);

  const chartData = {
    datasets: [
      {
        label: "BTC (EUR) – 7j",
        data: dataPoints,
        borderColor: "#f59e0b",
        backgroundColor: "rgba(245,158,11,0.2)",
        pointRadius: 0,
        tension: 0.3,
      },
    ],
  };

  const options = {
    scales: {
      x: { type: "time", time: { unit: "day" }, title: { display: true, text: "Date" } },
      y: { title: { display: true, text: "Prix (EUR)" } },
    },
    plugins: { tooltip: { mode: "index", intersect: false } },
    responsive: true,
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "600px", margin: "auto" }}>
      <h1>BTC – Prix 7 jours</h1>
      {alertVisible && (
        <div style={{ background: "#fee2e2", color: "#991b1b", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
          🚨 Alerte : chute ≥ 8 % sur les 7 derniers jours
        </div>
      )}
      <Line data={chartData} options={options} />
    </div>
  );
}
