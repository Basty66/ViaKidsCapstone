import { Bus } from 'lucide-react';

export const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-blue-100 to-blue-300 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">

            {/* Esferas animadas de fondo */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse"></div>
            <div className="absolute top-10 right-10 w-72 h-72 bg-cyan-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>

            {/* Tarjeta Principal Glassmorphism - Animación de Entrada General */}
            <div className="w-full max-w-5xl bg-white/60 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row z-10 transition-all duration-500 hover:shadow-blue-900/10 
                animate-[fadeIn_0.6s_ease-out_forwards,slideInUp_0.6s_ease-out_forwards] opacity-0">

                {/* Lado Izquierdo: Formulario */}
                <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">

                    {/* Header ViaKids con hover animado */}
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

                {/* Lado Derecho: Branding (Oculto en móviles) - Animación desde la izquierda */}
                <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600/90 to-blue-800/90 p-12 flex-col justify-center items-center text-center relative
                    animate-[slideInLeft_0.7s_ease-out_0.2s_forwards] opacity-0">
                    <div className="z-10 text-white space-y-6">
                        <div className="inline-block p-4 bg-white/20 rounded-full backdrop-blur-sm mb-4 transform transition-transform hover:rotate-12 hover:scale-110 duration-300">
                            <Bus size={64} className="text-white" />
                        </div>
                        <h2 className="text-4xl font-bold tracking-tight">Transporte Escolar<br />Seguro</h2>
                        <p className="text-blue-100 text-lg max-w-sm mx-auto">
                            Monitoreo en tiempo real para la tranquilidad de apoderados y conductores.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};