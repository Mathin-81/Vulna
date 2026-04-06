import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Radio, AlertOctagon } from 'lucide-react';

const intelFeeds = [
    { source: 'NVD Feed', cve: 'CVE-2024-0321', desc: 'Critical RCE in widely-used parsing library', severity: 'red' },
    { source: 'Dark Web Intel', cve: 'Unknown', desc: 'New automated SQLi attack vector detected', severity: 'orange' },
    { source: 'CISA Alert', cve: 'CVE-2024-1105', desc: 'Active exploitation of gateway appliances', severity: 'red' },
];

export default function ThreatIntelFeed() {
    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 h-full flex flex-col relative overflow-hidden"
        >
            <div className="absolute right-0 top-0 w-32 h-32 bg-rose-500/5 blur-[40px] rounded-full"></div>
            
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 relative z-10">
                <Globe className="w-5 h-5 text-rose-400" />
                Threat Intelligence Feed
                <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent ml-2"></div>
            </h3>

            <div className="space-y-4 relative z-10 flex-1">
                {intelFeeds.map((feed, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + (idx * 0.1) }}
                        key={idx} 
                        className="bg-slate-950/50 border border-slate-800 rounded-2xl p-4 flex gap-4 items-start group hover:border-slate-700 hover:bg-slate-900/80 transition-all"
                    >
                        <div className="mt-1 relative">
                            <span className={`absolute inset-0 rounded-full animate-ping opacity-75 ${feed.severity === 'red' ? 'bg-rose-500' : 'bg-orange-500'}`}></span>
                            <div className={`relative w-2.5 h-2.5 rounded-full ${feed.severity === 'red' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]' : 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]'}`}></div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold font-mono text-slate-400 border border-slate-800 bg-slate-950 px-2 py-0.5 rounded">{feed.cve}</span>
                                <span className="text-xs text-rose-400/80 border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Radio className="w-3 h-3" /> {feed.source}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-slate-300 leading-relaxed group-hover:text-white transition-colors">{feed.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
            
            <button className="w-full mt-4 flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-600 bg-slate-900/50 text-slate-300 hover:text-white rounded-xl py-3 text-sm font-semibold transition-all">
                <AlertOctagon className="w-4 h-4" /> View Full Intel DB
            </button>
        </motion.div>
    );
}
