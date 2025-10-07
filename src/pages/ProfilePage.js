import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import feather from 'feather-icons';
import { apiCall } from '../api';

const ProfilePage = ({ currentUser, token, onProfileUpdate, apiBaseUrl }) => {
	const { profileId } = useParams();
	const navigate = useNavigate();
	const [student, setStudent] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [newProfilePic, setNewProfilePic] = useState(null);

	useEffect(() => {
		const fetchStudent = async () => {
			try {
				setIsLoading(true);
				const data = await apiCall(`/students/${profileId}`);
				setStudent(data);
				setFormData(data);
			} catch (error) {
				console.error("Failed to fetch profile", error);
				navigate('/'); // Redirect home if profile not found
			} finally {
				setIsLoading(false);
			}
		};
		fetchStudent();
	}, [profileId, navigate]);

	useEffect(() => {
		feather.replace();
	}, [isLoading, isEditing, student]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		const newValue = name === "skills" ? value.split(',').map(s => s.trim()) : value;
		setFormData(prev => ({ ...prev, [name]: newValue }));
	};

	const handleFileChange = (e) => {
		if (e.target.files[0] && e.target.files[0].size < 5 * 1024 * 1024) {
			setNewProfilePic(e.target.files[0]);
		} else {
			alert("File is too large! Maximum size is 5MB.");
			e.target.value = null;
		}
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (newProfilePic) {
				const uploadFormData = new FormData();
				uploadFormData.append('profilePic', newProfilePic);
				await apiCall('/upload', 'POST', uploadFormData, token);
			}

			await apiCall(`/students/${currentUser.id}`, 'PUT', formData, token);
			setIsEditing(false);
			onProfileUpdate();
		} catch (error) {
			console.error("Failed to update profile", error);
		}
	};

	if (isLoading || !student) return <p>Loading profile...</p>;

	const isCurrentUser = currentUser?.id === student.id;

	return (
		<div className="profile-page">
			<a href="#/" onClick={(e) => { e.preventDefault(); navigate(-1); }} style={{ marginBottom: '1rem', display: 'inline-block' }}> &larr; Back</a>
			{!isEditing ? (
				<div>
					<div className="profile-header">
						<img src={student.profilePic.startsWith('http') ? student.profilePic : `${apiBaseUrl}${student.profilePic}`} alt={student.name} />
						<div className="profile-info">
							<h1>{student.name}</h1>
							<p>{student.major || 'Undeclared Major'}</p>
							<p>{student.year || 'N/A'}</p>
							{isCurrentUser && <div className="profile-actions"><button onClick={() => setIsEditing(true)} className="btn btn-primary">Edit Profile</button></div>}
						</div>
					</div>
					<div className="profile-details">
						<div className="details-header"><h3>About</h3></div>
						<p>{student.bio || 'No bio available.'}</p>
						<h3 style={{ marginTop: '2rem' }}>Skills</h3>
						<div className="profile-skills" style={{ justifyContent: 'flex-start' }}>
							{(student.skills || []).map(skill => <span key={skill} className="skill-tag">{skill}</span>)}
						</div>
					</div>
				</div>
			) : (
				<div className="profile-details">
					<h2>Edit Your Profile</h2>
					<form onSubmit={handleSubmit}>
						<div className="form-group"><label>Profile Picture (Max 5MB)</label><input type="file" accept="image/*" onChange={handleFileChange} /></div>
						<div className="form-group"><label>Major</label><input name="major" value={formData.major || ''} onChange={handleChange} /></div>
						<div className="form-group"><label>Year</label><input name="year" value={formData.year || ''} onChange={handleChange} /></div>
						<div className="form-group"><label>Bio</label><textarea name="bio" rows="4" value={formData.bio || ''} onChange={handleChange}></textarea></div>
						<div className="form-group"><label>Skills (comma-separated)</label><input name="skills" value={(formData.skills || []).join(', ')} onChange={handleChange} /></div>
						<button type="submit" className="btn btn-primary">Save Changes</button>
						<button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)} style={{ marginLeft: '1rem' }}>Cancel</button>
					</form>
				</div>
			)}
		</div>
	)
};

export default ProfilePage;

