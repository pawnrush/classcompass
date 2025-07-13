// FILE: src/app/page.tsx
// This is your main application page with all features re-integrated and build errors fixed.

"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- DYNAMIC RECHARTS LOADING ---
let Recharts: any = null;
if (typeof window !== 'undefined') {
  Recharts = (window as any).Recharts;
}

// --- ICONS ---
const DashboardIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg> );
const SettingsIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg> );
const AdminIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> );
const CompassIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg> );
const ClipboardIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg> );
const ChevronDownIcon = () => ( <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg> );
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const MinusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>;

// --- AUTH & ROLES ---
const ROLES = { ADMIN: 'Admin', TEACHER: 'Teacher', PARAPROFESSIONAL: 'Paraprofessional', SPECIALIST: 'Behavior Instructional Specialist', PARENT: 'Parent' };

// --- TYPESCRIPT INTERFACES ---
interface User { id: number; name: string; role: string; studentIds: number[]; }
interface Student { id: number; name: string; grade: string; }
interface ObservationLog { studentId: number; timestamp: string; frequency: number; intensity: 'Low' | 'Moderate' | 'High'; antecedent: string; behavior: string; consequence: string; }

// --- MOCK DATA ---
const mockUsers: User[] = [ { id: 1, name: 'Dr. Evelyn Reed', role: ROLES.ADMIN, studentIds: [1, 2] }, { id: 2, name: 'Mr. David Chen', role: ROLES.TEACHER, studentIds: [1] }, { id: 3, name: 'Ms. Maria Garcia', role: ROLES.PARAPROFESSIONAL, studentIds: [1, 2] }, { id: 4, name: 'Dr. Sam Jones', role: ROLES.SPECIALIST, studentIds: [1, 2] }, { id: 5, name: 'Sarah Carter', role: ROLES.PARENT, studentIds: [2] }, ];
const students: Student[] = [ { id: 1, name: 'Olivia Chen', grade: '5' }, { id: 2, name: 'Benjamin Carter', grade: '4' }, ];
const behaviorOptions = ["Non-compliance", "Disruptive Behaviors", "Elopement"];
const replacementBehaviorOptions = ["Request help", "Request break", "Use calming strategy"];
const observationLogs: ObservationLog[] = [ { studentId: 1, timestamp: "2025-06-12T13:15:00Z", frequency: 3, intensity: "High", antecedent: "Given instruction/demand", behavior: "Non-compliance", consequence: "Redirected" }, { studentId: 1, timestamp: "2025-06-12T15:30:00Z", frequency: 1, intensity: "Low", antecedent: "Transition/change in activity", behavior: "Disruptive Behaviors", consequence: "Adult attention provided" }, { studentId: 1, timestamp: "2025-06-13T16:00:00Z", frequency: 2, intensity: "Moderate", antecedent: "Given instruction/demand", behavior: "Non-compliance", consequence: "Task/activity avoided" }, { studentId: 1, timestamp: "2025-06-13T19:00:00Z", frequency: 1, intensity: "High", antecedent: "Denied access", behavior: "Elopement", consequence: "Redirected" }, { studentId: 1, timestamp: "2025-06-14T14:00:00Z", frequency: 4, intensity: "Moderate", antecedent: "Given instruction/demand", behavior: "Disruptive Behaviors", consequence: "Redirected" }, { studentId: 2, timestamp: "2025-06-12T14:45:00Z", frequency: 1, intensity: "Low", antecedent: "Transition/change in activity", behavior: "Non-compliance", consequence: "Adult attention provided" }, { studentId: 2, timestamp: "2025-06-13T18:20:00Z", frequency: 2, intensity: "High", antecedent: "Denied access", behavior: "Disruptive Behaviors", consequence: "Task/activity avoided" }, ];

// --- DATA PROCESSING UTILITIES ---
const processFrequencyData = (logs: ObservationLog[]) => { const dailyData = logs.reduce((acc: any, log) => { const date = new Date(log.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); if (!acc[date]) { acc[date] = { date, frequency: 0 }; } acc[date].frequency += log.frequency; return acc; }, {}); return Object.values(dailyData).sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()); };
const processAbcData = (logs: ObservationLog[]) => { const abcCounts: { [key: string]: { [key: string]: number } } = { antecedents: {}, behaviors: {}, consequences: {} }; logs.forEach((log) => { if (log.antecedent) abcCounts.antecedents[log.antecedent] = (abcCounts.antecedents[log.antecedent] || 0) + 1; if (log.behavior) abcCounts.behaviors[log.behavior] = (abcCounts.behaviors[log.behavior] || 0) + 1; if (log.consequence) abcCounts.consequences[log.consequence] = (abcCounts.consequences[log.consequence] || 0) + 1; }); const formatForChart = (data: any) => Object.entries(data).map(([name, value]) => ({ name, count: value })); return { antecedents: formatForChart(abcCounts.antecedents), behaviors: formatForChart(abcCounts.behaviors), consequences: formatForChart(abcCounts.consequences), }; };
const processHeatmapData = (logs: ObservationLog[]) => { const intensityMap: { [key: string]: number } = { 'Low': 1, 'Moderate': 2, 'High': 3 }; return logs.map(log => { const date = new Date(log.timestamp); const time = date.getUTCHours() + date.getUTCMinutes() / 60; return { time, day: date.getDay(), intensity: intensityMap[log.intensity] }; }); };

// --- CHARTING COMPONENTS ---
const ChartContainer = ({ title, children }: { title: string, children: React.ReactNode }) => ( <div className="bg-white rounded-2xl shadow-subtle p-6 h-96"><h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>{children}</div> );
const ChartGrid = ({ children }: { children: React.ReactNode }) => { const [chartsReady, setChartsReady] = useState(!!(typeof window !== 'undefined' && (window as any).Recharts)); useEffect(() => { if (!chartsReady) { const check = setInterval(() => { if ((window as any).Recharts) { Recharts = (window as any).Recharts; setChartsReady(true); clearInterval(check); } }, 100); return () => clearInterval(check); } }, [chartsReady]); if (!chartsReady) { return ( <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{React.Children.map(children, () => ( <div className="bg-white rounded-2xl shadow-subtle p-6 h-96 flex items-center justify-center"><p className="text-gray-500">Loading Chart...</p></div> ))}</div> ); } return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{children}</div>; }
const FrequencyLineChart = ({ data }: { data: any[] }) => ( <ChartContainer title="Behavior Frequency Over Time"><Recharts.ResponsiveContainer width="100%" height="90%"><Recharts.LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}><Recharts.CartesianGrid strokeDasharray="3 3" /><Recharts.XAxis dataKey="date" /><Recharts.YAxis allowDecimals={false} /><Recharts.Tooltip /><Recharts.Legend /><Recharts.Line type="monotone" dataKey="frequency" stroke="#d97706" strokeWidth={2} activeDot={{ r: 8 }} /></Recharts.LineChart></Recharts.ResponsiveContainer></ChartContainer> );
const AbcBarChart = ({ data, dataKey, title }: { data: any[], dataKey: string, title: string }) => ( <ChartContainer title={title}><Recharts.ResponsiveContainer width="100%" height="90%"><Recharts.BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}><Recharts.CartesianGrid strokeDasharray="3 3" /><Recharts.XAxis type="number" allowDecimals={false}/><Recharts.YAxis dataKey="name" type="category" width={120} /><Recharts.Tooltip /><Recharts.Bar dataKey={dataKey} fill="#f59e0b" barSize={20} /></Recharts.BarChart></Recharts.ResponsiveContainer></ChartContainer> );
const BehaviorHeatmap = ({ data }: { data: any[] }) => { const intensityColors: { [key: number]: string } = { 1: '#fde68a', 2: '#f97316', 3: '#b91c1c' }; const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; return ( <ChartContainer title="Behavior Intensity by Time of Day"><Recharts.ResponsiveContainer width="100%" height="90%"><Recharts.ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}><Recharts.CartesianGrid /><Recharts.XAxis type="number" dataKey="time" name="Time" domain={[7.5, 16.75]} tickFormatter={(time: number) => `${Math.floor(time)}:${String(Math.round((time % 1) * 60)).padStart(2, '0')}`} /><Recharts.YAxis type="number" dataKey="day" name="Day" domain={[0, 6]} tickFormatter={(day: number) => weekDays[day]} /><Recharts.ZAxis dataKey="intensity" range={[100, 500]} /><Recharts.Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }: any) => { if (active && payload && payload.length) { const data = payload[0].payload; const intensityLevels: { [key: number]: string } = { 1: 'Low', 2: 'Moderate', 3: 'High' }; const time = `${Math.floor(data.time)}:${String(Math.round((data.time % 1) * 60)).padStart(2, '0')}`; return <div className="bg-white p-2 border rounded shadow-lg"> <p>{`Time: ${time}`}</p> <p>{`Day: ${weekDays[data.day]}`}</p><p>{`Intensity: ${intensityLevels[data.intensity]}`}</p></div>; } return null; }} /><Recharts.Scatter name="Observations" data={data}>{data.map((entry: any, index: number) => { const cellColor = intensityColors[entry.intensity] || "#ccc"; return <Recharts.Cell key={`cell-${index}`} fill={cellColor} />; })}</Recharts.Scatter></Recharts.ScatterChart></Recharts.ResponsiveContainer></ChartContainer> ); };

// --- PAGE COMPONENTS ---
const DashboardPage = ({ currentUser }: { currentUser: User }) => {
    const availableStudents = students.filter(s => currentUser.studentIds.includes(s.id));
    const [selectedStudentId, setSelectedStudentId] = useState(availableStudents[0]?.id);
    
    useEffect(() => {
        if (!availableStudents.find(s => s.id === selectedStudentId)) {
            setSelectedStudentId(availableStudents[0]?.id);
        }
    }, [currentUser, availableStudents, selectedStudentId]);

    const filteredLogs = observationLogs.filter(log => log.studentId === selectedStudentId);
    const freqData = processFrequencyData(filteredLogs);
    const abcData = processAbcData(filteredLogs);
    const heatmapData = processHeatmapData(filteredLogs);

    return (
        <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-600 mb-6">Visualize student behavior data.</p>
            
            <div className="flex space-x-4 mb-6 p-4 bg-white rounded-2xl shadow-subtle">
                <div>
                    <label htmlFor="student-filter" className="block text-sm font-medium text-gray-700">Student</label>
                    {currentUser.role === ROLES.PARENT ? (
                        <p className="text-lg font-semibold mt-1">{availableStudents[0]?.name || 'No student assigned'}</p>
                    ) : (
                        <select id="student-filter" value={selectedStudentId} onChange={e => setSelectedStudentId(Number(e.target.value))} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-amber-500 focus:border-amber-500 sm:text-sm rounded-md">
                            {availableStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    )}
                </div>
            </div>

            <ChartGrid>
                <FrequencyLineChart data={freqData} />
                <BehaviorHeatmap data={heatmapData} />
                <AbcBarChart data={abcData.antecedents} dataKey="count" title="Antecedent Counts" />
                <AbcBarChart data={abcData.behaviors} dataKey="count" title="Behavior Counts" />
                <AbcBarChart data={abcData.consequences} dataKey="count" title="Consequence Counts" />
            </ChartGrid>
        </div>
    );
};
const DataCollectionPage = () => ( <div><h1 className="text-4xl font-bold text-gray-800 mb-2">Data Collection</h1><p className="text-gray-600 mb-6">Real-time observation and tracking tools.</p><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><p className="p-4 bg-yellow-100 text-yellow-800 rounded-lg text-center md:col-span-2">Data collection tools are under construction.</p></div></div> );
const AdminPage = () => ( <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-md"><h1 className="text-4xl font-bold text-gray-800">Admin Panel</h1><p className="mt-4 text-gray-600">User management and system settings will go here.</p></div> );
const SettingsPage = () => ( <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-md"><h1 className="text-4xl font-bold text-gray-800">Settings</h1><p className="mt-4 text-gray-600">User preferences and app settings will go here.</p></div> );

// --- LOGIN SCREEN ---
const LoginScreen = ({ onLogin }: { onLogin: (user: User) => void }) => (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-lg space-y-4">
            <div className="flex items-center space-x-3 justify-center text-amber-600">
                <CompassIcon />
                <h1 className="text-3xl font-bold text-gray-800">ClassCompass</h1>
            </div>
            <h2 className="text-center text-xl font-semibold text-gray-700 pt-4">Select a user to log in</h2>
            <div className="space-y-2">
                {mockUsers.map(user => (
                    <button key={user.id} onClick={() => onLogin(user)} className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-amber-100 hover:text-amber-700 transition-colors text-left">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.role}</p>
                    </button>
                ))}
            </div>
        </div>
    </div>
);

// --- MAIN APP COMPONENT ---
export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  useEffect(() => {
      const scriptId = 'recharts-script';
      if (!document.getElementById(scriptId)) {
          const script = document.createElement('script');
          script.id = scriptId;
          script.src = "https://unpkg.com/recharts/umd/Recharts.min.js";
          script.async = true;
          script.onload = () => console.log("Recharts script loaded.");
          document.head.appendChild(script);
      }
  }, []);
  
  const handleLogin = (user: User) => { setCurrentUser(user); setCurrentPage('dashboard'); };
  const handleLogout = () => { setCurrentUser(null); };

  if (!currentUser) { return <LoginScreen onLogin={handleLogin} />; }
  
  const renderPage = () => {
    switch (currentPage) {
      case 'admin': return <AdminPage />;
      case 'settings': return <SettingsPage />;
      case 'data-collection': return <DataCollectionPage />;
      case 'dashboard': default: return <DashboardPage currentUser={currentUser} />;
    }
  };
  
  const NavLink = ({ pageName, icon, children }: { pageName: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <button onClick={() => setCurrentPage(pageName)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${currentPage === pageName ? 'bg-amber-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-800'}`}>
        {icon}
        <span className="font-semibold">{children}</span>
    </button>
  );
  
  const staffRoles = [ROLES.ADMIN, ROLES.TEACHER, ROLES.PARAPROFESSIONAL, ROLES.SPECIALIST];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <nav className="w-64 bg-white p-6 shadow-lg flex flex-col justify-between">
        <div>
            <div className="flex items-center space-x-3 mb-10">
                <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center text-white">
                    <CompassIcon/>
                </div>
                <h1 className="text-2xl font-bold text-gray-800">ClassCompass</h1>
            </div>
            <div className="space-y-4">
                <NavLink pageName="dashboard" icon={<DashboardIcon />}>Dashboard</NavLink>
                {staffRoles.includes(currentUser.role) && <NavLink pageName="data-collection" icon={<ClipboardIcon />}>Data Collection</NavLink>}
                {currentUser.role === ROLES.ADMIN && <NavLink pageName="admin" icon={<AdminIcon />}>Admin</NavLink>}
                <NavLink pageName="settings" icon={<SettingsIcon />}>Settings</NavLink>
            </div>
        </div>
        <div className="text-center p-2 border-t">
            <p className="text-sm font-semibold">{currentUser.name}</p>
            <p className="text-xs text-gray-500">{currentUser.role}</p>
            <button onClick={handleLogout} className="text-xs text-amber-600 hover:underline mt-2">Log Out</button>
        </div>
      </nav>
      <main className="flex-1 p-10 overflow-y-auto">{renderPage()}</main>
    </div>
  );
}
