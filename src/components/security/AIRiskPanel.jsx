import React from 'react';
import { motion } from 'framer-motion';
import { Brain, TrendingUp, Cpu } from 'lucide-react';

export default function AIRiskPanel() {
    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 h-full relative overflow-hidden"
        >
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-600/10 blur-[50px] rounded-full pointer-events-none"></div>

            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2 relative z-10">
                <Brain className="w-5 h-5 text-indigo-400" />
                AI Security Insights
                <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent ml-2"></div>
            </h3>

            <div className="space-y-6 relative z-10">
                {/* Exploit Probability */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-300">Predicted Exploit Probability</span>
                        <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                            85%
                        </span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '85%' }}
                            transition={{ duration: 1, delay: 0.8 }}
                            className="h-full bg-gradient-to-r from-red-500/50 to-red-500 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                        />
                    </div>
                </div>

                {/* AI Risk Score */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-300">Overall AI Risk Score</span>
                        <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                            90 / 100
                        </span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '90%' }}
                            transition={{ duration: 1, delay: 1 }}
                            className="h-full bg-gradient-to-r from-orange-500/50 to-orange-500 rounded-full"
                        />
                    </div>
                </div>

                {/* Patch Priority */}
                <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 mt-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                            <span className="block text-xs text-indigo-300 font-medium">Recommended Priority</span>
                            <span className="block text-sm font-bold text-indigo-100">Immediate Remediation</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
