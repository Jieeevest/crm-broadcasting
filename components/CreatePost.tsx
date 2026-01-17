import React, { useState, useRef } from 'react';
import { Platform, Post } from '../types';
import { generatePostContent } from '../services/geminiService';
import { Button } from './Button';
import { Sparkles, Image as ImageIcon, Send, X } from 'lucide-react';

interface CreatePostProps {
  onPostCreate: (post: Omit<Post, 'id' | 'createdAt' | 'authorId' | 'status'>) => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({ onPostCreate }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!topic || platforms.length === 0) return;
    setIsGenerating(true);
    const result = await generatePostContent(topic, platforms[0]);
    setContent(result.content);
    setHashtags(result.hashtags);
    setIsGenerating(false);
  };

  const togglePlatform = (p: Platform) => {
    setPlatforms(prev => 
      prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || platforms.length === 0) return;

    onPostCreate({
      title,
      content,
      platforms,
      suggestedHashtags: hashtags,
      // Use selected image or fallback to a random seed if none selected
      imageUrl: selectedImage || `https://picsum.photos/seed/${Date.now()}/800/600`
    });

    // Reset
    setTitle('');
    setContent('');
    setPlatforms([]);
    setHashtags([]);
    setTopic('');
    setSelectedImage(null);
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-aqua-50/50">
          <h2 className="text-xl font-bold text-slate-800 flex items-center">
            <span className="bg-aqua-100 p-2 rounded-lg mr-3">
              <Sparkles className="text-aqua-600" size={20} />
            </span>
            Create New Content
          </h2>
          <p className="text-slate-500 mt-1 ml-11 text-sm">Draft content for your team to share.</p>
        </div>
        
        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: AI Assistant & Asset */}
          <div className="space-y-6">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Ask AI Assistant
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Summer Sale Announcement"
                  className="flex-1 rounded-lg border-slate-200 border px-4 py-2 focus:ring-2 focus:ring-aqua-500 focus:border-transparent outline-none text-sm"
                />
                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !topic || platforms.length === 0}
                  size="sm"
                  className="shrink-0"
                >
                  <Sparkles size={16} className="mr-2" />
                  Generate
                </Button>
              </div>
              <p className="text-xs text-slate-400 mt-2">Select a platform first to optimize generation.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Target Platforms</label>
              <div className="flex gap-3">
                {Object.values(Platform).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePlatform(p)}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all ${
                      platforms.includes(p)
                        ? 'border-aqua-500 bg-aqua-50 text-aqua-700'
                        : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Uploader */}
            <div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
              />
              {selectedImage ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
                  <img src={selectedImage} alt="Preview" className="w-full h-48 object-cover" />
                  <button 
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-slate-600 hover:text-red-500 shadow-sm"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer"
                >
                  <ImageIcon size={32} className="mb-2" />
                  <span className="text-sm font-medium">Upload Creative Asset</span>
                  <span className="text-xs mt-1">PNG, JPG up to 10MB</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Editor */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border-slate-200 border px-4 py-3 focus:ring-2 focus:ring-aqua-500 focus:border-transparent outline-none"
                placeholder="Internal campaign name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Post Caption</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full rounded-xl border-slate-200 border px-4 py-3 focus:ring-2 focus:ring-aqua-500 focus:border-transparent outline-none resize-none font-medium text-slate-600"
                placeholder="Write your caption here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Suggested Hashtags</label>
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag, idx) => (
                  <span key={idx} className="bg-aqua-100 text-aqua-700 px-3 py-1 rounded-full text-xs font-bold">
                    {tag}
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => setHashtags([...hashtags, '#NewTag'])}
                  className="text-slate-400 text-xs px-2 py-1 hover:text-aqua-600 font-medium"
                >
                  + Add Tag
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button type="submit" disabled={!title || !content || platforms.length === 0} className="w-full sm:w-auto">
                <Send size={18} className="mr-2" />
                Publish to Team
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};