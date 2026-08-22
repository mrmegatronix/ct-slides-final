import React from 'react';

interface IconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const getSizeClasses = (size: string) => {
  switch(size) {
    case 'xl': return 'w-64 h-64';
    case 'lg': return 'w-48 h-48';
    case 'md': return 'w-32 h-32';
    case 'sm': return 'w-16 h-16';
    default: return 'w-32 h-32';
  }
};

export const GlassSun: React.FC<IconProps> = ({ size = 'lg' }) => {
  const dim = getSizeClasses(size);
  
  return (
    <div className={`relative ${dim} flex items-center justify-center`}>
      {/* Rotating Rays/Glow */}
      <div className="absolute inset-0 animate-spin-slow">
         {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
           <div 
            key={deg}
            className="absolute top-1/2 left-1/2 w-[120%] h-[2px] bg-gradient-to-r from-transparent via-orange-300/30 to-transparent"
            style={{ transform: `translate(-50%, -50%) rotate(${deg}deg)` }}
           />
         ))}
      </div>
      
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full transform scale-75"></div>

      {/* Core Sun */}
      <div className="relative w-[55%] h-[55%] rounded-full shadow-[0_0_50px_rgba(251,146,60,0.5)] animate-float">
        {/* Solid Core Gradient */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-300 via-orange-500 to-red-500"></div>
        
        {/* Glass Reflection Top */}
        <div className="absolute inset-x-2 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-full blur-[1px]"></div>
        
        {/* Inner Border Ring */}
        <div className="absolute inset-0 rounded-full border-2 border-white/20"></div>
        
        {/* Specular Highlight */}
        <div className="absolute top-[15%] right-[15%] w-3 h-3 bg-white/80 rounded-full blur-[1px]"></div>
      </div>
    </div>
  );
};

export const GlassCloud: React.FC<IconProps> = ({ size = 'lg' }) => {
  const dim = getSizeClasses(size);

  return (
    <div className={`relative ${dim} flex items-center justify-center animate-float`}>
       {/* Shadow */}
       <div className="absolute bottom-[20%] w-[70%] h-4 bg-black/40 blur-xl rounded-[100%]"></div>

       {/* Back Puff (Left) */}
       <div className="absolute bottom-[25%] left-[15%] w-[45%] h-[45%] rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 z-10"></div>
       
       {/* Back Puff (Right) */}
       <div className="absolute bottom-[30%] right-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 z-10"></div>

       {/* Main Body (Front) */}
       <div className="absolute bottom-[20%] left-[15%] right-[15%] h-[45%] rounded-[50px] bg-gradient-to-b from-white/30 to-white/5 backdrop-blur-xl border-t border-l border-white/40 shadow-xl z-20 flex items-center justify-center">
          {/* Internal Glint */}
          <div className="absolute top-2 left-8 w-[40%] h-[20%] bg-white/10 rounded-full blur-md"></div>
       </div>

       {/* Main Puff (Top Center) */}
       <div className="absolute top-[20%] left-[25%] w-[50%] h-[50%] rounded-full bg-gradient-to-b from-white/40 to-white/5 backdrop-blur-xl border-t border-l border-white/40 z-30 shadow-lg">
          {/* Highlight */}
          <div className="absolute top-[15%] left-[20%] w-6 h-4 bg-white/30 rounded-full blur-[2px] transform -rotate-12"></div>
       </div>
    </div>
  );
};

export const GlassRain: React.FC<IconProps> = ({ size = 'lg' }) => {
  const dim = getSizeClasses(size);
  
  return (
    <div className={`relative ${dim} flex items-center justify-center`}>
      {/* Cloud Base */}
      <div className="absolute inset-0 z-20">
          <GlassCloud size={size} />
      </div>
      
      {/* Rain Drops */}
      <div className="absolute inset-0 z-10 overflow-visible">
          <div className="absolute bottom-[20%] left-[30%] w-1.5 h-6 bg-gradient-to-b from-cyan-200 to-blue-500 rounded-full animate-rain opacity-0 shadow-[0_0_8px_rgba(56,189,248,0.8)]" style={{ animationDelay: '0s' }}></div>
          <div className="absolute bottom-[20%] left-[50%] w-1.5 h-8 bg-gradient-to-b from-cyan-200 to-blue-500 rounded-full animate-rain opacity-0 shadow-[0_0_8px_rgba(56,189,248,0.8)]" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-[20%] right-[30%] w-1.5 h-5 bg-gradient-to-b from-cyan-200 to-blue-500 rounded-full animate-rain opacity-0 shadow-[0_0_8px_rgba(56,189,248,0.8)]" style={{ animationDelay: '1.2s' }}></div>
      </div>

      <style>{`
        @keyframes rain {
          0% { transform: translateY(0); opacity: 0; }
          20% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(60px); opacity: 0; }
        }
        .animate-rain {
          animation: rain 1.5s ease-in infinite;
        }
      `}</style>
    </div>
  );
};

export const GlassPartlyCloudy: React.FC<IconProps> = ({ size = 'lg' }) => {
  const dim = getSizeClasses(size);
  
  return (
    <div className={`relative ${dim} flex items-center justify-center`}>
      {/* Sun in background */}
      <div className="absolute top-[-15%] right-[-15%] z-0 transform scale-[0.6]">
        <GlassSun size={size} />
      </div>
      
      {/* Cloud in foreground */}
      <div className="absolute bottom-0 left-[-10%] z-10 transform scale-[0.85]">
        <GlassCloud size={size} />
      </div>
    </div>
  );
};
