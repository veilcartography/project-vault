import React, { useState, useEffect, useRef } from 'react';
import { 
  Check, 
  Sparkles, 
  Mic, 
  MicOff, 
  Trash2, 
  Download, 
  Copy, 
  BookOpen, 
  Clock, 
  Layers, 
  CheckSquare, 
  Smile, 
  Info, 
  Volume2, 
  User, 
  Settings, 
  ChevronRight, 
  Share2, 
  Undo2,
  FileText
} from 'lucide-react';

export default function App() {
  // Form State
  const [techStackInput, setTechStackInput] = useState('');
  const [techStackList, setTechStackList] = useState(['Gmail', 'Google Calendar', 'Slack', 'WhatsApp']);
  const [comfortLevel, setComfortLevel] = useState('Hands-on learner');
  const [interfacePrefs, setInterfacePrefs] = useState(['Text input', 'Web interface']);
  const [learningPatience, setLearningPatience] = useState('Short tutorial OK');
  const [idealOutcome, setIdealOutcome] = useState('Save 4 hours a week on repetitive emails and coordinate schedules effortlessly.');
  const [timeHorizon, setTimeHorizon] = useState('Full week');

  // UI & Interaction States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTarget, setRecordingTarget] = useState(null); // 'stack' or 'outcome'
  const [speechSupported, setSpeechSupported] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeTab, setActiveTab] = useState('form'); // 'form' | 'blueprint' | 'history'
  
  // Gemini API States
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBlueprint, setGeneratedBlueprint] = useState('');
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [generationError, setGenerationError] = useState('');

  // Speech Recognition reference
  const recognitionRef = useRef(null);

  // Constants
  const COMFORT_OPTIONS = [
    { value: 'Voice-first', label: '🎙️ Voice-first', desc: 'Prefer speaking, dictate messages, use voice assistants.' },
    { value: 'Text-comfortable', label: '⌨️ Text-comfortable', desc: 'Love typing, keyboard shortcuts, clean terminal/text layouts.' },
    { value: 'Hands-on learner', label: '🛠️ Hands-on learner', desc: 'Prefer interactive clicking, testing layouts, learning by doing.' },
    { value: 'Skeptical', label: '🔍 Skeptical', desc: 'Want direct proof of utility, minimal hype, highly robust features.' }
  ];

  const INTERFACE_OPTIONS = [
    { value: 'Voice/dictation', label: 'Voice / Dictation', icon: Mic },
    { value: 'Text input', label: 'Text Input', icon: Layers },
    { value: 'Email', label: 'Email Integrations', icon: CheckSquare },
    { value: 'Web interface', label: 'Web Dashboard', icon: Layers },
    { value: 'Simple/minimal', label: 'Minimal / Clean UI', icon: Smile }
  ];

  const PATIENCE_OPTIONS = [
    { value: 'Just try it, no training', label: '🚀 Dive In', desc: 'No tutorials, immediate trial-and-error.' },
    { value: 'Short tutorial OK', label: '📖 Quick Guide', desc: 'A 2-minute walkthrough or cheat-sheet is great.' },
    { value: 'I want to understand first', label: '🧠 Deep Dive', desc: 'Give me the mental model, guides, and theory first.' }
  ];

  const TIME_HORIZONS = [
    { value: '3-5 days', label: '⚡ Sprint (3-5 days)', desc: 'Quick setup, immediate payoff.' },
    { value: 'Full week', label: '📅 Standard (1 week)', desc: 'Balanced onboarding and system configuration.' },
    { value: 'Ongoing', label: '🌱 Adaptive (Ongoing)', desc: 'Continuous learning, steady refinement.' }
  ];

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (recordingTarget === 'outcome') {
          setIdealOutcome((prev) => prev + (finalTranscript || interimTranscript));
        } else if (recordingTarget === 'stack') {
          setTechStackInput((prev) => prev + (finalTranscript || interimTranscript));
        }
      };

      rec.onerror = (err) => {
        console.error('Speech recognition error:', err);
        showToast('Microphone error or permission denied.', 'error');
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }

    // Load saved configurations
    const localData = localStorage.getItem('baseline_profiles');
    if (localData) {
      try {
        setSavedProfiles(JSON.parse(localData));
      } catch (e) {
        console.error(e);
      }
    }
  }, [recordingTarget]);

  // Toast helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Toggle Dictation
  const toggleRecording = (target) => {
    if (!speechSupported) {
      showToast("Speech recognition not supported in this browser.", "info");
      return;
    }

    if (isRecording && recordingTarget === target) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      if (isRecording) {
        recognitionRef.current.stop();
      }
      setRecordingTarget(target);
      setIsRecording(true);
      try {
        recognitionRef.current.start();
        showToast(`Listening for ${target === 'stack' ? 'Tech Stack' : 'Ideal Outcome'}...`, 'info');
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Tech Stack Handlers
  const handleAddTech = (e) => {
    e.preventDefault();
    const trimmed = techStackInput.trim();
    if (trimmed) {
      // Split by commas or enter
      const items = trimmed.split(/,|\n/).map(i => i.trim()).filter(i => i && !techStackList.includes(i));
      if (items.length > 0) {
        setTechStackList([...techStackList, ...items]);
        setTechStackInput('');
        showToast(`Added ${items.length} tool(s) to stack`);
      }
    }
  };

  const removeTechItem = (itemToRemove) => {
    setTechStackList(techStackList.filter(item => item !== itemToRemove));
  };

  // Interface preferences handler
  const toggleInterfacePref = (pref) => {
    if (interfacePrefs.includes(pref)) {
      setInterfacePrefs(interfacePrefs.filter(p => p !== pref));
    } else {
      setInterfacePrefs([...interfacePrefs, pref]);
    }
  };

  // Export Data
  const getPayload = () => {
    return {
      timestamp: new Date().toISOString(),
      techStack: techStackList,
      comfortLevel,
      interfacePrefs,
      learningPatience,
      idealOutcome,
      timeHorizon
    };
  };

  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(getPayload(), null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "baseline_intake_profile.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Profile exported as JSON!");
  };

  const copyMarkdown = () => {
    const md = `# Baseline Intake Profile
Generated on: ${new Date().toLocaleDateString()}

## Section 1: Baseline Profile
* **Current Tech Stack:** ${techStackList.join(', ') || 'None listed'}
* **Tech Comfort Level:** ${comfortLevel}
* **Interface Preferences:** ${interfacePrefs.join(', ') || 'None'}
* **Learning Patience:** ${learningPatience}
* **Ideal Outcome:** ${idealOutcome || 'None specified'}
* **Time Horizon:** ${timeHorizon}
`;
    // Use standard fallback for clipboard
    const el = document.createElement('textarea');
    el.value = md;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showToast("Markdown copied to clipboard!");
  };

  // Local Saving
  const handleSaveProfile = () => {
    const payload = getPayload();
    const updated = [payload, ...savedProfiles.slice(0, 9)];
    setSavedProfiles(updated);
    localStorage.setItem('baseline_profiles', JSON.stringify(updated));
    showToast("Profile locally archived!");
  };

  // Reset Form
  const resetForm = () => {
    setTechStackList([]);
    setTechStackInput('');
    setComfortLevel('Hands-on learner');
    setInterfacePrefs([]);
    setLearningPatience('Short tutorial OK');
    setIdealOutcome('');
    setTimeHorizon('Full week');
    showToast("Form cleared.");
  };

  // Load an existing archive profile
  const loadProfile = (prof) => {
    setTechStackList(prof.techStack || []);
    setComfortLevel(prof.comfortLevel || 'Hands-on learner');
    setInterfacePrefs(prof.interfacePrefs || []);
    setLearningPatience(prof.learningPatience || 'Short tutorial OK');
    setIdealOutcome(prof.idealOutcome || '');
    setTimeHorizon(prof.timeHorizon || 'Full week');
    setActiveTab('form');
    showToast("Profile loaded into workspace.");
  };

  // Gemini API Strategy Generator
  const generateTechStrategy = async () => {
    setIsGenerating(true);
    setGenerationError('');
    setActiveTab('blueprint');
    
    const apiKey = ""; // Kept empty as per environment rules
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    
    const userPrompt = `
Analyze the following Baseline Intake Form responses and generate a stunningly creative, highly personalized, and realistic "Tech Strategy & Optimization Blueprint".

---
### RESPONSES:
- **Current Tech Stack**: ${techStackList.join(', ') || 'No tech tools provided yet.'}
- **Tech Comfort Level**: ${comfortLevel} (e.g., Prefers ${COMFORT_OPTIONS.find(o => o.value === comfortLevel)?.desc || ''})
- **Interface Preferences**: ${interfacePrefs.join(', ') || 'No preference indicated'}
- **Learning Patience**: ${learningPatience} (Learning Style: ${PATIENCE_OPTIONS.find(o => o.value === learningPatience)?.desc || ''})
- **Ideal Outcome**: "${idealOutcome}"
- **Time Horizon**: Accomplish this within ${timeHorizon}
---

Please format your response into clean, styled sections:
1.  **🚀 EXECUTIVE SUMMARY PROFILE**: Analyze what their profile says about their technology habits, strengths, and primary friction points. Give them a cool archetype name!
2.  **🔧 CURRENT STACK OPTIMIZATION**: Take their exact current stack [${techStackList.join(', ')}] and suggest 1-2 powerful integrations or tricks that fit their comfort level to make their current tools work 10x better together.
3.  **🌟 FUTURE-PROOF TOOL RECOMMENDATIONS**: Suggest 2-3 specific innovative or AI-driven tools that match their exact Interface Preferences and Comfort Levels to deliver their Ideal Outcome.
4.  **📅 STEP-BY-STEP ACTION TIMELINE (${timeHorizon})**: A day-by-day/phase-by-phase playbook that matches their Learning Patience (${learningPatience}) to minimize friction and build unstoppable momentum.
5.  **⚡ QUICK-WIN EXPERIMENTS**: Provide 2-3 immediate, high-impact tasks they can do in under 15 minutes to feel progress today.

Make the tone engaging, professional, inspiring, and highly specific. Use emojis and markdown for outstanding presentation.
`;

    const systemPrompt = "You are an elite productivity strategist and human-centric systems designer. Your goal is to guide clients on adopting advanced productivity tools, automation frameworks, and AI workflows seamlessly according to their mental models, time constraints, and ultimate ambitions.";

    const payload = {
      contents: [{ parts: [{ text: userPrompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] }
    };

    // Exponential Backoff Retry logic
    let delay = 1000;
    const maxRetries = 5;
    let success = false;
    let responseText = "";

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const result = await response.json();
          responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to extract a response strategy. Please try again.";
          success = true;
          break;
        } else {
          throw new Error(`Response status: ${response.status}`);
        }
      } catch (error) {
        if (attempt === maxRetries - 1) {
          setGenerationError("We ran into persistent connectivity errors generating your strategy. Please try again in a few moments.");
          setIsGenerating(false);
          return;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // exponential backoff (1s, 2s, 4s, 8s, 16s)
      }
    }

    if (success) {
      setGeneratedBlueprint(responseText);
      showToast("Personalized Tech Strategy Blueprint Generated!", "success");
    }
    setIsGenerating(false);
  };

  // Quick helper to convert Markdown simple headers/bold text to HTML for presentation
  const renderMarkdown = (text) => {
    if (!text) return '';
    return text
      .replace(/### (.*)/g, '<h4 class="text-md font-semibold text-violet-300 mt-5 mb-2">$1</h4>')
      .replace(/## (.*)/g, '<h3 class="text-lg font-bold text-violet-200 mt-6 mb-3 pb-1 border-b border-zinc-800">$1</h3>')
      .replace(/# (.*)/g, '<h2 class="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300 mt-8 mb-4">$1</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-zinc-100 font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-zinc-300">$1</em>')
      .replace(/- (.*)/g, '<li class="ml-4 list-disc text-zinc-300 my-1.5">$1</li>');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-violet-500/30 selection:text-violet-200">
      
      {/* Dynamic Toast Container */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center space-x-2 px-4 py-3 rounded-lg shadow-xl border backdrop-blur-md transition-all duration-300 ${
          toast.type === 'error' ? 'bg-rose-950/90 border-rose-500/30 text-rose-200' :
          toast.type === 'info' ? 'bg-indigo-950/90 border-indigo-500/30 text-indigo-200' :
          'bg-emerald-950/90 border-emerald-500/30 text-emerald-200'
        }`}>
          <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/10">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Baseline Intake Workspace
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-violet-500/10 text-violet-400 rounded-full border border-violet-500/20">
                  Fill Once
                </span>
              </h1>
              <p className="text-xs text-zinc-400">Section 1: Setup current system parameters & goals</p>
            </div>
          </div>

          {/* Quick Stats & Global Actions */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeTab === 'form' 
                  ? 'bg-zinc-850 text-white shadow-inner border border-zinc-700' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              Intake Form
            </button>
            <button
              onClick={() => setActiveTab('blueprint')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === 'blueprint' 
                  ? 'bg-zinc-850 text-white shadow-inner border border-zinc-700' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              Strategy Blueprint
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeTab === 'history' 
                  ? 'bg-zinc-850 text-white shadow-inner border border-zinc-700' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              Local Archives ({savedProfiles.length})
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: The Interactive Intake Form / Dashboard Controls */}
        <section className={`lg:col-span-7 space-y-8 ${activeTab !== 'form' ? 'hidden lg:block' : ''}`}>
          
          <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 space-y-6 backdrop-blur-sm">
            
            {/* Form Info Box */}
            <div className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-800/60 flex gap-3">
              <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-zinc-200">Workspace Guidelines</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Establish your baseline parameters below. This data will formulate a contextual system architecture tailored to your comfort and pacing. Save locally or run the live AI analysis.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              
              {/* Field 1: Current Tech Stack */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase font-semibold tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    Current Tech Stack
                  </label>
                  <span className="text-[10px] text-zinc-500">Text / Bullet List / Dictated</span>
                </div>
                <p className="text-xs text-zinc-400 leading-normal">
                  What technologies, services, or tools do you interact with regularly? (e.g., Slack, Alexa, Outlook, Notion, Gmail, etc.)
                </p>
                
                {/* Custom Stack Builder */}
                <form onSubmit={handleAddTech} className="flex gap-2 mt-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={techStackInput}
                      onChange={(e) => setTechStackInput(e.target.value)}
                      placeholder="Type a tool name (or paste separated by commas) and press Enter..."
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-sm px-3 py-2 rounded-xl text-zinc-200 placeholder-zinc-600 transition duration-150"
                    />
                    {speechSupported && (
                      <button
                        type="button"
                        onClick={() => toggleRecording('stack')}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition ${
                          isRecording && recordingTarget === 'stack'
                            ? 'bg-rose-500/20 text-rose-400 animate-pulse'
                            : 'hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300'
                        }`}
                        title="Voice dictate tool names"
                      >
                        {isRecording && recordingTarget === 'stack' ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="bg-zinc-850 hover:bg-zinc-800 border border-zinc-750 text-zinc-200 text-xs font-semibold px-4 py-2 rounded-xl transition duration-150"
                  >
                    Add
                  </button>
                </form>

                {/* Tags Layout */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {techStackList.length === 0 ? (
                    <div className="text-xs text-zinc-600 italic py-1">No items added to stack. Enter above to start.</div>
                  ) : (
                    techStackList.map((item, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 transition duration-150 hover:border-zinc-700"
                      >
                        {item}
                        <button 
                          type="button" 
                          onClick={() => removeTechItem(item)}
                          className="text-zinc-500 hover:text-rose-400 transition ml-0.5"
                        >
                          &times;
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              {/* Field 2: Tech Comfort Level */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase font-semibold tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    Tech Comfort Level
                  </label>
                  <span className="text-[10px] text-zinc-500">Select One</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {COMFORT_OPTIONS.map((opt) => (
                    <div
                      key={opt.value}
                      onClick={() => setComfortLevel(opt.value)}
                      className={`cursor-pointer p-3.5 rounded-xl border text-left transition duration-200 relative overflow-hidden ${
                        comfortLevel === opt.value
                          ? 'bg-violet-950/20 border-violet-500/55 shadow-md shadow-violet-500/5'
                          : 'bg-zinc-950/50 border-zinc-850 hover:border-zinc-800 hover:bg-zinc-950'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-zinc-100">{opt.label}</span>
                        {comfortLevel === opt.value && (
                          <div className="h-4 w-4 rounded-full bg-violet-500 flex items-center justify-center text-white">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{opt.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Field 3: Interface Preference */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase font-semibold tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    Interface Preference
                  </label>
                  <span className="text-[10px] text-zinc-500">Multi-select</span>
                </div>
                <p className="text-xs text-zinc-400 leading-normal">
                  Select your favored channels or formats. Choose as many as fit your workspace patterns.
                </p>
                <div className="flex flex-wrap gap-2">
                  {INTERFACE_OPTIONS.map((opt) => {
                    const isSelected = interfacePrefs.includes(opt.value);
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => toggleInterfacePref(opt.value)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition duration-150 ${
                          isSelected
                            ? 'bg-violet-900/10 border-violet-500/50 text-violet-300'
                            : 'bg-zinc-950/50 border-zinc-850 text-zinc-400 hover:text-zinc-200 hover:border-zinc-800'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-violet-400' : 'text-zinc-500'}`} />
                        {opt.value}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Field 4: Learning Patience */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase font-semibold tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                    Learning Patience
                  </label>
                  <span className="text-[10px] text-zinc-500">Select One</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {PATIENCE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setLearningPatience(opt.value)}
                      className={`p-3.5 rounded-xl border text-left flex flex-col justify-between h-28 transition duration-200 ${
                        learningPatience === opt.value
                          ? 'bg-violet-950/20 border-violet-500/55 shadow-md'
                          : 'bg-zinc-950/50 border-zinc-850 hover:border-zinc-800 hover:bg-zinc-950'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-zinc-200">{opt.label}</span>
                        {learningPatience === opt.value && (
                          <div className="h-4 w-4 rounded-full bg-violet-500 flex items-center justify-center text-white">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-normal mt-2">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 5: Ideal Outcome */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase font-semibold tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
                    Ideal Outcome
                  </label>
                  <span className="text-[10px] text-zinc-500">Long-form or Voice-dictated</span>
                </div>
                <p className="text-xs text-zinc-400 leading-normal">
                  What would make your life significantly easier? Be greedy. No limits. (e.g., "Automate my scheduling sync", "Free up 5 hours weekly for physical training")
                </p>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={idealOutcome}
                    onChange={(e) => setIdealOutcome(e.target.value)}
                    placeholder="Describe your perfect state of automated efficiency..."
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-sm px-3.5 py-3 rounded-xl text-zinc-200 placeholder-zinc-655 leading-relaxed resize-y"
                  />
                  {speechSupported && (
                    <button
                      type="button"
                      onClick={() => toggleRecording('outcome')}
                      className={`absolute right-3.5 bottom-3.5 p-2 rounded-xl transition ${
                        isRecording && recordingTarget === 'outcome'
                          ? 'bg-rose-500/20 text-rose-400 animate-pulse'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                      }`}
                      title="Voice dictate response"
                    >
                      {isRecording && recordingTarget === 'outcome' ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] tracking-wide font-bold">LISTENING</span>
                          <MicOff className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] tracking-wide font-medium text-zinc-500">DICTATE</span>
                          <Mic className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  )}
                </div>
                
                {/* Visual Audio Wave animation when recording */}
                {isRecording && (
                  <div className="flex items-center justify-center gap-1 py-1.5 bg-rose-500/5 rounded-lg border border-rose-500/10">
                    <span className="text-[10px] text-rose-400/80 mr-2 font-mono">Continuous Stream Mode:</span>
                    <div className="h-3 w-0.5 bg-rose-500 animate-pulse rounded-full"></div>
                    <div className="h-5 w-0.5 bg-rose-400 animate-pulse delay-75 rounded-full"></div>
                    <div className="h-4 w-0.5 bg-rose-500 animate-pulse delay-100 rounded-full"></div>
                    <div className="h-6 w-0.5 bg-rose-400 animate-pulse delay-150 rounded-full"></div>
                    <div className="h-2 w-0.5 bg-rose-500 animate-pulse delay-200 rounded-full"></div>
                  </div>
                )}
              </div>

              {/* Field 6: Time Horizon */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase font-semibold tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    Time Horizon
                  </label>
                  <span className="text-[10px] text-zinc-500">Select One</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {TIME_HORIZONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setTimeHorizon(opt.value)}
                      className={`p-3.5 rounded-xl border text-left flex flex-col justify-between h-24 transition duration-200 ${
                        timeHorizon === opt.value
                          ? 'bg-violet-950/20 border-violet-500/55 shadow-md'
                          : 'bg-zinc-950/50 border-zinc-850 hover:border-zinc-800 hover:bg-zinc-950'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-zinc-200">{opt.label}</span>
                        {timeHorizon === opt.value && (
                          <div className="h-4 w-4 rounded-full bg-violet-500 flex items-center justify-center text-white">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-normal mt-2">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Utility / Submission Controls */}
            <div className="pt-6 border-t border-zinc-900 flex flex-wrap gap-3 items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-rose-400 rounded-xl transition duration-150"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-850 text-xs font-semibold text-zinc-300 hover:text-white rounded-xl transition duration-150"
                  title="Store draft parameters on local browser profile"
                >
                  Save Draft
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="inline-flex rounded-xl overflow-hidden border border-zinc-800">
                  <button
                    type="button"
                    onClick={copyMarkdown}
                    className="bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs font-medium px-3.5 py-2 transition"
                    title="Copy response markdown"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={downloadJSON}
                    className="bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs font-medium px-3.5 py-2 border-l border-zinc-900 transition"
                    title="Export response profile JSON file"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={generateTechStrategy}
                  className="relative group bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition duration-200 flex items-center gap-2 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 overflow-hidden"
                >
                  <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                  <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                  Generate My Strategy
                </button>
              </div>
            </div>

          </div>

        </section>

        {/* RIGHT COLUMN: Interactive Strategy Blueprint Output & Local Archive Records */}
        <section className={`lg:col-span-5 space-y-8 ${activeTab === 'form' ? 'hidden lg:block' : ''}`}>
          
          {/* Active Tab content: Strategy Blueprint View */}
          {activeTab === 'blueprint' && (
            <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 space-y-6 backdrop-blur-sm relative min-h-[500px] flex flex-col justify-between">
              
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                    <h2 className="text-sm uppercase tracking-wider font-extrabold text-white">Tech Strategy Blueprint</h2>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-violet-950/50 text-violet-300 border border-violet-500/20 uppercase tracking-widest">
                    AI Guided Synthesis
                  </span>
                </div>

                {isGenerating ? (
                  /* Immersive Loading State with simulated intelligence steps */
                  <div className="py-12 flex flex-col items-center justify-center space-y-4">
                    <div className="relative flex items-center justify-center w-16 h-16">
                      <div className="absolute w-12 h-12 border-4 border-t-violet-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                      <div className="absolute w-16 h-16 border-2 border-dashed border-indigo-500/40 rounded-full animate-pulse"></div>
                      <Sparkles className="w-6 h-6 text-violet-400" />
                    </div>
                    <div className="text-center space-y-1.5 max-w-xs">
                      <h4 className="text-sm font-semibold text-zinc-200 animate-pulse">Analyzing Workflow Matrix...</h4>
                      <p className="text-xs text-zinc-500 leading-relaxed">
                        Cross-referencing comfort level: <span className="text-zinc-400">{comfortLevel}</span> with time horizon: <span className="text-zinc-400">{timeHorizon}</span>...
                      </p>
                    </div>
                  </div>
                ) : generatedBlueprint ? (
                  /* Strategy Render Layout */
                  <div className="py-2 space-y-4 max-h-[600px] overflow-y-auto pr-1">
                    <div 
                      className="text-xs text-zinc-300 leading-relaxed space-y-3 prose prose-invert"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(generatedBlueprint) }}
                    />
                  </div>
                ) : (
                  /* Empty state instruction */
                  <div className="py-16 text-center space-y-4">
                    <div className="h-12 w-12 rounded-xl bg-zinc-950 border border-zinc-850 flex items-center justify-center mx-auto text-zinc-500">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-zinc-300">Strategy Matrix Empty</h4>
                      <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                        Configure your current technology and desired outcomes in the form, then click 'Generate My Strategy' to spawn your automated plan.
                      </p>
                    </div>
                    <button
                      onClick={generateTechStrategy}
                      className="px-4 py-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-800 rounded-xl text-xs font-semibold text-zinc-300 transition"
                    >
                      Run Generator Using Defaults
                    </button>
                  </div>
                )}

                {generationError && (
                  <div className="p-4 bg-rose-950/40 border border-rose-500/20 rounded-xl text-xs text-rose-300 my-4 leading-normal">
                    {generationError}
                  </div>
                )}
              </div>

              {/* Share and Action for Blueprint */}
              {generatedBlueprint && !isGenerating && (
                <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500">Ready to copy or integrate into notes</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const el = document.createElement('textarea');
                        el.value = generatedBlueprint;
                        document.body.appendChild(el);
                        el.select();
                        document.execCommand('copy');
                        document.body.removeChild(el);
                        showToast("Copied strategy layout text!");
                      }}
                      className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-800 rounded-lg text-xs font-semibold text-zinc-300 flex items-center gap-1.5 transition"
                    >
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      Copy Strategy Markdown
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Active Tab Content: History Archive View */}
          {activeTab === 'history' && (
            <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 space-y-6 backdrop-blur-sm">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-zinc-400" />
                  <h2 className="text-sm uppercase tracking-wider font-extrabold text-white">Saved Profile Archives</h2>
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-mono bg-zinc-950 text-zinc-400 border border-zinc-850">
                  LocalStorage Storage
                </span>
              </div>

              {savedProfiles.length === 0 ? (
                <div className="py-16 text-center space-y-4">
                  <div className="h-12 w-12 rounded-xl bg-zinc-950 border border-zinc-850 flex items-center justify-center mx-auto text-zinc-600">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-zinc-300">No Archive Logs Found</h4>
                    <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed">
                      Save drafts of your intake state settings to switch easily between different workflows.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {savedProfiles.map((prof, idx) => (
                    <div 
                      key={idx}
                      className="p-4 bg-zinc-950/60 border border-zinc-850 hover:border-zinc-800 rounded-xl space-y-3 transition duration-150"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[11px] font-semibold text-indigo-400">
                            {new Date(prof.timestamp).toLocaleString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <h4 className="text-xs font-bold text-zinc-200 mt-0.5">
                            {prof.comfortLevel} / {prof.timeHorizon} Playbook
                          </h4>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => loadProfile(prof)}
                            className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-md transition"
                            title="Load Profile into form"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              const updated = savedProfiles.filter((_, sIdx) => sIdx !== idx);
                              setSavedProfiles(updated);
                              localStorage.setItem('baseline_profiles', JSON.stringify(updated));
                              showToast("Profile log removed.");
                            }}
                            className="p-1.5 hover:bg-zinc-800 text-zinc-500 hover:text-rose-400 rounded-md transition"
                            title="Delete Profile Archive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400">
                        <div>
                          <span className="block text-zinc-600 font-semibold uppercase">Stack Size:</span>
                          <span>{prof.techStack?.length || 0} tools listed</span>
                        </div>
                        <div>
                          <span className="block text-zinc-600 font-semibold uppercase">Interface preferences:</span>
                          <span className="truncate block max-w-[150px]">{prof.interfacePrefs?.join(', ') || 'None'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Stats Grid Sidecard */}
          <div className="bg-zinc-900/20 border border-zinc-900/60 rounded-2xl p-6 space-y-4">
            <h3 className="text-xs uppercase font-extrabold tracking-widest text-zinc-500">Workspace Metadata</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-900">
                <span className="block text-[10px] text-zinc-600 font-semibold uppercase">Active Stack</span>
                <span className="text-lg font-bold text-zinc-200 mt-1 block">{techStackList.length}</span>
                <span className="text-[10px] text-zinc-500">Configured utilities</span>
              </div>

              <div className="bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-900">
                <span className="block text-[10px] text-zinc-600 font-semibold uppercase">Dictation Mode</span>
                <span className="text-sm font-bold text-zinc-200 mt-1.5 block flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${speechSupported ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                  {speechSupported ? 'Supported' : 'Unavailable'}
                </span>
                <span className="text-[10px] text-zinc-500">Speech-to-Text Status</span>
              </div>
            </div>

            <div className="p-3 bg-zinc-950/40 rounded-xl border border-zinc-900 text-[11px] text-zinc-500 leading-relaxed">
              <span className="text-zinc-400 font-semibold block mb-1">💡 Pro Tip</span>
              Use the microphone icons inside text input fields to dictate your responses instantly instead of typing, just as the standard Notion checklist specifies.
            </div>
          </div>

        </section>

      </main>

      {/* Workspace Footer */}
      <footer className="mt-auto border-t border-zinc-900 py-6 text-center text-[11px] text-zinc-500">
        <p>© 2026 Baseline Systems Design Co. — Designed for rapid onboarding diagnostics.</p>
      </footer>

    </div>
  );
}