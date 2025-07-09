import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
        🌌 Welcome to <span className="text-blue-500">VisuVerse</span>
      </h1>
      <p className="text-gray-400 text-center mb-8 max-w-xl">
        Step into the universe of planets, satellites, quizzes, AI, and more.
        Let the journey to space exploration begin!
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => navigate('/planets')}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition"
        >
          🪐 Explore Planets
        </button>
        <button
          onClick={() => navigate('/satellites')}
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition"
        >
          📡 Satellite News
        </button>
        <button
          onClick={() => navigate('/quiz')}
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg transition"
        >
          🧠 Space Quiz
        </button>
        <button
          onClick={() => navigate('/chat')}
          className="bg-pink-600 hover:bg-pink-700 px-6 py-3 rounded-lg transition"
        >
          💬 Chat with Explorer
        </button>
        <button
          onClick={() => navigate('/voice')}
          className="bg-yellow-600 hover:bg-yellow-700 px-6 py-3 rounded-lg transition"
        >
          🎙️ Voice Assistant
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
