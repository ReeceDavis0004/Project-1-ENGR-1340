import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentCard from '../components/Student';

const StudentsPage = ({ students, isLoading, apiBaseUrl }) => {
	const [studentSearchQuery, setStudentSearchQuery] = useState('');
	const navigate = useNavigate();

	const filteredStudents = students.filter(student =>
		student.name.toLowerCase().includes(studentSearchQuery.toLowerCase())
	);

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
