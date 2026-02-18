import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Umbrella, Briefcase, Sparkles, CheckCircle2, CloudRain, Sun, Mountain } from 'lucide-react';
import './index.css';

const App = () => {
  const [vibes, setVibes] = useState('');
  const [freeTime, setFreeTime] = useState('');
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!vibes || !freeTime) return;
    setLoading(true);
    setError('');
    setItinerary(null);

    try {
      const response = await axios.post('http://localhost:5000/api/itinerary', { vibes, freeTime });
      // The response.data might be a JSON string or object depending on Python output
      let data = response.data;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) {
          console.error("Failed to parse inner JSON", e);
          // potentially handle raw string
        }
      }
      if (data.error) {
        throw new Error(data.error);
      }
      setItinerary(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Failed to generate itinerary. Ensure Python and Ollama are running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 text-slate-800 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-sky-600 mb-4">
              AI Travel Planner <span className="text-slate-400 text-2xl font-light block md:inline">for Bangladesh</span>
            </h1>
            <p className="text-slate-500 text-lg">
              Unlock the hidden gems of Sylhet & Sitakunda with local insights.
            </p>
          </motion.div>
        </header>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8 border border-slate-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                <Sparkles className="inline w-4 h-4 mr-1 text-yellow-500" /> Vibe
              </label>
              <input
                type="text"
                placeholder="e.g., Rainy adventure, Relaxed tea garden, Trekking"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all outline-none"
                value={vibes}
                onChange={(e) => setVibes(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2 uppercase tracking-wide">
                <Calendar className="inline w-4 h-4 mr-1 text-indigo-500" /> When?
              </label>
              <input
                type="text"
                placeholder="e.g., Next weekend, July, Winter break"
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all outline-none"
                value={freeTime}
                onChange={(e) => setFreeTime(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !vibes || !freeTime}
            className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white font-bold py-4 rounded-xl shadow-lg transform transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Analyzing Weather & Vibes...
              </>
            ) : (
              <>
                Generate Plan
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {itinerary && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8"
            >
              {/* Main Destination Card */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                <div className="h-48 bg-gradient-to-r from-sky-400 to-indigo-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <h2 className="text-3xl font-bold flex items-center gap-2">
                      <MapPin className="w-8 h-8" /> {itinerary.destination}
                    </h2>
                    <div className="flex items-center gap-2 mt-2 opacity-90">
                      {itinerary.weather_summary?.toLowerCase().includes('rain') ? <CloudRain className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                      <span>{itinerary.weather_summary}</span>
                    </div>
                  </div>
                  <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-medium border border-white/30">
                    {itinerary.vibe_match_score}% Match
                  </div>
                </div>

                <div className="p-6 md:p-8">
                  {/* Daily Itinerary */}
                  <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Mountain className="w-6 h-6 text-emerald-500" /> Your 3-Day Plan
                  </h3>
                  <div className="space-y-6 md:pl-4 relative border-l-2 border-slate-100 md:ml-2">
                    {itinerary.itinerary?.map((day, idx) => (
                      <div key={idx} className="relative pl-8 pb-2">
                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-100 border-4 border-emerald-500"></div>
                        <h4 className="font-bold text-slate-700 text-lg mb-2">Day {day.day}</h4>
                        <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                          {day.plan}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Packing List */}
                  <div className="mt-8 pt-8 border-t border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Briefcase className="w-6 h-6 text-orange-500" /> Smart Packing
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {itinerary.packing_list?.map((item, idx) => (
                        <span key={idx} className="bg-sky-50 text-sky-700 px-3 py-1 rounded-full text-sm font-medium border border-sky-100 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;
