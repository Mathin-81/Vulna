import { useState } from 'react';
import { UploadCloud, File, X, CheckCircle2 } from 'lucide-react';

const FileUploader = ({ onFileAccepted }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files[0]);
        }
    };

    const handleFiles = (file) => {
        // Add validation if needed
        setSelectedFile(file);
        if (onFileAccepted) {
            onFileAccepted(file);
        }
    };

    const removeFile = () => {
        setSelectedFile(null);
        if (onFileAccepted) {
            onFileAccepted(null);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {!selectedFile ? (
                <label
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    htmlFor="file-upload"
                    className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${isDragging
                            ? 'border-indigo-400 bg-indigo-500/10'
                            : 'border-slate-700 bg-slate-800/50 hover:border-slate-500 hover:bg-slate-800'
                        }`}
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <div className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700/50 text-slate-400'}`}>
                            <UploadCloud className="w-10 h-10" />
                        </div>
                        <p className="mb-2 text-lg font-semibold text-slate-200">
                            <span className="text-indigo-400">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-sm text-slate-400">
                            C, C++, JS, Python, Go files up to 10MB
                        </p>
                    </div>
                    <input
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={handleChange}
                        accept=".c,.cpp,.js,.py,.go,.zip"
                    />
                </label>
            ) : (
                <div className="flex items-center justify-between p-4 bg-slate-800 border border-slate-700 rounded-xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-500/20 rounded-lg">
                            <File className="w-8 h-8 text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-200 truncate max-w-[200px] sm:max-w-xs">
                                {selectedFile.name}
                            </p>
                            <p className="text-xs text-slate-400">
                                {(selectedFile.size / 1024).toFixed(2)} KB
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">
                            <CheckCircle2 className="w-3 h-3" /> Ready
                        </span>
                        <button
                            onClick={removeFile}
                            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 transition-colors rounded-lg"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUploader;
