import React, { useState } from 'react';
import { Server, Cpu, ShieldCheck, Activity, Wifi, Terminal } from 'lucide-react';

export const TechVideoSection: React.FC = () => {
  const [videoError, setVideoError] = useState(false);

  return (
    <div className="relative w-full max-w-6xl mx-auto my-12 rounded-2xl overflow-hidden neon-border bg-slate-950/80 shadow-2xl">
      {/* Top terminal-style bar */}
      <div className="px-4 py-2.5 bg-slate-900/90 border-b border-cyan-950/60 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <span className="text-cyan-400 font-semibold ml-2">NEXA CLOUD TIER III // SP-CORE-RACK-04</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
            Xeon Scalable Live
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden sm:inline text-cyan-300">4.8 Tbps Anti-DDoS</span>
        </div>
      </div>

      {/* Video Container with Fallback */}
      <div className="relative aspect-video max-h-[380px] w-full flex items-center justify-center overflow-hidden bg-slate-950">
        {!videoError ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            onError={() => setVideoError(true)}
            className="w-full h-full object-cover opacity-60 mix-blend-screen scale-105"
            poster="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80"
          >
            {/* High reliability lightweight tech servers animation loop */}
            <source
              src="https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-charts-31910-large.mp4"
              type="video/mp4"
            />
          </video>
        ) : null}

        {/* Fallback & Overlay Tech Graphics (always active for maximum cyberpunk datacenter feel) */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 bg-cyber-grid opacity-30 pointer-events-none"></div>

        {/* Floating Server Metrics Overlay */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-lg border border-cyan-500/30">
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <Cpu className="w-4 h-4" />
                <span className="text-xs font-mono font-medium">PROCESSADORES</span>
              </div>
              <p className="text-sm font-bold text-white">Intel Xeon E5 / Gold</p>
              <p className="text-[11px] text-slate-400">Até 3.8 GHz Turbo</p>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-lg border border-cyan-500/30">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-mono font-medium">DISCOS NVMe</span>
              </div>
              <p className="text-sm font-bold text-white">3.500 MB/s Leitura</p>
              <p className="text-[11px] text-slate-400">Zero gargalo de I/O</p>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-lg border border-cyan-500/30">
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-mono font-medium">MITIGAÇÃO</span>
              </div>
              <p className="text-sm font-bold text-white">Anycast Shield</p>
              <p className="text-[11px] text-slate-400">Proteção L3/L4/L7</p>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-md p-3 rounded-lg border border-cyan-500/30">
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <Wifi className="w-4 h-4" />
                <span className="text-xs font-mono font-medium">LATÊNCIA SP</span>
              </div>
              <p className="text-sm font-bold text-white">&lt; 10ms Brasil</p>
              <p className="text-[11px] text-slate-400">Rotas PTT Metro SP</p>
            </div>
          </div>

          {/* Bottom live rack feed */}
          <div className="bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-cyan-500/20 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>NEXA-NODE-CLUSTER: <span className="text-cyan-400">READY</span></span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">RAID 10 ACTIVE</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-300">
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ativação Manual Cuidadosa em cada VPS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
