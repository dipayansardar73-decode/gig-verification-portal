
import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, CheckCircle, XCircle } from 'lucide-react';

const FaceVerificationModal = ({ onClose, onVerify }) => {
    const webcamRef = useRef(null);
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState(null); // 'success', 'fail'

    const capture = useCallback(() => {
        setScanning(true);
        // Simulate API call delay
        setTimeout(() => {
            setScanning(false);
            setResult('success'); // Always success for demo
            setTimeout(() => {
                onVerify();
                onClose();
            }, 1500);
        }, 2000);
    }, [webcamRef, onVerify, onClose]);

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="glass-panel" style={{ padding: '2rem', maxWidth: '500px', width: '90%', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '1rem' }}>Face Verification</h2>

                {result === 'success' ? (
                    <div className="animate-fade-in" style={{ padding: '3rem 0' }}>
                        <CheckCircle size={80} color="var(--success)" style={{ margin: '0 auto 1rem auto' }} />
                        <h3 style={{ color: 'var(--success)' }}>Match Confirmed</h3>
                        <p>Identity verified against database.</p>
                    </div>
                ) : (
                    <>
                        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.5rem', border: '2px solid var(--accent-primary)' }}>
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                style={{ width: '100%', display: 'block' }}
                            />

                            {/* Face Guide Overlay */}
                            <div className="face-overlay">
                                <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>Align Face</div>
                            </div>

                            {scanning && (
                                <>
                                    <div className="scanner-line"></div>
                                    <div style={{
                                        position: 'absolute', top: 10, left: 10,
                                        background: 'rgba(0,0,0,0.6)', padding: '0.5rem', borderRadius: '4px',
                                        color: '#0f0', fontSize: '0.8rem', fontFamily: 'monospace'
                                    }}>
                                        <div>ANALYZING BIOMETRICS...</div>
                                        <div>LIVENESS: CHECKING</div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button onClick={onClose} className="btn" style={{ background: 'var(--glass-border)' }}>Cancel</button>
                            <button onClick={capture} className="btn btn-primary" disabled={scanning}>
                                <Camera size={18} style={{ marginRight: '0.5rem' }} />
                                {scanning ? 'Verifying...' : 'Verify Identity'}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default FaceVerificationModal;
