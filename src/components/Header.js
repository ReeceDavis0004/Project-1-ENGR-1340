import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ isAuthenticated, currentUser, onLoginClick, onSignupClick, onLogout }) => {
	const location = useLocation();
	const activePage = location.pathname.split('/')[1] || 'students';
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	useEffect(() => {
		setIsMenuOpen(false);
	}, [location.pathname]);

	const navItems = [
		{ path: '/students', name: 'Students', id: 'students' },
		{ path: '/jobs', name: 'Jobs', id: 'jobs' },
		{ path: '/companies', name: 'Companies', id: 'companies' },
	];

	if (isAuthenticated && currentUser?.type === 'student') {
		navItems.push({ path: '/subscriptions', name: 'Subscriptions' });
	}

	return (
		<header className="app-header">
			<Link className="logo-container" to="/">
				<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Texas_Tech_Athletics_logo.svg/1749px-Texas_Tech_Athletics_logo.svg.png" alt="Texas Tech Logo" />
				<span>Red Raider JobConnect</span>
			</Link>
			<nav className="nav-links-desktop">
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
							<button className="btn btn-secondary" onClick={onLogout}>Logout</button>
						</>

						:

						<>
							<span className="user-greeting">Welcome, {currentUser?.name.replace(' Rep', '')}!</span>
							<button className="btn btn-secondary" onClick={onLogout}>Logout</button>
						</>

				) : (
					<>
						<button className="btn btn-secondary" onClick={onLoginClick}>Login</button>
					</>
				)}
			</div>


			<div className="menu-button-mobile" onClick={() => setIsMenuOpen(!isMenuOpen)}>
				<i data-feather={isMenuOpen ? "x" : "menu"}></i>
			</div>

			{isMenuOpen && (
				<div className="nav-links-mobile">
					{navItems.map(item => (
						<Link key={item.path} to={item.path} className="nav-link-mobile-item">
							{item.name}
						</Link>
					))}
					<div className="mobile-menu-footer">
						{isAuthenticated ? (
							<button className="btn btn-secondary mobile-menu-btn" onClick={onLogout}>
								Log Out
							</button>
						) : (
							<button className="btn btn-secondary mobile-menu-btn" onClick={onLoginClick}>
								Log In
							</button>
						)}
					</div>
				</div>
			)}

		</header>
	);
};

export default Header;

