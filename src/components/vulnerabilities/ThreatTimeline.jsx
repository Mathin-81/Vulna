import React from 'react';
import { motion } from 'framer-motion';

const timelineData = [
    { time: '10:32 AM', event: 'SQL Injection detected', source: 'Auth Service', color: 'bg-red-500' },
    { time: '09:10 AM', event: 'Remote Code Execution', source: 'Data Parser', color: 'bg-red-500' },
    { time: '02:45 AM', event: 'Brute Force attempt', source: 'Gateway', color: 'bg-orange-500' },
    { time: 'Yesterday', event: 'XSS vulnerability', source: 'Comment System', color: 'bg-yellow-500' },
];

const dotAnimation = {
    initial: { scale: 0.5, opacity: 0 },
    animate: { 
        scale: 1, 
        opacity: 1,
        transition: { duration: 0.5 }
    },
    pulse: {
        scale: [1, 1.3, 1],
        opacity: [1, 0.6, 1],
        transition: { duration: 2, repeat: Infinity }
    }
};

export default function ThreatTimeline() {
    return (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 h-full flex flex-col"
        >
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                Discovery Timeline
                <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent ml-2"></div>
            </h3>
            <div className="relative pl-6 space-y-8 mt-4 overflow-y-auto max-h-[500px] flex-1 pr-2">
                {/* Vertical Line */}
                <div className="absolute top-2 bottom-2 left-[11px] w-px bg-slate-800 border-l border-dashed border-slate-700"></div>
                
                {timelineData.map((item, index) => (
                    <motion.div 
                        key={index} 
                        initial={{ opacity: 0, y: 10, x: -10 }}
                        animate={{ 
                            opacity: 1, 
                            y: 0,
                            x: 0,
                            transition: { delay: 0.5 + (index * 0.1) }
                        }}
                        whileInView={{ 
                            y: [0, -5, 0],
                            transition: { duration: 3, repeat: Infinity, delay: index * 0.2 }
                        }}
                        className="relative"
                    >
                        {/* Dot with continuous pulse animation */}
                        <motion.div 
                            className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full ${item.color} shadow-[0_0_10px_currentColor] z-10 box-content border-2 border-slate-950`}
                            variants={dotAnimation}
                            initial="initial"
                            animate="pulse"
                        ></motion.div>
                        
                        <motion.div 
                            className="flex flex-col"
                            animate={{ 
                                opacity: [0.7, 1, 0.7],
                                transition: { duration: 2.5, repeat: Infinity, delay: index * 0.3 }
                            }}
                        >
                            <span className="text-xs font-mono text-indigo-400 mb-1">{item.time}</span>
                            <span className="text-sm font-medium text-slate-200">{item.event}</span>
                            <span className="text-xs text-slate-500 mt-1">{item.source}</span>
                        </motion.div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
