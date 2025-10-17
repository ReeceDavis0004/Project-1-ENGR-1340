import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ isAuthenticated, currentUser, onLoginClick, onSignupClick, onLogout }) => {
	const location = useLocation();
	const activePage = location.pathname.split('/')[1] || 'students';

	const navItems = [
		{ path: '/', name: 'Students', id: 'students' },
		{ path: '/jobs', name: 'Jobs', id: 'jobs' },
		{ path: '/companies', name: 'Companies', id: 'companies' },
	];

	return (
		<header className="app-header">
			<Link className="logo-container" to="/">
				<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Texas_Tech_Athletics_logo.svg/1749px-Texas_Tech_Athletics_logo.svg.png" alt="Texas Tech Logo" />
				<span>Red Raider JobConnect</span>
			</Link>
			<nav className="nav-links">
				{navItems.map(item => (
					<Link key={item.id} to={item.path} className={`nav-link ${activePage === item.id ? 'active' : ''}`}>
						{item.name}
					</Link>
				))}
				{isAuthenticated && currentUser?.type === 'student' && (
					<>
						<Link to="/applications" className={`nav-link ${activePage === 'applications' ? 'active' : ''}`}>My Applications</Link>
						<Link to={`/profile/${currentUser.id}`} className={`nav-link ${activePage === 'profile' ? 'active' : ''}`}>My Profile</Link>
					</>
				)}
				{isAuthenticated && currentUser?.type === 'company' && (
					<Link to={`/company/${currentUser.companyId}`} className={`nav-link ${activePage === 'company' ? 'active' : ''}`}>My Company Page</Link>
				)}
			</nav>
			<div className="user-actions">
				{isAuthenticated ? (
					currentUser?.type !== 'company' ?

						<>
							<span className="user-greeting">Welcome, {currentUser?.name.split(', ')[1]}!</span>
							<button className="btn btn-secondary" onClick={onLogout}>Log Out</button>
						</>

						:

						<>
							<span className="user-greeting">Welcome, {currentUser?.name.replace(' Rep', '')}!</span>
							<button className="btn btn-secondary" onClick={onLogout}>Log Out</button>
						</>

				) : (
					<>
						<button className="btn btn-secondary" onClick={onLoginClick}>Log In</button>
						<button className="btn btn-primary" onClick={onSignupClick}>Sign Up</button>
					</>
				)}
			</div>
		</header>
	);
};

export default Header;

