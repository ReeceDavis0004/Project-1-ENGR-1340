import React, { useState } from 'react';
import { apiCall } from '../api';

const SubscriptionsPage = ({ currentUser, token, onSubscriptionUpdate }) => {
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState('');

	const tiers = [
		{ name: 'Pro', price: '$9.99/mo', color: '#cd7f32', features: ['Priority application placement', 'Custom profile border', 'Direct messaging recruiters'] },
		{ name: 'Ultimate', price: '$19.99/mo', color: '#c0c0c0', features: ['All Pro features', 'See who viewed your profile', 'Advanced analytics'] },
		{ name: 'Elite', price: '$29.99/mo', color: '#ffd700', features: ['All Ultimate features', 'Personalized job recommendations', 'Monthly resume review'] },
	];

	const handleSubscribe = async (tierName) => {
		setIsLoading(true);
		setMessage('');
		try {
			const result = await apiCall('/subscribe', 'PUT', { tier: tierName }, token);
			onSubscriptionUpdate(result.token);
			setMessage(`Successfully subscribed to the ${tierName} tier!`);
		} catch (error) {
			setMessage(`Failed to subscribe. ${error.message}`);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<div className="page-header">
				<h1 className="page-title">Unlock Your Potential</h1>
				<p className="page-subtitle">Choose a plan to stand out and get ahead in your job search.</p>
			</div>

			{message && <p style={{ textAlign: 'center', marginBottom: '1rem' }}>{message}</p>}

			<div className="grid-container">
				{tiers.map(tier => (
					<div className="card" key={tier.name} style={{ borderColor: tier.color }}>
						<div className="card-header">
							<h3 className="card-title" style={{ color: tier.color }}>{tier.name} Tier</h3>
						</div>
						<div className="card-body">
							<h2 style={{ fontSize: '2rem', margin: '0' }}>{tier.price}</h2>
							<ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
								{tier.features.map(feature => <li key={feature}>{feature}</li>)}
							</ul>
						</div>
						<div className="card-footer" style={{ marginTop: 'auto', border: 'none' }}>
							<button
								className="btn btn-primary"
								style={{ width: '100%' }}
								disabled={isLoading || currentUser.subscriptionTier === tier.name}
								onClick={() => handleSubscribe(tier.name)}
							>
								{currentUser.subscriptionTier === tier.name ? 'Current Plan' : 'Select Plan'}
							</button>
						</div>
					</div>
				))}
			</div>
			<div style={{ textAlign: 'center', marginTop: '2rem' }}>
				<button
					className="btn btn-secondary"
					disabled={isLoading || currentUser.subscriptionTier === 'Basic'}
					onClick={() => handleSubscribe('Basic')}
				>
					{currentUser.subscriptionTier === 'Basic' ? 'You are on the Basic plan' : 'Downgrade to Basic'}
				</button>
			</div>
		</div>
	);
};

export default SubscriptionsPage;
