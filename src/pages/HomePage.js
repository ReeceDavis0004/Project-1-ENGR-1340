import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Server } from 'react-feather';

const HomePage = () => {
	const navCards = [
		{
			title: 'Students',
			description: 'Discover your fellow students',
			link: '/students',
			icon: <Users size={48} />,
			color: '#CC0000'
		},
		{
			title: 'Jobs',
			description: 'Explore job offerings from our partners',
			link: '/jobs',
			icon: <Briefcase size={48} />,
			color: '#18191A'
		},
		{
			title: 'Companies',
			description: 'Learn about the companies sponsoring us.',
			link: '/companies',
			icon: <Server size={48} />,
			color: '#FFB800'
		}
	];

	return (
		<div className="home-page">
			<section className="hero-section">
				<h1>Welcome to Red Raider JobConnect</h1>
				<p className="subtitle">Platform for Texas Tech students to meet their future employers</p>
			</section>

			<section className="about-us">
				<h2>About Us</h2>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer mi erat, lobortis ut nisi eget, pulvinar porta dui. Nulla facilisi. Donec non orci ipsum. Suspendisse potenti. Sed vel dolor quam. Pellentesque justo lectus, scelerisque sit amet justo id, sodales tincidunt justo. Nunc blandit a tortor et vehicula.
				</p>
			</section>

			<section className="navigation-cards">
				{navCards.map(card => (
					<Link to={card.link} key={card.title} className="nav-card">
						<div className="nav-card-icon" style={{ backgroundColor: card.color }}>
							{card.icon}
						</div>
						<h3>{card.title}</h3>
						<p>{card.description}</p>
					</Link>
				))}
			</section>
		</div>
	);
};

export default HomePage;
