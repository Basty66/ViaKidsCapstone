import { Bus, ShieldCheck, MapPin, Bell } from 'lucide-react';

export const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">

            {/* Animated background orbs */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse" />
            <div className="absolute top-10 right-10 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }} />

            {/* Floating decorative icons */}
            <div className="absolute top-[15%] right-[10%] animate-[float_4s_ease-in-out_infinite] opacity-20">
                <ShieldCheck size={32} className="text-blue-600" />
            </div>
            <div className="absolute bottom-[20%] left-[8%] animate-[float_5s_ease-in-out_infinite] opacity-15" style={{ animationDelay: '1.5s' }}>
                <MapPin size={24} className="text-blue-500" />
            </div>
            <div className="absolute top-[35%] left-[5%] animate-[float_3.5s_ease-in-out_infinite] opacity-10" style={{ animationDelay: '0.8s' }}>
                <Bell size={20} className="text-blue-700" />
            </div>
            <div className="absolute bottom-[30%] right-[5%] animate-[float_4.5s_ease-in-out_infinite] opacity-15" style={{ animationDelay: '2s' }}>
                <Bus size={28} className="text-blue-600" />
            </div>

            {/* Dot pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'radial-gradient(circle, #1e3a8a 1px, transparent 1px)',
                backgroundSize: '24px 24px',
            }} />

            {/* Tarjeta Principal Glassmorphism */}
            <div className="w-full max-w-5xl bg-white/60 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row z-10 transition-all duration-500 hover:shadow-blue-900/10
                animate-[fadeIn_0.6s_ease-out_forwards,slideInUp_0.6s_ease-out_forwards] opacity-0">

                {/* Lado Izquierdo: Formulario */}
                <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">

                    {/* Header ViaKids */}
                    <div className="flex items-center gap-2 text-blue-700 font-extrabold text-2xl mb-8 transform transition-transform hover:scale-105 origin-left w-max cursor-default">
                        <Bus size={32} className="text-blue-600" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
                            ViaKids
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
                    <p className="text-gray-600 mb-8">{subtitle}</p>

                    {children}
                </div>

                {/* Lado Derecho: Branding */}
                <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-blue-800 p-12 flex-col justify-center items-center text-center relative overflow-hidden
                    animate-[slideInLeft_0.7s_ease-out_0.2s_forwards] opacity-0">

                    {/* Animated gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-transparent to-purple-500/20 animate-pulse" />

                    {/* Decorative circles */}
                    <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/5 rounded-full" />
                    <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 bg-white/5 rounded-full" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse" />

                    <div className="z-10 text-white space-y-6">
                        {/* Animated bus icon */}
                        <div className="inline-block p-4 bg-white/20 rounded-2xl backdrop-blur-sm mb-4 transform transition-transform hover:rotate-12 hover:scale-110 duration-300 relative">
                            <Bus size={56} className="text-white" />
                            {/* Subtle glow */}
                            <div className="absolute inset-0 rounded-2xl bg-white/10 animate-pulse" />
                        </div>

                        <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">
                            Transporte Escolar<br />
                            <span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">Seguro</span>
                        </h2>

                        <p className="text-blue-100 text-base lg:text-lg max-w-xs mx-auto leading-relaxed">
                            Monitoreo en tiempo real para la tranquilidad de apoderados y conductores.
                        </p>

                        {/* Feature list */}
                        <div className="mt-8 space-y-3 text-sm text-blue-200">
                            {[
                                { icon: <MapPin size={14} />, text: 'GPS en tiempo real' },
                                { icon: <ShieldCheck size={14} />, text: 'Seguridad verificada' },
                                { icon: <Bell size={14} />, text: 'Notificaciones instantáneas' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2 justify-center" style={{ animationDelay: `${i * 0.2}s` }}>
                                    <span className="text-cyan-300">{item.icon}</span>
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
