import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import feather from 'feather-icons';
import { apiCall } from '../api';
import ApplicantsModal from '../components/ApplicantsModal'; // Import the new component

const CompanyPage = ({ token, currentUser, onDataUpdate, apiBaseUrl }) => {
	const { companyId } = useParams();
	const navigate = useNavigate();
	const [company, setCompany] = useState(null);
	const [jobs, setJobs] = useState([]);
	const [isEditing, setIsEditing] = useState(false);
	const [editingJob, setEditingJob] = useState(undefined);
	const [companyFormData, setCompanyFormData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [newLogo, setNewLogo] = useState(null);

	// New state for applicants modal
	const [viewingApplicantsFor, setViewingApplicantsFor] = useState(null); // Will hold the job object
	const [applicants, setApplicants] = useState([]);
	const [isLoadingApplicants, setIsLoadingApplicants] = useState(false);

	const isOwner = currentUser?.companyId === parseInt(companyId);

	useEffect(() => {
		const fetchCompanyData = async () => {
			try {
				setIsLoading(true);
				const data = await apiCall(`/companies/${companyId}`);
				setCompany(data.company);
				setJobs(data.jobs);
				setCompanyFormData(data.company);
			} catch (error) {
				console.error("Failed to fetch company data", error);
				navigate('/companies');
			} finally {
				setIsLoading(false);
			}
		};
		fetchCompanyData();
	}, [companyId, navigate]);

	useEffect(() => {
		feather.replace();
	}, [isLoading, isEditing, editingJob, jobs, viewingApplicantsFor]);

	if (isLoading || !company) return <p>Loading company page...</p>;

	const handleViewApplicants = async (job) => {
		setViewingApplicantsFor(job);
		setIsLoadingApplicants(true);
		try {
			const data = await apiCall(`/jobs/${job.id}/applicants`, 'GET', null, token);
			setApplicants(data);
		} catch (error) {
			console.error("Could not fetch applicants", error);
			alert("Could not fetch applicants.");
		} finally {
			setIsLoadingApplicants(false);
		}
	};

	const handleCompanyChange = (e) => setCompanyFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

	const handleFileChange = (e) => {
		if (e.target.files[0] && e.target.files[0].size < 5 * 1024 * 1024) {
			setNewLogo(e.target.files[0]);
		} else {
			alert("File is too large! Maximum size is 5MB.");
			e.target.value = null;
		}
	}

	const handleCompanySubmit = async (e) => {
		e.preventDefault();
		try {
			if (newLogo) {
				const uploadFormData = new FormData();
				uploadFormData.append('profilePic', newLogo);
				await apiCall('/upload', 'POST', uploadFormData, token);
			}
			await apiCall(`/companies/${company.id}`, 'PUT', companyFormData, token);
			setIsEditing(false);
			onDataUpdate();
		} catch (error) {
			console.error("Failed to update company", error);
		}
	};

	const onAddJob = async (jobData) => {
		const newJob = await apiCall('/jobs', 'POST', jobData, token);
		setJobs(prev => [...prev, newJob]);
	};
	const onUpdateJob = async (jobData) => {
		const updatedJob = await apiCall(`/jobs/${jobData.id}`, 'PUT', jobData, token);
		setJobs(prev => prev.map(j => j.id === jobData.id ? { ...j, ...updatedJob } : j));
	};
	const onDeleteJob = async (jobId) => {
		if (window.confirm("Are you sure you want to delete this job?")) {
			await apiCall(`/jobs/${jobId}`, 'DELETE', null, token);
			setJobs(prev => prev.filter(j => j.id !== jobId));
		}
	};

	const JobEditorModal = ({ job, onClose, onSave }) => {
		const [jobFormData, setJobFormData] = useState(job || { title: '', type: 'Internship', location: company.location, description: '' });
		const isNew = !job;

		const handleChange = (e) => setJobFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
		const handleSubmit = (e) => {
			e.preventDefault();
			onSave(jobFormData, isNew);
			onClose();
		}

		return (
			<div className="modal-overlay" onClick={onClose}>
				<div className="modal-content" onClick={e => e.stopPropagation()}>
					<div className="modal-header">
						<h2 className="modal-title">{isNew ? 'Add New Job' : 'Edit Job'}</h2>
						<button className="close-button" onClick={onClose}><i data-feather="x"></i></button>
					</div>
					<form onSubmit={handleSubmit}>
						<div className="form-group"><label>Job Title</label><input type="text" name="title" value={jobFormData.title} onChange={handleChange} required /></div>
						<div className="form-group"><label>Location</label><input type="text" name="location" value={jobFormData.location} onChange={handleChange} required /></div>
						<div className="form-group"><label>Job Type</label>
							<select name="type" value={jobFormData.type} onChange={handleChange}>
								<option>Internship</option><option>Full-time</option><option>Part-time</option>
							</select>
						</div>
						<div className="form-group"><label>Description</label><textarea name="description" rows="4" value={jobFormData.description} onChange={handleChange} required /></div>
						<div className="modal-footer"><button type="submit" className="btn btn-primary">Save Job</button></div>
					</form>
				</div>
			</div>
		);
	};

	return (
		<div className="company-page">
			<a href="#/" onClick={(e) => { e.preventDefault(); navigate(-1); }} style={{ marginBottom: '1rem', display: 'inline-block' }}> &larr; Back</a>
			{!isEditing ? (
				<div className="profile-header company-header">
					<img src={company.logo_url && company.logo_url.startsWith('http') ? company.logo_url : `${apiBaseUrl}${company.logo_url}`} alt={company.name} />
					<div className="profile-info">
						<h1>{company.name}</h1>
						<p>{company.industry}</p>
						<p>{company.location}</p>
						{isOwner && <div className="profile-actions"><button onClick={() => setIsEditing(true)} className="btn btn-primary">Edit Profile</button></div>}
					</div>
				</div>
			) : (
				<div className="profile-details">
					<h2>Edit Company Profile</h2>
					<form onSubmit={handleCompanySubmit}>
						<div className="form-group"><label>Company Logo (Max 5MB)</label><input type="file" accept="image/*" onChange={handleFileChange} /></div>
						<div className="form-group"><label>Company Name</label><input name="name" value={companyFormData.name} onChange={handleCompanyChange} /></div>
						<div className="form-group"><label>Industry</label><input name="industry" value={companyFormData.industry} onChange={handleCompanyChange} /></div>
						<div className="form-group"><label>Location</label><input name="location" value={companyFormData.location} onChange={handleCompanyChange} /></div>
						<div className="form-group"><label>Description</label><textarea name="description" rows="4" value={companyFormData.description} onChange={handleCompanyChange}></textarea></div>
						<button type="submit" className="btn btn-primary">Save Changes</button>
						<button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)} style={{ marginLeft: '1rem' }}>Cancel</button>
					</form>
				</div>
			)}

			<div className="company-details">
				{!isEditing && <p>{company.description}</p>}
				<div className="details-header" style={{ marginTop: isEditing ? '2rem' : '0' }}>
					<h3>Job Openings</h3>
					{isOwner && <button onClick={() => setEditingJob(null)} className="btn btn-primary">Add Job</button>}
				</div>
				{jobs.length > 0 ? jobs.map(job => (
					<div key={job.id} className="job-listing">
						<div className="job-listing-header">
							<div>
								<div className="job-listing-title">{job.title}</div>
								<div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{job.type} - {job.location}</div>
							</div>
							{isOwner && (
								<div>
									<button onClick={() => handleViewApplicants(job)} className="btn btn-secondary" style={{ marginRight: '0.5rem' }}>View Applicants</button>
									<button onClick={() => setEditingJob(job)} className="btn-icon"><i data-feather="edit-2"></i></button>
									<button onClick={() => onDeleteJob(job.id)} className="btn-icon"><i data-feather="trash-2"></i></button>
								</div>
							)}
						</div>
						<p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{job.description}</p>
					</div>
				)) : <p>This company has no active job openings.</p>}
			</div>

			{editingJob !== undefined && <JobEditorModal
				job={editingJob}
				onClose={() => setEditingJob(undefined)}
				onSave={(jobData, isNew) => {
					if (isNew) onAddJob(jobData);
					else onUpdateJob(jobData);
				}}
			/>}

			{viewingApplicantsFor && <ApplicantsModal
				job={viewingApplicantsFor}
				applicants={applicants}
				isLoading={isLoadingApplicants}
				onClose={() => setViewingApplicantsFor(null)}
				apiBaseUrl={apiBaseUrl}
			/>}
		</div>
	)
};

export default CompanyPage;

