import React, { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import Editor from './components/Editor';
import { ImageFile } from './types';
import { WandIcon } from './components/Icons';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-50 flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-[#0f172a]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <WandIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Nano Banana Editor</span>
          </div>
          <div className="text-sm text-slate-500">
            Powered by Gemini 2.5 Flash
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        {!selectedImage ? (
          <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full animate-fade-in-up">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400 mb-6">
                Transform your images with words
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed max-w-lg mx-auto">
                Upload a photo and describe how you want to change it. 
                Our AI engine handles the rest instantly.
              </p>
            </div>
            
            <div className="w-full">
              <ImageUpload onImageSelected={setSelectedImage} />
            </div>

            <div className="mt-12 grid grid-cols-3 gap-4 w-full opacity-60">
               <div className="aspect-square rounded-lg bg-slate-800/50 border border-slate-700/50 p-2">
                  <div className="w-full h-full rounded bg-slate-700/30 flex items-center justify-center text-xs text-slate-500">Original</div>
               </div>
               <div className="flex items-center justify-center text-slate-600">
                 → "Add neon lights" →
               </div>
               <div className="aspect-square rounded-lg bg-slate-800/50 border border-indigo-500/30 p-2">
                  <div className="w-full h-full rounded bg-indigo-500/10 flex items-center justify-center text-xs text-indigo-400">Result</div>
               </div>
            </div>
          </div>
        ) : (
          <Editor 
            initialImage={selectedImage} 
            onReset={() => setSelectedImage(null)} 
          />
        )}
      </main>
    </div>
  );
};

export default App;