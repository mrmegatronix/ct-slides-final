import React, { useState, useEffect } from 'react';
import { GlassSun, GlassCloud, GlassRain, GlassPartlyCloudy } from './GlassIcons';
import { WeatherForecast } from '../types';

const CHRISTCHURCH_COORDS = { lat: -43.5321, lon: 172.6362 };

const mapWmoToCondition = (code: number): WeatherForecast['condition'] => {
  // WMO Weather interpretation codes (https://open-meteo.com/en/docs)
  if (code === 0) return 'sunny';
  if (code >= 1 && code <= 3) return 'partly-cloudy';
  if (code >= 45 && code <= 48) return 'cloudy';
  if (code >= 51 && code <= 99) return 'rain';
  return 'sunny';
};

const WeatherIcon: React.FC<{ condition: string; size?: 'sm' | 'md' | 'lg' | 'xl' }> = ({ condition, size }) => {
  switch (condition) {
    case 'rain': return <GlassRain size={size} />;
    case 'cloudy': return <GlassCloud size={size} />;
    case 'partly-cloudy': return <GlassPartlyCloudy size={size} />;
    default: return <GlassSun size={size} />;
  }
};

const WeatherView: React.FC = () => {
  const [forecast, setForecast] = useState<WeatherForecast[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${CHRISTCHURCH_COORDS.lat}&longitude=${CHRISTCHURCH_COORDS.lon}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max&timezone=auto`
        );
        const data = await response.json();

        const daily = data.daily;
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        
        const mappedForecast: WeatherForecast[] = daily.time.map((timeStr: string, i: number) => {
          const date = new Date(timeStr);
          return {
            day: i === 0 ? 'Today' : days[date.getDay()],
            temp: Math.round(i === 0 ? data.current.temperature_2m : daily.temperature_2m_max[i]),
            condition: mapWmoToCondition(i === 0 ? data.current.weather_code : daily.weather_code[i])
          };
        });

        setForecast(mappedForecast);
      } catch (error) {
        console.error("Weather fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 1800000);
    return () => clearInterval(interval);
  }, []);

  if (loading || forecast.length === 0) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center">
        <div className="text-amber-500 animate-pulse text-2xl font-serif">Loading Local Weather...</div>
      </div>
    );
  }

  const current = forecast[0];

  return (
    <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-slate-950 via-black to-slate-900 text-white flex flex-col items-center justify-center p-8">
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
      <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-20%] right-[10%] w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[150px]"></div>

      <div className="relative z-10 w-full max-w-7xl h-full flex flex-col">
        <div className="text-center mb-10 pt-8">
          <h2 className="text-xl md:text-2xl font-light tracking-[0.3em] uppercase text-blue-200/60 mb-3">Local Forecast</h2>
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 drop-shadow-xl">
            Christchurch
          </h1>
        </div>

        <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24 mb-12">
          <div className="scale-125 md:scale-150 p-4 drop-shadow-2xl">
             <WeatherIcon condition={current.condition} size="xl" />
          </div>
          
          <div className="flex flex-col items-start p-10 rounded-[3rem] backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.3)] min-w-[320px]">
            <span className="text-9xl font-black tracking-tighter drop-shadow-lg text-white">
              {current.temp}°
            </span>
            <span className="text-4xl font-light capitalize text-blue-100/80 mt-2 tracking-wide">
              {current.condition.replace('-', ' ')}
            </span>
            <div className="w-full h-px bg-white/20 my-6"></div>
            <div className="flex w-full justify-between text-lg font-medium text-blue-200/70">
              <div className="flex flex-col">
                 <span className="text-xs uppercase tracking-widest opacity-60">Status</span>
                 <span>Live</span>
              </div>
              <div className="flex flex-col text-right">
                 <span className="text-xs uppercase tracking-widest opacity-60">Region</span>
                 <span>Canterbury</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 w-full">
          {forecast.slice(1).map((day, idx) => (
            <div 
              key={idx} 
              className="group flex flex-col items-center justify-between p-4 py-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md shadow-lg hover:bg-white/10 transition-all duration-300"
            >
              <span className="text-lg font-semibold tracking-wide text-blue-100/90">{day.day}</span>
              <div className="my-6 transform scale-90">
                <WeatherIcon condition={day.condition} size="sm" />
              </div>
              <span className="text-3xl font-bold text-white/90">{day.temp}°</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeatherView;