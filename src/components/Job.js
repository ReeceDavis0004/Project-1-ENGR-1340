import React from 'react';
import feather from 'feather-icons';

const JobCard = ({ job, isAuthenticated, currentUser, isApplied, onApply, apiBaseUrl }) => {
	React.useEffect(() => {
		feather.replace();
	}, []);

	return (
		<div className="card">
			<div className="card-header">
				{console.log(job)}
				<img src={job.logo_url && job.logo_url.startsWith('http') ? job.logo_url : `${apiBaseUrl}${job.logo_url}`} className="company-logo-sm" alt={`${job.company} logo`} />
				<div><h3 className="card-title">{job.title}</h3><p className="card-subtitle">{job.company}</p></div>
			</div>
			<div className="card-body"><p>{job.description}</p></div>
			<div className="card-footer">
				<div className="info-tag"><i data-feather="map-pin"></i><span>{job.location}</span></div>
				<button className="btn btn-primary" disabled={!isAuthenticated || isApplied || currentUser?.type === 'company'} onClick={() => onApply(job.id)}>
					{isApplied ? 'Applied' : (isAuthenticated ? (currentUser?.type === 'company' ? 'Companies Cannot Apply' : 'Apply Now') : 'Log in to Apply')}
				</button>
			</div>
		</div>
	);
};

export default JobCard;
