import React from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle, Shield, AlertTriangle } from 'lucide-react';

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function ScanStats({ stats }) {
    const statCards = [
        { title: 'Total Scans', value: stats.totalScans, icon: Activity, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
        { title: 'Successful Scans', value: stats.successfulScans, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
        { title: 'Vulnerabilities Found', value: stats.vulnerabilitiesFound, icon: Shield, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
        { title: 'Critical Issues', value: stats.criticalIssues, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' }
    ];

    return (
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {statCards.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                    <motion.div
                        key={idx}
                        variants={item}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className={`relative group overflow-hidden bg-slate-900/60 backdrop-blur-xl border ${stat.border} rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]`}
                    >
                        <div className={`absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full blur-2xl opacity-20 transition-all duration-500 group-hover:opacity-40 group-hover:scale-150 ${stat.bg.replace('/10', '')}`} />
                        <div className="relative z-10 flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-400 mb-1">{stat.title}</p>
                                <motion.h3
                                    className="text-4xl font-bold text-white tracking-tight"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 100, delay: 0.2 + (idx * 0.1) }}
                                >
                                    {stat.value}
                                </motion.h3>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.border} border`}>
                                <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </motion.div>
    );
}
