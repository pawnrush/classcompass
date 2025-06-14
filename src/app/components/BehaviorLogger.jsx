import React, { useState } from 'react';

// A simple SVG icon for the dropdown arrow.
const ChevronDownIcon = () => (
  <svg
    className="h-5 w-5 text-gray-400"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

// Mock student data.
const students = [
  { id: 1, name: 'Olivia Chen' },
  { id: 2, name: 'Benjamin Carter' },
  { id: 3, name: 'Sophia Rodriguez' },
  { id: 4, name: 'Liam Goldberg' },
  { id: 5, name: 'Ava Nguyen' },
];

// Options extracted from the provided PDF data sheets.
const antecedentOptions = [
  "Given instruction/demand",
  "Given correction",
  "Alone (no attention/no demands)",
  "Attention given to peers",
  "Engaged in preferred activity",
  "Denied access to preferred item/activity",
  "Transition/change in activity",
];

const behaviorOptions = [
  "Elopement",
  "Non-compliance",
  "Disruptive Behaviors",
  "Aggression",
];

const consequenceOptions = [
  "Adult attention provided",
  "Peer attention provided",
  "Got preferred activity/item",
  "Got sensory input",
  "Adult attention avoided",
  "Task/activity avoided",
  "Sensory input avoided",
  "Redirected",
];


export default function BehaviorLogger() {
  // State management for form inputs
  const [selectedStudent, setSelectedStudent] = useState('');
  
  const [antecedent, setAntecedent] = useState('');
  const [antecedentOther, setAntecedentOther] = useState('');

  const [behavior, setBehavior] = useState('');
  const [behaviorOther, setBehaviorOther] = useState('');

  const [consequence, setConsequence] = useState('');
  const [consequenceOther, setConsequenceOther] = useState('');

  const [isSaved, setIsSaved] = useState(false);

  // Handles the save action
  const handleSave = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!selectedStudent || !antecedent || !behavior || !consequence) {
      alert('Please select a value for each dropdown.'); // Use a modal in a real app
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
    // Here you would typically send this data to your Firebase/Firestore backend.
    
    setIsSaved(true);
    // Reset form after a brief delay
    setTimeout(() => {
        setSelectedStudent('');
        setAntecedent('');
        setAntecedentOther('');
        setBehavior('');
        setBehaviorOther('');
        setConsequence('');
        setConsequenceOther('');
        setIsSaved(false);
    }, 2000);
  };

  // Helper function to render a dropdown and optional text area
  const renderSelectAndOther = (label, value, setValue, setOtherValue, options) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
        >
          <option value="" disabled>Select {label}...</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
          <option value="Other">Other...</option>
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ChevronDownIcon />
        </div>
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


  // Main component rendering
  return (
    <div className="bg-gray-50 flex items-center justify-center min-h-screen font-sans">
      <div className="w-full max-w-2xl p-8 space-y-8 bg-white rounded-2xl shadow-subtle">
        
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Behavior Logger</h1>
          <p className="mt-2 text-gray-500">
            Log an Antecedent-Behavior-Consequence (ABC) observation.
          </p>
        </div>

        {/* Form Section */}
        <form className="space-y-6" onSubmit={handleSave}>
          
          {/* Student Dropdown */}
          <div>
            <label htmlFor="student-select" className="block text-sm font-medium text-gray-700 mb-1">
              Student
            </label>
            <div className="relative">
              <select
                id="student-select"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border-transparent rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              >
                <option value="" disabled>Select a student...</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDownIcon />
              </div>
            </div>
          </div>
          
          {/* ABC Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderSelectAndOther("Antecedent", antecedent, setAntecedent, setAntecedentOther, antecedentOptions)}
            {renderSelectAndOther("Behavior", behavior, setBehavior, setBehaviorOther, behaviorOptions)}
            {renderSelectAndOther("Consequence", consequence, setConsequence, setConsequenceOther, consequenceOptions)}
          </div>

          {/* Save Button */}
          <div>
            <button
              type="submit"
              disabled={isSaved}
              className={`w-full py-3 px-4 font-semibold rounded-lg transition-all duration-200 ease-in-out
              ${isSaved
                ? 'bg-green-500 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isSaved ? 'Saved!' : 'Save Log'}
            </button>
          </div>

        </form>
      </div>
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
