import React from 'react';
import { Search, Filter } from 'lucide-react';

export default function ScanFilters({ filters, setFilters }) {
    return (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by ID or target..."
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                </div>
                <select
                    value={filters.scanType}
                    onChange={(e) => setFilters({ ...filters, scanType: e.target.value })}
                    className="px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                    <option value="">All Scan Types</option>
                    <option value="Static Analysis">Static Analysis</option>
                    <option value="Dynamic Scan">Dynamic Scan</option>
                    <option value="Dependency Scan">Dependency Scan</option>
                    <option value="AI Anomaly Scan">AI Anomaly Scan</option>
                </select>
                <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                    <option value="">All Status</option>
                    <option value="Completed">Completed</option>
                    <option value="Running">Running</option>
                    <option value="Failed">Failed</option>
                    <option value="Scheduled">Scheduled</option>
                </select>
                <input
                    type="date"
                    value={filters.date}
                    onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                    className="px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
            </div>
        </div>
    );
}
