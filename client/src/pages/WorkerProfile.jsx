
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle, Clock, QrCode, Download, MapPin, ScanFace, Building2 } from 'lucide-react';
import DigitalIDCard from '../components/DigitalIDCard';
import LocationMap from '../components/LocationMap';
import FaceVerificationModal from '../components/FaceVerificationModal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const WorkerProfile = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [worker, setWorker] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showID, setShowID] = useState(false);
    const [showFaceScan, setShowFaceScan] = useState(false);
    const [faceVerified, setFaceVerified] = useState(false);

    const handleDownload = async () => {
        const element = document.getElementById('profile-content');
        if (!element) return;

        try {
            const canvas = await html2canvas(element, { backgroundColor: '#0f172a' });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`verification_${worker.name.replace(/\s+/g, '_')}.pdf`);
        } catch (err) {
            console.error('PDF generation failed', err);
        }
    };

    useEffect(() => {
        const fetchWorker = async () => {
            console.log('Fetching worker with ID:', id); // Debug Log
            try {
                const url = `http://127.0.0.1:3000/workers/${id}?userId=${user?.email || 'unknown'}`;
                console.log('Fetch URL:', url);
                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    console.log('Worker Data:', data);
                    setWorker(data);
                } else {
                    console.error('Worker fetch failed:', res.status, res.statusText);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchWorker();
    }, [id, user]);

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading...</div>;
    if (!worker) return <div className="container" style={{ padding: '2rem' }}>Worker not found</div>;

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <button onClick={() => navigate(-1)} className="btn" style={{ background: 'transparent', paddingLeft: 0, marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                <ArrowLeft size={20} style={{ marginRight: '0.5rem' }} /> Back to Search
            </button>

            {showFaceScan && (
                <FaceVerificationModal
                    onClose={() => setShowFaceScan(false)}
                    onVerify={() => setFaceVerified(true)}
                />
            )}

            {showID ? (
                <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                    <button onClick={() => setShowID(false)} className="btn" style={{ width: '100%', marginBottom: '1rem', background: 'var(--glass-border)' }}>Close ID Card</button>
                    <DigitalIDCard worker={worker} />
                </div>
            ) : (
                <div className="glass-panel" id="profile-content" style={{ padding: '2rem', position: 'relative' }}>

                    {/* Action Buttons Top Right */}
                    <div style={{ position: 'absolute', right: '1rem', top: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                        <button
                            onClick={() => setShowID(true)}
                            className="btn"
                            style={{ padding: '0.5rem 1rem', background: 'var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                        >
                            <QrCode size={16} /> Digital ID
                        </button>
                        <button
                            onClick={handleDownload}
                            className="btn"
                            style={{ padding: '0.5rem 1rem', background: 'var(--glass-border)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                        >
                            <Download size={16} /> PDF Report
                        </button>
                        <button
                            onClick={() => setShowFaceScan(true)}
                            className="btn"
                            style={{ padding: '0.5rem 1rem', background: faceVerified ? 'var(--success)' : 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                            disabled={faceVerified}
                        >
                            {faceVerified ? <CheckCircle size={16} /> : <ScanFace size={16} />}
                            {faceVerified ? 'Face Verified' : 'Verify Identity'}
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem', marginTop: '1rem' }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            background: 'var(--bg-card)',
                            border: `4px solid ${worker.riskLevel === 'HIGH' ? 'var(--danger)' : worker.riskLevel === 'MEDIUM' ? 'var(--warning)' : 'var(--success)'}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '3rem',
                            fontWeight: 'bold',
                            marginBottom: '1rem',
                            overflow: 'hidden'
                        }}>
                            {worker.photoUrl ? <img src={worker.photoUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : worker.name.charAt(0)}
                        </div>
                        <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{worker.name}</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>{worker.role} at {worker.employer}</p>
                        {worker.govId && (
                            <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', borderRadius: '20px' }}>
                                Gov ID: {worker.govId}
                            </p>
                        )}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {/* Status Card */}
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px' }}>
                            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Current Status</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span>Risk Level</span>
                                <span style={{
                                    color: worker.riskLevel === 'HIGH' ? 'var(--danger)' : worker.riskLevel === 'MEDIUM' ? 'var(--warning)' : 'var(--success)',
                                    fontWeight: 'bold'
                                }}>{worker.riskLevel}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span>Verification Status</span>
                                <span>{worker.status}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Last Verified</span>
                                <span>{formatDate(worker.lastVerifiedAt)}</span>
                            </div>
                        </div>

                        {/* Details Card */}
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px' }}>
                            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Personal Details</h3>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.85rem' }}>Phone</span>
                                <span>{worker.phone}</span>
                            </div>
                            <div style={{ marginBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.85rem' }}>Platform</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {worker.employer}
                                    {/* Mock Linked Accounts */}
                                    <span style={{ fontSize: '0.7em', padding: '0.1rem 0.4rem', border: '1px solid var(--text-secondary)', borderRadius: '4px', opacity: 0.7 }}>
                                        + Linked: Urban Company
                                    </span>
                                </span>
                            </div>
                            <div>
                                <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.85rem' }}>Role</span>
                                <span>{worker.role}</span>
                            </div>
                        </div>
                    </div>

                    {/* Location Map Section */}
                    <div style={{ marginTop: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <MapPin size={20} /> Last Active Location
                        </h3>
                        <LocationMap lat={worker.latitude} lng={worker.longitude} />
                    </div>

                    {/* Incidents Section */}
                    <div style={{ marginTop: '2rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Incident History ({worker.incidents.length})</h3>
                        {worker.incidents.length === 0 ? (
                            <div style={{ padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <CheckCircle color="var(--success)" />
                                <span>No negative incidents reported. Clean record.</span>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {worker.incidents.map(inc => (
                                    <div key={inc.id} style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', borderRadius: '8px', display: 'flex', gap: '1rem', alignItems: 'start' }}>
                                        <AlertTriangle color="var(--danger)" style={{ flexShrink: 0, marginTop: '2px' }} />
                                        <div>
                                            <strong style={{ color: 'var(--danger)', display: 'block', marginBottom: '0.2rem' }}>{inc.type} - {inc.category}</strong>
                                            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>{inc.description}</p>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {formatDate(inc.date)}</span>
                                                <span>Source: {inc.source}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkerProfile;
