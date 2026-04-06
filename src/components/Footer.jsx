import { Link } from 'react-router-dom';
import { Shield, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = ({ className = "" }) => {
    return (
        <footer className={`w-full py-12 px-6 md:px-8 mt-20 border-t border-slate-800 bg-slate-900/50 backdrop-blur-md relative z-10 ${className}`}>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                
                <div className="md:col-span-1">
                    <Link to="/" className="flex items-center gap-2 mb-4 group">
                        <Shield className="w-8 h-8 text-indigo-500 group-hover:text-indigo-400 transition-colors" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">VulnScanner</span>
                    </Link>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6">
                        Securing the future of software with next-generation AI vulnerability detection. Identifying zero-days at the speed of thought.
                    </p>
                    <div className="flex items-center gap-4 text-slate-400">
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors">
                            <Github className="w-5 h-5" />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-indigo-400 transition-colors">
                            <Linkedin className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                <div className="md:col-span-1">
                    <h3 className="text-white font-semibold mb-4">Product</h3>
                    <ul className="space-y-3">
                        <li><Link to="/upload" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Scanner Engine</Link></li>
                        <li><Link to="/dashboard" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Analytics Dashboard</Link></li>
                        <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">API Integration</a></li>
                        <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Enterprise Data</a></li>
                    </ul>
                </div>

                <div className="md:col-span-1">
                    <h3 className="text-white font-semibold mb-4">Resources</h3>
                    <ul className="space-y-3">
                        <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Documentation</a></li>
                        <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Vulnerability DB</a></li>
                        <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Security Blog</a></li>
                        <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors text-sm">Research Papers</a></li>
                    </ul>
                </div>

                <div className="md:col-span-1">
                    <h3 className="text-white font-semibold mb-4">Stay Secure</h3>
                    <p className="text-slate-400 text-sm mb-4">Subscribe to our threat intelligence newsletter.</p>
                    <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                        <div className="relative flex-1">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input 
                                type="email" 
                                placeholder="Email address" 
                                className="w-full bg-slate-800/80 border border-slate-700 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                            />
                        </div>
                        <button type="submit" className="bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                            Subscribe
                        </button>
                    </form>
                </div>
                
            </div>

            <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-slate-500 text-sm">
                    &copy; {new Date().getFullYear()} VulnScanner. All rights reserved.
                </p>
                <div className="flex gap-6 text-sm">
                    <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">Privacy Policy</a>
                    <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">Terms of Service</a>
                    <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">Security</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
