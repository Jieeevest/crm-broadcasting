import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { CreatePost } from './components/CreatePost';
import { EmployeeFeed } from './components/EmployeeFeed';
import { Leaderboard } from './components/Leaderboard';
import { Integrations } from './components/Integrations';
import { MOCK_POSTS, MOCK_USERS } from './constants';
import { Post, User, UserRole, Platform } from './types';
import { Users, LayoutDashboard, ArrowRight } from 'lucide-react';

const App: React.FC = () => {
  // Application State
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]); // Default to Admin
  const [activeTab, setActiveTab] = useState('dashboard');
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  
  // Notification Simulation
  const [toast, setToast] = useState<{message: string, type: 'success' | 'info'} | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handlePostCreate = (newPostData: Omit<Post, 'id' | 'createdAt' | 'authorId' | 'status'>) => {
    const newPost: Post = {
      ...newPostData,
      id: `p${Date.now()}`,
      createdAt: new Date().toISOString(),
      authorId: currentUser.id,
      status: 'published',
    };
    setPosts([newPost, ...posts]);
    setToast({ message: 'Campaign created successfully!', type: 'success' });
    setActiveTab('feed');
  };

  const handleShare = (postId: string, platform: Platform) => {
    // Check if connected
    if (!currentUser.connectedAccounts.includes(platform)) {
      setToast({ message: `Please connect your ${platform} account in Settings first.`, type: 'info' });
      return;
    }

    // 1. Update User Stats
    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, shares: u.shares + 1, points: u.points + 10 };
      }
      return u;
    });
    setUsers(updatedUsers);
    
    // 2. Update current user session
    const me = updatedUsers.find(u => u.id === currentUser.id);
    if (me) setCurrentUser(me);

    setToast({ message: `Shared to ${platform}! +10 Points`, type: 'success' });
  };

  const handleToggleConnection = (platform: Platform) => {
    const isConnected = currentUser.connectedAccounts.includes(platform);
    let newAccounts = [...currentUser.connectedAccounts];
    
    if (isConnected) {
      newAccounts = newAccounts.filter(p => p !== platform);
      setToast({ message: `Disconnected from ${platform}.`, type: 'info' });
    } else {
      newAccounts.push(platform);
      setToast({ message: `Successfully connected to ${platform}!`, type: 'success' });
    }

    const updatedUser = { ...currentUser, connectedAccounts: newAccounts };
    setCurrentUser(updatedUser);
    
    // Update in users array too to persist logic if we switch roles back and forth (simulated DB)
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  const switchRole = () => {
    // Simple toggle for demo purposes
    const nextUser = currentUser.role === UserRole.ADMIN 
      ? users.find(u => u.role === UserRole.EMPLOYEE) 
      : users.find(u => u.role === UserRole.ADMIN);
    
    // Fallback if find fails (shouldn't happen with mock data)
    const safeUser = nextUser || MOCK_USERS[0];

    if (safeUser) {
      setCurrentUser(safeUser);
      // If employee tries to access create page, bump them to feed
      if (safeUser.role === UserRole.EMPLOYEE && activeTab === 'create') {
        setActiveTab('feed');
      }
    }
  };

  // Dashboard Overview Component
  const Dashboard = () => {
    const totalShares = users.reduce((acc, u) => acc + u.shares, 0);
    const totalPoints = users.reduce((acc, u) => acc + u.points, 0);
    const connectedCount = currentUser.connectedAccounts.length;
    
    return (
      <div className="space-y-8">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">Welcome back, {currentUser.name.split(' ')[0]}!</h2>
          <p className="text-slate-500 mt-1">Here is what is happening with your social campaigns today.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 font-medium text-sm uppercase">Total Shares</h3>
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                <LayoutDashboard size={20} />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">{totalShares}</div>
            <div className="text-sm text-green-600 font-medium mt-2 flex items-center">
              +12% <span className="text-slate-400 ml-1 font-normal">from last week</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-500 font-medium text-sm uppercase">Active Connections</h3>
              <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <Users size={20} />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900">{connectedCount}</div>
             <div className="text-sm text-purple-600 font-medium mt-2 flex items-center">
              Platforms Linked
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 text-white relative overflow-hidden group cursor-pointer" onClick={() => setActiveTab('feed')}>
             <div className="relative z-10">
               <h3 className="text-slate-400 font-medium text-sm uppercase mb-4">Quick Action</h3>
               <div className="text-xl font-bold mb-4">Check new campaigns</div>
               <div className="flex items-center text-aqua-400 text-sm font-bold group-hover:translate-x-1 transition-transform">
                 Go to Feed <ArrowRight size={16} className="ml-2" />
               </div>
             </div>
             <div className="absolute -bottom-4 -right-4 text-slate-800 opacity-20">
               <LayoutDashboard size={100} />
             </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200">
           <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Activity</h3>
           <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
             {posts.slice(0, 3).map((post) => (
               <div key={post.id} className="p-4 border-b border-slate-100 last:border-0 flex items-center hover:bg-slate-50 transition-colors">
                  <img src={post.imageUrl} className="w-12 h-12 rounded-lg object-cover mr-4" alt="Post" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 text-sm">{post.title}</h4>
                    <p className="text-xs text-slate-500 truncate max-w-md">{post.content}</p>
                  </div>
                  <div className="flex gap-1">
                    {post.platforms.map(p => (
                      <span key={p} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded">{p}</span>
                    ))}
                  </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <Sidebar 
        currentRole={currentUser.role} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={switchRole}
      />

      <main className="flex-1 ml-64 p-8 relative">
        {/* Top Header */}
        <div className="flex justify-end items-center mb-8">
          <div className="flex items-center space-x-3 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase">{currentUser.role} View</span>
            <div className="h-4 w-px bg-slate-200"></div>
            <img src={currentUser.avatar} alt="Avatar" className="w-8 h-8 rounded-full" />
            <span className="text-sm font-bold text-slate-800">{currentUser.name}</span>
          </div>
        </div>

        {/* Content Area */}
        <div className="animate-fade-in w-full">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'create' && currentUser.role === UserRole.ADMIN && (
            <CreatePost onPostCreate={handlePostCreate} />
          )}
          {activeTab === 'feed' && (
            <EmployeeFeed posts={posts} onShare={handleShare} />
          )}
          {activeTab === 'leaderboard' && (
            <Leaderboard users={users} />
          )}
          {activeTab === 'integrations' && (
            <Integrations user={currentUser} onToggleConnection={handleToggleConnection} />
          )}
        </div>
      </main>
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 animate-bounce-in">
          <div className={`px-6 py-4 rounded-xl shadow-lg flex items-center text-white ${
            toast.type === 'success' ? 'bg-slate-800' : 'bg-blue-600'
          }`}>
            <span className="font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;