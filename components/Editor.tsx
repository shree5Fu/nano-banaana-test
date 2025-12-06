import React, { useState } from 'react';
import { ImageFile, AppStatus } from '../types';
import { generateEditedImage } from '../services/geminiService';
import { WandIcon, XIcon, DownloadIcon, RefreshIcon } from './Icons';

interface EditorProps {
  initialImage: ImageFile;
  onReset: () => void;
}

const Editor: React.FC<EditorProps> = ({ initialImage, onReset }) => {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setStatus(AppStatus.LOADING);
    setError(null);

    try {
      const generatedImageBase64 = await generateEditedImage({
        image: initialImage,
        prompt: prompt.trim(),
      });
      setResultImage(generatedImageBase64);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      setStatus(AppStatus.ERROR);
      setError(err.message || "Something went wrong.");
    }
  };

  const handleDownload = () => {
    if (resultImage) {
      const link = document.createElement('a');
      link.href = resultImage;
      link.download = `edited-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto w-full">
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onReset}
          className="flex items-center text-slate-400 hover:text-white transition-colors"
        >
          <XIcon className="w-5 h-5 mr-2" />
          Cancel
        </button>
        {status === AppStatus.SUCCESS && (
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <DownloadIcon className="w-4 h-4" />
            Download Result
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0">
        
        {/* Left Column: Input */}
        <div className="flex flex-col gap-6 h-full">
          <div className="flex-1 bg-slate-800/50 rounded-2xl p-4 border border-slate-700 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-white">Original</div>
            <img 
              src={initialImage.previewUrl} 
              alt="Original" 
              className="max-w-full max-h-[50vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
          
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              How would you like to edit this image?
            </label>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., 'Add a pair of sunglasses to the dog' or 'Turn the sky into a sunset'"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-4 text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none h-32"
                disabled={status === AppStatus.LOADING}
              />
              <div className="absolute bottom-3 right-3 text-xs text-slate-500">
                {prompt.length} chars
              </div>
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || status === AppStatus.LOADING}
              className={`w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-white transition-all
                ${!prompt.trim() || status === AppStatus.LOADING 
                  ? 'bg-slate-700 cursor-not-allowed text-slate-400' 
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-lg shadow-indigo-500/20'}`}
            >
              {status === AppStatus.LOADING ? (
                <>
                  <RefreshIcon className="w-5 h-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <WandIcon className="w-5 h-5" />
                  Generate Edit
                </>
              )}
            </button>
            {error && (
               <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                 {error}
               </div>
            )}
          </div>
        </div>

        {/* Right Column: Result */}
        <div className="flex flex-col h-full min-h-[400px]">
          <div className={`flex-1 bg-slate-900 rounded-2xl border-2 border-dashed ${status === AppStatus.SUCCESS ? 'border-indigo-500/30' : 'border-slate-800'} relative overflow-hidden flex items-center justify-center`}>
            
            {status === AppStatus.IDLE && (
              <div className="text-center p-8">
                 <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <WandIcon className="w-10 h-10 text-slate-600" />
                 </div>
                 <h3 className="text-xl font-medium text-slate-500">Ready to Create</h3>
                 <p className="text-slate-600 mt-2">Enter a prompt and hit generate to see the magic.</p>
              </div>
            )}

            {status === AppStatus.LOADING && (
               <div className="text-center p-8 animate-pulse">
                <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                   <div className="absolute inset-0 rounded-full border-t-2 border-indigo-500 animate-spin"></div>
                   <WandIcon className="w-8 h-8 text-indigo-400" />
                </div>
                <h3 className="text-xl font-medium text-slate-300">Working on it...</h3>
                <p className="text-slate-500 mt-2">The Gemini Nano Banana model is processing your pixels.</p>
             </div>
            )}

            {status === AppStatus.ERROR && (
               <div className="text-center p-8">
                 <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XIcon className="w-10 h-10 text-red-500" />
                 </div>
                 <h3 className="text-xl font-medium text-red-400">Generation Failed</h3>
                 <p className="text-slate-600 mt-2 max-w-xs mx-auto">{error}</p>
              </div>
            )}

            {status === AppStatus.SUCCESS && resultImage && (
              <div className="w-full h-full flex items-center justify-center bg-black/20 relative group">
                 <div className="absolute top-4 left-4 bg-indigo-600 px-3 py-1 rounded-full text-xs font-medium text-white shadow-lg z-10">AI Edited</div>
                 <img 
                   src={resultImage} 
                   alt="Result" 
                   className="max-w-full max-h-full object-contain"
                 />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;