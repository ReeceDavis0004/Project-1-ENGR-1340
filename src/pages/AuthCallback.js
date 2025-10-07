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
			// no token was found when trying to login, we can pretty much assume they cancelled the request
			navigate('/');
		}
	}, [location, navigate, onLoginSuccess]);

	return <div>Logging you in...</div>;
};

export default AuthCallbackPage;
