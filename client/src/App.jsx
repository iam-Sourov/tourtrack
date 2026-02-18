import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Calendar, Briefcase, Sparkles, CheckCircle2,
  CloudRain, Sun, Mountain, ArrowRight, Loader2, Plane,
  Thermometer, Wind, Coffee, Compass
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
    <div className="min-h-screen bg-[#fffdfa] font-hand text-slate-700 selection:bg-rose-100 selection:text-rose-900 overflow-x-hidden">
      {/* Organic Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-orange-100/40 via-rose-100/30 to-transparent rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-gradient-to-tl from-emerald-100/40 via-teal-100/30 to-transparent rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center">

        {/* Header - Friendly & Personal */}
        <header className="text-center mb-16 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-100 rounded-full text-sm  text-rose-500 mb-6 shadow-sm hover:shadow-md transition-shadow cursor-default">
              <Compass className="w-4 h-4" />
              <span>Your Personal Travel Companion</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-800 mb-6 font-manrope leading-tight">
              Where will <span className="text-white px-2 py-1 bg-red-700 relative inline-block transform -rotate-2 z-10">your</span> story <span className="text-white px-2 py-1 bg-red-700  relative inline-block transform -rotate-2 ">be<span className='text-gray-800'>g</span>in?</span>
            </h1>
            <p className="text-slate-500 text-xl font-light leading-relaxed max-w-lg mx-auto">
              Skip the generic guides. Let's plan a journey that feels like <i>you</i>.
            </p>
          </motion.div>
        </header>

        {/* Conversational Interaction Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="w-full bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 p-8 md:p-12 relative overflow-hidden"
        >
          {/* Subtle paper texture overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>

          <div className="relative z-10 space-y-10">
            {/* The "Sentence" Form */}
            <div className="underline text-2xl md:text-5xl  leading-loose text-slate-800 font-manrope">
              <span className="text-slate-400 font-light">I'm dreaming of a trip to</span>
              <div className="inline-block relative group mx-2 md:mx-3 align-baseline">
                <input
                  type="text"
                  placeholder="Paris, Tokyo..."
                  className="w-48 md:w-64 bg-transparent border-b-2 border-slate-200 focus:border-rose-400 outline-none text-rose-500 placeholder:text-slate-300 transition-colors pb-1 text-center font-bold"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
                <div className="absolute -bottom-2 left-0 w-full h-0.5 bg-rose-400 scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
              </div>
              <span className="text-slate-400 font-light">to experience a</span>
              <div className="inline-block relative group mx-2 md:mx-3 align-baseline">
                <input
                  type="text"
                  placeholder="romantic, adventurous..."
                  className="w-56 md:w-80 bg-transparent border-b-2 border-slate-200 focus:border-orange-400 outline-none text-orange-500 placeholder:text-slate-300 transition-colors pb-1 text-center font-bold"
                  value={vibes}
                  onChange={(e) => setVibes(e.target.value)}
                />
              </div>
              <span className="text-slate-400 font-light">vibe in</span>
              <div className="inline-block relative group mx-2 md:mx-3 align-baseline">
                <input
                  type="text"
                  placeholder="July, next week..."
                  className="w-40 md:w-56 bg-transparent border-b-2 border-slate-200 focus:border-teal-400 outline-none text-teal-500 placeholder:text-slate-300 transition-colors pb-1 text-center font-bold"
                  value={freeTime}
                  onChange={(e) => setFreeTime(e.target.value)}
                />
              </div>
              <span className="text-slate-400 font-light">.</span>
            </div>

            {/* Quick Vibe Chips */}
            <div className="flex flex-wrap gap-3 justify-center">
              {VIBE_SUGGESTIONS.map((v, i) => (
                <button
                  key={i}
                  onClick={() => setVibes(v)}
                  className="px-4 py-2 rounded-full text-sm  bg-slate-50 text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors border border-slate-100"
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Action Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={handleGenerate}
                disabled={loading || !vibes || !freeTime || !destination}
                className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-white transition-all duration-200 bg-slate-900 rounded-full hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Writing your story...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>Create My Itinerary</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-rose-500 bg-rose-50 py-3 px-4 rounded-xl text-sm max-w-md mx-auto"
              >
                {error}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Results - The "Journal" Look */}
        <AnimatePresence>
          {itinerary && (
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="w-full mt-16"
            >
              <div className="bg-[#fffefc] rounded-[2rem] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden">
                {/* Hero Image / Header */}
                <div className="relative h-80 bg-slate-100 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 to-slate-900/20 z-10"></div>

                  {/* Abstract Placeholder - In a real app, fetch an image of the destination */}
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80')] bg-cover bg-center grayscale mix-blend-overlay opacity-50"></div>

                  <div className="absolute bottom-0 left-0 p-8 md:p-12 z-20 w-full">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-bold uppercase tracking-widest mb-4">
                          <Plane className="w-3 h-3" /> Trip Plan
                        </div>
                        <h2 className="text-5xl md:text-7xl font-bold text-white font-manrope leading-none">
                          {itinerary.destination}
                        </h2>
                      </div>
                      <div className="flex items-center gap-4 text-white/90 bg-black/20 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                        <div className="text-right">
                          <div className="text-xs  opacity-70 uppercase tracking-wider">Vibe Match</div>
                          <div className="text-2xl font-bold">{itinerary.vibe_match_score}%</div>
                        </div>
                        <div className="h-8 w-px bg-white/20"></div>
                        <div className="text-right">
                          <div className="text-xs opacity-70 uppercase tracking-wider">Plan</div>
                          <div className="text-2xl font-bold">3 Days</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
                  {/* Main Content */}
                  <div className="lg:col-span-8 space-y-12">
                    {/* Weather "Snapshot" */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-start gap-4">
                      <div className="p-3 bg-white rounded-xl shadow-sm text-sky-500">
                        {itinerary.weather_summary?.toLowerCase().includes('rain') ? <CloudRain className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Weather Forecast</h3>
                        <p className="text-slate-700 leading-relaxed text-xl">{itinerary.weather_summary}</p>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative border-l-2 border-slate-100 pl-8 ml-4 space-y-12">
                      {itinerary.itinerary?.map((day, idx) => (
                        <div key={idx} className="relative group">
                          <div className="absolute -left-[41px] top-0 h-10 w-10 bg-white border-2 border-slate-200 rounded-full flex items-center justify-center text-slate-400 font-bold text-sm shadow-sm group-hover:border-rose-400 group-hover:text-rose-500 transition-colors">
                            {day.day}
                          </div>
                          <div className="space-y-3">
                            <h4 className="text-xl font-bold text-slate-800">Day {day.day}</h4>
                            <p className="text-slate-600 leading-relaxed text-lg font-light">
                              {day.plan}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sidebar - "Notes" */}
                  <div className="lg:col-span-4 space-y-8">
                    {/* Handwritten Note */}
                    <div className="rotate-1 bg-[#fffbe6] p-6 shadow-md border border-slate-200/50 relative">
                      {/* Tape effect */}
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/40 backdrop-blur-[1px] rotate-2 shadow-sm border-l border-r border-white/50"></div>

                      <h3 className=" text-2xl text-slate-800 mb-2 flex items-center gap-2">
                        <Coffee className="w-5 h-5 text-amber-600" /> Local Secret
                      </h3>
                      <p className=" text-xl text-slate-700 leading-normal">
                        "{itinerary.local_tip || "Embrace the journey!"}"
                      </p>
                    </div>

                    {/* Packing List Checklist */}
                    <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" /> Essentials
                      </h3>
                      <ul className="space-y-4">
                        {itinerary.packing_list?.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3 group cursor-default">
                            <div className="h-5 w-5 rounded-full border-2 border-slate-300 group-hover:border-emerald-400 transition-colors"></div>
                            <span className="text-slate-600 group-hover:text-slate-900 transition-colors">{item}</span>
                          </li>
                        ))}
                      </ul>
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
