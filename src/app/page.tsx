import React, { useState } from 'react';

// --- ICONS (Self-contained SVGs for simplicity) ---

const ChevronDownIcon = () => (
  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const DashboardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
);

const StudentsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);


// --- MOCK DATA & OPTIONS (Should be fetched from a backend in a real app) ---

const students = [
  { id: 1, name: 'Olivia Chen' },
  { id: 2, name: 'Benjamin Carter' },
  { id: 3, name: 'Sophia Rodriguez' },
  { id: 4, name: 'Liam Goldberg' },
  { id: 5, name: 'Ava Nguyen' },
];

const antecedentOptions = [
  "Given instruction/demand", "Given correction", "Alone (no attention/no demands)",
  "Attention given to peers", "Engaged in preferred activity", "Denied access to preferred item/activity",
  "Transition/change in activity",
];

const behaviorOptions = ["Elopement", "Non-compliance", "Disruptive Behaviors", "Aggression"];

const consequenceOptions = [
  "Adult attention provided", "Peer attention provided", "Got preferred activity/item",
  "Got sensory input", "Adult attention avoided", "Task/activity avoided",
  "Sensory input avoided", "Redirected",
];


// --- REUSABLE COMPONENTS ---

function BehaviorLogger() {
  const [selectedStudent, setSelectedStudent] = useState('');
  const [antecedent, setAntecedent] = useState('');
  const [antecedentOther, setAntecedentOther] = useState('');
  const [behavior, setBehavior] = useState('');
  const [behaviorOther, setBehaviorOther] = useState('');
  const [consequence, setConsequence] = useState('');
  const [consequenceOther, setConsequenceOther] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedStudent || !antecedent || !behavior || !consequence) {
      alert('Please select a value for each dropdown.');
      return;
    }
    const logData = {
      studentId: selectedStudent,
      antecedent: antecedent === 'Other' ? antecedentOther : antecedent,
      behavior: behavior === 'Other' ? behaviorOther : behavior,
      consequence: consequence === 'Other' ? consequenceOther : consequence,
      timestamp: new Date().toISOString(),
    };
    console.log('Behavior Log Saved:', logData);
    setIsSaved(true);
    setTimeout(() => {
      setSelectedStudent('');
      setAntecedent(''); setAntecedentOther('');
      setBehavior(''); setBehaviorOther('');
      setConsequence(''); setConsequenceOther('');
      setIsSaved(false);
    }, 2000);
  };

  const renderSelectAndOther = (label, value, setValue, setOtherValue, options) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
        >
          <option value="" disabled>Select {label}...</option>
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
          <option value="Other">Other...</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"><ChevronDownIcon /></div>
      </div>
      {value === 'Other' && (
        <textarea
          onChange={(e) => setOtherValue(e.target.value)}
          placeholder="Please specify..."
          rows={3}
          className="w-full mt-2 px-4 py-3 bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
        />
      )}
    </div>
  );

  return (
    <div className="w-full max-w-4xl p-8 space-y-8 bg-white rounded-2xl shadow-subtle">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Behavior Logger</h1>
        <p className="mt-2 text-gray-500">Log an Antecedent-Behavior-Consequence (ABC) observation.</p>
      </div>
      <form className="space-y-6" onSubmit={handleSave}>
        <div>
          <label htmlFor="student-select" className="block text-sm font-medium text-gray-700 mb-1">Student</label>
          <div className="relative">
            <select
              id="student-select"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            >
              <option value="" disabled>Select a student...</option>
              {students.map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"><ChevronDownIcon /></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderSelectAndOther("Antecedent", antecedent, setAntecedent, setAntecedentOther, antecedentOptions)}
          {renderSelectAndOther("Behavior", behavior, setBehavior, setBehaviorOther, behaviorOptions)}
          {renderSelectAndOther("Consequence", consequence, setConsequence, setConsequenceOther, consequenceOptions)}
        </div>
        <div>
          <button
            type="submit"
            disabled={isSaved}
            className={`w-full py-3 px-4 font-semibold rounded-lg transition-all duration-200 ease-in-out ${isSaved ? 'bg-green-500 text-white cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'}`}
          >
            {isSaved ? 'Saved!' : 'Save Log'}
          </button>
        </div>
      </form>
    </div>
  );
}


// --- PAGE COMPONENTS ---

const DashboardPage = () => (
    <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Dashboard</h1>
        <BehaviorLogger />
    </div>
);

const StudentProfilePage = () => (
    <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-subtle">
        <h1 className="text-4xl font-bold text-gray-800">Student Profiles</h1>
        <p className="mt-4 text-gray-600">This page will display student information and their behavior data. (Under Construction)</p>
    </div>
);

const SettingsPage = () => (
    <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-subtle">
        <h1 className="text-4xl font-bold text-gray-800">Settings</h1>
        <p className="mt-4 text-gray-600">This page will contain application settings and user preferences. (Under Construction)</p>
    </div>
);


// --- MAIN APP COMPONENT (Default Export) ---

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'students':
        return <StudentProfilePage />;
      case 'settings':
        return <SettingsPage />;
      case 'dashboard':
      default:
        return <DashboardPage />;
    }
  };

  const NavLink = ({ pageName, icon, children }) => (
    <button
        onClick={() => setCurrentPage(pageName)}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
            currentPage === pageName 
            ? 'bg-blue-500 text-white shadow-md' 
            : 'text-gray-500 hover:bg-gray-200 hover:text-gray-800'
        }`}
    >
        {icon}
        <span className="font-semibold">{children}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar Navigation */}
      <nav className="w-64 bg-white p-6 shadow-lg flex flex-col justify-between">
        <div>
            <div className="flex items-center space-x-3 mb-10">
                {/* Replace with your logo */}
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    C
                </div>
                <h1 className="text-2xl font-bold text-gray-800">ClassCompass</h1>
            </div>
            <div className="space-y-4">
                <NavLink pageName="dashboard" icon={<DashboardIcon />}>Dashboard</NavLink>
                <NavLink pageName="students" icon={<StudentsIcon />}>Students</NavLink>
                <NavLink pageName="settings" icon={<SettingsIcon />}>Settings</NavLink>
            </div>
        </div>
        <div className="text-center text-xs text-gray-400">
            <p>ClassCompass v0.1.0</p>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
}

// To make the shadow more subtle, add this to your globals.css file:
/*
@layer utilities {
  .shadow-subtle {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  }
}
*/
