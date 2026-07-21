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
  User, 
  ChevronRight, 
  FileText,
  Settings,
  X,
  Send
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
  
  // Gemini API & Modal States
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedBlueprint, setGeneratedBlueprint] = useState('');
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [generationError, setGenerationError] = useState('');
  const [showApiModal, setShowApiModal] = useState(false);
  const [showFallbackModal, setShowFallbackModal] = useState(false);
  const [fallbackPromptType, setFallbackPromptType] = useState('playbook'); // 'playbook' | 'suggest_tools' | 'upgrade_outcome'
  const [fallbackPromptText, setFallbackPromptText] = useState('');
  const [externalResponsePaste, setExternalResponsePaste] = useState('');
  const [apiKeyValue, setApiKeyValue] = useState('');

  // AI features states
  const [isSuggestingTools, setIsSuggestingTools] = useState(false);
  const [showSmartTools, setShowSmartTools] = useState(false);
  const [aiSuggestedTools, setAiSuggestedTools] = useState([]);
  const [isUpgradingOutcome, setIsUpgradingOutcome] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatting, setIsChatting] = useState(false);

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
    { value: 'Full week', label: '📅 Standard (1 week)', desc: 'Balanced onboarding.' },
    { value: 'Ongoing', label: '🌱 Adaptive (Ongoing)', desc: 'Continuous steady refinement.' }
  ];

  // Map state setters explicitly to avoid ReferenceErrors in click events
  const selectComfort = (val) => setComfortLevel(val);
  const selectPatience = (val) => setLearningPatience(val);
  const selectHorizon = (val) => setTimeHorizon(val);

  // Initialize Speech Recognition & API local keys
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

    // Load saved API keys
    const savedKey = localStorage.getItem('baseline_gemini_api_key');
    if (savedKey) {
      setApiKeyValue(savedKey);
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
    if (e) e.preventDefault();
    const trimmed = techStackInput.trim();
    if (trimmed) {
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

  // Dynamic Suggestion tool appender
  const addSuggestedTool = (name) => {
    if (!techStackList.includes(name)) {
      setTechStackList(prev => [...prev, name]);
      showToast(`Added ${name} to stack!`);
    }
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
    const el = document.createElement('textarea');
    el.value = md;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showToast("Markdown copied to clipboard!");
  };

  // Local Saving - Unified to saveProfileLocally to prevent ReferenceError
  const saveProfileLocally = () => {
    const payload = getPayload();
    const updated = [payload, ...savedProfiles.slice(0, 9)];
    setSavedProfiles(updated);
    localStorage.setItem('baseline_profiles', JSON.stringify(updated));
    showToast("Profile locally archived!");
  };

  // Reset Form
  const clearForm = () => {
    setTechStackList([]);
    setTechStackInput('');
    setComfortLevel('Hands-on learner');
    setInterfacePrefs([]);
    setLearningPatience('Short tutorial OK');
    setIdealOutcome('');
    setTimeHorizon('Full week');
    setShowSmartTools(false);
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

  // Key configurations managers
  const saveApiKeyLocal = () => {
    if (apiKeyValue.trim()) {
      localStorage.setItem('baseline_gemini_api_key', apiKeyValue.trim());
      showToast("API Key updated and stored securely!");
    } else {
      localStorage.removeItem('baseline_gemini_api_key');
      showToast("API Key removed from local device.");
    }
    setShowApiModal(false);
  };

  const clearApiKeyLocal = () => {
    localStorage.removeItem('baseline_gemini_api_key');
    setApiKeyValue('');
    setShowApiModal(false);
    showToast("API configuration deleted.");
  };

  // Prompt Generator for manual copier
  const generateFallbackPromptText = (type) => {
    const stack = techStackList.join(', ') || 'No tech tools provided yet.';
    const outcomeVal = idealOutcome || 'No specified outcome';
    
    if (type === 'suggest_tools') {
      return `Analyze my system preferences and output exactly 5 smart, modern tool suggestions that fit my lifestyle.
---
TECH COMFORT: ${comfortLevel}
INTERFACE PREFERENCE: ${interfacePrefs.join(', ') || 'Any'}
IDEAL OUTCOME: "${outcomeVal}"
EXCLUDE ALREADY KNOWN TOOLS: [${stack}]
---

Please reply in valid, raw JSON format matching this schema strictly without any conversational markdown wrapper (do not wrap inside \`\`\`json block, just return raw JSON):
{
  "recommendations": [
    {
      "name": "Tool Name",
      "reason": "Clear explanation under 15 words on why it fits my specific comfort/outcome needs."
    }
  ]
}`;
    }

    if (type === 'upgrade_outcome') {
      return `Enhance and polish my simple workspace outcome goals into an executive productivity objective. Keep it highly realistic, professional, and under 30 words.
---
RAW STATEMENT: "${outcomeVal}"
Comfort Level: ${comfortLevel}
---

Provide ONLY the final enhanced statement directly. No preamble or explanations.`;
    }

    return `Act as an elite productivity strategist and human-centric systems designer. Analyze my baseline dashboard parameters and generate a highly personalized "Tech Strategy & Optimization Blueprint" playbook.

---
CLIENT BASES:
- Current Tech Stack: ${stack}
- Tech Comfort Level: ${comfortLevel}
- Interface Preferences: ${interfacePrefs.join(', ') || 'Any preference'}
- Learning Patience: ${learningPatience}
- Ideal Outcome Goal: "${outcomeVal}"
- Action Time Horizon: Accomplish within ${timeHorizon}
---

Format your response in structured sections using clean Markdown:
# 🚀 EXECUTIVE SUMMARY PROFILE
Analyze my technology habits, strengths, and friction points. Give me a creative tech-user archetype name.

## 🔧 CURRENT STACK OPTIMIZATION
Analyze [${stack}] and suggest 1-2 integrations or configurations to make current tools work 10x better together.

## 🌟 FUTURE-PROOF RECOMMENDATIONS
Suggest 2-3 innovative AI-driven tools matching Interface Preferences & Comfort levels.

## 📅 STEP-BY-STEP TIMELINE (${timeHorizon})
Provide a daily/weekly adoption playbook structured around my Learning Patience (${learningPatience}) to minimize onboarding friction.

## ⚡ QUICK-WIN EXPERIMENTS
Provide 2-3 immediate workflow tasks I can do in under 15 minutes to feel progress today.`;
  };

  const handleApplyExternalPaste = () => {
    if (!externalResponsePaste.trim()) {
      showToast("Please paste the generated AI response first!", "error");
      return;
    }

    try {
      const parsed = JSON.parse(externalResponsePaste);
      if (parsed.recommendations) {
        setAiSuggestedTools(parsed.recommendations);
        setShowSmartTools(true);
        showToast("AI suggested tools applied successfully!");
        setShowFallbackModal(false);
        return;
      }
    } catch (e) {
      // Not JSON, continue to raw markdown parser
    }

    if (fallbackPromptType === 'upgrade_outcome' || externalResponsePaste.length < 150) {
      setIdealOutcome(externalResponsePaste.replace(/"/g, '').trim());
      showToast("Upgraded outcome statement applied!");
      setShowFallbackModal(false);
      return;
    }

    setGeneratedBlueprint(externalResponsePaste);
    setActiveTab('blueprint');
    showToast("Playbook strategy loaded into dashboard!");
    setShowFallbackModal(false);
  };

  // Secure Direct API wrapper
  const callGeminiDirect = async (prompt, systemInstruction = "", schema = null) => {
    const storedKey = localStorage.getItem('baseline_gemini_api_key') || "";
    if (!storedKey) {
      throw new Error("NO_API_KEY");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${storedKey}`;
    
    const payload = {
      contents: [{ parts: [{ text: prompt }] }]
    };
    
    if (systemInstruction) {
      payload.systemInstruction = { parts: [{ text: systemInstruction }] };
    }

    if (schema) {
      payload.generationConfig = {
        responseMimeType: "application/json",
        responseSchema: schema
      };
    }

    let delay = 1000;
    const maxRetries = 5;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const result = await response.json();
          return result.candidates?.[0]?.content?.parts?.[0]?.text || null;
        } else {
          throw new Error(`Status: ${response.status}`);
        }
      } catch (error) {
        if (attempt === maxRetries - 1) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      }
    }
    return null;
  };

  // ✨ DIRECT FEATURE 1: Smart Suggest tool combinations
  const handleSuggestTools = async () => {
    setIsSuggestingTools(true);
    setShowSmartTools(true);
    
    const systemPrompt = "You are an expert tech stack engineer who suggests modern productivity/automation tools based on user styles.";
    const userPrompt = `
Based on this profile setup, suggest exactly 5 specific, highly relevant technology tools that this user should consider adding to their stack:
- Comfort Level: ${comfortLevel}
- Interface Preferences: ${interfacePrefs.join(', ') || 'Any'}
- Ideal Outcome: "${idealOutcome}"

Only suggest tools NOT already in this list: [${techStackList.join(', ')}].
`;

    const schema = {
      type: "OBJECT",
      properties: {
        recommendations: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              name: { type: "STRING" },
              reason: { type: "STRING" }
            },
            required: ["name", "reason"]
          }
        }
      },
      required: ["recommendations"]
    };

    try {
      const rawJsonText = await callGeminiDirect(userPrompt, systemPrompt, schema);
      if (rawJsonText) {
        const parsed = JSON.parse(rawJsonText);
        setAiSuggestedTools(parsed.recommendations || []);
        showToast("Automated tool pairings generated!");
      }
    } catch (err) {
      if (err.message === "NO_API_KEY") {
        setFallbackPromptType('suggest_tools');
        setFallbackPromptText(generateFallbackPromptText('suggest_tools'));
        setShowFallbackModal(true);
      } else {
        showToast("Unable to fetch recommendations. Try fallback copier instead.", "error");
      }
    } finally {
      setIsSuggestingTools(false);
    }
  };

  // ✨ DIRECT FEATURE 2: Polish vague outcomes
  const handleUpgradeOutcome = async () => {
    if (!idealOutcome.trim()) {
      showToast("Please type or dictate some notes first!", "error");
      return;
    }

    setIsUpgradingOutcome(true);

    const systemPrompt = "You are a professional workflow designer. You take vague, simple, or rough outcome descriptions and polish them into clear, actionable, high-impact business and technical outcome statements under 30 words. Keep it highly realistic and ambitious.";
    const userPrompt = `Enhance this raw outcome description: "${idealOutcome}"`;

    try {
      const upgraded = await callGeminiDirect(userPrompt, systemPrompt);
      if (upgraded) {
        setIdealOutcome(upgraded.trim().replace(/"/g, ''));
        showToast("Goal statement refined beautifully!");
      }
    } catch (err) {
      if (err.message === "NO_API_KEY") {
        setFallbackPromptType('upgrade_outcome');
        setFallbackPromptText(generateFallbackPromptText('upgrade_outcome'));
        setShowFallbackModal(true);
      } else {
        showToast("Could not refine outcome. Try fallback copier.", "error");
      }
    } finally {
      setIsUpgradingOutcome(false);
    }
  };

  // ✨ DIRECT FEATURE 3: Follow-Up Conversational adaptations
  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');
    setIsChatting(true);

    const promptText = `
ORIGINAL BLUEPRINT CONTEXT:
${generatedBlueprint}

USER CLARIFICATION/ADAPTATION:
"${userText}"

Adapt the strategy to address this specific feedback while staying aligned with their setup profile. Be concise (under 80 words).
`;

    const systemPrompt = "You are an elite productivity strategist. The user has an existing blueprint playbook which you need to modify based on their new questions or constraints. Respond concisely in under 80 words. Be realistic and extremely precise.";

    try {
      const aiResponse = await callGeminiDirect(promptText, systemPrompt);
      if (aiResponse) {
        setChatMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
        showToast("Playbook blueprint adapted successfully!");
      }
    } catch (err) {
      showToast("Failed to run chat follow-up. Make sure API key is loaded.", "error");
    } finally {
      setIsChatting(false);
    }
  };

  // Primary General Playbook logic
  const handleGeneratePlaybook = async () => {
    setIsGenerating(true);
    setGenerationError('');
    setActiveTab('blueprint');

    const userPrompt = `
Analyze the following Baseline Intake Form responses and generate a stunningly creative, highly personalized, and realistic "Tech Strategy & Optimization Blueprint".

---
### RESPONSES:
- **Current Tech Stack**: ${techStackList.join(', ') || 'No tech tools provided yet.'}
- **Tech Comfort Level**: ${comfortLevel}
- **Interface Preferences**: ${interfacePrefs.join(', ') || 'No preference indicated'}
- **Learning Patience**: ${learningPatience}
- **Ideal Outcome**: "${idealOutcome}"
- **Time Horizon**: Accomplish this within ${timeHorizon}
---

Please format your response into clean, styled sections:
1.  **🚀 EXECUTIVE SUMMARY PROFILE**: Analyze what their profile says about their technology habits, strengths, and primary friction points. Give them a cool archetype name!
2.  **🔧 CURRENT STACK OPTIMIZATION**: Take their exact current stack [${techStackList.join(', ')}] and suggest 1-2 powerful integrations or tricks that fit their comfort level to make their current tools work 10x better together.
3.  **🌟 FUTURE-PROOF TOOL RECOMMENDATIONS**: Suggest 2-3 specific innovative or AI-driven tools that match their exact Interface Preferences and Comfort Levels to deliver their Ideal Outcome.
4.  **📅 STEP-BY-STEP ACTION TIMELINE (${timeHorizon})**: A day-by-day/phase-by-phase playbook that matches their Learning Patience to minimize friction and build unstoppable momentum.
5.  **⚡ QUICK-WIN EXPERIMENTS**: Provide 2-3 immediate, high-impact tasks they can do in under 15 minutes to feel progress today.

Make the tone engaging, professional, inspiring, and highly specific. Use emojis and markdown for outstanding presentation.
`;

    const systemPrompt = "You are an elite productivity strategist and human-centric systems designer. Your goal is to guide clients on adopting advanced productivity tools, automation frameworks, and AI workflows seamlessly according to their mental models, time constraints, and ultimate ambitions.";

    try {
      const responseText = await callGeminiDirect(userPrompt, systemPrompt);
      if (responseText) {
        setGeneratedBlueprint(responseText);
        setChatMessages([]); // reset chat
        showToast("Personalized strategy playbook compiled!");
      }
    } catch (err) {
      if (err.message === "NO_API_KEY") {
        setFallbackPromptType('playbook');
        setFallbackPromptText(generateFallbackPromptText('playbook'));
        setShowFallbackModal(true);
        setGeneratedBlueprint('');
      } else {
        setGenerationError("Failed to reach Gemini servers. Please check your connectivity and try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const renderMarkdown = (text) => {
    if (!text) return '';
    return text
      .replace(/### (.*)/g, '<h4 class="text-md font-semibold text-violet-300 mt-5 mb-2">$1</h4>')
      .replace(/## (.*)/g, '<h3 class="text-lg font-bold text-violet-200 mt-6 mb-3 pb-1 border-b border-zinc-800">$1</h3>')
      .replace(/# (.*)/g, '<h2 class="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300 mt-8 mb-4">$1</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-zinc-100 font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-zinc-300">$1</em>')
      .replace(/- (.*)/g, '<li class="ml-4 list-disc text-zinc-300 my-1.5 font-normal">$1</li>');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-violet-500/30 selection:text-violet-200">
      
      {/* Toast Alert */}
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

      {/* Modal 1: Secure Direct Keys setup */}
      {showApiModal && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Settings className="w-4 h-4 text-violet-400" />
                Gemini Secure Key API
              </h3>
              <button onClick={() => setShowApiModal(false)} className="text-zinc-500 hover:text-white text-lg">&times;</button>
            </div>
            <div className="space-y-4">
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                This workspace executes client-side AI analysis dynamically. To run premium direct integrations on this page, save your Gemini developer key below. It remains safely saved inside your browser's private storage.
              </p>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Google Gemini API Key</label>
                <input 
                  type="password" 
                  value={apiKeyValue}
                  onChange={(e) => setApiKeyValue(e.target.value)}
                  placeholder="AIzaSy..." 
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-sm px-3.5 py-2.5 rounded-xl text-zinc-200"
                />
                <p className="text-[10px] text-zinc-500">
                  Generate keys instantly for free at <a href="https://aistudio.google.com/" target="_blank" className="text-violet-400 underline hover:text-violet-300">Google AI Studio</a>.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <button onClick={clearApiKeyLocal} className="text-xs text-rose-400 hover:text-rose-300 font-semibold">Clear Saved Key</button>
              <div className="flex gap-2">
                <button onClick={() => setShowApiModal(false)} className="px-3.5 py-2 bg-zinc-950 hover:bg-zinc-850 text-xs font-semibold rounded-xl border border-zinc-800 transition">Cancel</button>
                <button onClick={saveApiKeyLocal} className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-750 hover:to-indigo-750 text-xs text-white font-bold rounded-xl transition">Apply Key</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Fallback Copier modal */}
      {showFallbackModal && (
        <div className="fixed inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-violet-500 animate-pulse"></span>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Structured Fallback Assistant</h3>
              </div>
              <button onClick={() => setShowFallbackModal(false)} className="text-zinc-500 hover:text-white text-lg">&times;</button>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              No API Key is currently loaded. Use our streamlined fallback process: copy this dynamically populated prompt, run it inside any free chat utility (Gemini, ChatGPT, or Claude), and paste the result back below to populate the dashboard!
            </p>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Structured AI Prompt</span>
                <button 
                  onClick={() => {
                    const el = document.createElement('textarea');
                    el.value = fallbackPromptText;
                    document.body.appendChild(el);
                    el.select();
                    document.execCommand('copy');
                    document.body.removeChild(el);
                    showToast('Structured prompt template copied!', 'info');
                  }} 
                  className="text-xs text-violet-400 hover:text-violet-300 font-bold flex items-center gap-1.5 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy Prompt Structure
                </button>
              </div>
              <textarea 
                readOnly 
                rows="7" 
                value={fallbackPromptText}
                className="w-full bg-zinc-950 border border-zinc-850 p-3 rounded-xl text-xs text-zinc-400 font-mono leading-relaxed focus:outline-none select-all"
              />
            </div>
            <div className="space-y-2 border-t border-zinc-800 pt-4">
              <label className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Paste Response Back Below</label>
              <textarea 
                rows="3" 
                value={externalResponsePaste}
                onChange={(e) => setExternalResponsePaste(e.target.value)}
                placeholder="Paste response from ChatGPT / Gemini directly..." 
                className="w-full bg-zinc-950 border border-zinc-850 p-3 rounded-xl text-xs text-zinc-200 placeholder-zinc-750 leading-relaxed focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setShowFallbackModal(false)} className="px-4 py-2 bg-zinc-950 hover:bg-zinc-850 text-xs font-semibold rounded-xl border border-zinc-800 transition">Close</button>
              <button onClick={handleApplyExternalPaste} className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-750 text-xs text-white font-bold rounded-xl transition">Parse response to Dashboard</button>
            </div>
          </div>
        </div>
      )}

      {/* Main App Layout */}
      <header className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/10">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
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

          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                activeTab === 'form' 
                  ? 'bg-zinc-800 text-white shadow-inner border border-zinc-700' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              Intake Form
            </button>
            <button
              onClick={() => setActiveTab('blueprint')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                activeTab === 'blueprint' 
                  ? 'bg-zinc-800 text-white shadow-inner border border-zinc-700' 
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
                  ? 'bg-zinc-800 text-white shadow-inner border border-zinc-700' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              Local Archives ({savedProfiles.length})
            </button>
            
            {/* Gear Configuration Settings Button */}
            <button 
              onClick={() => setShowApiModal(true)} 
              className="p-2 ml-2 bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-zinc-800 transition text-zinc-400 hover:text-white"
              title="API Configuration"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form Parameters */}
        <section id="form-container" className={`lg:col-span-7 space-y-8 ${activeTab !== 'form' ? 'hidden lg:block' : ''}`}>
          <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 space-y-6 backdrop-blur-sm">
            
            <div className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-800/60 flex gap-3">
              <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-zinc-200">Workspace Guidelines</h3>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed font-normal">
                  Establish your baseline parameters below. This data will formulate a contextual system architecture tailored to your comfort and pacing. Save locally or run the live AI synthesis.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              
              {/* Field 1: Tech Stack List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase font-semibold tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    Current Tech Stack
                  </label>
                  <span className="text-[10px] text-zinc-500">Text / Bullet List / Dictated</span>
                </div>
                <p className="text-xs text-zinc-400">
                  What tools or services do you interact with regularly? (e.g., Slack, Alexa, Outlook, Notion, Gmail)
                </p>
                
                <form onSubmit={handleAddTech} className="flex gap-2 mt-2">
                  <div className="relative flex-1">
                    <input 
                      id="tech-input" 
                      type="text" 
                      value={techStackInput}
                      onChange={(e) => setTechStackInput(e.target.value)}
                      placeholder="Type tool name and press Enter..." 
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-sm px-3 py-2 rounded-xl text-zinc-200 placeholder-zinc-600 transition duration-150"
                    />
                    {speechSupported && (
                      <button 
                        type="button"
                        onClick={() => toggleRecording('stack')} 
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition ${
                          isRecording && recordingTarget === 'stack' ? 'text-rose-500 bg-rose-500/10' : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {isRecording && recordingTarget === 'stack' ? <MicOff className="w-4 h-4 animate-pulse" /> : <Mic className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                  <button type="submit" className="bg-zinc-850 hover:bg-zinc-800 border border-zinc-750 text-zinc-200 text-xs font-semibold px-4 py-2 rounded-xl transition">Add</button>
                </form>
                
                <div id="tech-tags-list" className="flex flex-wrap gap-1.5 pt-2">
                  {techStackList.map(item => (
                    <span key={item} className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-300 transition duration-150 hover:border-zinc-700">
                      {item}
                      <button onClick={() => removeTechItem(item)} className="text-zinc-500 hover:text-rose-400 transition ml-0.5">&times;</button>
                    </span>
                  ))}
                </div>

                {/* AI Automated Tools Suggester */}
                <div className="pt-2">
                  <button 
                    onClick={handleSuggestTools} 
                    disabled={isSuggestingTools}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-950/25 hover:bg-violet-950/50 text-violet-300 hover:text-violet-200 text-xs font-semibold rounded-lg border border-violet-900/40 transition"
                  >
                    <span>{isSuggestingTools ? "✨ Mapping Pairings..." : "✨ Suggest Matching Tools"}</span>
                  </button>

                  {showSmartTools && (
                    <div id="smart-tool-recommendations" className="mt-3 p-3 bg-zinc-950/50 rounded-xl border border-zinc-900 space-y-2">
                      <p className="text-[10px] uppercase font-bold text-violet-400 tracking-wider">✨ AI Suggested Additions</p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {aiSuggestedTools.length === 0 ? (
                          <span className="text-xs text-zinc-600 italic">No tools loaded. Try direct fallback.</span>
                        ) : (
                          aiSuggestedTools.map(tool => (
                            <button 
                              key={tool.name}
                              onClick={() => addSuggestedTool(tool.name)} 
                              className="group text-left p-2.5 bg-zinc-900/80 hover:bg-violet-950/20 border border-zinc-800 hover:border-violet-500/40 rounded-xl transition flex flex-col gap-1 w-full md:w-[48%]"
                            >
                              <span className="text-xs font-bold text-zinc-200 group-hover:text-violet-300 flex items-center justify-between w-full">
                                <span>✨ {tool.name}</span>
                                <span className="text-[10px] text-zinc-500 font-semibold group-hover:text-violet-400 bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-850">+ Add</span>
                              </span>
                              <span className="text-[10px] text-zinc-400 leading-normal font-normal">{tool.reason}</span>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Field 2: Tech Comfort */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase font-semibold tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    Tech Comfort Level
                  </label>
                  <span className="text-[10px] text-zinc-500">Select One</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {COMFORT_OPTIONS.map(opt => (
                    <div 
                      key={opt.value}
                      onClick={() => selectComfort(opt.value)}
                      className={`cursor-pointer p-3.5 rounded-xl border text-left transition duration-200 ${
                        comfortLevel === opt.value ? 'bg-violet-950/20 border-violet-500/55 shadow-md shadow-violet-500/5' : 'bg-zinc-950/50 border-zinc-850 hover:border-zinc-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-zinc-100">{opt.label}</span>
                        {comfortLevel === opt.value && <span className="text-xs text-violet-400 font-bold">✓</span>}
                      </div>
                      <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed font-normal">{opt.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Field 3: Interface Pref */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase font-semibold tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    Interface Preference
                  </label>
                  <span className="text-[10px] text-zinc-500">Multi-select</span>
                </div>
                <p className="text-xs text-zinc-400">Select your favored layout formats.</p>
                <div className="flex flex-wrap gap-2">
                  {INTERFACE_OPTIONS.map(opt => {
                    const selected = interfacePrefs.includes(opt.value);
                    return (
                      <button 
                        key={opt.value}
                        onClick={() => toggleInterfacePref(opt.value)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition ${
                          selected ? 'bg-violet-900/10 border-violet-500/50 text-violet-300' : 'bg-zinc-950/50 border-zinc-850 text-zinc-400 hover:text-zinc-200 hover:border-zinc-800'
                        }`}
                      >
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
                  {PATIENCE_OPTIONS.map(opt => (
                    <button 
                      key={opt.value}
                      onClick={() => selectPatience(opt.value)}
                      className={`p-3.5 rounded-xl border text-left flex flex-col justify-between h-28 transition duration-200 w-full ${
                        learningPatience === opt.value ? 'bg-violet-950/20 border-violet-500/55 shadow-md' : 'bg-zinc-950/50 border-zinc-850 hover:border-zinc-800'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-zinc-200">{opt.label}</span>
                        {learningPatience === opt.value && <span className="text-xs text-violet-400 font-bold">✓</span>}
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-normal mt-2 font-normal">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Field 5: Ideal Outcome Refiner */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase font-semibold tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />
                    Ideal Outcome
                  </label>
                  <span className="text-[10px] text-zinc-500">Long-form or Voice-dictated</span>
                </div>
                <p className="text-xs text-zinc-400">Describe what would make your life significantly easier. Be greedy. No limits.</p>
                <div className="relative">
                  <textarea 
                    value={idealOutcome}
                    onChange={(e) => setIdealOutcome(e.target.value)}
                    rows="3" 
                    placeholder="Describe your perfect state of automated efficiency..." 
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 text-sm px-3.5 py-3 rounded-xl text-zinc-200 placeholder-zinc-600 leading-relaxed resize-y"
                  />
                  <div className="absolute right-3.5 bottom-3.5 flex items-center gap-2">
                    <button 
                      onClick={handleUpgradeOutcome} 
                      disabled={isUpgradingOutcome}
                      className="bg-violet-950/40 hover:bg-violet-900/50 text-violet-300 py-1.5 px-3 rounded-xl text-[10px] tracking-wide font-bold flex items-center gap-1.5 border border-violet-900/50 transition"
                    >
                      <span>{isUpgradingOutcome ? "Refining..." : "✨ Upgrade Outcome"}</span>
                    </button>
                    {speechSupported && (
                      <button 
                        onClick={() => toggleRecording('outcome')} 
                        className={`py-1.5 px-3 rounded-xl text-[10px] tracking-wide font-bold flex items-center gap-1.5 border transition ${
                          isRecording && recordingTarget === 'outcome' ? 'text-rose-500 bg-rose-500/10 border-rose-500/35' : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border-zinc-800'
                        }`}
                      >
                        <span>DICTATE</span>
                        <Mic className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                
                {isRecording && (
                  <div id="audio-wave-container" className="flex items-center justify-center gap-1 py-1.5 bg-rose-500/5 rounded-lg border border-rose-500/10">
                    <span className="text-[10px] text-rose-400/80 mr-2 font-mono">Continuous Dictation Streaming...</span>
                    <div className="h-3 w-0.5 bg-rose-500 animate-bounce rounded-full"></div>
                    <div className="h-5 w-0.5 bg-rose-400 animate-bounce rounded-full" style={{ animationDelay: '0.1s' }}></div>
                    <div className="h-2 w-0.5 bg-rose-500 animate-bounce rounded-full" style={{ animationDelay: '0.2s' }}></div>
                    <div className="h-6 w-0.5 bg-rose-400 animate-bounce rounded-full" style={{ animationDelay: '0.3s' }}></div>
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
                  {TIME_HORIZONS.map(opt => (
                    <button 
                      key={opt.value}
                      onClick={() => selectHorizon(opt.value)}
                      className={`p-3.5 rounded-xl border text-left flex flex-col justify-between h-24 transition duration-200 w-full ${
                        timeHorizon === opt.value ? 'bg-violet-950/20 border-violet-500/55 shadow-md' : 'bg-zinc-950/50 border-zinc-850 hover:border-zinc-800'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold text-zinc-200">{opt.label}</span>
                        {timeHorizon === opt.value && <span className="text-xs text-violet-400 font-bold">✓</span>}
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-normal mt-2 font-normal">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Form Actions */}
            <div className="pt-6 border-t border-zinc-900 flex flex-wrap gap-3 items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={clearForm} className="px-4 py-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-rose-400 rounded-xl transition duration-150">
                  Clear All
                </button>
                <button onClick={saveProfileLocally} className="px-4 py-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white rounded-xl transition duration-150">
                  Save Draft
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="inline-flex rounded-xl overflow-hidden border border-zinc-800">
                  <button onClick={copyMarkdown} className="bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs font-medium px-3.5 py-2 transition" title="Copy Markdown Setup">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={downloadJSON} className="bg-zinc-950 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 text-xs font-medium px-3.5 py-2 border-l border-zinc-900 transition" title="Export JSON File">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button onClick={handleGeneratePlaybook} className="bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition flex items-center gap-2 shadow-lg shadow-indigo-500/20">
                  <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                  Generate Playbook
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* Right Column: AI Blueprint Adaptations & Archives */}
        <section id="sidebar-container" className="lg:col-span-5 space-y-8">
          
          {/* Blueprint rendering panel */}
          {activeTab === 'blueprint' && (
            <div id="blueprint-panel" className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 space-y-6 backdrop-blur-sm flex flex-col justify-between min-h-[500px]">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet-400" />
                    <h2 className="text-xs uppercase font-extrabold tracking-wider text-white">Strategy Blueprint</h2>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-violet-950/50 text-violet-300 border border-violet-500/20 uppercase tracking-widest">
                    AI Guided Synthesis
                  </span>
                </div>

                {/* Content Area */}
                {isGenerating ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="relative flex items-center justify-center w-16 h-16">
                      <div className="absolute w-12 h-12 border-4 border-t-violet-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                      <Sparkles className="w-6 h-6 text-violet-400 animate-pulse" />
                    </div>
                    <p className="text-xs text-zinc-400">Compiling playbook parameters...</p>
                  </div>
                ) : generatedBlueprint ? (
                  <div className="py-2 text-left space-y-4 max-h-[450px] overflow-y-auto pr-1">
                    <div 
                      className="text-xs text-zinc-300 leading-relaxed space-y-3"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(generatedBlueprint) }}
                    />
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="h-12 w-12 rounded-xl bg-zinc-950 border border-zinc-850 flex items-center justify-center text-zinc-500">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-zinc-300">Strategy Matrix Empty</h4>
                      <p className="text-xs text-zinc-500 max-w-xs leading-relaxed font-normal">
                        Configure your parameters, then click 'Generate Playbook' to trigger AI analysis.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Conversational strategists follow ups */}
              {generatedBlueprint && !isGenerating && (
                <div id="blueprint-chat-section" className="border-t border-zinc-900/80 pt-4 mt-4 space-y-3">
                  <p className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">✨ Adapt Playbook (Follow-up Chat)</p>
                  <div id="chat-messages" className="space-y-2 max-h-40 overflow-y-auto p-2 bg-zinc-950/60 rounded-xl border border-zinc-900 text-xs">
                    {chatMessages.length === 0 ? (
                      <div className="text-zinc-400 italic">No alterations made yet. Chat here to modify timeline!</div>
                    ) : (
                      chatMessages.map((msg, i) => (
                        <div key={i} className={`p-2 rounded-lg space-y-0.5 ${msg.sender === 'user' ? 'bg-zinc-900 border border-zinc-800' : 'bg-violet-950/20 border-violet-900/40'}`}>
                          <p className="text-[9px] uppercase font-bold text-zinc-500">{msg.sender === 'user' ? 'You' : 'Strategist Consultant'}</p>
                          <p className="text-zinc-300 font-normal leading-relaxed">{msg.text}</p>
                        </div>
                      ))
                    )}
                    {isChatting && (
                      <div className="p-2 bg-violet-950/10 border border-violet-900/20 rounded-lg space-y-0.5 animate-pulse">
                        <p className="text-[9px] uppercase font-bold text-violet-400">Strategist Consultant</p>
                        <p className="text-zinc-400 italic font-normal">Adapting timeline with new constraints...</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                      placeholder="Ask follow-ups (e.g., make step 3 simpler)..." 
                      className="w-full bg-zinc-950 border border-zinc-800 text-xs px-3 py-2 rounded-xl text-zinc-250 placeholder-zinc-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                    />
                    <button onClick={handleSendChat} className="bg-violet-950 hover:bg-violet-900 text-violet-200 hover:text-white px-3.5 py-1.5 rounded-xl border border-violet-850 text-xs font-semibold transition">
                      Adapt
                    </button>
                  </div>
                </div>
              )}

              {generatedBlueprint && (
                <div id="blueprint-footer" className="pt-4 border-t border-zinc-900 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500 font-sans">Ready for clipboard export</span>
                  <button onClick={copyStrategyText} className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-850 text-xs font-semibold text-zinc-300 flex items-center gap-1.5 transition">
                    <Copy className="w-3.5 h-3.5" />
                    Copy Strategy Markdown
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Local archived playbooks */}
          {activeTab === 'history' && (
            <div id="history-panel" className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 space-y-4 backdrop-blur-sm">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-900">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-zinc-400" />
                  <h2 className="text-xs uppercase font-extrabold tracking-wider text-white">Archived Playbooks</h2>
                </div>
              </div>
              <div id="archives-list" className="space-y-3">
                {savedProfiles.length === 0 ? (
                  <p className="text-xs text-zinc-500 text-center py-6">No archives locally saved.</p>
                ) : (
                  savedProfiles.map((prof, idx) => (
                    <div key={idx} className="p-4 bg-zinc-950/60 border border-zinc-850 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-zinc-500">{new Date(prof.timestamp).toLocaleDateString()}</p>
                        <h4 className="text-xs font-bold text-zinc-200">{prof.comfortLevel} Playbook</h4>
                        <span className="text-[10px] text-zinc-400 block truncate max-w-[180px]">{prof.techStack?.join(', ')}</span>
                      </div>
                      <button onClick={() => loadProfile(prof)} className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* State widgets */}
          <div className="bg-zinc-900/20 border border-zinc-900/60 rounded-2xl p-6 space-y-4">
            <h3 className="text-[10px] uppercase font-extrabold tracking-widest text-zinc-500">Workspace Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-900">
                <span className="block text-[10px] text-zinc-600 font-semibold uppercase">Active Stack</span>
                <span className="text-lg font-bold text-zinc-200 mt-1 block">{techStackList.length}</span>
                <span className="text-[10px] text-zinc-500">Configured utilities</span>
              </div>
              <div className="bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-900">
                <span className="block text-[10px] text-zinc-600 font-semibold uppercase">Dictation Service</span>
                <span className="text-xs font-bold text-zinc-200 mt-1 block flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${speechSupported ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                  {speechSupported ? 'Available' : 'Unavailable'}
                </span>
                <span className="text-[10px] text-zinc-500">Voice engine online</span>
              </div>
            </div>
          </div>

        </section>

      </main>
    </div>
  );
}