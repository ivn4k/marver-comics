import { useState, useEffect } from 'react';
import { sendTestNotification, requestNotificationPermission, testServerConnection } from '../../utils/serviceWorkerRegistration';

const TestPage: React.FC = () => {
    const [notificationTitle, setNotificationTitle] = useState('Marvel Comics');
    const [notificationBody, setNotificationBody] = useState('Check out our latest comics!');
    const [notificationUrl, setNotificationUrl] = useState('/comics');
    const [serverStatus, setServerStatus] = useState<'checking' | 'available' | 'unavailable'>('checking');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        checkServerStatus();
    }, []);

    const checkServerStatus = async () => {
        setServerStatus('checking');
        const isAvailable = await testServerConnection();
        setServerStatus(isAvailable ? 'available' : 'unavailable');
    };

    const handleSendNotification = async () => {
        setLoading(true);
        setError(null);
        try {
            await sendTestNotification(notificationTitle, notificationBody, notificationUrl);
        } catch (err) {
            setError('Failed to send notification. Make sure the server is running.');
            console.error('Error sending notification:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>PWA Test Page</h1>
            
            <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
                <h2>Server Status</h2>
                <p>
                    Push Notification Server: {' '}
                    {serverStatus === 'checking' && 'Checking...'}
                    {serverStatus === 'available' && <span style={{ color: 'green' }}>Available ✓</span>}
                    {serverStatus === 'unavailable' && <span style={{ color: 'red' }}>Unavailable ✗</span>}
                </p>
                {serverStatus === 'unavailable' && (
                    <div style={{ color: 'red', marginTop: '5px' }}>
                        <p>The notification server is not running. Please start it with:</p>
                        <pre style={{ backgroundColor: '#eee', padding: '5px' }}>cd server && npm run dev</pre>
                    </div>
                )}
                <button 
                    onClick={checkServerStatus}
                    style={{ padding: '5px 10px', marginTop: '5px' }}
                >
                    Refresh Server Status
                </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
                <h2>Notification Permission</h2>
                <button 
                    onClick={() => requestNotificationPermission()}
                    style={{ padding: '10px', margin: '10px 0' }}
                >
                    Request Notification Permission
                </button>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
                <h2>Send Test Notification</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
                    <div>
                        <label htmlFor="title">Title:</label>
                        <input 
                            id="title"
                            type="text" 
                            value={notificationTitle} 
                            onChange={(e) => setNotificationTitle(e.target.value)} 
                            style={{ marginLeft: '10px', width: '300px' }}
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="body">Body:</label>
                        <input 
                            id="body"
                            type="text" 
                            value={notificationBody} 
                            onChange={(e) => setNotificationBody(e.target.value)} 
                            style={{ marginLeft: '10px', width: '300px' }}
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="url">URL:</label>
                        <input 
                            id="url"
                            type="text" 
                            value={notificationUrl} 
                            onChange={(e) => setNotificationUrl(e.target.value)} 
                            style={{ marginLeft: '10px', width: '300px' }}
                        />
                    </div>
                    
                    <button 
                        onClick={handleSendNotification}
                        disabled={serverStatus !== 'available' || loading}
                        style={{ 
                            padding: '10px', 
                            marginTop: '10px',
                            opacity: serverStatus !== 'available' ? 0.5 : 1
                        }}
                    >
                        {loading ? 'Sending...' : 'Send Notification'}
                    </button>
                    
                    {error && (
                        <div style={{ color: 'red', marginTop: '10px' }}>
                            {error}
                        </div>
                    )}
                </div>
            </div>
            
            <div>
                <h2>PWA Information</h2>
                <p>Service Worker Status: {navigator.serviceWorker ? 'Supported' : 'Not Supported'}</p>
                <p>Current Notification Permission: {Notification.permission}</p>
                <p>Is Installed as PWA: {window.matchMedia('(display-mode: standalone)').matches ? 'Yes' : 'No'}</p>
            </div>
        </div>
    );
}

export default TestPage;