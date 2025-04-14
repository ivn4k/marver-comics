import React, { useEffect } from 'react';
import styles from './Toast.module.css';

interface ToastProps {
    message: string;
    type?: 'error' | 'success' | 'info';
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
    message, 
    type = 'error', 
    onClose, 
    duration = 3000 
}) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [onClose, duration]);

    return (
        <div className={`${styles.toast} ${styles[type]}`}>
            <span className={styles.message}>{message}</span>
            <button className={styles.closeButton} onClick={onClose}>
                ×
            </button>
        </div>
    );
};

export default Toast;