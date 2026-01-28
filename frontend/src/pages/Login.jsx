import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'editor'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register(formData.username, formData.email, formData.password, formData.role);
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card glass">
                <div className="login-header">
                    <h1>Video Streaming Platform</h1>
                    <p className="text-muted">
                        {isLogin ? 'Sign in to your account' : 'Create a new account'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {!isLogin && (
                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                name="username"
                                className="form-input"
                                placeholder="Enter username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength={6}
                        />
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label className="form-label">Role</label>
                            <select
                                name="role"
                                className="form-input"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="viewer">Viewer (Read-only)</option>
                                <option value="editor">Editor (Upload & Manage)</option>
                                <option value="admin">Admin (Full Access)</option>
                            </select>
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
                    </button>
                </form>

                <div className="login-footer">
                    <button
                        type="button"
                        className="toggle-btn"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                        }}
                    >
                        {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
