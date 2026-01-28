import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import VideoUpload from '../components/VideoUpload';
import VideoList from '../components/VideoList';
import AdminPanel from '../components/AdminPanel';
import './Dashboard.css';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Connect to Socket.io
        const newSocket = io('http://localhost:5000');

        newSocket.on('connect', () => {
            console.log('Connected to server');
            newSocket.emit('join', user.id);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [user.id]);

    return (
        <div className="dashboard">
            <nav className="dashboard-nav">
                <div className="container">
                    <div className="nav-content">
                        <h2>Video Platform</h2>
                        <div className="nav-user">
                            <span className="user-info">
                                <strong>{user.username}</strong>
                                <span className={`badge badge-${user.role === 'admin' ? 'error' : user.role === 'editor' ? 'info' : 'warning'}`}>
                                    {user.role}
                                </span>
                            </span>
                            <button onClick={logout} className="btn btn-secondary">
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="dashboard-content container">
                {user.role === 'admin' && (
                    <section className="admin-section">
                        <AdminPanel />
                    </section>
                )}

                {(user.role === 'editor' || user.role === 'admin') && (
                    <section className="upload-section">
                        <VideoUpload socket={socket} />
                    </section>
                )}

                <section className="videos-section">
                    <VideoList socket={socket} />
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
