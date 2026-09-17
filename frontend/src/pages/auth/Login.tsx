import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../context/AuthContext';
import { collegeService } from '../../services/collegeService';
import type { College } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
  collegeId: z.string().optional(),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [colleges, setColleges] = useState<College[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const queryParams = new URLSearchParams(location.search);
  const isExpired = queryParams.get('expired') === 'true';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
    collegeService.getAllColleges()
      .then((data) => {
        if (data && data.length > 0) {
          setColleges(data);
          setValue('collegeId', data[0].id.toString());
        }
      })
      .catch(() => setColleges([]));
  }, [isAuthenticated, navigate, setValue]);

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      await login({
        email: data.email,
        password: data.password,
      });
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid login credentials';
      setServerError(msg);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Welcome Back</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Sign in to your SmartCampus institution portal
        </p>
      </div>

      {isExpired && (
        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Your session has expired. Please sign in again.</span>
        </div>
      )}

      {serverError && (
        <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-800 rounded-lg flex items-center gap-2 text-xs text-rose-800 dark:text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <Input
          label="Email Address"
          type="email"
          placeholder="name@college.edu"
          error={errors.email?.message}
          leftIcon={<Mail className="w-4 h-4" />}
          {...register('email')}
        />

        {/* Password */}
        <Input
          label="Password"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          error={errors.password?.message}
          leftIcon={<Lock className="w-4 h-4" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="hover:text-slate-600 focus:outline-none cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          }
          {...register('password')}
        />

        {/* College selection */}
        {colleges.length > 0 && (
          <Select
            label="College / Institution"
            options={colleges.map((c) => ({
              value: c.id.toString(),
              label: `${c.name} (${c.code})`,
            }))}
            {...register('collegeId')}
          />
        )}

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              className="rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500"
              {...register('rememberMe')}
            />
            <span>Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Sign In to Portal
        </Button>
      </form>
    </div>
  );
};
