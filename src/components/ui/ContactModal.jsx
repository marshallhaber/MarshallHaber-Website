import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ContactModal.module.css';

const SERVICE_OPTIONS = ['Brand Strategy', 'Identity', 'Website', 'Product design', 'Other'];

const INITIAL = {
    services: new Set(),
    name: '',
    email: '',
    phone: '',
    message: '',
    stage: 'form',
};

export default function ContactModal({ isOpen, onClose }) {
    const [services, setServices] = useState(INITIAL.services);
    const [name, setName] = useState(INITIAL.name);
    const [email, setEmail] = useState(INITIAL.email);
    const [phone, setPhone] = useState(INITIAL.phone);
    const [message, setMessage] = useState(INITIAL.message);
    const [stage, setStage] = useState(INITIAL.stage);
    const prevOverflow = useRef('');

    const isPristine =
        services.size === 0 && !name && !email && !phone && !message;

    const finalClose = () => {
        onClose();
    };

    const requestClose = () => {
        if (stage === 'submitted' || isPristine) {
            finalClose();
        } else {
            setStage('confirm-close');
        }
    };

    // Reset state whenever the modal closes so re-opening is clean.
    useEffect(() => {
        if (!isOpen) {
            setServices(new Set());
            setName('');
            setEmail('');
            setPhone('');
            setMessage('');
            setStage('form');
        }
    }, [isOpen]);

    // Body-scroll lock + Escape handler. Preserves original overflow value.
    useEffect(() => {
        if (!isOpen) return;
        prevOverflow.current = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleEsc = (e) => {
            if (e.key !== 'Escape') return;
            if (stage === 'confirm-close') {
                finalClose();
            } else {
                requestClose();
            }
        };
        document.addEventListener('keydown', handleEsc);

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = prevOverflow.current;
        };
    }, [isOpen, stage, isPristine]); // eslint-disable-line react-hooks/exhaustive-deps

    const toggleService = (opt) => {
        setServices((prev) => {
            const next = new Set(prev);
            if (next.has(opt)) next.delete(opt);
            else next.add(opt);
            return next;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStage('loading');
        const payload = {
            services: Array.from(services),
            name,
            email,
            phone,
            message,
        };
        try {
            const res = await fetch('/api/admin/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error('Server error');
        } catch (err) {
            console.error('Error submitting form:', err);
        }
        setStage('submitted');
    };

    const handleBackdropClick = () => {
        if (stage === 'confirm-close') return; // no-op during confirm
        requestClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className={styles.overlay}>
                    <motion.div
                        className={styles.backdrop}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleBackdropClick}
                        transition={{ duration: 0.35 }}
                    />

                    <motion.div
                            className={`${styles.modal} ${stage === 'confirm-close' ? styles.modalFaded : ''}`}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="contact-modal-title"
                            aria-hidden={stage === 'confirm-close'}
                            initial={{ opacity: 0, scale: 0.96, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 8 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                        >
                            {stage === 'loading' ? (
                                <div className={styles.successBody}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '2rem 0' }}>
                                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: 'spin 1s linear infinite' }}>
                                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
                                        </svg>
                                        <p style={{ fontSize: '1rem', opacity: 0.6 }}>Sending…</p>
                                    </div>
                                    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                                </div>
                            ) : stage === 'submitted' ? (
                                <div className={styles.successBody}>
                                    <h2 className={styles.successHeading}>Thanks — we'll be in touch.</h2>
                                    <p className={styles.successText}>
                                        Your project request has landed in our inbox.
                                    </p>
                                    <button
                                        type="button"
                                        className={styles.submitBtn}
                                        onClick={finalClose}
                                    >
                                        Close
                                    </button>
                                </div>
                            ) : (
                                <>
                                        <div className={styles.headerRow} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                            <h2 id="contact-modal-title" className={styles.heading}>
                                                How Can We Help?
                                            </h2>
                                            <p style={{ marginTop: '8px', fontSize: '1.2rem', fontFamily: "'PP Mori', sans-serif" }}>
                                                Briefly describe your project, goals or challenge.
                                            </p>
                                        </div>
                                        <div className={styles.closeGroup} style={{ position: 'absolute', top: '32px', right: '32px' }}>
                                            <button
                                                type="button"
                                                className={styles.closeIconBtn}
                                                onClick={requestClose}
                                                aria-label="Close"
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                                                </svg>
                                            </button>

                                        </div>

                                    <form onSubmit={handleSubmit}>
                                        <div className={styles.section}>
                                            <label className={styles.sectionLabel}>
                                                What can we do for you?
                                            </label>
                                            <div className={styles.chipRow}>
                                                {SERVICE_OPTIONS.map((opt) => {
                                                    const active = services.has(opt);
                                                    return (
                                                        <motion.button
                                                            key={opt}
                                                            type="button"
                                                            className={`${styles.chip} ${active ? styles.chipActive : ''}`}
                                                            onClick={() => toggleService(opt)}
                                                            aria-pressed={active}
                                                            whileTap={{ scale: 0.96 }}
                                                        >
                                                            {opt}
                                                        </motion.button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className={styles.section}>
                                            <label className={styles.sectionLabel}>Your information</label>
                                            <div className={styles.inputGrid}>
                                                <input
                                                    type="text"
                                                    className={styles.inputPill}
                                                    placeholder="Your name"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    required
                                                    aria-label="Your name"
                                                />
                                                <input
                                                    type="email"
                                                    className={styles.inputPill}
                                                    placeholder="Your email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                    aria-label="Your email"
                                                />
                                            </div>
                                            <textarea
                                                className={styles.textareaBox}
                                                placeholder=""
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                aria-label="Project details"
                                            />
                                        </div>

                                        <div className={styles.footerRow}>
                                            <div className={styles.modalPhoneText}>
                                                Phone: +1 212.494.9052
                                            </div>
                                            <button type="submit" className={styles.submitBtn}>
                                                Submit
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    <AnimatePresence>
                        {stage === 'confirm-close' && (
                            <motion.div
                                key="confirm-card"
                                className={styles.confirmCard}
                                role="alertdialog"
                                aria-modal="true"
                                aria-labelledby="contact-confirm-title"
                                initial={{ opacity: 0, scale: 0.92 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ type: 'spring', damping: 26, stiffness: 280 }}
                            >
                                <span className={styles.confirmDot} aria-hidden="true" />
                                <h3 id="contact-confirm-title" className={styles.confirmHeading}>
                                    Forgot to <br/> press Submit?
                                </h3>
                                <div className={styles.confirmActions}>
                                    <button
                                        type="button"
                                        className={styles.confirmLinkBtn}
                                        onClick={() => setStage('form')}
                                    >
                                        Back to form
                                    </button>
                                    <button
                                        type="button"
                                        className={styles.confirmLinkBtn}
                                        onClick={finalClose}
                                    >
                                        Close anyway
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </AnimatePresence>
    );
}
