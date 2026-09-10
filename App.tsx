import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Settings, Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { SlideData, SLIDE_DURATION_MS } from './types';
import { INITIAL_SLIDES } from './constants';
import Slide from './components/Slide';
import WeatherView from './components/WeatherView';
import AdminPanel from './components/AdminPanel';

const STORAGE_KEY = 'restaurant_slides_v2';

const App: React.FC = () => {
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  // Initialize from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSlides(parsed);
      } catch (e) {
        setSlides(INITIAL_SLIDES);
      }
    } else {
      setSlides(INITIAL_SLIDES);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SLIDES));
    }
  }, []);

  const playlist = useMemo(() => {
    return slides;
  }, [slides]);

  const currentSlide = playlist[currentIndex] || playlist[0];
  const startTimeRef = useRef<number>(Date.now());

  const [isLocked, setIsLocked] = useState(false);
  const [slideDuration, setSlideDuration] = useState(SLIDE_DURATION_MS);
  const [hudMessage, setHudMessage] = useState<string | null>(null);
  const hudTimeoutRef = useRef<number | null>(null);

  const showHud = useCallback((text: string) => {
    setHudMessage(text);
    if (hudTimeoutRef.current) window.clearTimeout(hudTimeoutRef.current);
    hudTimeoutRef.current = window.setTimeout(() => setHudMessage(null), 1600);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [playlist.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, [playlist.length]);

  useEffect(() => {
    if (!isPlaying || isAdminOpen || isLocked) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTimeRef.current;
      const newProgress = (elapsed / slideDuration) * 100;

      if (newProgress >= 100) {
        nextSlide();
      } else {
        setProgress(newProgress);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, isAdminOpen, isLocked, slideDuration, nextSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName || '').toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select' || (document.activeElement as HTMLElement)?.isContentEditable) return;

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
        showHud('Prev Slide');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
        showHud('Next Slide');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setCurrentIndex(0);
        setProgress(0);
        startTimeRef.current = Date.now();
        showHud('Restart Module');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'SKIP_MODULE' }, '*');
        }
        showHud('Next Module');
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsPlaying(prev => {
          const next = !prev;
          if (next) startTimeRef.current = Date.now() - (progress / 100) * slideDuration;
          showHud(next ? 'Playing' : 'Paused');
          return next;
        });
      } else if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        setIsAdminOpen(prev => !prev);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        window.open('remote.html', '_blank');
      } else if (e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        const secs = parseInt(e.key, 10) * 10;
        setSlideDuration(secs * 1000);
        setProgress(0);
        startTimeRef.current = Date.now();
        showHud(`Speed: ${secs}s`);
      } else if (e.key === '0') {
        e.preventDefault();
        setIsLocked(prev => {
          const next = !prev;
          showHud(next ? 'Slide Locked' : 'Slide Unlocked');
          return next;
        });
      }
    };

    const handleMessage = (e: MessageEvent) => {
      if (!e.data) return;
      if (e.data.type === 'SKIP_MODULE') {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ type: 'SKIP_MODULE' }, '*');
        }
      } else if (e.data.type === 'GOTO_FIRST') {
        setCurrentIndex(0);
        setProgress(0);
        startTimeRef.current = Date.now();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('message', handleMessage);
    };
  }, [nextSlide, prevSlide, progress, slideDuration, showHud]);

  const handleAdminSave = (newSlides: SlideData[]) => {
    setSlides([...newSlides]); // Force new reference
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSlides));
    // Reset timer to allow user to see the changed slide immediately
    setProgress(0);
    startTimeRef.current = Date.now();
  };

  if (!currentSlide) return null;

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden font-sans group">
      <div className="w-full h-full">
        {currentSlide.type === 'weather' ? (
          <WeatherView />
        ) : (
          <Slide key={currentSlide.id} data={currentSlide} />
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full h-3 bg-black/40 z-40 backdrop-blur-sm">
        <div
          className="h-full bg-gradient-to-r from-amber-600 to-yellow-400 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Persistent Controls Area - Hidden until group-hover */}
      <div className="absolute top-8 right-8 z-50 flex items-center gap-3 p-3 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl opacity-0 translate-y-[-10px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        <button
          onClick={prevSlide}
          className="p-3 bg-white/5 hover:bg-amber-600 rounded-xl text-white transition-all active:scale-95"
          title="Previous Slide"
        >
          <SkipBack className="w-6 h-6" />
        </button>

        <button
          onClick={() => {
            const nextIsPlaying = !isPlaying;
            setIsPlaying(nextIsPlaying);
            if (nextIsPlaying) {
              startTimeRef.current = Date.now() - (progress / 100) * SLIDE_DURATION_MS;
            }
          }}
          className="p-3 bg-white/5 hover:bg-amber-600 rounded-xl text-white transition-all active:scale-95"
          title={isPlaying ? "Pause" : "Resume"}
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>

        <button
          onClick={nextSlide}
          className="p-3 bg-white/5 hover:bg-amber-600 rounded-xl text-white transition-all active:scale-95"
          title="Next Slide"
        >
          <SkipForward className="w-6 h-6" />
        </button>

        <div className="w-px h-8 bg-white/10 mx-1"></div>

        <button
          onClick={() => setIsAdminOpen(true)}
          className="p-3 bg-white/5 hover:bg-blue-600 rounded-xl text-white transition-all active:scale-95"
          title="Open Admin Overview"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {isAdminOpen && (
        <AdminPanel
          slides={slides}
          onSave={handleAdminSave}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {hudMessage && (
        <div className="fixed bottom-6 right-6 z-[99999] bg-black/85 text-white border border-white/25 px-4 py-2 rounded-xl text-sm font-semibold shadow-2xl tracking-wide pointer-events-none transition-opacity duration-200">
          {hudMessage}
        </div>
      )}
    </div>
  );
};

export default App;