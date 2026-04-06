import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Upload, 
    Scan, 
    Activity, 
    Shield, 
    Globe, 
    History, 
    FileText, 
    Brain, 
    Users, 
    Settings,
    ShieldAlert
} from 'lucide-react';

const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload & Analyze', path: '/upload', icon: Upload },
    { name: 'AI Scanning Engine', path: '/scan', icon: Scan },
    { name: 'Live Scan Monitor', path: '/live-monitor', icon: Activity },
    { name: 'Vulnerability Explorer', path: '/vulnerabilities', icon: Shield },
    { name: 'Threat Intelligence', path: '/threat-intelligence', icon: Globe },
    { name: 'Scan History', path: '/history', icon: History },
    { name: 'Security Reports', path: '/reports', icon: FileText },
    { name: 'AI Insights', path: '/insights', icon: Brain },
    { name: 'Team Collaboration', path: '/collaboration', icon: Users },
    { name: 'System Settings', path: '/settings', icon: Settings },
];

const Sidebar = () => {
    const location = useLocation();

    return (
        <aside className="w-64 h-full bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <Link to="/" className="flex items-center gap-2 text-indigo-400">
                    <ShieldAlert className="w-8 h-8" />
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
                        NexusScan
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    // Check if path matches exactly or if we're on a subroute 
                    // (with special handling for the root path if it's dashboard)
                    const isActive = location.pathname === item.path || 
                        (item.path !== '/' && location.pathname.startsWith(item.path));

                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                                isActive
                                    ? 'bg-slate-800/50 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                                <span className="font-medium">{item.name}</span>
                            </div>
                            {isActive && (
                                <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
};

export default Sidebar;
