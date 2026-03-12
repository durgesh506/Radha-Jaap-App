import { useState, useRef, useEffect } from "react";
import MantraInput from "../components/MantraInput";
import {
  sendNotification,
  requestNotificationPermission,
} from "../services/notificationService";
import { minutesToMilliseconds, isWithinOfficeTime } from "../utils/timeUtils";

function Home() {

  const [activeTab, setActiveTab] = useState("jaap");

  const [installPrompt, setInstallPrompt] = useState(null);

  const [mantra, setMantra] = useState("Radha");
  const [interval, setIntervalTime] = useState(5);
  const [startTime, setStartTime] = useState("09:30");
  const [endTime, setEndTime] = useState("18:30");

  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem("jaapCount");
    return saved ? Number(saved) : 0;
  });

  const [running, setRunning] = useState(false);

  const intervalRef = useRef(null);

  // PWA install detect
  useEffect(() => {

    const handler = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };

  }, []);

  const installApp = async () => {

    if (!installPrompt) {
      alert("Install option not available yet");
      return;
    }

    installPrompt.prompt();
    await installPrompt.userChoice;

  };

  const startReminder = async () => {

    await requestNotificationPermission();

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {

      if (isWithinOfficeTime(startTime, endTime)) {
        sendNotification(mantra);
      }

    }, minutesToMilliseconds(interval));

    setRunning(true);
  };

  const stopReminder = () => {

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setRunning(false);
  };

  const increaseCount = () => {

    setCount((prev) => {

      const newCount = prev + 1;

      if (newCount === 108) {
        alert("🎉 108 Jaap Complete!");
        localStorage.setItem("jaapCount", 0);
        return 0;
      }

      localStorage.setItem("jaapCount", newCount);
      return newCount;

    });

  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f8",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >

      {/* Header */}

      <div
        style={{
          padding: 15,
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 20,
          background: "#ff6600",
          color: "white",
        }}
      >
        🙏 Radha App
      </div>

      {/* Install Button */}

      {installPrompt && (
        <div style={{padding:10}}>
          <button
            onClick={installApp}
            style={{
              width: "100%",
              padding: 12,
              background: "#ff6600",
              color: "white",
              border: "none",
              borderRadius: 10,
              fontWeight: "bold"
            }}
          >
            📲 Install Radha App
          </button>
        </div>
      )}

      {/* Content */}

      <div style={{ padding: 20, flex: 1 }}>

        {activeTab === "jaap" && (
          <div style={{ textAlign: "center" }}>

            <h2>📿 Naam Jaap</h2>

            <p style={{ color: "#777" }}>Goal: 108</p>

            <div
              style={{
                fontSize: 70,
                fontWeight: "bold",
                margin: "20px 0",
                color: "#ff6600",
              }}
            >
              {count}
            </div>

            <div
              style={{
                width: "100%",
                height: 10,
                background: "#eee",
                borderRadius: 10,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: `${(count / 108) * 100}%`,
                  height: "100%",
                  background: "#ff6600",
                  borderRadius: 10,
                }}
              />
            </div>

            <button
              onClick={() => {
                increaseCount();
                if (navigator.vibrate) navigator.vibrate(50);
              }}
              style={{
                width: "100%",
                background: "#ff6600",
                color: "white",
                padding: 18,
                border: "none",
                borderRadius: 12,
                fontSize: 22,
                fontWeight: "bold",
                marginBottom: 12,
              }}
            >
              +1 JAAP
            </button>

            <button
              onClick={() => {
                setCount(0);
                localStorage.setItem("jaapCount", 0);
              }}
              style={{
                width: "100%",
                background: "#ddd",
                padding: 12,
                border: "none",
                borderRadius: 10,
              }}
            >
              Reset Counter
            </button>

          </div>
        )}

        {activeTab === "reminder" && (
          <div>

            <p>Status: {running ? "🟢 Running" : "🔴 Stopped"}</p>

            <label>Mantra</label>

            <MantraInput mantra={mantra} setMantra={setMantra} />

            <br /><br />

            <label>Reminder Interval</label>

            <input
              type="number"
              value={interval}
              onChange={(e) => setIntervalTime(Number(e.target.value))}
              style={{ width: "100%", padding: 10 }}
            />

            <br /><br />

            <label>Start Time</label>

            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              style={{ width: "100%", padding: 10 }}
            />

            <br /><br />

            <label>End Time</label>

            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              style={{ width: "100%", padding: 10 }}
            />

            <br /><br />

            <button
              onClick={startReminder}
              style={{
                width: "100%",
                background: "#ff6600",
                color: "white",
                padding: 12,
                border: "none",
                borderRadius: 10,
              }}
            >
              Start Reminder
            </button>

            <br /><br />

            <button
              onClick={stopReminder}
              style={{
                width: "100%",
                background: "red",
                color: "white",
                padding: 12,
                border: "none",
                borderRadius: 10,
              }}
            >
              Stop
            </button>

          </div>
        )}

        {activeTab === "darshan" && (
          <div style={{ textAlign: "center" }}>
            <h2>🛕 Live Darshan</h2>
            <p>Coming Soon</p>
          </div>
        )}

      </div>

      {/* Bottom Navigation */}

      <div
        style={{
          display: "flex",
          borderTop: "1px solid #ddd",
          background: "white",
        }}
      >
        <button
          onClick={() => setActiveTab("jaap")}
          style={{
            flex: 1,
            padding: 12,
            border: "none",
            background: activeTab === "jaap" ? "#ffe5d0" : "white",
          }}
        >
          📿 Jaap
        </button>

        <button
          onClick={() => setActiveTab("reminder")}
          style={{
            flex: 1,
            padding: 12,
            border: "none",
            background: activeTab === "reminder" ? "#ffe5d0" : "white",
          }}
        >
          ⏰ Reminder
        </button>

        <button
          onClick={() => setActiveTab("darshan")}
          style={{
            flex: 1,
            padding: 12,
            border: "none",
            background: activeTab === "darshan" ? "#ffe5d0" : "white",
          }}
        >
          🛕 Darshan
        </button>
      </div>

    </div>
  );
}

export default Home;