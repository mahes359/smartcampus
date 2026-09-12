import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="p-4 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-full mb-4">
        <ShieldAlert className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Access Restricted</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mt-2 mb-6">
        Your current role profile does not have authorization to view this administrative module. Switch roles or contact your campus system administrator.
      </p>
      <Link to="/dashboard">
        <Button leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Back to Authorized Dashboard
        </Button>
      </Link>
    </div>
  );
};
