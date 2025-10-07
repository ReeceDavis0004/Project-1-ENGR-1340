import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import feather from 'feather-icons';

const ApplicantsModal = ({ job, applicants, isLoading, onClose, apiBaseUrl }) => {
	const navigate = useNavigate();

	useEffect(() => {
		feather.replace();
	}, [isLoading]);

	const viewProfile = (studentId) => {
		onClose(); // Close modal before navigating
		navigate(`/profile/${studentId}`);
	};

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
				<div className="modal-header">
					<h2 className="modal-title">Applicants for {job.title}</h2>
					<button className="close-button" onClick={onClose}><i data-feather="x"></i></button>
				</div>
				<div>
					{isLoading ? (
						<p>Loading applicants...</p>
					) : applicants.length > 0 ? (
						applicants.map(applicant => (
							<div key={applicant.id} className="job-listing" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
								<div>
									<div className="job-listing-title">{applicant.name}</div>
									<div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
										{applicant.major || 'Undeclared'} - {applicant.year || 'N/A'}
									</div>
								</div>
								<button className="btn btn-secondary" onClick={() => viewProfile(applicant.id)}>View Profile</button>
							</div>
						))
					) : (
						<p>There are no applicants for this position yet.</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default ApplicantsModal;
