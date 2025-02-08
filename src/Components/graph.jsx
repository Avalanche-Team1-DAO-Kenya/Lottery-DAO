import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { getTokenName } from "../utils/helpers";
import "./css/graph.css";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

const Graph = ({ data }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (chartInstance) {
      chartInstance.update();
    }
  }, [isMobile, chartInstance]);

  if (!data || !data.labels || !data.values || data.values.length === 0) {
    return (
      <div className="graph-wrapper">
        <div className="hologram-coin"></div>
        <p className="no-data">No ticket data available</p>
      </div>
    );
  }

  // Format labels to use token names instead of addresses
  const formattedLabels = data.labels.map(getTokenName);

  const chartData = {
    labels: formattedLabels,
    datasets: [
      {
        label: "Your Tickets",
        data: data.values,
        borderColor: "#FFD700",
        backgroundColor: "rgba(255, 215, 0, 0.1)",
        pointBackgroundColor: "#FFA500",
        pointBorderColor: "#FFD700",
        pointBorderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: isMobile ? 4 : 6,
        pointHoverRadius: isMobile ? 6 : 8,
        borderWidth: isMobile ? 2 : 3
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: "easeInOutQuart"
    },
    plugins: {
      legend: {
        display: !isMobile,
        position: "top",
        labels: {
          color: "#B8B8B8",
          font: {
            size: isMobile ? 12 : 14,
            family: "'Inter', sans-serif"
          },
          padding: isMobile ? 10 : 20,
          usePointStyle: true,
          pointStyle: "circle"
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(26, 26, 46, 0.95)",
        titleColor: "#FFD700",
        bodyColor: "#ffffff",
        borderColor: "rgba(255, 215, 0, 0.3)",
        borderWidth: 1,
        padding: isMobile ? 10 : 14,
        titleFont: {
          size: isMobile ? 13 : 15,
          family: "'Inter', sans-serif",
          weight: "600"
        },
        bodyFont: {
          size: isMobile ? 12 : 14,
          family: "'Inter', sans-serif"
        },
        displayColors: false,
        callbacks: {
          title: (context) => {
            const address = data.labels[context[0].dataIndex];
            const tokenName = getTokenName(address);
            return `Token: ${tokenName}`;
          },
          label: (context) => `Tickets: ${context.parsed.y}`
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
          drawBorder: false,
          display: !isMobile
        },
        ticks: {
          color: "#B8B8B8",
          font: {
            size: isMobile ? 10 : 12,
            family: "'Inter', sans-serif"
          },
          maxRotation: isMobile ? 45 : 0,
          minRotation: isMobile ? 45 : 0
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
          drawBorder: false
        },
        ticks: {
          color: "#B8B8B8",
          font: {
            size: isMobile ? 10 : 12,
            family: "'Inter', sans-serif"
          },
          stepSize: 1,
          callback: (value) => (Number.isInteger(value) ? value : "")
        },
        suggestedMax: Math.max(...data.values) + 1
      }
    },
    interaction: {
      intersect: false,
      mode: "index"
    },
    onHover: (event, elements) => {
      if (event.native) {
        event.native.target.style.cursor = elements.length ? "pointer" : "default";
      }
    }
  };

  return (
    <div className="graph-wrapper">
      <Line 
        data={chartData} 
        options={options}
        onElementsClick={(elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const address = data.labels[index];
            console.log("Token:", getTokenName(address));
            console.log("Address:", address);
            console.log("Tickets:", data.values[index]);
          }
        }}
      />
    </div>
  );
};

export default Graph;
