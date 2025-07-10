import React, { useState, useEffect, useRef } from "react";
import "./../styles/Pomodoro.css";
import bellSound from "./../assets/bell.wav";
import Layout from "../components/Layout";
import "../styles/Layout.css";

const Pomodoro = () => {
  const classicCycles = [
    { mode: "Focus", duration: 25 * 60 },
    { mode: "Short Break", duration: 5 * 60 },
    { mode: "Focus", duration: 25 * 60 },
    { mode: "Short Break", duration: 5 * 60 },
  ];

  const deepFocus = [
    { mode: "Focus", duration: 50 * 60 },
    { mode: "Long Break", duration: 10 * 60 },
  ];

  const [cycles, setCycles] = useState(classicCycles);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [timeLeft, setTimeLeft] = useState(classicCycles[0].duration);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedMode, setSelectedMode] = useState("classic");

  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakDuration, setBreakDuration] = useState(0);
  const [previousTimeLeft, setPreviousTimeLeft] = useState(null);

  const totalDuration = isOnBreak
    ? breakDuration
    : cycles[currentCycle]?.duration || 1;

  const audioRef = useRef(new Audio(bellSound));

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (isRunning && timeLeft === 0) {
      audioRef.current.play();
      setIsRunning(false);
      setTimeout(() => {
        if (isOnBreak) {
          setIsOnBreak(false);
          setTimeLeft(previousTimeLeft || cycles[currentCycle].duration);
          setPreviousTimeLeft(null);
        } else {
          if (currentCycle < cycles.length - 1) {
            setCurrentCycle((prev) => prev + 1);
          } else {
            setCurrentCycle(0);
          }
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, currentCycle, cycles, isOnBreak, breakDuration, previousTimeLeft]);

  useEffect(() => {
    if (!isOnBreak) setTimeLeft(cycles[currentCycle].duration);
  }, [currentCycle, cycles]);

  const changeMode = (type) => {
    const newMode = type === "classic" ? classicCycles : deepFocus;
    setCycles(newMode);
    setSelectedMode(type);
    setCurrentCycle(0);
    setTimeLeft(newMode[0].duration);
    setIsRunning(false);
    setIsOnBreak(false);
  };

  const takeBreak = (durationInMin) => {
    if (!isRunning || isOnBreak) return;
    setPreviousTimeLeft(timeLeft);
    setBreakDuration(durationInMin * 60);
    setTimeLeft(durationInMin * 60);
    setIsOnBreak(true);
    setIsRunning(true);
  };

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const percentage = ((totalDuration - timeLeft) / totalDuration) * 100;

  return (
    <Layout title="Pomodoro">
      <main className="pomodoro-fullscreen">
        <h1 className="pomodoro-heading">
          Focus Better. <span>One Session at a Time.</span>
        </h1>

        <div className="timer-ring">
          <svg width="260" height="260">
            <circle
              cx="130"
              cy="130"
              r="120"
              stroke="var(--accent-color)"
              fill="none"
              strokeWidth="12"
            />
            <circle
              cx="130"
              cy="130"
              r="120"
              stroke="var(--text-color)"
              fill="none"
              strokeWidth="12"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * ((100 - percentage) / 100)}
              strokeLinecap="round"
              transform="rotate(-90 130 130)"
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dy=".3em"
              fontSize="40px"
              fill="var(--text-color)"
            >
              {formatTime(timeLeft)}
            </text>
          </svg>
        </div>

        <p className="session">
          {isOnBreak
            ? `On a Break — ${breakDuration / 60} min`
            : `${cycles[currentCycle].mode} — Cycle ${currentCycle + 1} of ${cycles.length}`}
        </p>

        <div className="bottom-controls">
          <select
            value={selectedMode}
            onChange={(e) => changeMode(e.target.value)}
          >
            <option value="classic">Classic (25+5)x2</option>
            <option value="deep">Deep Focus (50+10)</option>
          </select>

          <div className="btn-group">
            <button onClick={() => setIsRunning(true)}>Start</button>
            <button onClick={() => setIsRunning(false)}>Pause</button>
            <button
              onClick={() => {
                setIsRunning(false);
                setIsOnBreak(false);
                setCurrentCycle(0);
                setTimeLeft(cycles[0].duration);
                setPreviousTimeLeft(null);
              }}
            >
              Reset
            </button>
          </div>

          <div className="btn-group">
            <button onClick={() => takeBreak(5)}>Small Break</button>
            <button onClick={() => takeBreak(15)}>Long Break</button>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Pomodoro;
