import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Bell, 
  Server, 
  Settings, 
  LogIn, 
  Home,
  ChevronRight,
  X,
  Monitor,
  BarChart3,
  Shield,
  Users
} from 'lucide-react';

type Screen = 'landing' | 'login' | 'dashboard' | 'alerts' | 'hosts' | 'settings';

interface WireframeBoxProps {
  label: string;
  className?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent' | 'muted';
}

const WireframeBox: React.FC<WireframeBoxProps> = ({ 
  label, 
  className = '', 
  onClick, 
  icon,
  variant = 'muted' 
}) => {
  const variantStyles = {
    primary: 'border-primary/50 bg-primary/10 hover:bg-primary/20',
    secondary: 'border-secondary/50 bg-secondary/10 hover:bg-secondary/20',
    accent: 'border-accent/50 bg-accent/10 hover:bg-accent/20',
    muted: 'border-muted-foreground/30 bg-muted/20 hover:bg-muted/40'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        border-2 border-dashed rounded-lg p-4 
        flex flex-col items-center justify-center gap-2
        transition-colors cursor-pointer
        ${variantStyles[variant]}
        ${className}
      `}
      onClick={onClick}
    >
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <span className="text-xs text-muted-foreground font-medium text-center">{label}</span>
    </motion.div>
  );
};

const WireframeLine: React.FC<{ horizontal?: boolean; className?: string }> = ({ 
  horizontal = true, 
  className = '' 
}) => (
  <div 
    className={`
      ${horizontal ? 'h-0.5 w-full' : 'w-0.5 h-full'} 
      bg-gradient-to-r from-transparent via-muted-foreground/30 to-transparent
      ${className}
    `} 
  />
);

const ScreenIndicator: React.FC<{ screens: Screen[]; current: Screen; onSelect: (s: Screen) => void }> = ({
  screens,
  current,
  onSelect
}) => (
  <div className="flex gap-2 justify-center mb-6">
    {screens.map((screen) => (
      <button
        key={screen}
        onClick={() => onSelect(screen)}
        className={`
          px-3 py-1.5 rounded-full text-xs font-medium transition-all
          ${current === screen 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted text-muted-foreground hover:bg-muted/80'}
        `}
      >
        {screen.charAt(0).toUpperCase() + screen.slice(1)}
      </button>
    ))}
  </div>
);

// Landing Page Wireframe
const LandingWireframe: React.FC<{ onNavigate: (s: Screen) => void }> = ({ onNavigate }) => (
  <div className="space-y-4">
    {/* Header */}
    <div className="flex items-center justify-between p-3 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/10">
      <WireframeBox label="Logo" className="w-24 h-10" icon={<Shield size={16} />} variant="primary" />
      <div className="flex gap-2">
        <WireframeBox label="Features" className="w-20 h-8" />
        <WireframeBox label="Pricing" className="w-20 h-8" />
        <WireframeBox label="Demo" className="w-20 h-8" />
      </div>
      <WireframeBox 
        label="Login" 
        className="w-20 h-10" 
        variant="accent" 
        onClick={() => onNavigate('login')}
        icon={<LogIn size={14} />}
      />
    </div>

    {/* Hero Section */}
    <div className="grid grid-cols-2 gap-4 p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/10">
      <div className="space-y-3">
        <WireframeBox label="Hero Headline" className="h-12 w-full" variant="primary" />
        <WireframeBox label="Subheadline / Description" className="h-20 w-full" />
        <div className="flex gap-2">
          <WireframeBox label="CTA Button" className="w-32 h-10" variant="accent" onClick={() => onNavigate('login')} />
          <WireframeBox label="Secondary" className="w-32 h-10" />
        </div>
      </div>
      <WireframeBox label="Hero Image / 3D Graphic" className="h-48" icon={<Monitor size={32} />} variant="secondary" />
    </div>

    {/* Features Grid */}
    <div className="p-4 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/10">
      <WireframeBox label="Section Title: Features" className="h-10 w-48 mx-auto mb-4" variant="primary" />
      <div className="grid grid-cols-3 gap-3">
        <WireframeBox label="Feature 1" className="h-24" icon={<BarChart3 size={20} />} />
        <WireframeBox label="Feature 2" className="h-24" icon={<Bell size={20} />} />
        <WireframeBox label="Feature 3" className="h-24" icon={<Shield size={20} />} />
      </div>
    </div>

    {/* Footer */}
    <div className="flex justify-between p-3 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/10">
      <WireframeBox label="© NebulaOne" className="w-32 h-8" />
      <div className="flex gap-2">
        <WireframeBox label="Terms" className="w-16 h-8" />
        <WireframeBox label="Privacy" className="w-16 h-8" />
        <WireframeBox label="Contact" className="w-16 h-8" />
      </div>
    </div>
  </div>
);

// Login Wireframe
const LoginWireframe: React.FC<{ onNavigate: (s: Screen) => void }> = ({ onNavigate }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="w-80 space-y-4 p-6 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/10">
      <WireframeBox label="Logo" className="h-12 w-32 mx-auto" variant="primary" icon={<Shield size={20} />} />
      <WireframeBox label="Welcome Back" className="h-8 w-full" />
      <WireframeLine />
      <WireframeBox label="Email Input" className="h-10 w-full" />
      <WireframeBox label="Password Input" className="h-10 w-full" />
      <WireframeBox label="Forgot Password?" className="h-6 w-32 ml-auto" />
      <WireframeBox 
        label="Sign In" 
        className="h-12 w-full" 
        variant="accent"
        onClick={() => onNavigate('dashboard')}
        icon={<ChevronRight size={16} />}
      />
      <WireframeLine />
      <WireframeBox label="Don't have an account? Sign up" className="h-8 w-full" />
      <WireframeBox label="← Back to Home" className="h-8 w-32 mx-auto" onClick={() => onNavigate('landing')} />
    </div>
  </div>
);

// Dashboard Wireframe
const DashboardWireframe: React.FC<{ onNavigate: (s: Screen) => void }> = ({ onNavigate }) => (
  <div className="flex gap-4">
    {/* Sidebar */}
    <div className="w-48 space-y-2 p-3 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/10">
      <WireframeBox label="Logo" className="h-10" variant="primary" icon={<Shield size={14} />} />
      <WireframeLine />
      <WireframeBox label="Dashboard" className="h-9" variant="accent" icon={<LayoutDashboard size={14} />} />
      <WireframeBox label="Alerts" className="h-9" onClick={() => onNavigate('alerts')} icon={<Bell size={14} />} />
      <WireframeBox label="Hosts" className="h-9" onClick={() => onNavigate('hosts')} icon={<Server size={14} />} />
      <WireframeBox label="Settings" className="h-9" onClick={() => onNavigate('settings')} icon={<Settings size={14} />} />
      <div className="flex-1" />
      <WireframeLine />
      <WireframeBox label="User Profile" className="h-10" icon={<Users size={14} />} />
      <WireframeBox label="Logout" className="h-8" onClick={() => onNavigate('landing')} />
    </div>

    {/* Main Content */}
    <div className="flex-1 space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/10">
        <WireframeBox label="Dashboard Overview" className="h-8 w-40" variant="primary" />
        <div className="flex gap-2">
          <WireframeBox label="Search" className="h-8 w-32" />
          <WireframeBox label="Theme" className="h-8 w-8" />
          <WireframeBox label="Notif" className="h-8 w-8" icon={<Bell size={12} />} />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-3">
        <WireframeBox label="Total Alerts" className="h-20" variant="secondary" />
        <WireframeBox label="Critical" className="h-20" variant="accent" />
        <WireframeBox label="Hosts Online" className="h-20" variant="secondary" />
        <WireframeBox label="Uptime %" className="h-20" variant="secondary" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-3">
        <WireframeBox label="Alert Timeline Chart" className="h-40" icon={<BarChart3 size={24} />} />
        <WireframeBox label="Severity Distribution" className="h-40" icon={<BarChart3 size={24} />} />
      </div>

      {/* Table */}
      <div className="p-3 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/10">
        <WireframeBox label="Recent Alerts Table" className="h-8 w-40 mb-3" />
        <div className="space-y-2">
          <WireframeBox label="Table Header Row" className="h-8" variant="secondary" />
          <WireframeBox label="Alert Row 1" className="h-10" onClick={() => onNavigate('alerts')} />
          <WireframeBox label="Alert Row 2" className="h-10" onClick={() => onNavigate('alerts')} />
          <WireframeBox label="Alert Row 3" className="h-10" onClick={() => onNavigate('alerts')} />
        </div>
      </div>
    </div>
  </div>
);

// Alerts Wireframe
const AlertsWireframe: React.FC<{ onNavigate: (s: Screen) => void }> = ({ onNavigate }) => (
  <div className="flex gap-4">
    {/* Sidebar (condensed) */}
    <div className="w-16 space-y-2 p-2 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/10">
      <WireframeBox label="" className="h-8 w-8 mx-auto" variant="primary" icon={<Shield size={12} />} />
      <WireframeBox label="" className="h-8 w-8 mx-auto" onClick={() => onNavigate('dashboard')} icon={<LayoutDashboard size={12} />} />
      <WireframeBox label="" className="h-8 w-8 mx-auto" variant="accent" icon={<Bell size={12} />} />
      <WireframeBox label="" className="h-8 w-8 mx-auto" onClick={() => onNavigate('hosts')} icon={<Server size={12} />} />
      <WireframeBox label="" className="h-8 w-8 mx-auto" onClick={() => onNavigate('settings')} icon={<Settings size={12} />} />
    </div>

    {/* Main Content */}
    <div className="flex-1 space-y-4">
      <div className="flex justify-between items-center">
        <WireframeBox label="Alerts Management" className="h-10 w-48" variant="primary" />
        <div className="flex gap-2">
          <WireframeBox label="Filter" className="h-9 w-24" />
          <WireframeBox label="Search" className="h-9 w-32" />
          <WireframeBox label="Export" className="h-9 w-20" variant="secondary" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 p-3 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/10">
        <WireframeBox label="All" className="h-8 w-16" variant="accent" />
        <WireframeBox label="Critical" className="h-8 w-20" />
        <WireframeBox label="Warning" className="h-8 w-20" />
        <WireframeBox label="Info" className="h-8 w-16" />
        <WireframeBox label="Date Range" className="h-8 w-28" />
      </div>

      {/* Alerts Table */}
      <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/10 p-3">
        <div className="flex gap-2 mb-2 text-xs text-muted-foreground">
          <span className="w-20">Severity</span>
          <span className="flex-1">Alert Name</span>
          <span className="w-32">Host</span>
          <span className="w-28">Time</span>
          <span className="w-20">Actions</span>
        </div>
        <WireframeLine className="mb-2" />
        {[1, 2, 3, 4, 5].map((i) => (
          <WireframeBox 
            key={i} 
            label={`Alert ${i} - Click to view details`} 
            className="h-12 mb-2" 
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        <WireframeBox label="←" className="h-8 w-8" />
        <WireframeBox label="1" className="h-8 w-8" variant="accent" />
        <WireframeBox label="2" className="h-8 w-8" />
        <WireframeBox label="3" className="h-8 w-8" />
        <WireframeBox label="→" className="h-8 w-8" />
      </div>
    </div>
  </div>
);

// Hosts Wireframe
const HostsWireframe: React.FC<{ onNavigate: (s: Screen) => void }> = ({ onNavigate }) => (
  <div className="flex gap-4">
    <div className="w-16 space-y-2 p-2 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/10">
      <WireframeBox label="" className="h-8 w-8 mx-auto" variant="primary" icon={<Shield size={12} />} />
      <WireframeBox label="" className="h-8 w-8 mx-auto" onClick={() => onNavigate('dashboard')} icon={<LayoutDashboard size={12} />} />
      <WireframeBox label="" className="h-8 w-8 mx-auto" onClick={() => onNavigate('alerts')} icon={<Bell size={12} />} />
      <WireframeBox label="" className="h-8 w-8 mx-auto" variant="accent" icon={<Server size={12} />} />
      <WireframeBox label="" className="h-8 w-8 mx-auto" onClick={() => onNavigate('settings')} icon={<Settings size={12} />} />
    </div>

    <div className="flex-1 space-y-4">
      <div className="flex justify-between items-center">
        <WireframeBox label="Hosts Overview" className="h-10 w-40" variant="primary" />
        <WireframeBox label="+ Add Host" className="h-9 w-28" variant="accent" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <WireframeBox label="Online: 24" className="h-16" variant="secondary" />
        <WireframeBox label="Offline: 2" className="h-16" />
        <WireframeBox label="Maintenance: 1" className="h-16" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-3 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/10">
            <div className="flex justify-between mb-2">
              <WireframeBox label={`Host ${i}`} className="h-8 w-24" />
              <WireframeBox label="●" className="h-8 w-8" variant={i === 3 ? 'muted' : 'secondary'} />
            </div>
            <WireframeBox label="CPU / Memory / Disk Usage" className="h-16" icon={<BarChart3 size={16} />} />
            <WireframeBox label="View Details" className="h-8 w-full mt-2" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Settings Wireframe
const SettingsWireframe: React.FC<{ onNavigate: (s: Screen) => void }> = ({ onNavigate }) => (
  <div className="flex gap-4">
    <div className="w-16 space-y-2 p-2 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/10">
      <WireframeBox label="" className="h-8 w-8 mx-auto" variant="primary" icon={<Shield size={12} />} />
      <WireframeBox label="" className="h-8 w-8 mx-auto" onClick={() => onNavigate('dashboard')} icon={<LayoutDashboard size={12} />} />
      <WireframeBox label="" className="h-8 w-8 mx-auto" onClick={() => onNavigate('alerts')} icon={<Bell size={12} />} />
      <WireframeBox label="" className="h-8 w-8 mx-auto" onClick={() => onNavigate('hosts')} icon={<Server size={12} />} />
      <WireframeBox label="" className="h-8 w-8 mx-auto" variant="accent" icon={<Settings size={12} />} />
    </div>

    <div className="flex-1 space-y-4">
      <WireframeBox label="Settings" className="h-10 w-32" variant="primary" />
      
      <div className="grid grid-cols-4 gap-2">
        <WireframeBox label="Profile" className="h-10" variant="accent" />
        <WireframeBox label="Security" className="h-10" />
        <WireframeBox label="Notifications" className="h-10" />
        <WireframeBox label="Integrations" className="h-10" />
      </div>

      <div className="p-4 border-2 border-dashed border-muted-foreground/30 rounded-lg bg-muted/10 space-y-3">
        <WireframeBox label="Profile Settings" className="h-8 w-40" />
        <WireframeLine />
        <div className="grid grid-cols-2 gap-3">
          <WireframeBox label="Full Name Input" className="h-10" />
          <WireframeBox label="Email Input" className="h-10" />
        </div>
        <WireframeBox label="Avatar Upload" className="h-24 w-24" icon={<Users size={24} />} />
        <WireframeBox label="Bio / Description" className="h-20" />
        <div className="flex gap-2 justify-end">
          <WireframeBox label="Cancel" className="h-10 w-24" />
          <WireframeBox label="Save" className="h-10 w-24" variant="accent" />
        </div>
      </div>
    </div>
  </div>
);

export const InteractiveWireframe: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const screens: Screen[] = ['landing', 'login', 'dashboard', 'alerts', 'hosts', 'settings'];

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <LandingWireframe onNavigate={setCurrentScreen} />;
      case 'login':
        return <LoginWireframe onNavigate={setCurrentScreen} />;
      case 'dashboard':
        return <DashboardWireframe onNavigate={setCurrentScreen} />;
      case 'alerts':
        return <AlertsWireframe onNavigate={setCurrentScreen} />;
      case 'hosts':
        return <HostsWireframe onNavigate={setCurrentScreen} />;
      case 'settings':
        return <SettingsWireframe onNavigate={setCurrentScreen} />;
      default:
        return <LandingWireframe onNavigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">NebulaOne Interactive Wireframe</h1>
          <p className="text-muted-foreground text-sm">Click on elements to navigate between screens</p>
        </div>

        {/* Screen Navigation */}
        <ScreenIndicator screens={screens} current={currentScreen} onSelect={setCurrentScreen} />

        {/* Wireframe Container */}
        <div className="border border-border rounded-xl p-6 bg-card shadow-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="mt-6 flex justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-dashed border-primary/50 bg-primary/10 rounded" />
            <span>Primary Elements</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-dashed border-accent/50 bg-accent/10 rounded" />
            <span>Interactive/CTA</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-dashed border-secondary/50 bg-secondary/10 rounded" />
            <span>Secondary</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-dashed border-muted-foreground/30 bg-muted/20 rounded" />
            <span>Content Blocks</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveWireframe;
