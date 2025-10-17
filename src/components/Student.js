import React from 'react';

const StudentCard = ({ student, onViewProfile, apiBaseUrl }) => {
	const displayedSkills = (student.skills || []).slice(0, 3);
	const extraSkillsCount = (student.skills?.length || 0) - displayedSkills.length;

	return (
		<div className="card clickable" onClick={() => onViewProfile(student.id)}>
			<div className="profile-card-content">
				<img
					src={
						student.profilePic?.startsWith('http')
							? student.profilePic
							: `${apiBaseUrl}${student.profilePic}`
					}
					alt={student.name}
				/>
				<h3 className="profile-name">{student.name}</h3>
				<p className="profile-major">
					{student.major || 'Undeclared'} - {student.year || 'N/A'}
				</p>
				<div className="profile-skills">
					{displayedSkills.map(skill => (
						<span key={skill} className="skill-tag">{skill.length > 6 ? skill.slice(0, 5) + "..." : skill}</span>
					))}
					{extraSkillsCount > 0 && (
						<span className="skill-tag extra-skill">+{extraSkillsCount} more</span>
					)}
				</div>
			</div>
		</div>
	);
};

export default StudentCard;
