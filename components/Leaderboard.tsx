import React from 'react';
import { User } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Trophy, Medal, TrendingUp } from 'lucide-react';

interface LeaderboardProps {
  users: User[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ users }) => {
  // Sort users by points descending
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);
  const topThree = sortedUsers.slice(0, 3);
  
  // Data for chart
  const chartData = sortedUsers.map(u => ({
    name: u.name.split(' ')[0],
    points: u.points,
    shares: u.shares
  }));

  const COLORS = ['#14b8a6', '#5eead4', '#99f6e4', '#ccfbf1'];

  return (
    <div className="w-full space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Performer Card */}
        <div className="bg-gradient-to-br from-aqua-500 to-aqua-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Trophy size={120} />
          </div>
          <div className="relative z-10">
            <h3 className="text-aqua-100 font-medium text-sm uppercase tracking-wider mb-1">Top Performer</h3>
            <div className="flex items-center space-x-4 mb-6">
              <img 
                src={topThree[0]?.avatar} 
                alt="Winner" 
                className="w-16 h-16 rounded-full border-4 border-white/30"
              />
              <div>
                <div className="text-2xl font-bold">{topThree[0]?.name}</div>
                <div className="text-aqua-100 text-sm">{topThree[0]?.points} Total Points</div>
              </div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 flex justify-between items-center backdrop-blur-sm">
              <div className="flex flex-col">
                <span className="text-2xl font-bold">{topThree[0]?.shares}</span>
                <span className="text-xs text-aqua-100">Shares</span>
              </div>
              <div className="h-8 w-px bg-white/20"></div>
               <div className="flex flex-col">
                <span className="text-2xl font-bold">#1</span>
                <span className="text-xs text-aqua-100">Rank</span>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-slate-800 flex items-center">
              <TrendingUp className="mr-2 text-aqua-500" size={20} />
              Team Performance
             </h3>
          </div>
          <div className="flex-1 min-h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="points" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Full List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-700">Leaderboard Standings</h3>
          <span className="text-xs text-slate-400">Updates Real-time</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">Rank</th>
              <th className="px-6 py-4">Employee</th>
              <th className="px-6 py-4 text-center">Shares</th>
              <th className="px-6 py-4 text-right">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedUsers.map((user, index) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                    ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                      index === 1 ? 'bg-slate-200 text-slate-700' : 
                      index === 2 ? 'bg-orange-100 text-orange-700' : 'text-slate-500'}`}>
                    {index <= 2 ? <Medal size={16} /> : index + 1}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img src={user.avatar} alt="" className="w-10 h-10 rounded-full mr-3" />
                    <div>
                      <div className="font-medium text-slate-900">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.role}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center text-slate-600 font-medium">
                  {user.shares}
                </td>
                <td className="px-6 py-4 text-right font-bold text-aqua-600">
                  {user.points}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};