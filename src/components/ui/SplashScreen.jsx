import { useState, useEffect, useCallback } from 'react';
import { Bus, GraduationCap, Shield, MapPin, Navigation, Bell } from 'lucide-react';

export const SplashScreen = ({ onComplete }) => {
    const [phase, setPhase] = useState(0);

    const handleSkip = useCallback(() => {
        localStorage.removeItem('viakids_splash_seen');
        onComplete();
    }, [onComplete]);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
                handleSkip();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [handleSkip]);

    useEffect(() => {
        const t1 = setTimeout(() => setPhase(1), 300);
        const t2 = setTimeout(() => setPhase(2), 800);
        const t3 = setTimeout(() => setPhase(3), 1600);
        const t4 = setTimeout(() => setPhase(4), 2400);
        const t5 = setTimeout(() => setPhase(5), 3200);
        const t6 = setTimeout(() => onComplete(), 3800);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            clearTimeout(t4);
            clearTimeout(t5);
            clearTimeout(t6);
        };
    }, [onComplete]);

    return (
        <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center overflow-hidden">
            {/* Animated background orbs */}
            <div className={`absolute w-96 h-96 rounded-full bg-blue-500/10 blur-[100px] transition-all duration-1000 ${phase >= 1 ? 'top-[-20%] left-[-10%] scale-100' : 'top-[50%] left-[50%] scale-0'}`} />
            <div className={`absolute w-80 h-80 rounded-full bg-purple-500/10 blur-[100px] transition-all duration-1000 ${phase >= 2 ? 'bottom-[-15%] right-[-10%] scale-100' : 'bottom-[50%] right-[50%] scale-0'}`} />
            <div className={`absolute w-64 h-64 rounded-full bg-emerald-500/10 blur-[80px] transition-all duration-1000 ${phase >= 3 ? 'top-[40%] left-[40%] scale-100' : 'top-[50%] left-[50%] scale-0'}`} />

            {/* Floating particles */}
            {phase >= 2 && (
                <>
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-blue-400/40 rounded-full"
                            style={{
                                top: `${20 + Math.random() * 60}%`,
                                left: `${10 + Math.random() * 80}%`,
                                animation: `float ${2 + Math.random() * 3}s ease-in-out infinite`,
                                animationDelay: `${i * 0.3}s`,
                            }}
                        />
                    ))}
                </>
            )}

            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
            }} />

            <div className="relative z-10 flex flex-col items-center justify-center">
                {/* Logo container */}
                <div className={`transition-all duration-700 ease-out ${phase >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                    <div className="relative">
                        {/* Glow ring */}
                        <div className={`absolute inset-[-20px] rounded-full border-2 border-blue-500/20 transition-all duration-1000 ${phase >= 3 ? 'scale-110 opacity-100' : 'scale-75 opacity-0'}`} />
                        <div className={`absolute inset-[-40px] rounded-full border border-blue-500/10 transition-all duration-1000 ${phase >= 4 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} />

                        {/* Main logo circle */}
                        <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-2xl shadow-blue-500/30">
                            <Bus className="text-white" size={48} />
                        </div>

                        {/* Orbiting icons */}
                        {phase >= 4 && (
                            <>
                                <div className="absolute top-[-10px] left-[-10px] p-2 bg-purple-500/20 rounded-xl border border-purple-500/30 animate-[spin-slow_8s_linear_infinite]">
                                    <Shield size={16} className="text-purple-400" />
                                </div>
                                <div className="absolute top-[-10px] right-[-10px] p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30 animate-[spin-slow_10s_linear_infinite_reverse]">
                                    <GraduationCap size={16} className="text-emerald-400" />
                                </div>
                                <div className="absolute bottom-[-10px] left-[-10px] p-2 bg-amber-500/20 rounded-xl border border-amber-500/30 animate-[spin-slow_12s_linear_infinite]">
                                    <MapPin size={16} className="text-amber-400" />
                                </div>
                                <div className="absolute bottom-[-10px] right-[-10px] p-2 bg-cyan-500/20 rounded-xl border border-cyan-500/30 animate-[spin-slow_8s_linear_infinite_reverse]">
                                    <Navigation size={16} className="text-cyan-400" />
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Title */}
                <div className={`mt-8 md:mt-10 transition-all duration-700 ease-out ${phase >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                        <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">Via</span>
                        <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">Kids</span>
                    </h1>
                </div>

                {/* Tagline */}
                <div className={`mt-3 transition-all duration-700 ease-out ${phase >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <p className="text-slate-400 text-sm md:text-base tracking-wide">
                        Transporte Escolar <span className="text-blue-400 font-semibold">Seguro</span>
                    </p>
                </div>

                {/* Feature pills */}
                <div className={`mt-6 flex flex-wrap justify-center gap-2 md:gap-3 transition-all duration-700 ease-out ${phase >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    {[
                        { icon: <MapPin size={12} />, text: 'Tracking en Vivo' },
                        { icon: <Shield size={12} />, text: 'Seguridad QR' },
                        { icon: <Bell size={12} />, text: 'Alertas Instantáneas' },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-xs text-slate-300"
                            style={{ animationDelay: `${i * 0.15}s` }}
                        >
                            <span className="text-blue-400">{item.icon}</span>
                            {item.text}
                        </div>
                    ))}
                </div>

                {/* Loading bar */}
                <div className={`mt-10 md:mt-12 w-48 md:w-56 transition-all duration-500 ${phase >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-300 ease-out"
                            style={{
                                width: phase === 2 ? '25%' : phase === 3 ? '50%' : phase === 4 ? '75%' : phase >= 5 ? '100%' : '0%',
                            }}
                        />
                    </div>
                    <p className="text-center text-slate-500 text-xs mt-3 animate-pulse">
                        {phase <= 2 ? 'Cargando sistema' : phase <= 4 ? 'Verificando servicios' : '¡Listo!'}
                    </p>
                </div>
            </div>

            {/* Bottom brand */}
            <div className={`absolute bottom-6 md:bottom-8 transition-all duration-500 ${phase >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                <p className="text-slate-600 text-xs tracking-wider">© 2026 ViaKids — Todos los derechos reservados</p>
            </div>

            {/* Skip button */}
            <button
                onClick={handleSkip}
                className={`absolute top-4 right-4 md:top-6 md:right-6 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 text-xs hover:bg-white/10 hover:text-white transition-all ${phase >= 1 ? 'opacity-100' : 'opacity-0'}`}
            >
                Saltar
            </button>
        </div>
    );
};
