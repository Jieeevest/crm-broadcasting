import React from 'react';
import { Post, Platform } from '../types';
import { Button } from './Button';
import { Copy, ExternalLink, Share2, Hash, Check } from 'lucide-react';

interface EmployeeFeedProps {
  posts: Post[];
  onShare: (postId: string, platform: Platform) => void;
}

export const EmployeeFeed: React.FC<EmployeeFeedProps> = ({ posts, onShare }) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSmartShare = (post: Post, platform: Platform) => {
    // 1. Copy text to clipboard automatically
    const fullContent = `${post.content}\n\n${post.suggestedHashtags.join(' ')}`;
    navigator.clipboard.writeText(fullContent);

    // 2. Open the specific platform upload/feed page
    let url = '';
    switch (platform) {
      case Platform.LINKEDIN:
        url = 'https://www.linkedin.com/feed/';
        break;
      case Platform.INSTAGRAM:
        url = 'https://www.instagram.com/'; // Instagram web doesn't support direct create link easily, but goes to feed
        break;
      case Platform.TIKTOK:
        url = 'https://www.tiktok.com/upload';
        break;
      default:
        url = '#';
    }

    if (url !== '#') {
      window.open(url, '_blank');
    }

    // 3. Trigger the point system
    onShare(post.id, platform);
    
    // 4. Show visual feedback
    setCopiedId(`share-${post.id}-${platform}`);
    setTimeout(() => setCopiedId(null), 3000);
  };

  return (
    <div className="w-full space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Campaign Feed</h2>
          <p className="text-slate-500">Select a campaign, we'll copy the caption, and send you to the app!</p>
        </div>
        <div className="flex space-x-2">
           <span className="px-3 py-1 bg-white rounded-full text-xs font-bold text-slate-500 border border-slate-200">
             {posts.length} Active Campaigns
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
            {post.imageUrl && (
              <div className="h-48 w-full bg-slate-100 relative group overflow-hidden">
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  {post.platforms.map(p => (
                    <span key={p} className="px-2 py-1 bg-black/50 backdrop-blur-md text-white text-[10px] uppercase font-bold rounded-md">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg text-slate-900">{post.title}</h3>
                <span className="text-xs text-slate-400 whitespace-nowrap">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4 flex-1 relative group/text">
                <p className="text-slate-600 text-sm leading-relaxed">{post.content}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.suggestedHashtags.map(tag => (
                    <span key={tag} className="text-aqua-600 text-xs font-medium flex items-center">
                      <Hash size={10} className="mr-0.5" />
                      {tag.replace('#', '')}
                    </span>
                  ))}
                </div>
                {/* Quick Copy Overlay */}
                <div className="absolute inset-0 bg-slate-900/5 backdrop-blur-[1px] opacity-0 group-hover/text:opacity-100 transition-opacity flex items-center justify-center rounded-xl cursor-pointer"
                     onClick={() => handleCopy(`${post.content} ${post.suggestedHashtags.join(' ')}`, post.id)}>
                   <div className="bg-white px-3 py-1.5 rounded-lg shadow-sm text-xs font-bold flex items-center text-slate-700">
                     {copiedId === post.id ? <Check size={14} className="mr-1 text-green-500"/> : <Copy size={14} className="mr-1"/>}
                     {copiedId === post.id ? 'Copied!' : 'Copy Text'}
                   </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">One-Click Share</h4>
                <div className="grid grid-cols-2 gap-2">
                  {post.platforms.map(platform => {
                     const isSharedNow = copiedId === `share-${post.id}-${platform}`;
                     return (
                      <Button 
                        key={platform}
                        variant={isSharedNow ? "primary" : "outline"}
                        size="sm"
                        onClick={() => handleSmartShare(post, platform)}
                        className={`w-full flex justify-between group transition-all duration-300 ${isSharedNow ? 'bg-green-500 border-green-500 hover:bg-green-600' : ''}`}
                      >
                        <span className={isSharedNow ? 'text-white' : ''}>{platform}</span>
                        {isSharedNow ? (
                          <Check size={14} className="text-white" />
                        ) : (
                          <Share2 size={14} className="text-aqua-400 group-hover:text-aqua-600" />
                        )}
                      </Button>
                    );
                  })}
                </div>
                
                <div className="text-[10px] text-center text-slate-400 mt-2">
                  *Clicking share will copy caption & open app
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
