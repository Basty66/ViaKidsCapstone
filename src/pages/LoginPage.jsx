import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthLayout } from '../components/templates/AuthLayout';
import { LoginForm } from '../components/organisms/LoginForm';
import { Loader2 } from 'lucide-react';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const hasRedirected = useRef(false);

    useEffect(() => {
        if (loading) return;
        if (user && !hasRedirected.current) {
            hasRedirected.current = true;
            const routes = {
                admin: '/admin',
                parent: '/parent',
                driver: '/driver',
            };
            navigate(routes[user.role] || '/', { replace: true });
        }
    }, [user, loading, navigate]);

    if (loading || user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center overflow-hidden">
                {/* Background orbs */}
                <div className="absolute w-48 h-48 sm:w-64 sm:h-64 bg-blue-500/10 rounded-full blur-[80px] animate-pulse top-0 left-1/4" />
                <div className="absolute w-40 h-40 sm:w-56 sm:h-56 bg-purple-500/10 rounded-full blur-[60px] animate-pulse bottom-0 right-1/4" style={{ animationDelay: '0.8s' }} />

                <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-6 px-4 animate-[fadeIn_0.5s_ease-out]">
                    {/* Animated ring */}
                    <div className="relative">
                        <div className="absolute inset-[-12px] sm:inset-[-16px] rounded-full border-2 border-blue-500/20 animate-ping-slow" />
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <Loader2 size={28} className="sm:w-8 sm:h-8 text-white animate-spin" />
                        </div>
                    </div>

                    <div className="text-center space-y-1.5">
                        <h2 className="text-lg sm:text-xl font-bold text-white">{user ? 'Redirigiendo a tu panel...' : 'Cargando ViaKids...'}</h2>
                        <p className="text-slate-400 text-xs sm:text-sm">Preparando tu experiencia segura</p>
                    </div>

                    {/* Loading dots */}
                    <div className="flex gap-1.5">
                        {[0, 1, 2].map(i => (
                            <div
                                key={i}
                                className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                                style={{ animationDelay: `${i * 0.15}s` }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <AuthLayout
            title="Bienvenido de vuelta"
            subtitle="Inicia sesión para acceder a tu panel"
        >
            <LoginForm />
        </AuthLayout>
    );
};
