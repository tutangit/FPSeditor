
import React from 'react';

interface HUDProps {
  health: number;
  ammo: number;
  maxAmmo: number;
}

const HUD: React.FC<HUDProps> = ({ health, ammo, maxAmmo }) => {
  return (
    <div className="absolute inset-0 pointer-events-none text-green-400 font-mono tracking-widest">
      {/* CROSSHAIR */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <div className="w-4 h-[1px] bg-green-400 opacity-80" />
        <div className="h-4 w-[1px] bg-green-400 opacity-80 absolute" />
        <div className="w-1 h-1 bg-green-400 rounded-full" />
      </div>

      {/* BOTTOM LEFT: Health & Armor */}
      <div className="absolute bottom-10 left-10 flex gap-8 items-end drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col">
          <span className="text-sm opacity-50">HEALTH</span>
          <div className="flex items-center gap-2">
             <span className="text-4xl font-black">{health}</span>
             <div className="w-2 h-8 bg-green-400 animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-sm opacity-50">ARMOR</span>
          <span className="text-3xl font-bold">100</span>
        </div>
      </div>

      {/* BOTTOM RIGHT: Ammo */}
      <div className="absolute bottom-10 right-10 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] flex flex-col items-end">
        <span className="text-sm opacity-50">MAGAZINE</span>
        <div className="flex items-baseline gap-2">
            <span className={`text-4xl font-black ${ammo < 5 ? 'text-red-500 animate-bounce' : 'text-green-400'}`}>
                {ammo}
            </span>
            <span className="text-xl text-green-700">/ {maxAmmo}</span>
        </div>
      </div>

      {/* TOP RIGHT: Radar (Simulated) */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-green-900/20 border border-green-500/50 rounded-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_0%,rgba(34,197,94,0.1)_100%)]" />
        <div className="w-[1px] h-full bg-green-500/30 absolute rotate-45" />
        <div className="w-[1px] h-full bg-green-500/30 absolute -rotate-45" />
        {/* Radar Blips */}
        <div className="w-2 h-2 bg-red-500 rounded-full absolute top-1/4 left-1/3 animate-ping" />
        <div className="w-1.5 h-1.5 bg-green-400 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        
        {/* Sweep effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-transparent animate-[spin_4s_linear_infinite]" style={{ transformOrigin: 'center' }} />
      </div>

      {/* TOP LEFT: Time */}
      <div className="absolute top-10 left-10 text-2xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] font-bold">
        02:45
      </div>
    </div>
  );
};

export default HUD;
