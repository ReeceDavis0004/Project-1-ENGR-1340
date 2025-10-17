import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentCard from '../components/Student';

const StudentsPage = ({ students, isLoading, apiBaseUrl }) => {
	const [studentSearchQuery, setStudentSearchQuery] = useState('');
	const navigate = useNavigate();

	const normalizeName = (name) => {
		const lower = name.toLowerCase().trim();
		if (lower.includes(',')) {
			const [last, first] = lower.split(',').map(s => s.trim());
			return `${first} ${last}`;
		}
		return lower;
	};

	const filteredStudents = students.filter(student => {
		const normalizedStudentName = normalizeName(student.name);
		const normalizedQuery = studentSearchQuery.toLowerCase().trim();

		return normalizedStudentName.includes(normalizedQuery) || student.name.toLowerCase().includes(normalizedQuery)

	});

	const onViewProfile = (id) => navigate(`/profile/${id}`);

	return (
		<>
			<div className="page-header"><h1 className="page-title">Find Fellow Red Raiders</h1></div>
			<div className="search-bar-container">
				<input
					type="text"
					placeholder="Search for a student by name..."
					value={studentSearchQuery}
					onChange={(e) => setStudentSearchQuery(e.target.value)}
				/>
			</div>
			{isLoading ? <p>Loading students...</p> : (
				<div className="grid-container">
					{filteredStudents.map(s => <StudentCard key={s.id} student={s} onViewProfile={onViewProfile} apiBaseUrl={apiBaseUrl} />)}
				</div>
			)}
		</>
	);
};

export default StudentsPage;
