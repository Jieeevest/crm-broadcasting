import React, { useState } from 'react';
import { Platform, User } from '../types';
import { Button } from './Button';
import { CheckCircle, Instagram, Linkedin, Video } from 'lucide-react';

interface IntegrationsProps {
  user: User;
  onToggleConnection: (platform: Platform) => void;
}

export const Integrations: React.FC<IntegrationsProps> = ({ user, onToggleConnection }) => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleConnect = (platform: Platform) => {
    setLoading(platform);
    // Simulate API handshake
    setTimeout(() => {
      onToggleConnection(platform);
      setLoading(null);
    }, 1500);
  };

  const platforms = [
    {
      id: Platform.INSTAGRAM,
      name: 'Instagram',
      description: 'Share posts directly to your feed and stories.',
      icon: Instagram,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
    },
    {
      id: Platform.LINKEDIN,
      name: 'LinkedIn',
      description: 'Post professional updates to your personal profile.',
      icon: Linkedin,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
    },
    {
      id: Platform.TIKTOK,
      name: 'TikTok',
      description: 'Upload short-form video content instantly.',
      icon: Video, // TikTok icon replacement
      color: 'text-black',
      bgColor: 'bg-slate-100',
    },
  ];

  return (
    <div className="w-full space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Platform Integrations</h2>
        <p className="text-slate-500">Connect your social accounts to enable one-click sharing and analytics tracking.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((p) => {
          const isConnected = user.connectedAccounts.includes(p.id);
          const Icon = p.icon;
          const isLoading = loading === p.id;

          return (
            <div key={p.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between h-64">
              <div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${p.bgColor}`}>
                  <Icon size={24} className={p.color} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{p.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{p.description}</p>
              </div>

              <div className="mt-6">
                {isConnected ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center text-green-600 text-sm font-semibold bg-green-50 px-3 py-2 rounded-lg w-fit">
                      <CheckCircle size={16} className="mr-2" />
                      Connected as {user.name}
                    </div>
                    <button 
                      onClick={() => handleConnect(p.id)}
                      className="text-slate-400 text-xs hover:text-red-500 hover:underline text-left transition-colors"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Disconnecting...' : 'Disconnect Account'}
                    </button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => handleConnect(p.id)}
                    isLoading={isLoading}
                  >
                    Connect {p.name}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};