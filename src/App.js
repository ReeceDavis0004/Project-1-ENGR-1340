import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import feather from 'feather-icons';
import { apiCall } from './api';

import Header from './components/Header';
import AuthModal from './components/AuthModel';
import StudentsPage from './pages/StudentsPage';
import CompaniesPage from './pages/CompaniesPage';
import JobsPage from './pages/JobsPage';
import ApplicationsPage from './pages/ApplicationPage';
import ProfilePage from './pages/ProfilePage';
import CompanyPage from './pages/CompanyPage';
import AuthCallbackPage from './pages/AuthCallback';

const API_BASE_URL = 'http://localhost:3001';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [currentUser, setCurrentUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = !!token;

  const fetchPublicData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [studentsData, jobsData, companiesData] = await Promise.all([
        apiCall('/students'),
        apiCall('/jobs'),
        apiCall('/companies')
      ]);
      setStudents(studentsData);
      setJobs(jobsData);
      setCompanies(companiesData);
    } catch (error) {
      console.error("Failed to load initial data", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
    setAppliedJobs([]);
    navigate('/');
  }, [navigate]);

  const handleLoginSuccess = useCallback((receivedToken) => {
    localStorage.setItem('token', receivedToken);
    setToken(receivedToken);
    try {
      const decoded = jwtDecode(receivedToken);
      setCurrentUser({
        id: decoded.userId,
        name: decoded.name,
        email: decoded.email,
        type: decoded.accountType,
        companyId: decoded.companyId
      });
      navigate('/'); // Redirect to home on successful login
    } catch (e) {
      console.error("Failed to decode token", e);
      handleLogout();
    }
  }, [navigate, handleLogout]);

  useEffect(() => {
    if (token && !currentUser) {
      try {
        const decoded = jwtDecode(token);
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          handleLogout();
        } else {
          setCurrentUser({
            id: decoded.userId,
            name: decoded.name,
            email: decoded.email,
            type: decoded.accountType,
            companyId: decoded.companyId
          });
        }
      } catch (e) {
        console.error("Invalid token on load", e);
        handleLogout();
      }
    }
  }, [token, currentUser, handleLogout]);

  useEffect(() => {
    fetchPublicData();
  }, [fetchPublicData]);

  useEffect(() => {
    const fetchUserApplications = async () => {
      if (token && currentUser?.type === 'student') {
        try {
          const appData = await apiCall('/applications', 'GET', null, token);
          setAppliedJobs(appData);
        } catch (error) {
          console.error("Failed to fetch user applications", error);
        }
      }
    };
    if (token && currentUser) {
      fetchUserApplications();
    }
  }, [token, currentUser]);

  useEffect(() => {
    feather.replace();
  }, [location.pathname, isLoading, students, jobs, companies]);

  const handleShowLogin = () => { setModalMode('login'); setShowModal(true); };
  const handleShowSignup = () => { setModalMode('signup'); setShowModal(true); };
  const handleCloseModal = () => setShowModal(false);

  const handleAuthSubmit = async (formData) => {
    const isLogin = modalMode === 'login';
    const endpoint = isLogin ? '/login' : '/signup';

    if (!isLogin) {
      await apiCall(endpoint, 'POST', formData);
    }

    const { token } = await apiCall('/login', 'POST', {
      email: formData.email,
      password: formData.password,
      accountType: 'company'
    });
    handleLoginSuccess(token);
    handleCloseModal();
    fetchPublicData();
  };

  const handleApply = async (jobId) => {
    try {
      await apiCall('/applications', 'POST', { jobId }, token);
      setAppliedJobs(prev => [...prev, jobId]);
    } catch (error) {
      alert("Failed to apply: " + error.message);
    }
  };

  return (
    <>
      {showModal && <AuthModal mode={modalMode} onClose={handleCloseModal} onSubmit={handleAuthSubmit} onSwitchMode={() => setModalMode(prev => prev === 'login' ? 'signup' : 'login')} />}
      <Header isAuthenticated={isAuthenticated} currentUser={currentUser} onLoginClick={handleShowLogin} onSignupClick={handleShowSignup} onLogout={handleLogout} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<StudentsPage students={students} isLoading={isLoading} apiBaseUrl={API_BASE_URL} />} />
          <Route path="/jobs" element={<JobsPage isAuthenticated={isAuthenticated} currentUser={currentUser} appliedJobs={appliedJobs} handleApply={handleApply} jobs={jobs} isLoading={isLoading} apiBaseUrl={API_BASE_URL} />} />
          <Route path="/companies" element={<CompaniesPage companies={companies} isLoading={isLoading} apiBaseUrl={API_BASE_URL} />} />
          <Route path="/applications" element={isAuthenticated ? <ApplicationsPage currentUser={currentUser} appliedJobsInfo={jobs.filter(job => appliedJobs.includes(job.id))} isLoading={isLoading} apiBaseUrl={API_BASE_URL} /> : <p>Please log in to see your applications.</p>} />
          <Route path="/profile/:profileId" element={<ProfilePage currentUser={currentUser} token={token} onProfileUpdate={fetchPublicData} apiBaseUrl={API_BASE_URL} />} />
          <Route path="/company/:companyId" element={<CompanyPage token={token} currentUser={currentUser} onDataUpdate={fetchPublicData} apiBaseUrl={API_BASE_URL} />} />
          <Route path="/auth/callback" element={<AuthCallbackPage onLoginSuccess={handleLoginSuccess} />} />
        </Routes>
      </main>
    </>
  );
}

export default App;

