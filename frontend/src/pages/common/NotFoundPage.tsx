import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
        <FileQuestion className="w-12 h-12 text-slate-400" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">Page Not Found</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mt-2 mb-6">
        The requested campus resource or dashboard route does not exist or has been relocated.
      </p>
      <Link to="/dashboard">
        <Button leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};
