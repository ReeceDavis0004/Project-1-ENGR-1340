import React from 'react';
import JobCard from '../components/Job';

const ApplicationsPage = ({ currentUser, appliedJobsInfo, isLoading, apiBaseUrl }) => (
	<div>
		<h1 className="page-title">Your Applications</h1>
		{isLoading ? <p>Loading applications...</p> : appliedJobsInfo.length > 0 ? (
			<div className="grid-container">
				{appliedJobsInfo.map(job => <JobCard key={job.id} job={job} isAuthenticated={true} currentUser={currentUser} isApplied={true} onApply={() => { }} apiBaseUrl={apiBaseUrl} />)}
			</div>
		) : (<p>You haven't applied to any jobs yet.</p>)}
	</div>
);

export default ApplicationsPage;
