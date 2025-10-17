import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
	return (
		<footer className="app-footer">
			<div className="footer-content">
				<div className="footer-logo">
					<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Texas_Tech_Athletics_logo.svg/1749px-Texas_Tech_Athletics_logo.svg.png" alt="Texas Tech Logo" />
					<span>Red Raider Connect</span>
				</div>
				<div className="footer-links">
					<Link to="/students">Students</Link>
					<Link to="/jobs">Jobs</Link>
					<Link to="/companies">Companies</Link>
				</div>
				<div className="footer-copyright">
					<p>&copy; {new Date().getFullYear()} Red Raider JobConnect. All Rights Reserved.</p>
					<p>A project for Texas Tech University in ENGR-1340.</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
