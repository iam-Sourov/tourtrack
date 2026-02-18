import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Calendar, Briefcase, Sparkles, CheckCircle2,
  CloudRain, Sun, Mountain, ArrowRight, Loader2, Plane,
  Thermometer, Droplets, Wind
} from 'lucide-react';
import './index.css';

const App = () => {
  const [destination, setDestination] = useState('');
  const [vibes, setVibes] = useState('');
  const [freeTime, setFreeTime] = useState('');
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const VIBE_SUGGESTIONS = [
    "Rainy adventure", "Relaxed tea garden",
    "Trekking expedition", "Cultural immersion", "Foodie tour"
  ];

  const handleGenerate = async () => {
    if (!destination || !vibes || !freeTime) return;
    setLoading(true);
    setError('');
    setItinerary(null);

    try {
      const response = await axios.post('http://localhost:5000/api/itinerary', { destination, vibes, freeTime });
      let data = response.data;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) {
          console.error("Failed to parse inner JSON", e);
        }
      }
      if (data.error) throw new Error(data.error);
      setItinerary(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Failed to generate itinerary. Ensure Python and Ollama are running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-emerald-50 to-transparent"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-32 -left-24 w-72 h-72 bg-emerald-100 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-16">
        {/* Header */}
        <header className="mb-12 text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-semibold text-emerald-600 mb-6 shadow-sm">
              <Sparkles className="w-3 h-3" />
              <span>AI-Powered Local Travel Guide</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">
              Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Your Next</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500">Adventure</span>
            </h1>
            <p className="text-slate-500 text-lg md:text-xl leading-relaxed">
              Explore the hidden gems of the world. Tell us where, your vibe, and when—we'll craft the perfect local itinerary for you.
            </p>
          </motion.div>
        </header>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 p-6 md:p-10 mb-12 border border-white/50"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-500" />
                Where to?
              </label>
              <input
                type="text"
                placeholder="e.g., Sylhet, Sitakunda, Cox's Bazar..."
                className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 transition-all outline-none text-slate-900 font-medium placeholder:text-slate-400"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                What's your vibe?
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g., Rainy adventure, Relaxed tea garden..."
                  className="w-full pl-5 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none text-slate-900 font-medium placeholder:text-slate-400"
                  value={vibes}
                  onChange={(e) => setVibes(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {VIBE_SUGGESTIONS.map((v, i) => (
                  <button
                    key={i}
                    onClick={() => setVibes(v)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition-colors border border-transparent hover:border-emerald-100 font-medium"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-500" />
                When are you going?
              </label>
              <input
                type="text"
                placeholder="e.g., Next weekend, July, Winter break..."
                className="w-full px-5 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all outline-none text-slate-900 font-medium placeholder:text-slate-400"
                value={freeTime}
                onChange={(e) => setFreeTime(e.target.value)}
              />
              <p className="text-xs text-slate-400 mt-2 pl-1">
                We'll check historical weather data for this time.
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !vibes || !freeTime || !destination}
            className="w-full relative overflow-hidden group bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 rounded-2xl shadow-lg transform transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
          >
            <span className="relative z-10 flex items-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Crafting your perfect trip...
                </>
              ) : (
                <>
                  Generate Itinerary <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-start gap-3"
            >
              <div className="p-1 bg-red-100 rounded-full flex-shrink-0">
                <span className="block w-2 h-2 bg-red-500 rounded-full"></span>
              </div>
              <div className="font-medium">{error}</div>
            </motion.div>
          )}
        </motion.div>

        {/* Results Section */}
        <AnimatePresence>
          {itinerary && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="space-y-8"
            >
              {/* Main Destination Card */}
              <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 ring-1 ring-slate-900/5">
                <div className="relative h-64 bg-slate-900 overflow-hidden">
                  {/* Abstract background for header */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-slate-900 to-sky-900"></div>
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                  <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-10">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md text-white/90 text-sm font-medium border border-white/20 mb-3">
                          <Plane className="w-4 h-4" /> Destination
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white flex items-center gap-3">
                          {itinerary.destination}
                        </h2>
                      </div>
                      <div className="hidden md:flex flex-col items-end">
                        <div className="text-white/60 text-sm font-medium mb-1">Vibe Match</div>
                        <div className="text-3xl font-bold text-emerald-400">{itinerary.vibe_match_score}%</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 mt-6 text-white/90">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                          {itinerary.weather_summary?.toLowerCase().includes('rain') ? <CloudRain className="w-5 h-5 text-sky-300" /> : <Sun className="w-5 h-5 text-amber-300" />}
                        </div>
                        <span className="font-medium">{itinerary.weather_summary}</span>
                      </div>
                      {/* Simulated weather stats based on text */}
                      <div className="h-4 w-px bg-white/20 hidden md:block"></div>
                      <div className="hidden md:flex items-center gap-2 opacity-80">
                        <Thermometer className="w-4 h-4" />
                        <span>Feels like home</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-10 bg-white">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Daily Itinerary - Left Column */}
                    <div className="lg:col-span-2">
                      <h3 className="text-xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                          <Mountain className="w-5 h-5" />
                        </div>
                        <span>Your 3-Day Journey</span>
                      </h3>

                      <div className="relative pl-8 space-y-12 before:absolute before:left-[19px] before:top-2 before:bottom-4 before:w-0.5 before:bg-slate-200">
                        {itinerary.itinerary?.map((day, idx) => (
                          <div key={idx} className="relative">
                            <div className="absolute -left-[39px] top-0 flex items-center justify-center w-10 h-10 rounded-full bg-slate-50 border-4 border-white shadow-sm ring-1 ring-slate-200 text-slate-600 font-bold z-10 text-sm">
                              {day.day}
                            </div>
                            <div className="bg-slate-50 hover:bg-slate-100 transition-colors p-6 rounded-2xl border border-slate-100 shadow-sm group">
                              <h4 className="font-bold text-slate-800 text-lg mb-3 flex items-center justify-between">
                                <span>Day {day.day} Agenda</span>
                                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                              </h4>
                              <p className="text-slate-600 leading-relaxed text-[15px]">
                                {day.plan}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sidebar - Right Column */}
                    <div className="space-y-8">
                      {/* Vibes Score Mobile */}
                      <div className="md:hidden p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                        <div className="text-slate-500 text-sm font-medium mb-1">Vibe Match</div>
                        <div className="text-4xl font-bold text-emerald-500">{itinerary.vibe_match_score}%</div>
                      </div>

                      {/* Packing List */}
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100">
                        <h3 className="text-lg font-bold text-sky-900 mb-4 flex items-center gap-2">
                          <Briefcase className="w-5 h-5 text-sky-600" />
                          Smart Packing
                        </h3>
                        <ul className="space-y-3">
                          {itinerary.packing_list?.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sky-800 text-sm font-medium">
                              <CheckCircle2 className="w-5 h-5 text-sky-500 flex-shrink-0" />
                              <span className="leading-tight pt-0.5">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Local Tips / Decorative */}
                      <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
                        <h3 className="text-lg font-bold text-emerald-900 mb-2 flex items-center gap-2">
                          <Wind className="w-5 h-5 text-emerald-600" />
                          Traveler's Note
                        </h3>
                        <p className="text-sm text-emerald-800 leading-relaxed italic">
                          "{itinerary.local_tip || "Embrace the journey and respect the local culture!"}"
                        </p>
                      </div>
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
