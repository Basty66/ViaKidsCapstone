import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Bus, Shield, GraduationCap, Mail, Lock, Loader2, CheckCircle2 } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().min(1, 'El correo es obligatorio').email('Formato de correo inválido'),
    password: z.string().min(1, 'La contraseña es obligatoria').min(6, 'Mínimo 6 caracteres'),
});

const roleRoutes = {
    admin: '/admin',
    driver: '/driver',
    parent: '/parent',
};

const roleLabels = {
    admin: 'Administrador',
    driver: 'Conductor',
    parent: 'Apoderado',
};

const roleIcons = {
    admin: <Shield size={20} className="text-purple-400" />,
    driver: <Bus size={20} className="text-blue-400" />,
    parent: <GraduationCap size={20} className="text-emerald-400" />,
};

export const LoginForm = () => {
    const [globalError, setGlobalError] = useState('');
    const [transitionState, setTransitionState] = useState(null);
    const [transitionProgress, setTransitionProgress] = useState(0);
    const [selectedRole, setSelectedRole] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError: setFieldError } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const doLogin = async (email, password, role) => {
        setGlobalError('');
        setSelectedRole(role);
        try {
            const response = await apiService.login(email, password);

            setTransitionState('validating');
            setTransitionProgress(0);

            await new Promise(r => setTimeout(r, 350));
            setTransitionProgress(30);

            await new Promise(r => setTimeout(r, 300));
            setTransitionProgress(55);

            login({
                token: response.token,
                role: response.role,
                name: response.name,
            });

            setTransitionProgress(80);
            await new Promise(r => setTimeout(r, 200));

            setTransitionProgress(100);
            setTransitionState('success');
            await new Promise(r => setTimeout(r, 350));

            navigate(roleRoutes[response.role] || '/', { replace: true });
        } catch (error) {
            setTransitionState(null);
            setSelectedRole(null);
            const msg = error.response?.data?.message || error.response?.data?.error || 'Credenciales incorrectas.';
            setGlobalError(msg);
            setTransitionProgress(0);
        }
    };

    const onSubmit = async (data) => {
        await doLogin(data.email, data.password, null);
    };

    if (transitionState) {
        return (
            <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center overflow-hidden">
                {/* Animated background orbs */}
                <div className="absolute top-0 left-1/4 w-48 h-48 sm:w-64 sm:h-64 bg-blue-500/10 rounded-full blur-[80px] sm:blur-[100px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-40 h-40 sm:w-56 sm:h-56 bg-purple-500/10 rounded-full blur-[60px] sm:blur-[80px] animate-pulse" style={{ animationDelay: '0.8s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-48 sm:h-48 bg-emerald-500/5 rounded-full blur-[60px] animate-pulse" style={{ animationDelay: '1.5s' }} />

                {/* Floating particles */}
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full"
                        style={{
                            top: `${10 + Math.random() * 80}%`,
                            left: `${5 + Math.random() * 90}%`,
                            background: `rgba(${59 + Math.random() * 100}, ${130 + Math.random() * 60}, 246, ${0.15 + Math.random() * 0.2})`,
                            animation: `float ${2 + Math.random() * 4}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    />
                ))}

                {/* Subtle grid */}
                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                }} />

                <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-0 gap-4 sm:gap-6 md:gap-8 w-full max-w-sm animate-[fadeIn_0.4s_ease-out]">
                    {/* Icon with pulse rings */}
                    <div className="relative flex items-center justify-center">
                        {/* Outer pulse ring */}
                        <div className={`absolute rounded-full transition-all duration-700 ${
                            transitionState === 'validating'
                                ? 'w-[72px] h-[72px] sm:w-[96px] sm:h-[96px] border-2 border-blue-500/20 scale-100'
                                : 'w-[80px] h-[80px] sm:w-[112px] sm:h-[112px] border-2 border-emerald-500/20 scale-100'
                        }`} />

                        {/* Inner pulse ring */}
                        <div className={`absolute rounded-full border transition-all duration-500 ${
                            transitionState === 'validating'
                                ? 'w-[64px] h-[64px] sm:w-[80px] sm:h-[80px] border-blue-500/10 scale-100'
                                : 'w-[72px] h-[72px] sm:w-[96px] sm:h-[96px] border-emerald-500/10 scale-100 opacity-0'
                        }`} />

                        {/* Main circle */}
                        <div className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-500 ${
                            transitionState === 'validating'
                                ? 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/30'
                                : 'bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/30'
                        }`}>
                            {transitionState === 'validating' ? (
                                <Loader2 size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8 text-white animate-spin" />
                            ) : (
                                <CheckCircle2 size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8 text-white animate-[scaleIn_0.3s_ease-out]" />
                            )}
                        </div>
                    </div>

                    {/* Role badge */}
                    {selectedRole && (
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border animate-[scaleIn_0.3s_ease-out] ${
                            transitionState === 'validating'
                                ? 'bg-blue-500/10 border-blue-500/20'
                                : 'bg-emerald-500/10 border-emerald-500/20'
                        }`}>
                            {roleIcons[selectedRole]}
                            <span className={`text-xs font-semibold ${
                                transitionState === 'validating' ? 'text-blue-300' : 'text-emerald-300'
                            }`}>
                                {roleLabels[selectedRole]}
                            </span>
                        </div>
                    )}

                    {/* Text - responsive sizing */}
                    <div className="text-center space-y-1.5 px-4">
                        <h2 className="text-lg sm:text-xl font-bold text-white leading-tight">
                            {transitionState === 'validating' ? 'Verificando credenciales' : '¡Bienvenido!'}
                        </h2>
                        <p className="text-slate-400 text-xs sm:text-sm leading-snug">
                            {transitionState === 'validating'
                                ? 'Validando acceso al sistema...'
                                : `Acceso concedido — Panel de ${roleLabels[selectedRole] || 'Administrador'}`
                            }
                        </p>
                    </div>

                    {/* Progress bar */}
                    <div className="w-44 sm:w-56 md:w-64 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ease-out ${
                                transitionState === 'validating'
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-400'
                                    : 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                            }`}
                            style={{ width: `${transitionProgress}%` }}
                        />
                    </div>

                    {/* Loading dots */}
                    {transitionState === 'validating' && (
                        <div className="flex gap-1.5">
                            {[0, 1, 2].map(i => (
                                <div
                                    key={i}
                                    className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Sparkle on success */}
                    {transitionState === 'success' && (
                        <div className="relative">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute w-1 h-1 bg-emerald-400 rounded-full"
                                    style={{
                                        top: `${50 + Math.cos(i * 60 * Math.PI / 180) * 40}%`,
                                        left: `${50 + Math.sin(i * 60 * Math.PI / 180) * 40}%`,
                                        animation: `scaleIn 0.5s ease-out ${i * 0.08}s both`,
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
            {globalError && (
                <div className="mb-5 p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-xl shadow-sm animate-pulse">
                    {globalError}
                </div>
            )}



            <div className="animate-[slideInUp_0.6s_ease-out_0.2s_forwards] opacity-0">
                <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        {...register('email')}
                        className="w-full bg-white/80 backdrop-blur-sm border border-slate-200 pl-10 pr-4 py-3 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-sm"
                    />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
            </div>

            <div className="mt-4 animate-[slideInUp_0.6s_ease-out_0.3s_forwards] opacity-0">
                <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        {...register('password')}
                        className="w-full bg-white/80 backdrop-blur-sm border border-slate-200 pl-10 pr-4 py-3 rounded-xl text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-sm"
                    />
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between mb-6 mt-4 animate-[slideInUp_0.6s_ease-out_0.4s_forwards] opacity-0">
                <label className="flex items-center gap-2 text-sm text-slate-500 cursor-pointer hover:text-blue-600 transition-colors">
                    <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4" />
                    Recordarme
                </label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-semibold transition-colors">¿Olvidaste tu contraseña?</a>
            </div>

            <div className="animate-[slideInUp_0.6s_ease-out_0.5s_forwards] opacity-0">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3.5 rounded-xl text-white font-bold transform transition-all duration-300 shadow-lg ${
                        isSubmitting
                            ? 'bg-blue-400 cursor-not-allowed shadow-none'
                            : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 hover:-translate-y-1 hover:shadow-blue-500/40 active:translate-y-0'
                    }`}
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Validando...
                        </span>
                    ) : 'Iniciar Sesión'}
                </button>
            </div>
        </form>
    );
};
