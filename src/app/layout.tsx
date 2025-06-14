"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';

// --- DYNAMIC RECHARTS LOADING ---
// We explicitly type Recharts as 'any' to resolve the TypeScript error.
let Recharts: any = null;
if (typeof window !== 'undefined') {
  Recharts = (window as any).Recharts;
}

// --- ICONS ---
const ChevronDownIcon = () => ( <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg> );
const DashboardIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg> );
const StudentsIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> );
const SettingsIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg> );
const ClipboardIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg> );
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L9.5 8.5L4 11L9.5 13.5L12 19L14.5 13.5L20 11L14.5 8.5L12 3z"/></svg>;
const AdminIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const MinusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>;

// --- AUTH & ROLES ---
const ROLES = { ADMIN: 'Admin', TEACHER: 'Teacher', PARAPROFESSIONAL: 'Paraprofessional', SPECIALIST: 'Behavior Instructional Specialist', PARENT: 'Parent' };
const mockUsers = [ { id: 1, name: 'Dr. Evelyn Reed', role: ROLES.ADMIN, studentIds: [1, 2] }, { id: 2, name: 'Mr. David Chen', role: ROLES.TEACHER, studentIds: [1] }, { id: 3, name: 'Ms. Maria Garcia', role: ROLES.PARAPROFESSIONAL, studentIds: [1, 2] }, { id: 4, name: 'Dr. Sam Jones', role: ROLES.SPECIALIST, studentIds: [1, 2] }, { id: 5, name: 'Sarah Carter', role: ROLES.PARENT, studentIds: [2] }, ];

// --- CUSTOM HOOKS ---
const useTimer = (initialState = 0) => {
    const [elapsedTime, setElapsedTime] = useState(initialState);
    const [isRunning, setIsRunning] = useState(false);
    // Explicitly type the ref to hold a number (for browser's setInterval ID) or null
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (isRunning) {
            const startTime = Date.now() - elapsedTime;
            timerRef.current = window.setInterval(() => {
                setElapsedTime(Date.now() - startTime);
            }, 100);
        } else {
            if (timerRef.current) {
                window.clearInterval(timerRef.current);
            }
        }
        return () => {
            if (timerRef.current) {
                window.clearInterval(timerRef.current);
            }
        };
    }, [isRunning, elapsedTime]);
    
    const formatTime = useCallback((time: number) => {
        const totalSeconds = Math.floor(time / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, []);
    
    const resetTimer = () => {
        setIsRunning(false);
        setElapsedTime(0);
    };
    
    return { elapsedTime, isRunning, setIsRunning, formatTime, resetTimer };
};

// --- MOCK DATA ---
const students = [ { id: 1, name: 'Olivia Chen', grade: '5' }, { id: 2, name: 'Benjamin Carter', grade: '4' }, ];
const behaviorOptions = ["Non-compliance", "Disruptive Behaviors", "Elopement"];
const replacementBehaviorOptions = ["Request help", "Request break", "Use calming strategy"];
const observationLogs = [ { studentId: 1, timestamp: "2025-06-12T13:15:00Z", frequency: 3, intensity: "High", antecedent: "Given instruction/demand", behavior: "Non-compliance", consequence: "Redirected" }, { studentId: 1, timestamp: "2025-06-12T15:30:00Z", frequency: 1, intensity: "Low", antecedent: "Transition/change in activity", behavior: "Disruptive Behaviors", consequence: "Adult attention provided" }, { studentId: 1, timestamp: "2025-06-13T16:00:00Z", frequency: 2, intensity: "Moderate", antecedent: "Given instruction/demand", behavior: "Non-compliance", consequence: "Task/activity avoided" }, { studentId: 1, timestamp: "2025-06-13T19:00:00Z", frequency: 1, intensity: "High", antecedent: "Denied access", behavior: "Elopement", consequence: "Redirected" }, { studentId: 1, timestamp: "2025-06-14T14:00:00Z", frequency: 4, intensity: "Moderate", antecedent: "Given instruction/demand", behavior: "Disruptive Behaviors", consequence: "Redirected" }, { studentId: 2, timestamp: "2025-06-12T14:45:00Z", frequency: 1, intensity: "Low", antecedent: "Transition/change in activity", behavior: "Non-compliance", consequence: "Adult attention provided" }, { studentId: 2, timestamp: "2025-06-13T18:20:00Z", frequency: 2, intensity: "High", antecedent: "Denied access", behavior: "Disruptive Behaviors", consequence: "Task/activity avoided" }, ];

// --- DATA PROCESSING UTILITIES ---
const processFrequencyData = (logs) => { const dailyData = logs.reduce((acc, log) => { const date = new Date(log.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); if (!acc[date]) { acc[date] = { date, frequency: 0 }; } acc[date].frequency += log.frequency; return acc; }, {}); return Object.values(dailyData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); };
const processAbcData = (logs) => { const abcCounts = { antecedents: {}, behaviors: {}, consequences: {} }; logs.forEach(log => { if (log.antecedent) abcCounts.antecedents[log.antecedent] = (abcCounts.antecedents[log.antecedent] || 0) + 1; if (log.behavior) abcCounts.behaviors[log.behavior] = (abcCounts.behaviors[log.behavior] || 0) + 1; if (log.consequence) abcCounts.consequences[log.consequence] = (abcCounts.consequences[log.consequence] || 0) + 1; }); const formatForChart = (data) => Object.entries(data).map(([name, value]) => ({ name, count: value })); return { antecedents: formatForChart(abcCounts.antecedents), behaviors: formatForChart(abcCounts.behaviors), consequences: formatForChart(abcCounts.consequences), }; };
const processHeatmapData = (logs) => { const intensityMap = { 'Low': 1, 'Moderate': 2, 'High': 3 }; return logs.map(log => { const date = new Date(log.timestamp); const time = date.getUTCHours() + date.getUTCMinutes() / 60; return { time, day: date.getDay(), intensity: intensityMap[log.intensity] }; }); };

// --- CHARTING COMPONENTS ---
const ChartContainer = ({ title, children }) => ( <div className="bg-white rounded-2xl shadow-subtle p-6 h-96"><h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>{children}</div> );
const ChartGrid = ({ children }) => { const [chartsReady, setChartsReady] = useState(!!(typeof window !== 'undefined' && (window as any).Recharts)); useEffect(() => { if (!chartsReady) { const check = setInterval(() => { if ((window as any).Recharts) { Recharts = (window as any).Recharts; setChartsReady(true); clearInterval(check); } }, 100); return () => clearInterval(check); } }, [chartsReady]); if (!chartsReady) { return ( <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{React.Children.map(children, () => ( <div className="bg-white rounded-2xl shadow-subtle p-6 h-96 flex items-center justify-center"><p className="text-gray-500">Loading Chart...</p></div> ))}</div> ); } return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{children}</div>; }
const FrequencyLineChart = ({ data }) => ( <ChartContainer title="Behavior Frequency Over Time"><ResponsiveContainer width="100%" height="90%"><Recharts.LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}><Recharts.CartesianGrid strokeDasharray="3 3" /><Recharts.XAxis dataKey="date" /><Recharts.YAxis allowDecimals={false} /><Recharts.Tooltip /><Recharts.Legend /><Recharts.Line type="monotone" dataKey="frequency" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} /></Recharts.LineChart></ResponsiveContainer></ChartContainer> );
const AbcBarChart = ({ data, dataKey, title }) => ( <ChartContainer title={title}><ResponsiveContainer width="100%" height="90%"><Recharts.BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}><Recharts.CartesianGrid strokeDasharray="3 3" /><Recharts.XAxis type="number" allowDecimals={false}/><Recharts.YAxis dataKey="name" type="category" width={120} /><Recharts.Tooltip /><Recharts.Bar dataKey={dataKey} fill="#3b82f6" barSize={20} /></Recharts.BarChart></ResponsiveContainer></ChartContainer> );
const BehaviorHeatmap = ({ data }) => { const intensityColors = { 1: '#93c5fd', 2: '#3b82f6', 3: '#be123c' }; const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; return ( <ChartContainer title="Behavior Intensity by Time of Day"><ResponsiveContainer width="100%" height="90%"><Recharts.ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}><Recharts.CartesianGrid /><Recharts.XAxis type="number" dataKey="time" name="Time" domain={[7.5, 16.75]} tickFormatter={(time) => `${Math.floor(time)}:${String(Math.round((time % 1) * 60)).padStart(2, '0')}`} /><Recharts.YAxis type="number" dataKey="day" name="Day" domain={[0, 6]} tickFormatter={(day) => weekDays[day]} /><Recharts.ZAxis dataKey="intensity" range={[100, 500]} /><Recharts.Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => { if (active && payload && payload.length) { const data = payload[0].payload; const intensityLevels = { 1: 'Low', 2: 'Moderate', 3: 'High' }; const time = `${Math.floor(data.time)}:${String(Math.round((data.time % 1) * 60)).padStart(2, '0')}`; return <div className="bg-white p-2 border rounded shadow-lg"> <p>{`Time: ${time}`}</p> <p>{`Day: ${weekDays[data.day]}`}</p><p>{`Intensity: ${intensityLevels[data.intensity]}`}</p></div>; } return null; }} /><Recharts.Scatter name="Observations" data={data}>{data.map((entry, index) => { const cellColor = intensityColors[entry.intensity] || "#ccc"; return <Recharts.Cell key={`cell-${index}`} fill={cellColor} />; })}</Recharts.Scatter></Recharts.ScatterChart></ResponsiveContainer></ChartContainer> ); };

// --- GEMINI API COMPONENTS ---
function GeminiFbaHelper({ logs }) { /* ... unchanged ... */ 
    const [isLoading, setIsLoading] = useState(false); const [hypothesis, setHypothesis] = useState(''); const [interventions, setInterventions] = useState([]); const [error, setError] = useState('');
    const handleAnalyzeFunction = async () => { setIsLoading(true); setError(''); setHypothesis(''); setInterventions([]); const formattedLogs = logs.map(l => `On ${new Date(l.timestamp).toLocaleString()}, Antecedent: ${l.antecedent}, Behavior: ${l.behavior}, Consequence: ${l.consequence}.`).join('\n'); const prompt = `Based on the following Antecedent-Behavior-Consequence (ABC) data for a student, please generate a hypothesis for the primary function of the behavior. The possible functions are attention, escape, tangible, or sensory. Provide a brief rationale for your hypothesis.\n\nData:\n${formattedLogs}`; try { const chatHistory = [{ role: "user", parts: [{ text: prompt }] }]; const payload = { contents: chatHistory }; const apiKey = ""; const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`; const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); if (!response.ok) { throw new Error(`API call failed with status: ${response.status}`); } const result = await response.json(); if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) { setHypothesis(result.candidates[0].content.parts[0].text); } else { throw new Error("Invalid response format from API."); } } catch (err) { setError(err.message); console.error("Error analyzing function:", err); } finally { setIsLoading(false); } };
    const handleSuggestInterventions = async () => { setIsLoading(true); setError(''); setInterventions([]); const prompt = `Given the following behavior function hypothesis for a student, suggest 3 evidence-based intervention strategies. Hypothesis: ${hypothesis}`; const schema = { type: "ARRAY", items: { type: "OBJECT", properties: { name: { type: "STRING" }, description: { type: "STRING" } }, required: ["name", "description"] } }; try { const chatHistory = [{ role: "user", parts: [{ text: prompt }] }]; const payload = { contents: chatHistory, generationConfig: { responseMimeType: "application/json", responseSchema: schema }}; const apiKey = ""; const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`; const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); if (!response.ok) { throw new Error(`API call failed with status: ${response.status}`); } const result = await response.json(); if (result.candidates && result.candidates[0]?.content?.parts[0]?.text) { const parsedInterventions = JSON.parse(result.candidates[0].content.parts[0].text); setInterventions(parsedInterventions); } else { throw new Error("Invalid response format from API."); } } catch (err) { setError(err.message); console.error("Error suggesting interventions:", err); } finally { setIsLoading(false); } };
    return ( <div className="mt-8 bg-white rounded-2xl shadow-subtle p-6"><h3 className="text-xl font-semibold text-gray-700 mb-4">AI-Powered Insights</h3>{!hypothesis && ( <button onClick={handleAnalyzeFunction} disabled={isLoading} className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg disabled:bg-gray-400 disabled:from-gray-400 hover:shadow-lg transition-shadow"><SparklesIcon /><span>{isLoading ? 'Analyzing...' : 'Analyze Behavior Function'}</span></button> )} {isLoading && <div className="text-center p-4">Loading...</div>} {error && <div className="text-center p-4 text-red-600 bg-red-100 rounded-lg">Error: {error}</div>} {hypothesis && ( <div className="p-4 bg-gray-50 rounded-lg border"><h4 className="font-semibold text-gray-800">Hypothesized Function:</h4><p className="text-gray-600 mt-2 whitespace-pre-wrap">{hypothesis}</p><button onClick={handleSuggestInterventions} disabled={isLoading} className="mt-4 flex items-center justify-center space-x-2 w-full px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-semibold rounded-lg disabled:bg-gray-400 hover:shadow-lg transition-shadow"><SparklesIcon /><span>{isLoading ? 'Generating...' : 'Suggest Interventions'}</span></button></div> )} {interventions.length > 0 && ( <div className="mt-6"><h4 className="font-semibold text-gray-800 mb-2">Suggested Interventions:</h4><ul className="space-y-4">{interventions.map((item, index) => ( <li key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200"><strong className="text-blue-700">{item.name}</strong><p className="text-gray-600 mt-1">{item.description}</p></li> ))}</ul></div> )}</div> );
}

// --- DATA COLLECTION COMPONENTS ---
const DataCollectionToolContainer = ({ title, children }) => ( <div className="bg-white rounded-2xl shadow-subtle p-6">{title && <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>}{children}</div> );

const FrequencyTracker = ({ title, behaviorList, onLog, isTargetBehavior }) => {
    const [behavior, setBehavior] = useState(behaviorList[0] || '');
    const [frequency, setFrequency] = useState(0);
    const [intensity, setIntensity] = useState('Low');
    const [sessionLogs, setSessionLogs] = useState([]);
    const [chartsReady, setChartsReady] = useState(false);

    useEffect(() => setChartsReady(!!(window as any).Recharts), []);

    const handleLog = () => {
        if (!behavior) { alert("Please select a behavior."); return; }
        const logEntry = {
            type: title,
            behavior,
            frequency: frequency + 1, // Log the incremented value
            intensity: isTargetBehavior ? intensity : undefined,
            timestamp: new Date().toLocaleTimeString(),
        };
        setFrequency(f => f + 1);
        setSessionLogs(prev => [...prev, { time: logEntry.timestamp, freq: prev.length + 1 }]);
        onLog(logEntry); // This would send to a central store/DB
    };
    
    const handleDecrement = () => {
        setFrequency(f => Math.max(0, f - 1));
        // Note: Decrementing doesn't add a log entry for this example
    };

    const resetSession = () => {
        setFrequency(0);
        setSessionLogs([]);
    };
    
    return (
        <DataCollectionToolContainer title={title}>
            <div className="space-y-4">
                <div className="relative"><select value={behavior} onChange={e => setBehavior(e.target.value)} className="w-full px-4 py-3 bg-gray-100 rounded-lg appearance-none"><option value="" disabled>Select Behavior</option>{behaviorList.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select><div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none"><ChevronDownIcon /></div></div>
                {isTargetBehavior && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Intensity</label>
                        <div className="flex bg-gray-200 rounded-lg p-1">{['Low', 'Moderate', 'High'].map(level => ( <button key={level} onClick={() => setIntensity(level)} className={`w-full py-1 text-sm rounded-md transition-all ${intensity === level ? 'bg-white text-blue-600 shadow' : 'text-gray-600'}`}>{level}</button>))}</div>
                    </div>
                )}
                <div className="flex items-center space-x-4 justify-center">
                    <button onClick={handleDecrement} className="p-3 bg-gray-200 rounded-full hover:bg-gray-300"><MinusIcon /></button>
                    <span className="text-5xl font-mono w-24 text-center">{frequency}</span>
                    <button onClick={handleLog} className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600"><PlusIcon /></button>
                </div>
                 {chartsReady && sessionLogs.length > 0 && (
                    <div className="h-40 -mx-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <Recharts.LineChart data={sessionLogs} >
                                <Recharts.Tooltip />
                                <Recharts.Line type="stepAfter" dataKey="freq" stroke="#3b82f6" strokeWidth={2} name="Frequency" />
                            </Recharts.LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
                <button onClick={resetSession} className="w-full text-xs text-gray-500 hover:underline">Reset Session</button>
            </div>
        </DataCollectionToolContainer>
    );
};

const BreakTracker = ({ onLog }) => {
    const { elapsedTime, isRunning, setIsRunning, formatTime, resetTimer } = useTimer();
    const [isPrompted, setIsPrompted] = useState(false);
    const [isIndependent, setIsIndependent] = useState(false);

    const handleLog = () => {
        if(isRunning) { alert("Please stop the timer before logging."); return; }
        if(!isPrompted && !isIndependent){ alert("Please select break type."); return; }
        onLog({ type: "Break", duration: formatTime(elapsedTime), breakType: isPrompted ? 'Prompted' : 'Independent', timestamp: new Date().toISOString() });
        alert(`Break Logged: ${formatTime(elapsedTime)}`);
        resetTimer();
        setIsPrompted(false); setIsIndependent(false);
    };

    return(
        <DataCollectionToolContainer title="Time Out / Break">
            <div className="flex items-center space-x-4 mb-4">
                 <span className="text-3xl font-mono p-2 bg-gray-100 rounded-lg">{formatTime(elapsedTime)}</span>
                 <button onClick={() => setIsRunning(r => !r)} className={`px-4 py-2 font-semibold rounded-lg text-white ${isRunning ? 'bg-red-500' : 'bg-green-500'}`}>{isRunning ? 'Stop' : 'Start'}</button>
            </div>
            <div className="flex space-x-4 items-center mb-4">
                <label className="flex items-center space-x-2"><input type="checkbox" checked={isPrompted} onChange={(e) => { setIsPrompted(e.target.checked); if(e.target.checked) setIsIndependent(false); }} className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500" /><span>Prompted</span></label>
                <label className="flex items-center space-x-2"><input type="checkbox" checked={isIndependent} onChange={(e) => { setIsIndependent(e.target.checked); if(e.target.checked) setIsPrompted(false); }} className="h-5 w-5 rounded text-blue-600 focus:ring-blue-500" /><span>Independent</span></label>
            </div>
            <button onClick={handleLog} className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg">Log Break</button>
        </DataCollectionToolContainer>
    );
};


// --- PAGE COMPONENTS ---
const DashboardPage = ({ currentUser }) => { const availableStudents = students.filter(s => currentUser.studentIds.includes(s.id)); const [selectedStudentId, setSelectedStudentId] = useState(availableStudents[0]?.id); useEffect(() => { if (!availableStudents.find(s => s.id === selectedStudentId)) { setSelectedStudentId(availableStudents[0]?.id); } }, [currentUser, availableStudents, selectedStudentId]); const filteredLogs = observationLogs.filter(log => log.studentId === selectedStudentId); const freqData = processFrequencyData(filteredLogs); const abcData = processAbcData(filteredLogs); const heatmapData = processHeatmapData(filteredLogs); return ( <div> <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1> <p className="text-gray-600 mb-6">Visualize student behavior data.</p> <div className="flex space-x-4 mb-6 p-4 bg-white rounded-2xl shadow-subtle"> <div> <label htmlFor="student-filter" className="block text-sm font-medium text-gray-700">Student</label> {currentUser.role === ROLES.PARENT ? ( <p className="text-lg font-semibold mt-1">{availableStudents[0]?.name || 'No student assigned'}</p> ) : ( <select id="student-filter" value={selectedStudentId} onChange={e => setSelectedStudentId(Number(e.target.value))} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"> {availableStudents.map(s => <option key={s.id} value={s.id}>{s.name}</option>)} </select> )} </div> </div> <ChartGrid> <FrequencyLineChart data={freqData} /> <BehaviorHeatmap data={heatmapData} /> <AbcBarChart data={abcData.antecedents} dataKey="count" title="Antecedent Counts" /> <AbcBarChart data={abcData.behaviors} dataKey="count" title="Behavior Counts" /> <AbcBarChart data={abcData.consequences} dataKey="count" title="Consequence Counts" /> </ChartGrid> {currentUser.role !== ROLES.PARENT && <GeminiFbaHelper logs={filteredLogs} />} </div> ); };
const DataCollectionPage = () => {
    const handleLog = (data) => {
        console.log("Data Logged: ", data); // Save to Firestore
    };
    return (
        <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Data Collection</h1>
            <p className="text-gray-600 mb-6">Real-time observation and tracking tools.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FrequencyTracker title="Target Behavior" behaviorList={behaviorOptions} onLog={handleLog} isTargetBehavior={true} />
                <FrequencyTracker title="Replacement Behavior" behaviorList={replacementBehaviorOptions} onLog={handleLog} isTargetBehavior={false} />
                <BreakTracker onLog={handleLog} />
            </div>
        </div>
    );
};
const AdminPage = () => ( <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-subtle"><h1 className="text-4xl font-bold text-gray-800">Admin Panel</h1><p className="mt-4 text-gray-600">User management and system settings will go here.</p></div> );
const SettingsPage = () => ( <div className="w-full max-w-4xl p-8 bg-white rounded-2xl shadow-subtle"><h1 className="text-4xl font-bold text-gray-800">Settings</h1><p className="mt-4 text-gray-600">User preferences and app settings will go here.</p></div> );

// --- LOGIN SCREEN ---
const LoginScreen = ({ onLogin }) => ( <div className="flex h-screen items-center justify-center bg-gray-100"><div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-subtle space-y-4"><div className="flex items-center space-x-3 justify-center"><div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-2xl">C</div><h1 className="text-3xl font-bold text-gray-800">ClassCompass</h1></div><h2 className="text-center text-xl font-semibold text-gray-700">Select a user to log in</h2><div className="space-y-2">{mockUsers.map(user => ( <button key={user.id} onClick={() => onLogin(user)} className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors text-left"><p className="font-semibold">{user.name}</p><p className="text-sm text-gray-500">{user.role}</p></button>))}</div></div></div> );

// --- MAIN APP COMPONENT ---
export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => { const scriptId = 'recharts-script'; if (!document.getElementById(scriptId)) { const script = document.createElement('script'); script.id = scriptId; script.src = "https://unpkg.com/recharts/umd/Recharts.min.js"; script.async = true; script.onload = () => { console.log("Recharts script loaded."); }; document.head.appendChild(script); } }, []);
  const handleLogin = (user) => { setCurrentUser(user); setCurrentPage('dashboard'); };
  const handleLogout = () => { setCurrentUser(null); };
  if (!currentUser) { return <LoginScreen onLogin={handleLogin} />; }
  
  const renderPage = () => {
    switch (currentPage) {
      case 'data-collection': return <DataCollectionPage />;
      case 'admin': return <AdminPage />;
      case 'settings': return <SettingsPage />;
      case 'dashboard': default: return <DashboardPage currentUser={currentUser} />;
    }
  };
  
  const NavLink = ({ pageName, icon, children }) => ( <button onClick={() => setCurrentPage(pageName)} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${currentPage === pageName ? 'bg-blue-500 text-white shadow-md' : 'text-gray-500 hover:bg-gray-200 hover:text-gray-800'}`}>{icon}<span className="font-semibold">{children}</span></button> );
  const staffRoles = [ROLES.ADMIN, ROLES.TEACHER, ROLES.PARAPROFESSIONAL, ROLES.SPECIALIST];

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <nav className="w-64 bg-white p-6 shadow-lg flex flex-col justify-between">
        <div>
            <div className="flex items-center space-x-3 mb-10"><div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">C</div><h1 className="text-2xl font-bold text-gray-800">ClassCompass</h1></div>
            <div className="space-y-4">
                <NavLink pageName="dashboard" icon={<DashboardIcon />}>Dashboard</NavLink>
                {staffRoles.includes(currentUser.role) && <NavLink pageName="data-collection" icon={<ClipboardIcon />}>Data Collection</NavLink>}
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
