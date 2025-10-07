import React from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyCard from '../components/Company';

const CompaniesPage = ({ companies, isLoading, apiBaseUrl }) => {
	const navigate = useNavigate();

	const onSelectCompany = (id) => navigate(`/company/${id}`);

	return (
		<>
			<div className="page-header"><h1 className="page-title">Partner Companies</h1></div>
			{isLoading ? <p>Loading companies...</p> : (
				<div className="grid-container">
					{companies.map(c => <CompanyCard key={c.id} company={c} onSelectCompany={onSelectCompany} apiBaseUrl={apiBaseUrl} />)}
				</div>
			)}
		</>
	);
};

export default CompaniesPage;
