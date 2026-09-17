import React from 'react';
import { PageHeader } from '../../components/common/PageHeader';
import { Card } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS } from '../../constants/roles';
import { Mail, Building, Moon, Sun, ShieldCheck, User } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, role, activeCollegeId, isDarkMode, toggleDarkMode } = useAuth();

  return (
    <div className="max-w-4xl">
      <PageHeader
        title="User Profile & Account Preferences"
        description="Institutional identity credentials, security settings & access configuration"
      />

      {/* Identity Card */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5">
          <Avatar name={user?.name || 'User'} size="xl" />
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{user?.name}</h2>
              {role && <Badge variant="primary" size="sm">{ROLE_LABELS[role]}</Badge>}
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{user?.email}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1.5"><Building className="w-3.5 h-3.5" />Institution Tenant ID: #{activeCollegeId}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Role & Access Info (read-only) */}
        <Card header="Access Role & Permissions">
          <div className="space-y-3 text-xs">
            <p className="text-slate-500 dark:text-slate-400">
              Your access level is determined by your institutional account. Contact your administrator to request a role change.
            </p>
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
              <div>
                <p className="font-semibold text-blue-800 dark:text-blue-200">{role ? ROLE_LABELS[role] : 'Unassigned'}</p>
                <p className="text-[11px] text-blue-600 dark:text-blue-400">Active session role — server-verified</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">
              <User className="w-5 h-5 text-slate-500 shrink-0" />
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-200">User ID: {user?.id}</p>
                <p className="text-[11px] text-slate-500">Internal identifier for this account</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Appearance & Security */}
        <Card header="Application Preferences & Appearance">
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200">Theme Preference</h4>
                <p className="text-[11px] text-slate-500">Currently using {isDarkMode ? 'Dark' : 'Light'} appearance</p>
              </div>
              <Button size="sm" variant="outline" onClick={toggleDarkMode}>
                {isDarkMode ? <Sun className="w-4 h-4 mr-1 text-amber-400" /> : <Moon className="w-4 h-4 mr-1" />}
                {isDarkMode ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-2">
              <h4 className="font-semibold text-slate-800 dark:text-slate-200">Security Credentials</h4>
              <p className="text-[11px] text-slate-500">Session authenticated via API Gateway Bearer Token with multi-tenant header isolation.</p>
              <Button size="sm" variant="outline">
                Change Password
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
