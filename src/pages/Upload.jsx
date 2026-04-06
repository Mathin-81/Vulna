import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, ShieldCheck, File as FileIcon, X, CheckCircle2, FileCode2, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../config';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState("");
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const handleStartScan = async () => {
        if (!file) return;

        try {
            // Set an uploading state so user knows it's working
            setError("Uploading file to secure server...");

            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch(`${API_BASE_URL}/upload-folder`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                // File successfully sent to Python
                setError("");
                navigate('/scan');
            } else {
                const errData = await response.json();
                setError(errData.detail || "Failed to upload file to engine.");
            }
        } catch (err) {
            console.error(err);
            setError("Network error: Could not reach backend server.");
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave" || e.type === "drop") {
            setIsDragging(false);
        }
    };

    const validateAndSetFile = (selectedFile) => {
        const validExtensions = ['.c', '.cpp', '.js', '.py', '.go'];
        const fileExtension = '.' + selectedFile.name.split('.').pop().toLowerCase();

        if (!validExtensions.includes(fileExtension)) {
            setError("Invalid file type. Supported formats: C, C++, Python, JavaScript, Go.");
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            setError("File size exceeds the 10MB limit.");
            return;
        }

        setFile(selectedFile);
        setError("");
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const removeFile = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setFile(null);
        setError("");
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className={`relative min-h-[100dvh] bg-[#020617] text-[#F9FAFB] font-sans flex flex-col items-center py-6 px-4 sm:px-6 lg:px-8 transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'} overflow-hidden`}>

            {/* Height.app-style Animation Styles */}
            <style>{`
                /* Subtle background grid */
                .tech-grid {
                    position: absolute;
                    inset: 0;
                    background-size: 50px 50px;
                    background-image:
                        linear-gradient(to right, rgba(99, 102, 241, 0.04) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(99, 102, 241, 0.04) 1px, transparent 1px);
                    mask-image: linear-gradient(to bottom, black 40%, transparent 100%), radial-gradient(ellipse at center, black 20%, transparent 80%);
                    -webkit-mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
                    z-index: 1;
                    pointer-events: none;
                }

                /* Slow rotating glowing orb in background */
                @keyframes orbitSlow {
                    0% { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
                    50% { transform: translate(-50%, -40%) rotate(180deg) scale(1.1); }
                    100% { transform: translate(-50%, -50%) rotate(360deg) scale(1); }
                }
                .glow-orb {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 800px;
                    height: 800px;
                    background: conic-gradient(from 90deg at 50% 50%, rgba(99,102,241,0.05) 0%, rgba(34,197,94,0.02) 25%, rgba(99,102,241,0.05) 50%, rgba(2,6,23,0) 75%, rgba(99,102,241,0.05) 100%);
                    filter: blur(60px);
                    border-radius: 50%;
                    animation: orbitSlow 25s linear infinite;
                    z-index: 0;
                    pointer-events: none;
                }

                /* Pulse drop zone */
                @keyframes pulseGlow {
                    0% { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
                    70% { box-shadow: 0 0 0 20px rgba(99,102,241,0); }
                    100% { box-shadow: 0 0 0 0 rgba(99,102,241,0); }
                }
                .drop-zone-active {
                    animation: pulseGlow 2s infinite;
                    border-color: #6366F1 !important;
                    background: rgba(99,102,241,0.08) !important;
                }

                /* Animated sweeping border for the main card */
                .animated-card {
                    position: relative;
                    background: rgba(15, 23, 42, 0.6);
                    backdrop-filter: blur(20px);
                    border-radius: 1.5rem;
                    z-index: 10;
                }
                .animated-card::before {
                    content: "";
                    position: absolute;
                    inset: -1px;
                    border-radius: 1.6rem;
                    background: linear-gradient(90deg, rgba(51,65,85,0.4), rgba(99,102,241,0.8), rgba(51,65,85,0.4), rgba(34,197,94,0.4));
                    background-size: 300% 100%;
                    z-index: -1;
                    animation: sweepBorder 6s linear infinite;
                    opacity: 0.5;
                    transition: opacity 0.5s ease;
                }
                .animated-card:hover::before {
                    opacity: 1;
                }
                @keyframes sweepBorder {
                    0% { background-position: 0% 0%; }
                    100% { background-position: 100% 0%; }
                }

                /* Base entrance animation */
                @keyframes cardEnter {
                    0% { transform: translateY(30px) scale(0.97); opacity: 0; filter: blur(10px); }
                    100% { transform: translateY(0) scale(1); opacity: 1; filter: blur(0); }
                }
                .animate-card-enter {
                    animation: cardEnter 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>

            {/* Background Elements */}
            <div className="tech-grid"></div>
            <div className="glow-orb"></div>

            {/* Top Light Flare */}
            <div className="absolute top-0 inset-x-0 h-px w-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50 shadow-[0_0_20px_rgba(99,102,241,0.5)] z-20"></div>

            {/* Centered Main Section */}
            <main className="relative z-10 w-full flex flex-col items-center justify-center flex-1 pb-20 pt-10">
                <div className="text-center mb-12 w-full max-w-2xl px-4 animate-card-enter" style={{ animationDelay: '0.1s' }}>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6 backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                        Secure Pipeline Active
                    </div>
                    <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-slate-400 drop-shadow-sm">
                        Code Analysis
                    </h1>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto font-light leading-relaxed">
                        Upload your code for deep vulnerability scanning.
                        Our engine securely analyzes and identifies potential risks in real-time.
                    </p>
                </div>

                {/* Upload Card */}
                <div className={`w-full max-w-2xl animated-card p-1 sm:p-2 shadow-[0_0_50px_rgba(0,0,0,0.5)] ${isLoaded ? 'animate-card-enter' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
                    <div className="bg-slate-900/90 rounded-[1.3rem] p-8 sm:p-10 w-full h-full relative overflow-hidden">

                        <div className="relative z-10 flex flex-col items-center w-full">

                            {/* Drag and Drop Zone */}
                            {!file ? (
                                <label
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    htmlFor="code-upload"
                                    className={`w-full flex flex-col items-center justify-center py-16 px-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-transparent ${isDragging
                                            ? 'drop-zone-active'
                                            : 'border-slate-700 bg-slate-800/20 hover:border-indigo-500/50 hover:bg-indigo-500/5'
                                        }`}
                                >
                                    <div className={`mb-6 transition-all duration-500 ${isDragging ? 'text-indigo-400 scale-125 drop-shadow-[0_0_15px_rgba(99,102,241,0.6)]' : 'text-slate-500 group-hover/card:text-indigo-400'}`}>
                                        <UploadCloud className="w-16 h-16" strokeWidth={1} />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 text-slate-200">
                                        {isDragging ? 'Drop file to initiate scan' : 'Click or drag file to upload'}
                                    </h3>
                                    <p className="text-slate-500 mb-8 text-center text-sm font-medium">
                                        Limit: 10MB • End-to-End Encrypted Processing
                                    </p>

                                    {/* Supported Languages Indicators */}
                                    <div className="flex flex-wrap justify-center gap-3 w-full">
                                        {['C', 'C++', 'Python', 'JavaScript', 'Go'].map((lang, idx) => (
                                            <div key={idx} className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-950/50 border border-slate-800 text-center transition-all hover:border-slate-600">
                                                <FileCode2 className="w-3.5 h-3.5 text-slate-400" />
                                                <span className="text-xs font-semibold text-slate-400">{lang}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <input
                                        id="code-upload"
                                        type="file"
                                        className="hidden"
                                        onChange={handleChange}
                                        accept=".c,.cpp,.js,.py,.go"
                                    />
                                </label>
                            ) : (
                                // Uploaded File Area
                                <div className="w-full flex items-center justify-between p-6 bg-slate-950 border border-indigo-500/30 rounded-xl animate-in fade-in zoom-in-95 duration-500 shadow-[0_0_30px_rgba(99,102,241,0.1)] relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent pointer-events-none"></div>

                                    <div className="flex items-center gap-5 min-w-0 relative z-10">
                                        <div className="flex-shrink-0 p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                                            <FileIcon className="w-8 h-8 text-indigo-400" strokeWidth={1.5} />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-base font-semibold text-slate-200 truncate pr-4">
                                                {file.name}
                                            </p>
                                            <p className="text-sm text-slate-500 mt-1 font-medium">
                                                {formatFileSize(file.size)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 flex-shrink-0 pl-6 border-l border-slate-800 relative z-10">
                                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                            <span className="text-xs font-bold tracking-wide text-emerald-400 uppercase">Ready</span>
                                        </div>
                                        <button
                                            onClick={removeFile}
                                            className="p-2.5 text-slate-500 hover:text-white hover:bg-slate-800 transition-all rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 hover:shadow-lg"
                                            aria-label="Replace file"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="w-full mt-6 flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500"></div>
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <p className="font-medium">{error}</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="mt-10 w-full relative">
                                <button
                                    onClick={handleStartScan}
                                    disabled={!file}
                                    className={`w-full group relative flex items-center justify-center gap-3 px-6 py-5 rounded-xl font-bold text-lg transition-all duration-500 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-indigo-500 ${file
                                            ? 'bg-white text-slate-950 hover:scale-[1.02] shadow-[0_0_40px_rgba(255,255,255,0.2)]'
                                            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                                        }`}
                                >
                                    {/* Shining effect on hover for active button */}
                                    {file && (
                                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-slate-200/50 to-transparent group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                                    )}
                                    <style>{`
                                        @keyframes shimmer {
                                            100% { transform: translateX(100%); }
                                        }
                                    `}</style>

                                    <ShieldCheck className={`w-6 h-6 transition-transform duration-300 ${file ? 'group-hover:scale-110' : ''}`} />
                                    <span className="relative z-10">Start Vulnerability Scan</span>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Upload;
