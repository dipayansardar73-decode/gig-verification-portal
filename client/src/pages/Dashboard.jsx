import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import WorkerCard from '../components/WorkerCard';

const Dashboard = ({ user }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) return;

        setLoading(true);
        setSearched(true);

        try {
            console.log('Searching for:', query);
            // Pass userId for audit logging if strictly needed here, or just basic search
            const res = await fetch(`http://127.0.0.1:3000/workers/search?q=${query}`);
            const data = await res.json();
            console.log('Search results:', data);
            setResults(data);
        } catch (err) {
            console.error('Search failed', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #4facfe, #00f2fe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Verification Portal
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Search by Phone Number, Name, or Worker ID
                </p>
            </header>

            <form onSubmit={handleSearch} style={{ maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                <div className="glass-panel" style={{ display: 'flex', padding: '0.5rem', borderRadius: '50px', alignItems: 'center' }}>
                    <Search size={20} style={{ marginLeft: '1rem', color: 'var(--text-secondary)' }} />
                    <input
                        type="text"
                        placeholder="Search workers..."
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        style={{
                            flex: 1,
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            padding: '1rem',
                            fontSize: '1.1rem',
                            outline: 'none'
                        }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ borderRadius: '40px', padding: '0.8rem 2rem' }}>
                        {loading ? 'Searching...' : 'Scan / Search'}
                    </button>
                </div>
            </form>

            <div style={{ display: 'grid', gap: '1rem', maxWidth: '800px', margin: '0 auto' }}>
                <AnimatePresence>
                    {results.map((worker, index) => (
                        <motion.div
                            key={worker.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <WorkerCard worker={worker} />
                        </motion.div>
                    ))}
                </AnimatePresence>

                {searched && results.length === 0 && !loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}
                    >
                        No workers found.
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
