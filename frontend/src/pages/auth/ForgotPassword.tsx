import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
      <div className="mb-6">
        <Link
          to="/login"
          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Login</span>
        </Link>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Reset Password</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Enter your registered institutional email to receive password reset instructions.
        </p>
      </div>

      {isSubmitted ? (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center space-y-2">
          <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
          <h4 className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">Email Dispatched</h4>
          <p className="text-xs text-emerald-700 dark:text-emerald-300">
            If an account matches <strong>{email}</strong>, a reset link has been dispatched.
          </p>
          <div className="pt-3">
            <Link to="/login">
              <Button size="sm" variant="outline">
                Return to Login
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Institutional Email"
            type="email"
            placeholder="user@college.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
        </form>
      )}
    </div>
  );
};
