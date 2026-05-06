import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { mockApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Bus, Shield, GraduationCap, Mail, Lock, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().min(1, 'El correo es obligatorio').email('Formato de correo inválido'),
    password: z.string().min(1, 'La contraseña es obligatoria').min(6, 'Mínimo 6 caracteres'),
});

const DEMO_ACCOUNTS = [
    { email: 'admin@viakids.cl', password: '123456', role: 'admin', name: 'Administrador', fullName: 'Admin ViaKids', icon: <Shield size={16} />, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', desc: 'Panel de control total' },
    { email: 'conductor@viakids.cl', password: '123456', role: 'driver', name: 'Conductor', fullName: 'Juan Pérez', icon: <Bus size={16} />, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', desc: 'Rutas y asistencia' },
    { email: 'apoderado@viakids.cl', password: '123456', role: 'parent', name: 'Apoderado', fullName: 'Carlos Ruiz', icon: <GraduationCap size={16} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', desc: 'Seguimiento del alumno' },
];

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

export const LoginForm = () => {
    const [globalError, setGlobalError] = useState('');
    const [transitionState, setTransitionState] = useState(null);
    const [transitionProgress, setTransitionProgress] = useState(0);
    const { login } = useAuth();
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isSubmitting }, setError: setFieldError } = useForm({
        resolver: zodResolver(loginSchema),
    });

    const doLogin = async (email, password) => {
        setGlobalError('');
        try {
            const response = await mockApi.login(email, password);

            // Phase 1: Validating
            setTransitionState('validating');
            setTransitionProgress(0);

            await new Promise(r => setTimeout(r, 400));
            setTransitionProgress(30);

            await new Promise(r => setTimeout(r, 300));
            setTransitionProgress(60);

            // Phase 2: Auth success
            login({
                token: response.token,
                role: response.role,
                name: response.name,
            });

            setTransitionProgress(80);
            await new Promise(r => setTimeout(r, 200));

            setTransitionProgress(100);
            setTransitionState('success');
            await new Promise(r => setTimeout(r, 400));

            // Navigate to dashboard
            navigate(roleRoutes[response.role] || '/', { replace: true });
        } catch (error) {
            setTransitionState(null);
            setGlobalError(error.message || 'Credenciales incorrectas.');
            setTransitionProgress(0);
        }
    };

    const onSubmit = async (data) => {
        await doLogin(data.email, data.password);
    };

    const quickLogin = async (account) => {
        const success = await doLogin(account.email, account.password);
        if (!success) {
            setFieldError('email', { message: 'No se pudo iniciar sesión' });
        }
    };

    // Transition overlay
    if (transitionState) {
        return (
            <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center">
                {/* Background particles */}
                <div className="absolute top-[20%] left-[20%] w-32 h-32 bg-blue-500/10 rounded-full blur-[60px] animate-pulse" />
                <div className="absolute bottom-[20%] right-[20%] w-40 h-40 bg-purple-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />

                <div className="relative z-10 flex flex-col items-center gap-8 animate-fade-in">
                    {/* Icon with pulse ring */}
                    <div className="relative">
                        <div className={`absolute inset-[-16px] rounded-full border-2 transition-all duration-500 ${
                            transitionState === 'validating'
                                ? 'border-blue-500/30 scale-100'
                                : 'border-emerald-500/30 scale-110'
                        }`} />
                        <div className={`absolute inset-[-32px] rounded-full border transition-all duration-700 ${
                            transitionState === 'validating'
                                ? 'border-blue-500/10 scale-75 opacity-0'
                                : 'border-emerald-500/10 scale-100 opacity-100'
                        }`} />

                        <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${
                            transitionState === 'validating'
                                ? 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/30'
                                : 'bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/30'
                        }`}>
                            {transitionState === 'validating' ? (
                                <Loader2 size={32} className="text-white animate-spin" />
                            ) : (
                                <CheckCircle2 size={32} className="text-white animate-[scaleIn_0.3s_ease-out]" />
                            )}
                        </div>
                    </div>

                    {/* Text */}
                    <div className="text-center space-y-2">
                        <h2 className="text-xl font-bold text-white">
                            {transitionState === 'validating' ? 'Verificando credenciales' : '¡Bienvenido!'}
                        </h2>
                        <p className="text-slate-400 text-sm">
                            {transitionState === 'validating'
                                ? 'Validando acceso al sistema...'
                                : `Acceso concedido — Panel de ${roleLabels[transitionState === 'success' ? Object.keys(roleRoutes).find(k => true) : 'admin']}`
                            }
                        </p>
                    </div>

                    {/* Progress bar */}
                    <div className="w-56 h-1.5 bg-white/5 rounded-full overflow-hidden">
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
                        <div className="flex gap-1.5 mt-2">
                            {[0, 1, 2].map(i => (
                                <div
                                    key={i}
                                    className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                                    style={{ animationDelay: `${i * 0.15}s` }}
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

            {/* Demo Quick Login */}
            <div className="mb-6 space-y-2">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Acceso rápido demo</p>
                {DEMO_ACCOUNTS.map((account) => (
                    <button
                        key={account.role}
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => quickLogin(account)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${account.bg}`}
                    >
                        <div className={`p-2 rounded-lg ${account.color} shrink-0`}>{account.icon}</div>
                        <div className="text-left flex-1 min-w-0">
                            <p className={`text-sm font-bold ${account.color}`}>{account.name}</p>
                            <p className="text-xs text-slate-400">{account.desc}</p>
                        </div>
                        <div className="text-slate-400 shrink-0">
                            <ArrowRight size={16} />
                        </div>
                    </button>
                ))}
            </div>

            <div className="flex items-center gap-2 mb-5">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 font-medium">o ingresa manualmente</span>
                <div className="flex-1 h-px bg-slate-200" />
            </div>

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
