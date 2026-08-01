import { useSelector } from 'react-redux';
import { type RootState } from '../store/store';
import { motion } from 'framer-motion';
import { User as UserIcon, Mail, Shield, ShieldCheck, Key } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { Link } from 'react-router-dom';
import { GLOBAL_ROLES } from '../constants/roles';

export default function Profile() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader>
        <div className="w-full flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">User Profile</h2>
            <p className="text-xs text-muted-foreground hidden lg:block">View your account details and manage settings.</p>
          </div>
        </div>
      </PageHeader>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border rounded-xl shadow-sm overflow-hidden"
      >
        <div className="p-8 border-b bg-muted/20 flex flex-col items-center sm:flex-row sm:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary text-4xl font-bold shadow-inner">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 text-center sm:text-left mt-2 sm:mt-0">
            <h3 className="text-2xl font-bold text-foreground mb-1">
              {user?.email ? user.email.split('@')[0] : 'User'}
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-3 text-sm text-muted-foreground mt-3">
              <span className="flex items-center gap-1.5 bg-background px-3 py-1 rounded-full border shadow-sm">
                <Mail className="w-4 h-4 text-primary/70" />
                {user?.email}
              </span>
              <span className="flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 font-medium">
                {user?.role === GLOBAL_ROLES.SUPER_ADMIN ? <ShieldCheck className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                {user?.role?.replace('_', ' ')}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          <section>
            <h4 className="text-lg font-semibold border-b pb-2 mb-4 flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-muted-foreground" />
              Account Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-muted/30 p-4 rounded-lg border">
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Email Address</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg border">
                <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Role / Permissions</p>
                <p className="font-medium capitalize">{user?.role?.replace('_', ' ').toLowerCase()}</p>
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-lg font-semibold border-b pb-2 mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-muted-foreground" />
              Security
            </h4>
            <div className="bg-muted/30 p-5 rounded-lg border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-medium">Password</p>
                <p className="text-sm text-muted-foreground mt-1">To change your password, you can use the forgot password flow from the login page.</p>
              </div>
              <Link 
                to="/login"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors whitespace-nowrap"
                onClick={() => {
                  // The user will need to log out to use forgot password, 
                  // or we can just point them to the login page where they can click "Forgot Password"
                }}
              >
                Go to Login
              </Link>
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
