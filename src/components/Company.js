import React from 'react';
import feather from 'feather-icons';

const CompanyCard = ({ company, onSelectCompany, apiBaseUrl }) => {
	React.useEffect(() => {
		feather.replace();
	}, []);

	return (
		<div className="card clickable" onClick={() => onSelectCompany(company.id)}>
			<div className="card-header">
				<img src={company.profilePic.startsWith('http') ? company.profilePic : `${apiBaseUrl}${company.profilePic}`} className="company-logo-sm" alt={`${company.name} logo`} />
				<div><h3 className="card-title">{company.name}</h3><p className="card-subtitle">{company.industry}</p></div>
			</div>
			<div className="card-body"><p>{company.description}</p></div>
			<div className="card-footer">
				<div className="info-tag"><i data-feather="map-pin"></i><span>{company.location}</span></div>
			</div>
		</div>
	);
};

export default CompanyCard;
