import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Shield, Clock, FileCode, AlertTriangle, CheckCircle2, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const severityColors = {
    Critical: { color: '#ef4444', bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
    High: { color: '#f97316', bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' },
    Medium: { color: '#eab308', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' },
    Low: { color: '#10b981', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' }
};

export default function ScanDetailDrawer({ scan, isOpen, onClose }) {
    if (!scan) return null;

    const chartData = [
        { name: 'Critical', value: scan.severityDistribution?.critical || 0 },
        { name: 'High', value: scan.severityDistribution?.high || 0 },
        { name: 'Medium', value: scan.severityDistribution?.medium || 0 },
        { name: 'Low', value: scan.severityDistribution?.low || 0 }
    ];

    const COLORS = ['#ef4444', '#f97316', '#eab308', '#10b981'];

    const timeline = [
        { label: 'Scan Started', icon: Activity, completed: true },
        { label: 'Code Analysis', icon: FileCode, completed: true },
        { label: 'Fuzz Testing', icon: Shield, completed: true },
        { label: 'AI Anomaly Detection', icon: AlertTriangle, completed: scan.status === 'Completed' },
        { label: 'Report Generated', icon: CheckCircle2, completed: scan.status === 'Completed' }
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25 }}
                        className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-slate-900 border-l border-slate-700 z-50 overflow-y-auto"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">Scan Details</h2>
                                <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                                    <X className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                                    <h3 className="text-lg font-semibold text-white mb-4">Scan Summary</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <Target className="w-5 h-5 text-indigo-400" />
                                            <div>
                                                <p className="text-xs text-slate-400">Target Application</p>
                                                <p className="text-sm text-white font-medium">{scan.target}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Shield className="w-5 h-5 text-orange-400" />
                                            <div>
                                                <p className="text-xs text-slate-400">Total Vulnerabilities</p>
                                                <p className="text-sm text-white font-medium">{scan.vulnerabilities}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <FileCode className="w-5 h-5 text-emerald-400" />
                                            <div>
                                                <p className="text-xs text-slate-400">Files Scanned</p>
                                                <p className="text-sm text-white font-medium">{scan.filesScanned || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock className="w-5 h-5 text-blue-400" />
                                            <div>
                                                <p className="text-xs text-slate-400">Time Taken</p>
                                                <p className="text-sm text-white font-medium">{scan.duration}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                                    <h3 className="text-lg font-semibold text-white mb-4">Severity Distribution</h3>
                                    <ResponsiveContainer width="100%" height={200}>
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: '#1e293b',
                                                    border: '1px solid #334155',
                                                    borderRadius: '8px'
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="grid grid-cols-2 gap-2 mt-4">
                                        {Object.entries(severityColors).map(([key, value]) => (
                                            <div key={key} className={`${value.bg} ${value.border} border rounded-lg p-2`}>
                                                <p className={`text-xs ${value.text}`}>{key}</p>
                                                <p className="text-lg font-bold text-white">{scan.severityDistribution?.[key.toLowerCase()] || 0}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                                    <h3 className="text-lg font-semibold text-white mb-4">Scan Timeline</h3>
                                    <div className="space-y-4">
                                        {timeline.map((step, idx) => {
                                            const Icon = step.icon;
                                            return (
                                                <div key={idx} className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${step.completed ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-slate-700/50 border border-slate-600'}`}>
                                                        <Icon className={`w-5 h-5 ${step.completed ? 'text-emerald-400' : 'text-slate-400'}`} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className={`text-sm font-medium ${step.completed ? 'text-white' : 'text-slate-400'}`}>{step.label}</p>
                                                    </div>
                                                    {step.completed && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {scan.status === 'Running' && (
                                    <div className="bg-slate-800/50 border border-blue-500/30 rounded-xl p-4">
                                        <h3 className="text-lg font-semibold text-white mb-3">Scan Progress</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-400">Progress</span>
                                                <span className="text-blue-400 font-semibold">{scan.progress || 65}%</span>
                                            </div>
                                            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${scan.progress || 65}%` }}
                                                    transition={{ duration: 1 }}
                                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
