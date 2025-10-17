import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthCallbackPage = ({ onLoginSuccess }) => {
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const token = params.get('token');
		if (token) {
			onLoginSuccess(token);
		} else {
			navigate('/');
		}
	}, [location, navigate, onLoginSuccess]);

	return <div>Logging you in...</div>;
};

export default AuthCallbackPage;
