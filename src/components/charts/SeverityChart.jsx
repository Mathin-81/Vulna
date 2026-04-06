import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const data = [
    { name: 'Critical', value: 18, color: '#ef4444' }, // red-500
    { name: 'High', value: 45, color: '#f97316' },     // orange-500
    { name: 'Medium', value: 52, color: '#eab308' },   // yellow-500
    { name: 'Low', value: 27, color: '#3b82f6' },      // blue-500
];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-xl shadow-xl flex items-center gap-3">
                <div className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: payload[0].payload.color, color: payload[0].payload.color }} />
                <div>
                    <p className="text-white font-medium">{payload[0].name}</p>
                    <p className="text-slate-400 text-sm">{payload[0].value} Issues</p>
                </div>
            </div>
        );
    }
    return null;
};

export default function SeverityChart() {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 h-full flex flex-col"
        >
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                Severity Distribution
                <div className="h-px flex-1 bg-gradient-to-r from-slate-800 to-transparent ml-2"></div>
            </h3>
            <div className="flex-1 min-h-[250px] relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.color} 
                                    style={{ filter: `drop-shadow(0px 0px 8px ${entry.color}40)` }}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                    </PieChart>
                </ResponsiveContainer>
                {/* Center text overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-bold text-white">142</span>
                    <span className="text-xs text-slate-400 uppercase tracking-wider">Total</span>
                </div>
            </div>
        </motion.div>
    );
}
