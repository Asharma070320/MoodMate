import React from "react";
import { useState, useEffect } from "react";

const moodOptions = [
  { emoji: "😊", label: "Happy", color: "bg-orange-400" },
  { emoji: "😐", label: "Neutral", color: "bg-yellow-400" },
  { emoji: "🙁", label: "Sad", color: "bg-yellow-600" },
  { emoji: "😠", label: "Angry", color: "bg-red-400" },
  { emoji: "🤢", label: "Sick", color: "bg-green-700" },
];

const weatherIcons = {
  Clear: "☀️",
  Clouds: "☁️",
  Rain: "🌧️",
  Snow: "❄️",
  Thunderstorm: "⚡",
  Drizzle: "🌦️",
  Mist: "🌫️",
  Default: "☁️",
};

export default function MoodMate() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState("");
  const [entries, setEntries] = useState([]);
  const [currentView, setCurrentView] = useState("input");
  const [weather, setWeather] = useState({ temp: 25, condition: "Clear" });
  const [location, setLocation] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [darkMode, setDarkMode] = useState(false);
  const [currentMonthYear, setCurrentMonthYear] = useState(new Date());

  useEffect(() => {
    const savedEntries = localStorage.getItem("moodEntries");
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (location) {
      const weatherConditions = ["Clear", "Clouds", "Rain", "Snow", "Mist"];
      const randomCondition =
        weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
      const randomTemp = Math.floor(Math.random() * 15) + 15;

      setWeather({
        temp: randomTemp,
        condition: randomCondition,
      });
    }
  }, [location]);

  useEffect(() => {
    localStorage.setItem("moodEntries", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    const newDate = new Date();
    newDate.setMonth(currentMonth);
    setCurrentMonthYear(newDate);
  }, [currentMonth]);

  const handleSaveMood = () => {
    if (selectedMood === null) {
      alert("Please select your mood");
      return;
    }

    const newEntry = {
      id: Date.now(),
      date: selectedDate,
      mood: selectedMood,
      note: note,
      weather: weather,
    };

    setEntries([newEntry, ...entries]);
    setSelectedMood(null);
    setNote("");
    setShowConfirmation(true);

    setTimeout(() => {
      setShowConfirmation(false);
    }, 2000);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatShortDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getMoodByDate = (date) => {
    const formattedDate = new Date(date).toDateString();
    return entries.find(
      (entry) => new Date(entry.date).toDateString() === formattedDate
    );
  };

  const generateCalendarDays = () => {
    const year = currentMonthYear.getFullYear();
    const month = currentMonthYear.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    let days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>);
    }

    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const entry = getMoodByDate(date);
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <div
          key={`day-${day}`}
          className={`h-8 w-8 flex items-center justify-center rounded-full cursor-pointer
                     ${entry ? moodOptions[entry.mood].color : ""} 
                     ${isToday && !entry ? "ring-2 ring-orange-500" : ""}`}
          onClick={() => {
            setSelectedDate(date);
            setCurrentView("input");
          }}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const getMonthName = () => {
    return currentMonthYear.toLocaleString("default", { month: "long" });
  };

  const backgroundClass = darkMode ? "bg-gray-900 text-white" : "bg-orange-300";
  const cardClass = darkMode ? "bg-gray-800" : "bg-orange-50";
  const buttonActiveClass = darkMode ? "bg-blue-600" : "bg-orange-400";
  const buttonInactiveClass = darkMode ? "bg-gray-700" : "bg-orange-200";
  const noteCardClass = darkMode ? "bg-gray-700" : "bg-orange-100";

  return (
    <div
      className={`min-h-screen p-4 ${backgroundClass} transition-colors duration-300`}
    >
      <div className="fixed top-4 right-4 z-10">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-3 rounded-full ${
            darkMode ? "bg-gray-700" : "bg-orange-400"
          } shadow-lg hover:opacity-90 transition-all`}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? "🌙" : "☀️"}
        </button>
      </div>

      <div
        className={`max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg ${cardClass}`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">MoodMate</h1>
            <div className="flex items-center">
              {weatherIcons[weather.condition] || weatherIcons["Default"]}{" "}
              {weather.temp}°C
            </div>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setCurrentView("input")}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                currentView === "input"
                  ? buttonActiveClass
                  : buttonInactiveClass
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setCurrentView("notes")}
              className={`flex-1 py-2 rounded-lg font-medium transition-colors ${
                currentView === "notes"
                  ? buttonActiveClass
                  : buttonInactiveClass
              }`}
            >
              All Notes
            </button>
          </div>

          {currentView === "input" ? (
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <h2 className="text-xl font-semibold mb-3">
                  {formatDate(selectedDate)}
                </h2>
                <p className="mb-3">How are you feeling today?</p>
                <div className="flex justify-between mb-6">
                  {moodOptions.map((mood, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedMood(index)}
                      className={`text-3xl p-2 rounded-full transition-transform duration-200 ${
                        selectedMood === index
                          ? "transform scale-125 ring-2 ring-orange-500"
                          : ""
                      }`}
                      aria-label={`Select mood: ${mood.label}`}
                    >
                      {mood.emoji}
                    </button>
                  ))}
                </div>

                <textarea
                  placeholder="Add a note..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-3 rounded-lg border mb-4 bg-white text-black resize-none"
                  rows={4}
                />

                <button
                  onClick={handleSaveMood}
                  className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-lg transition-colors font-medium"
                >
                  Save
                </button>

                {showConfirmation && (
                  <div className="mt-3 p-2 bg-green-100 text-green-800 rounded-lg text-center">
                    Mood saved successfully!
                  </div>
                )}
              </div>

              <div className="md:w-1/2 mt-6 md:mt-0">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold">{getMonthName()}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentMonth((prev) => prev - 1)}
                      className={`p-1 px-2 rounded-lg ${buttonInactiveClass} hover:opacity-80`}
                      aria-label="Previous month"
                    >
                      ◀
                    </button>
                    <button
                      onClick={() => setCurrentMonth((prev) => prev + 1)}
                      className={`p-1 px-2 rounded-lg ${buttonInactiveClass} hover:opacity-80`}
                      aria-label="Next month"
                    >
                      ▶
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                    <div key={day} className="font-semibold">
                      {day}
                    </div>
                  ))}
                  {generateCalendarDays()}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-4">All Notes</h2>
              {entries.length === 0 ? (
                <p className="text-center py-6">
                  No entries yet. Add your first mood!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className={`p-4 rounded-lg ${noteCardClass} shadow-sm`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl mt-1">
                          {moodOptions[entry.mood].emoji}
                        </span>
                        <div className="flex-1">
                          <p className="mb-2">{entry.note}</p>
                          <div className="flex justify-between text-sm opacity-75">
                            <span>{formatShortDate(entry.date)}</span>
                            <span>
                              {weatherIcons[entry.weather.condition] ||
                                weatherIcons["Default"]}{" "}
                              {entry.weather.temp}°C
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
