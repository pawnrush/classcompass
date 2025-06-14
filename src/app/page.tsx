// FILE: src/app/page.tsx
// This is your main application page.
// Please replace the entire contents of your page.tsx with this code.

"use client";

import React, { useState, useEffect } from 'react';

// --- ICONS (Corrected xmlns attribute) ---
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
);
const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);
const AdminIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);

// --- AUTH & ROLES ---
const ROLES = { ADMIN: 'Admin', TEACHER: 'Teacher', PARAPROFESSIONAL: 'Paraprofessional', SPECIALIST: 'Behavior Instructional Specialist', PARENT: 'Parent' };

// --- TYPESCRIPT INTERFACES ---
interface User {
  id: number;
  name: string;
  role: string;
  studentIds: number[];
}

interface Student {
    id: number;
    name: string;
    grade: string;
}

const mockUsers: User[] = [ { id: 1, name: 'Dr. Evelyn Reed', role: ROLES.ADMIN, studentIds: [1, 2] }, { id: 2, name: 'Mr. David Chen', role: ROLES.TEACHER, studentIds: [1] }, { id: 3, name: 'Ms. Maria Garcia', role: ROLES.PARAPROFESSIONAL, studentIds: [1, 2] }, { id: 4, name: 'Dr. Sam Jones', role: ROLES.SPECIALIST, studentIds: [1, 2] }, { id: 5, name: 'Sarah Carter', role: ROLES.PARENT, studentIds: [2] }, ];
const students: Student[] = [ { id: 1, name: 'Olivia Chen', grade: '5' }, { id: 2, name: 'Benjamin Carter', grade: '4' }, ];

// --- PAGE COMPONENTS ---
const DashboardPage = ({ currentUser }: { currentUser: User }) => {
    const availableStudents = students.filter(s => currentUser.studentIds.includes(s.id));
    const [selectedStudentId, setSelectedStudentId] = useState(availableStudents[0]?.id);

    return (
        <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-600 mb-6">Student data dashboards will be displayed here.</p>
            <div className="p-4 bg-white rounded-2xl shadow-subtle">
                <label htmlFor="student-filter" className="block text-sm font-medium text-gray-700">Student</label>
                {currentUser.role === ROLES.PARENT ? (
                    <p className="text-lg font-semibold mt-1">{availableStudents[0]?.name || 'No student assigned'}</p>
                ) : (
                    <select id="student-filter" value={selectedStudentId} onChange={e => setSelectedStudentId(Number(e.target.value))} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                        {availableStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                )}
                 <div className="mt-6 text-center text-gray-400 p-8 border-2 border-dashed rounded-lg">
                    <p>Charts and visualizations will be added back here once deployment is stable.</p>
                </div>
            </div>
        </div>
    );
};
const AdminPage = () => ( <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-subtle"><h1 className="text-4xl font-bold text-gray-800">Admin Panel</h1><p className="mt-4 text-gray-600">User management and system settings will go here.</p></div> );
const SettingsPage = () => ( <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-subtle"><h1 className="text-4xl font-bold text-gray-800">Settings</h1><p className="mt-4 text-gray-600">User preferences and app settings will go here.</p></div> );

// --- LOGIN SCREEN ---
const LoginScreen = ({ onLogin }: { onLogin: (user: User) => void }) => ( <div className="flex h-screen items-center justify-center bg-gray-100"><div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-subtle space-y-4"><div className="flex items-center space-x-3 justify-center"><div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">C</div><h1 className="text-3xl font-bold text-gray-800">ClassCompass</h1></div><h2 className="text-center text-xl font-semibold text-gray-700">Select a user to log in</h2><div className="space-y-2">{mockUsers.map(user => ( <button key={user.id} onClick={() => onLogin(user)} className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors text-left"><p className="font-semibold">{user.name}</p><p className="text-sm text-gray-500">{user.role}</p></button>))}</div></div></div> );

// --- MAIN APP COMPONENT ---
export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const handleLogin = (user: User) => { setCurrentUser(user); setCurrentPage('dashboard'); };
  const handleLogout = () => { setCurrentUser(null); };

  if (!currentUser) { return <LoginScreen onLogin={handleLogin} />; }
  
  const renderPage = () => {
    switch (currentPage) {
      case 'admin': return <AdminPage />;
      case 'settings': return <SettingsPage />;
      case 'dashboard': default: return <DashboardPage currentUser={currentUser} />;
    }
  };
  
  const NavLink = ({ pageName, icon, children }: { pageName: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <button onClick={() => setCurrentPage(pageName)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${currentPage === pageName ? 'bg-blue-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-800'}`}>
        {icon}
        <span className="font-semibold">{children}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <nav className="w-64 bg-white p-6 shadow-lg flex flex-col justify-between">
        <div>
            <div className="flex items-center space-x-3 mb-10"><div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">C</div><h1 className="text-2xl font-bold text-gray-800">ClassCompass</h1></div>
            <div className="space-y-4">
                <NavLink pageName="dashboard" icon={<DashboardIcon />}>Dashboard</NavLink>
                {currentUser.role === ROLES.ADMIN && <NavLink pageName="admin" icon={<AdminIcon />}>Admin</NavLink>}
                <NavLink pageName="settings" icon={<SettingsIcon />}>Settings</NavLink>
            </div>
        </div>
        <div className="text-center p-2 border-t"><p className="text-sm font-semibold">{currentUser.name}</p><p className="text-xs text-gray-500">{currentUser.role}</p><button onClick={handleLogout} className="text-xs text-blue-500 hover:underline mt-2">Log Out</button></div>
      </nav>
      <main className="flex-1 p-10 overflow-y-auto">{renderPage()}</main>
    </div>
  );
}
