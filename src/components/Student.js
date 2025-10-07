import React from 'react';

const StudentCard = ({ student, onViewProfile, apiBaseUrl }) => (
	<div className="card clickable" onClick={() => onViewProfile(student.id)}>
		<div className="profile-card-content">
			<img src={student.profilePic.startsWith('http') ? student.profilePic : `${apiBaseUrl}${student.profilePic}`} alt={student.name} />
			<h3 className="profile-name">{student.name}</h3>
			<p className="profile-major">{student.major || 'Undeclared'} - {student.year || 'N/A'}</p>
			<div className="profile-skills">
				{(student.skills || []).slice(0, 3).map(skill => <span key={skill} className="skill-tag">{skill}</span>)}
			</div>
		</div>
	</div>
);

export default StudentCard;
