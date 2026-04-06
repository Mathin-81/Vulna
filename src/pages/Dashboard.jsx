import { useState, useEffect } from 'react';
import VulnerabilityCard from '../components/VulnerabilityCard';
import { Activity, ShieldCheck, Tag } from 'lucide-react';
import { API_BASE_URL } from '../config';

// Export dynamically active vulnerabilities for details page routing
export let activeVulnerabilities = [];

const Dashboard = () => {
    const [filter, setFilter] = useState('All');
    const [vulnerabilities, setVulnerabilities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [summary, setSummary] = useState(null);
    const [aiCount, setAiCount] = useState(0);
    const [criticalCount, setCriticalCount] = useState(0);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const [resResponse, sumResponse, countResponse, critResponse] = await Promise.all([
                    fetch(`${API_BASE_URL}/results`),
                    fetch(`${API_BASE_URL}/summary`),
                    fetch(`${API_BASE_URL}/ai-count`),
                    fetch(`${API_BASE_URL}/critical-ops`)
                ]);

                if (resResponse.ok) {
                    const data = await resResponse.json();
                    const formattedIssues = data.issues.map((issue, index) => ({
                        id: index + 1,
                        type: issue.type || 'Unknown Issue',
                        file: issue.file || 'unknown',
                        line: issue.line || 'N/A',
                        severity: issue.severity || 'Medium',
                        description: issue.description || 'No description provided.',
                        snippet: '/* Neural Analysis Active */',
                        remediation: issue.fix || 'No fix suggested.'
                    }));
                    setVulnerabilities(formattedIssues);
                    activeVulnerabilities = formattedIssues;
                }

                if (sumResponse.ok) {
                    const sumData = await sumResponse.json();
                    setSummary(sumData);
                }

                if (countResponse.ok) {
                    const countData = await countResponse.json();
                    setAiCount(countData.total || 0);
                }

                if (critResponse.ok) {
                    const critData = await critResponse.json();
                    setCriticalCount(critData.total || 0);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, []);

    const filteredVulns = filter === 'All'
        ? vulnerabilities
        : vulnerabilities.filter(v => v.severity === filter);

    const stats = {
        total: vulnerabilities.length,
        critical: vulnerabilities.filter(v => v.severity === 'Critical').length,
        high: vulnerabilities.filter(v => v.severity === 'High').length,
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
                <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-4" />
                <p>Loading AI Security Insights...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold mb-2 flex items-center gap-3">
                        <Activity className="w-8 h-8 text-indigo-400" />
                        AI Command Center
                    </h1>
                    <p className="text-slate-400">Real-time neural analysis of system vulnerabilities.</p>
                </div>

                <div className="flex gap-2">
                    {['All', 'Critical', 'High', 'Medium', 'Low'].map((level) => (
                        <button
                            key={level}
                            onClick={() => setFilter(level)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${filter === level
                                ? 'bg-indigo-600 text-white border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.4)]'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                                }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>
            </div>

            {/* AI Summary Section - THE BOXES */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                {summary?.answers?.map((answer, i) => (
                    <div key={i} className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl relative overflow-hidden group hover:bg-indigo-500/10 transition-all">
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Tag className="w-12 h-12" />
                        </div>
                        <p className="text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-3">AI Discovery #{i + 1}</p>
                        <p className="text-slate-200 text-sm font-medium leading-relaxed italic">"{answer}"</p>
                    </div>
                ))}
            </div>

            {/* Key Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Total Threats</p>
                    <p className="text-3xl font-black text-white">{aiCount}</p>
                </div>
                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Critical Ops</p>
                    <p className="text-3xl font-black text-rose-500">{criticalCount}</p>
                </div>
                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Health Score</p>
                    <p className="text-3xl font-black text-emerald-500">{summary?.score || 0}%</p>
                </div>
                <div className="p-6 bg-slate-900/50 border border-slate-800 rounded-2xl">
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">Status</p>
                    <p className={`text-xl font-bold ${summary?.health_status === 'Critical' ? 'text-rose-500' : 'text-emerald-400'}`}>
                        {summary?.health_status || 'Analyzing...'}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredVulns.length > 0 ? (
                    filteredVulns.map(vuln => <VulnerabilityCard key={vuln.id} vuln={vuln} />)
                ) : (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
                        <ShieldCheck className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-500 font-medium">No vulnerabilities detected in latest sweep.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
