
import React, { useState } from 'react';
import { Upload, Plus, FileText, BarChart3, PieChart, Users, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart as RePie, Pie, Cell, Legend } from 'recharts';

const AdminPanel = ({ user }) => {
    const [activeTab, setActiveTab] = useState('analytics'); // analytics, upload, list

    // Mock Data for Charts
    const riskData = [
        { name: 'Low Risk', value: 400, color: '#10b981' },
        { name: 'Medium Risk', value: 120, color: '#f59e0b' },
        { name: 'High Risk', value: 30, color: '#ef4444' },
    ];

    const verificationData = [
        { day: 'Mon', count: 45 },
        { day: 'Tue', count: 52 },
        { day: 'Wed', count: 38 },
        { day: 'Thu', count: 65 },
        { day: 'Fri', count: 48 },
        { day: 'Sat', count: 70 },
        { day: 'Sun', count: 60 },
    ];

    if (user?.role !== 'PLATFORM_ADMIN' && user?.role !== 'SUPER_ADMIN') {
        return <div className="container" style={{ padding: '2rem' }}>Access Denied</div>;
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem' }}>Platform Admin Panel</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Manage workers and verification data</p>
            </header>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', overflowX: 'auto' }}>
                    <button
                        className="btn"
                        style={{
                            background: activeTab === 'analytics' ? 'var(--accent-primary)' : 'transparent',
                            color: activeTab === 'analytics' ? 'white' : 'var(--text-secondary)'
                        }}
                        onClick={() => setActiveTab('analytics')}
                    >
                        <BarChart3 size={18} style={{ marginRight: '0.5rem' }} /> Analytics
                    </button>
                    <button
                        className="btn"
                        style={{
                            background: activeTab === 'upload' ? 'var(--accent-primary)' : 'transparent',
                            color: activeTab === 'upload' ? 'white' : 'var(--text-secondary)'
                        }}
                        onClick={() => setActiveTab('upload')}
                    >
                        <Upload size={18} style={{ marginRight: '0.5rem' }} /> Bulk Upload
                    </button>
                    <button
                        className="btn"
                        style={{
                            background: activeTab === 'list' ? 'var(--accent-primary)' : 'transparent',
                            color: activeTab === 'list' ? 'white' : 'var(--text-secondary)'
                        }}
                        onClick={() => setActiveTab('list')}
                    >
                        <FileText size={18} style={{ marginRight: '0.5rem' }} /> Workers
                    </button>
                </div>

                {activeTab === 'analytics' && (
                    <div className="animate-fade-in">
                        {/* Stats Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                    <Users size={20} /> Total Workers
                                </div>
                                <h2 style={{ fontSize: '2rem' }}>550</h2>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', marginBottom: '0.5rem' }}>
                                    <PieChart size={20} /> Verified Safe
                                </div>
                                <h2 style={{ fontSize: '2rem' }}>400</h2>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', marginBottom: '0.5rem' }}>
                                    <AlertTriangle size={20} /> High Risk
                                </div>
                                <h2 style={{ fontSize: '2rem' }}>30</h2>
                            </div>
                        </div>

                        {/* Charts Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                            {/* Risk Distribution */}
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', height: '350px' }}>
                                <h3 style={{ marginBottom: '1rem' }}>Risk Score Distribution</h3>
                                <ResponsiveContainer width="100%" height="85%">
                                    <RePie>
                                        <Pie data={riskData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                            {riskData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ background: '#1e293b', border: 'none' }} />
                                        <Legend />
                                    </RePie>
                                </ResponsiveContainer>
                            </div>

                            {/* Daily Verifications */}
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', height: '350px' }}>
                                <h3 style={{ marginBottom: '1rem' }}>Last 7 Days Verifications</h3>
                                <ResponsiveContainer width="100%" height="85%">
                                    <BarChart data={verificationData}>
                                        <XAxis dataKey="day" stroke="#94a3b8" />
                                        <YAxis stroke="#94a3b8" />
                                        <Tooltip contentStyle={{ background: '#1e293b', border: 'none' }} cursor={{ fill: 'rgba(255,255,255,0.1)' }} />
                                        <Bar dataKey="count" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'upload' && (
                    <div style={{ textAlign: 'center', padding: '3rem', border: '2px dashed var(--glass-border)', borderRadius: '12px' }}>
                        <Upload size={48} color="var(--accent-primary)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>Drag and drop CSV file</h3>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Upload worker list for verification scoring</p>
                        <button className="btn btn-primary">Select File</button>
                        <p style={{ marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            Template: name, phone, aadhaar_hash, employer, role
                        </p>
                    </div>
                )}

                {activeTab === 'list' && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3>Worker Registry</h3>
                            <button className="btn" style={{ background: 'var(--glass-border)' }}><Plus size={16} /> Add New</button>
                        </div>
                        <p style={{ color: 'var(--text-secondary)' }}>List of workers will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPanel;
