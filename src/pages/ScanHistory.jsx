import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import ScanStats from '../components/scans/ScanStats';
import ScanActivityChart from '../components/charts/ScanActivityChart';
import ScanFilters from '../components/filters/ScanFilters';
import ScanTable from '../components/tables/ScanTable';
import ScanDetailDrawer from '../components/scans/ScanDetailDrawer';

// Mock data
const mockScans = [
    {
        id: 'SCN-2024-001',
        target: 'payment-gateway-api',
        type: 'Static Analysis',
        date: '2024-01-15',
        duration: '12m 34s',
        vulnerabilities: 23,
        severity: 'Critical',
        status: 'Completed',
        filesScanned: 156,
        progress: 100,
        severityDistribution: { critical: 5, high: 8, medium: 7, low: 3 }
    },
    {
        id: 'SCN-2024-002',
        target: 'user-auth-service',
        type: 'Dynamic Scan',
        date: '2024-01-15',
        duration: '8m 12s',
        vulnerabilities: 12,
        severity: 'High',
        status: 'Completed',
        filesScanned: 89,
        progress: 100,
        severityDistribution: { critical: 2, high: 5, medium: 3, low: 2 }
    },
    {
        id: 'SCN-2024-003',
        target: 'frontend-dashboard',
        type: 'Dependency Scan',
        date: '2024-01-14',
        duration: '5m 45s',
        vulnerabilities: 8,
        severity: 'Medium',
        status: 'Completed',
        filesScanned: 234,
        progress: 100,
        severityDistribution: { critical: 0, high: 2, medium: 4, low: 2 }
    },
    {
        id: 'SCN-2024-004',
        target: 'data-processing-engine',
        type: 'AI Anomaly Scan',
        date: '2024-01-14',
        duration: '18m 23s',
        vulnerabilities: 31,
        severity: 'Critical',
        status: 'Running',
        filesScanned: 412,
        progress: 65,
        severityDistribution: { critical: 7, high: 12, medium: 8, low: 4 }
    },
    {
        id: 'SCN-2024-005',
        target: 'mobile-app-backend',
        type: 'Static Analysis',
        date: '2024-01-13',
        duration: '10m 56s',
        vulnerabilities: 15,
        severity: 'High',
        status: 'Completed',
        filesScanned: 178,
        progress: 100,
        severityDistribution: { critical: 3, high: 6, medium: 4, low: 2 }
    },
    {
        id: 'SCN-2024-006',
        target: 'notification-service',
        type: 'Dynamic Scan',
        date: '2024-01-13',
        duration: '0m 0s',
        vulnerabilities: 0,
        severity: 'Low',
        status: 'Failed',
        filesScanned: 0,
        progress: 0,
        severityDistribution: { critical: 0, high: 0, medium: 0, low: 0 }
    },
    {
        id: 'SCN-2024-007',
        target: 'analytics-pipeline',
        type: 'Dependency Scan',
        date: '2024-01-16',
        duration: '0m 0s',
        vulnerabilities: 0,
        severity: 'Low',
        status: 'Scheduled',
        filesScanned: 0,
        progress: 0,
        severityDistribution: { critical: 0, high: 0, medium: 0, low: 0 }
    },
    {
        id: 'SCN-2024-008',
        target: 'email-service',
        type: 'AI Anomaly Scan',
        date: '2024-01-12',
        duration: '7m 18s',
        vulnerabilities: 4,
        severity: 'Low',
        status: 'Completed',
        filesScanned: 67,
        progress: 100,
        severityDistribution: { critical: 0, high: 0, medium: 1, low: 3 }
    }
];

const mockChartData = [
    { date: 'Jan 10', scans: 5, vulnerabilities: 45 },
    { date: 'Jan 11', scans: 8, vulnerabilities: 62 },
    { date: 'Jan 12', scans: 6, vulnerabilities: 38 },
    { date: 'Jan 13', scans: 10, vulnerabilities: 71 },
    { date: 'Jan 14', scans: 7, vulnerabilities: 52 },
    { date: 'Jan 15', scans: 12, vulnerabilities: 89 },
    { date: 'Jan 16', scans: 4, vulnerabilities: 28 }
];

const ScanHistory = () => {
    const [filters, setFilters] = useState({
        search: '',
        scanType: '',
        status: '',
        date: ''
    });
    const [selectedScan, setSelectedScan] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const filteredScans = useMemo(() => {
        return mockScans.filter(scan => {
            const matchesSearch = scan.id.toLowerCase().includes(filters.search.toLowerCase()) ||
                scan.target.toLowerCase().includes(filters.search.toLowerCase());
            const matchesType = !filters.scanType || scan.type === filters.scanType;
            const matchesStatus = !filters.status || scan.status === filters.status;
            const matchesDate = !filters.date || scan.date === filters.date;
            return matchesSearch && matchesType && matchesStatus && matchesDate;
        });
    }, [filters]);

    const stats = useMemo(() => {
        const totalScans = mockScans.length;
        const successfulScans = mockScans.filter(s => s.status === 'Completed').length;
        const vulnerabilitiesFound = mockScans.reduce((sum, s) => sum + s.vulnerabilities, 0);
        const criticalIssues = mockScans.reduce((sum, s) => sum + (s.severityDistribution?.critical || 0), 0);
        return { totalScans, successfulScans, vulnerabilitiesFound, criticalIssues };
    }, []);

    const handleRowClick = (scan) => {
        setSelectedScan(scan);
        setIsDrawerOpen(true);
    };

    return (
        <div className="p-6 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.05),transparent_50%)] pointer-events-none" />
            
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10"
            >
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                        Scan History
                    </h1>
                    <p className="text-slate-400">Monitor and analyze your security scan activities</p>
                </div>

                <ScanStats stats={stats} />
                <ScanActivityChart data={mockChartData} />
                <ScanFilters filters={filters} setFilters={setFilters} />
                <ScanTable scans={filteredScans} onRowClick={handleRowClick} />
            </motion.div>

            <ScanDetailDrawer
                scan={selectedScan}
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
        </div>
    );
};

export default ScanHistory;
