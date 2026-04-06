import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Loader } from 'lucide-react';

const statusColors = {
    Completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    Running: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    Failed: 'bg-red-500/10 text-red-400 border-red-500/30',
    Scheduled: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
};

const severityColors = {
    Critical: 'text-red-400',
    High: 'text-orange-400',
    Medium: 'text-yellow-400',
    Low: 'text-emerald-400'
};

export default function ScanTable({ scans, onRowClick }) {
    return (
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-800/50 border-b border-slate-700">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Scan ID</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Target System</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Scan Type</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Scan Date</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Duration</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Vulnerabilities</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Severity</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {scans.map((scan, idx) => (
                            <motion.tr
                                key={scan.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => onRowClick(scan)}
                                className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                            >
                                <td className="px-6 py-4 text-sm font-mono text-indigo-400">{scan.id}</td>
                                <td className="px-6 py-4 text-sm text-white">{scan.target}</td>
                                <td className="px-6 py-4 text-sm text-slate-300">{scan.type}</td>
                                <td className="px-6 py-4 text-sm text-slate-400">{scan.date}</td>
                                <td className="px-6 py-4 text-sm text-slate-400 flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {scan.duration}
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-white">{scan.vulnerabilities}</td>
                                <td className={`px-6 py-4 text-sm font-semibold ${severityColors[scan.severity]}`}>{scan.severity}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${statusColors[scan.status]}`}>
                                        {scan.status === 'Running' && <Loader className="w-3 h-3 animate-spin" />}
                                        {scan.status}
                                    </span>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
