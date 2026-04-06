import React from 'react';
import { Search, Filter, ChevronDown, ListFilter } from 'lucide-react';

export default function FiltersPanel({ searchTerm, setSearchTerm }) {
    return (
        <div className="mb-8">
            <div className="flex flex-col xl:flex-row gap-4">
                <div className="relative flex-[2]">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                        type="text" 
                        placeholder="Search CVE ID, component, or description..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all backdrop-blur-sm shadow-inner"
                    />
                </div>
                <div className="flex gap-3 flex-1 overflow-x-auto pb-2 xl:pb-0 hide-scrollbar">
                    <button className="flex-1 flex items-center justify-between gap-2 px-5 py-3.5 bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800/50 transition-colors backdrop-blur-sm whitespace-nowrap min-w-[140px]">
                        <div className="flex items-center gap-2">
                            <ListFilter className="w-4 h-4 text-indigo-400" />
                            <span>Vuln Type</span>
                        </div>
                        <ChevronDown className="w-4 h-4 opacity-50" />
                    </button>
                    <button className="flex-1 flex items-center justify-between gap-2 px-5 py-3.5 bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800/50 transition-colors backdrop-blur-sm whitespace-nowrap min-w-[140px]">
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-indigo-400" />
                            <span>Severity</span>
                        </div>
                        <ChevronDown className="w-4 h-4 opacity-50" />
                    </button>
                    <button className="hidden sm:flex flex-1 items-center justify-between gap-2 px-5 py-3.5 bg-slate-900/50 border border-slate-800 rounded-2xl text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-800/50 transition-colors backdrop-blur-sm whitespace-nowrap min-w-[140px]">
                        <span className="text-sm">More Filters</span>
                        <ChevronDown className="w-4 h-4 opacity-50" />
                    </button>
                </div>
            </div>
            
            {/* Tag Selection */}
            <div className="flex flex-wrap items-center gap-2 mt-4 ml-2">
                <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mr-2">Detect Methods:</span>
                {['SAST', 'DAST', 'Runtime', 'AI Prediction', '0-Day Feed'].map(tag => (
                    <span key={tag} className="text-xs font-semibold px-3 py-1 bg-slate-900/60 border border-slate-800 text-slate-400 rounded-full cursor-pointer hover:bg-indigo-500/10 hover:border-indigo-500/30 hover:text-indigo-400 transition-colors">
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}
