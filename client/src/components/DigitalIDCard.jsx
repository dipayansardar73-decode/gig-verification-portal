
import React from 'react';
import QRCode from 'react-qr-code';

const DigitalIDCard = ({ worker }) => {
    return (
        <div style={{
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            padding: '2rem',
            borderRadius: '16px',
            border: '1px solid var(--glass-border)',
            textAlign: 'center',
            maxWidth: '300px',
            margin: '0 auto',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
        }}>
            <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 1rem auto',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid white'
            }}>
                {worker.photoUrl ? (
                    <img src={worker.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div style={{ width: '100%', height: '100%', background: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                        {worker.name.charAt(0)}
                    </div>
                )}
            </div>

            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{worker.name}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                {worker.role} • {worker.employer}
            </p>

            <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', width: 'fit-content', margin: '0 auto 1.5rem auto' }}>
                <QRCode
                    value={`gigverify://${worker.id}`}
                    size={120}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="H"
                />
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <p>Verification ID</p>
                <code style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                    {worker.id.split('-')[0]}...
                </code>
            </div>
        </div>
    );
};

export default DigitalIDCard;
