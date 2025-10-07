import React, { useState, useEffect } from 'react';
import feather from 'feather-icons';

const AuthModal = ({ mode, onClose, onSwitchMode, onSubmit }) => {
	const [formData, setFormData] = useState({ name: '', email: '', password: '' });
	const [accountType, setAccountType] = useState('student');
	const [error, setError] = useState('');

	useEffect(() => {
		feather.replace();
	}, [accountType]);

	const handleMicrosoftLogin = () => {
		// Corrected: Use the full URL for the API server
		window.location.href = `http://localhost:3001/api/auth/microsoft`;
	};

	const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError('');
		try {
			await onSubmit({ ...formData, accountType: 'company' });
		} catch (err) {
			setError(err.message || 'An unexpected error occurred.');
		}
	};

	const isLogin = mode === 'login';

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal-content" onClick={e => e.stopPropagation()}>
				<div className="modal-header">
					<h2 className="modal-title">{isLogin ? 'Log In' : 'Sign Up'}</h2>
					<button className="close-button" onClick={onClose}><i data-feather="x"></i></button>
				</div>
				<div className="account-type-toggle">
					<label><input type="radio" name="accountType" value="student" checked={accountType === 'student'} onChange={() => setAccountType('student')} /> Student</label>
					<label><input type="radio" name="accountType" value="company" checked={accountType === 'company'} onChange={() => setAccountType('company')} /> Company</label>
				</div>

				{accountType === 'student' ? (
					<div style={{ textAlign: 'center' }}>
						<p>Students, please sign in using your official Texas Tech Outlook account.</p>
						<button className="btn btn-microsoft" onClick={handleMicrosoftLogin}>
							<svg width="20" height="20" viewBox="0 0 21 21"><path fill="#f25022" d="M1 1h9v9H1z"></path><path fill="#00a4ef" d="M1 11h9v9H1z"></path><path fill="#7fba00" d="M11 1h9v9h-9z"></path><path fill="#ffb900" d="M11 11h9v9h-9z"></path></svg>
							Sign in with Microsoft
						</button>
					</div>
				) : (
					<form onSubmit={handleSubmit}>
						{!isLogin && <div className="form-group"><label>Company Name</label><input type="text" name="name" onChange={handleChange} required /></div>}
						<div className="form-group"><label>Email</label><input type="email" name="email" onChange={handleChange} required /></div>
						<div className="form-group"><label>Password</label><input type="password" name="password" onChange={handleChange} required /></div>
						{error && <p className="error-message">{error}</p>}
						<div className="modal-footer"><button type="submit" className="btn btn-primary">{isLogin ? 'Log In' : 'Create Account'}</button></div>
					</form>
				)}
				<div className="toggle-auth">
					{isLogin ? "Don't have an account?" : "Already have an account?"}
					<button onClick={onSwitchMode}>{isLogin ? 'Sign Up' : 'Log In'}</button>
				</div>
			</div>
		</div>
	);
};

export default AuthModal;

