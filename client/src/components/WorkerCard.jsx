
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, Shield } from 'lucide-react';

const WorkerCard = ({ worker }) => {
    const navigate = useNavigate();

    const getRiskColor = (level) => {
        switch (level) {
            case 'HIGH': return 'var(--danger)';
            case 'MEDIUM': return 'var(--warning)';
            case 'LOW': return 'var(--success)';
            default: return 'var(--text-secondary)';
        }
    };

    const RiskIcon = () => {
        switch (worker.riskLevel) {
            case 'HIGH': return <ShieldAlert size={48} color={getRiskColor('HIGH')} />;
            case 'MEDIUM': return <Shield size={48} color={getRiskColor('MEDIUM')} />;
            default: return <ShieldCheck size={48} color={getRiskColor('LOW')} />;
        }
    };

    return (
        <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => navigate(`/worker/${worker.id}`)}>
            <div style={{ flexShrink: 0 }}>
                {worker.photoUrl ? (
                    <img src={worker.photoUrl} alt={worker.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${getRiskColor(worker.riskLevel)}` }} />
                ) : (
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `3px solid ${getRiskColor(worker.riskLevel)}` }}>
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{worker.name.charAt(0)}</span>
                    </div>
                )}
            </div>

            <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>{worker.name}</h3>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <span>{worker.role}</span>
                    <span>•</span>
                    <span>{worker.employer}</span>
                </div>
                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        background: `${getRiskColor(worker.riskLevel)}20`,
                        color: getRiskColor(worker.riskLevel),
                        border: `1px solid ${getRiskColor(worker.riskLevel)}`
                    }}>
                        {worker.riskLevel} RISK ({worker.riskScore})
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Status: {worker.status}
                    </span>
                </div>
            </div>

            <div style={{ opacity: 0.8 }}>
                <RiskIcon />
            </div>
        </div>
    );
};

export default WorkerCard;
