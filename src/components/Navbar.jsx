import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Home,
    LayoutDashboard,
    Upload,
    Shield,
    ShieldAlert,
    History,
    FileText,
    Settings,
    Menu,
    X,
    User
} from 'lucide-react';

const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Upload & Analyze', path: '/upload', icon: Upload },
    { name: 'Vulnerability Explorer', path: '/vulnerabilities', icon: Shield },
    { name: 'Threat Intelligence', path: '/threat-intelligence', icon: ShieldAlert },
    { name: 'Scan History', path: '/history', icon: History },
    { name: 'Security Reports', path: '/reports', icon: FileText },
];

const Navbar = () => {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const SettingsItem = { name: 'System Settings', path: '/settings', icon: Settings };

    return (
        // The container wrapper provides fixed positioning
        <div className="fixed top-0 inset-x-0 z-50 flex justify-center w-full px-4 sm:px-6 pt-4 sm:pt-6 pointer-events-none transition-all duration-300">
            {/* The actual navbar acting as a floating pill */}
            <header 
                className="pointer-events-auto w-full max-w-[95%] 2xl:max-w-[1400px] h-16 bg-[rgba(15,23,42,0.85)] border border-[#1f2937] flex items-center justify-between shadow-[0_10px_40px_-5px_rgba(0,0,0,0.8)] rounded-full backdrop-blur-xl px-5 sm:px-8"
            >
                {/* Left: Logo */}
                <div className="flex flex-shrink-0 items-center">
                    <Link to="/" className="flex items-center gap-3 transition-colors text-[#818CF8]">
                        <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                            <ShieldAlert className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <span className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-indigo-200 tracking-wide drop-shadow-sm">
                            NexusScan
                        </span>
                    </Link>
                </div>

                {/* Center: Desktop Nav */}
                <nav className="hidden xl:flex flex-1 justify-center items-center gap-1 2xl:gap-3 h-full px-2 overflow-hidden">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path ||
                            (item.path !== '/' && location.pathname.startsWith(item.path));
                        
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center text-sm shrink-0 transition-all duration-300 whitespace-nowrap px-3 py-2 rounded-full relative group
                                    ${isActive
                                        ? 'text-white font-semibold tracking-wide bg-indigo-500/10'
                                        : 'text-slate-400 hover:text-white font-medium hover:bg-slate-800/50'
                                    }`}
                            >
                                <span>{item.name}</span>
                                {isActive && (
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Right: Settings & Hamburger */}
                <div className="flex flex-shrink-0 items-center gap-1 sm:gap-3">
                    <Link
                        to={SettingsItem.path}
                        className="hidden md:flex p-2.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all"
                        title="System Settings"
                    >
                        <Settings className="w-5 h-5" />
                    </Link>
                    <div 
                        className="hidden md:flex items-center justify-center w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full text-white cursor-pointer hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all border-2 border-slate-900 ml-2"
                        title="User Profile"
                    >
                        <User className="w-5 h-5" />
                    </div>

                    <button
                        className="xl:hidden p-2 text-slate-400 hover:text-white transition-colors bg-slate-800 rounded-lg ml-3"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile / Tablet Menu Dropdown */}
                {isMenuOpen && (
                    <div className="absolute top-[calc(100%+16px)] left-0 w-full bg-[rgba(15,23,42,0.95)] backdrop-blur-2xl border border-slate-800 rounded-2xl flex flex-col p-4 xl:hidden shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] max-h-[calc(100vh-100px)] overflow-y-auto">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path ||
                                (item.path !== '/' && location.pathname.startsWith(item.path));
                            
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200 ${
                                        isActive
                                            ? 'bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20'
                                            : 'text-slate-400 hover:bg-slate-800/80 hover:text-white border border-transparent'
                                    }`}
                                >
                                    <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                        <div className="h-px bg-slate-800 my-4 w-full"></div>
                        <Link
                            to={SettingsItem.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200 ${
                                location.pathname.startsWith(SettingsItem.path)
                                    ? 'bg-indigo-500/10 text-indigo-400 font-semibold border border-indigo-500/20'
                                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-white border border-transparent'
                            }`}
                        >
                            <Settings className="w-5 h-5 text-slate-500" />
                            <span>System Settings</span>
                        </Link>
                    </div>
                )}
            </header>
        </div>
    );
};

export default Navbar;
