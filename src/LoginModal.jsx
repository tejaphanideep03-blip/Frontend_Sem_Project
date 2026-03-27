import React, { useState } from 'react';
import './LoginModal.css';

const LoginModal = ({
    isOpen,
    onClose,
    onLoginSuccess,
    initialView = 'signin'
}) => {
    const [view, setView] = useState(initialView);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    React.useEffect(() => {
        if (isOpen) {
            setView(initialView);
            setEmail('');
            setPassword('');
            setName('');
        }
    }, [initialView, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!email || !password || (view === 'signup' && !name)) {
            alert('Please fill in all required fields.');
            return;
        }

        // Load existing users from localStorage
        const users = JSON.parse(localStorage.getItem('antigravity_users') || '[]');

        if (view === 'signup') {
            const userExists = users.some(u => u.email === email);
            if (userExists) {
                alert('An account with this email already exists. Please sign in.');
                return;
            }

            const newUser = { name, email, password };
            users.push(newUser);
            localStorage.setItem('antigravity_users', JSON.stringify(users));
            
            onLoginSuccess(newUser);
            alert('Account created and logged in successfully!');
            onClose();
        } else {
            const user = users.find(u => u.email === email);
            if (!user) {
                alert('No account found with this email. Please sign up first.');
                return;
            }

            if (user.password !== password) {
                alert('Incorrect password. Please try again.');
                return;
            }

            onLoginSuccess(user);
            alert('Logged in successfully!');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="overlay"
            onClick={onClose}
        >
            <div
                className="modal"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="close"
                    onClick={onClose}
                >
                    &times;
                </button>
                <div className="head">
                    <h2>
                        {view === 'signin' ? 'Sign In' : 'Sign Up'}
                    </h2>
                    <p>
                        {view === 'signin'
                            ? 'Welcome back! Please enter your details.'
                            : 'Create an account to get started.'}
                    </p>
                </div>
                <form
                    className="form"
                    onSubmit={handleSubmit}
                >
                    {view === 'signup' && (
                        <div className="box">
                            <label>Full Name</label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="box">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="box">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn"
                    >
                        {view === 'signin' ? 'Sign In' : 'Create Account'}
                    </button>
                </form>
                <div className="foot">
                    <p>
                        {view === 'signin'
                            ? "Don't have an account?"
                            : "Already have an account?"}{' '}
                        <span
                            onClick={() => setView(view === 'signin' ? 'signup' : 'signin')}
                        >
                            {view === 'signin' ? 'Sign Up' : 'Sign In'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
