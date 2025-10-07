import React, { useState, useEffect } from 'react';
import feather from 'feather-icons';
import JobCard from '../components/Job';

const JobsPage = ({ isAuthenticated, currentUser, appliedJobs, handleApply, jobs, isLoading, apiBaseUrl }) => {
	const [jobTypeFilter, setJobTypeFilter] = useState('All');

	const filteredJobs = jobs.filter(job => jobTypeFilter === 'All' || job?.type === jobTypeFilter);

	useEffect(() => {
		feather.replace();
	}, [isLoading, jobTypeFilter, jobs]);

	return (
		<div>
			<div className="page-header">
				<h1 className="page-title">Opportunities</h1>
			</div>
			<div className="filter-group">
				<button className={jobTypeFilter === 'All' ? 'active' : ''} onClick={() => setJobTypeFilter('All')}>All</button>
				<button className={jobTypeFilter === 'Internship' ? 'active' : ''} onClick={() => setJobTypeFilter('Internship')}>Internship</button>
				<button className={jobTypeFilter === 'Full-time' ? 'active' : ''} onClick={() => setJobTypeFilter('Full-time')}>Full-time</button>
				<button className={jobTypeFilter === 'Part-time' ? 'active' : ''} onClick={() => setJobTypeFilter('Part-time')}>Part-time</button>
			</div>

			{isLoading ? <p>Loading jobs...</p> : filteredJobs.length > 0 ? (
				<div className="grid-container">
					{filteredJobs.map(job => <JobCard key={job.id} job={job} isAuthenticated={isAuthenticated} currentUser={currentUser} isApplied={appliedJobs.includes(job.id)} onApply={handleApply} apiBaseUrl={apiBaseUrl} />)}
				</div>
			) : (<p>No job openings match the current filters.</p>)}
		</div>
	);
}

export default JobsPage;
