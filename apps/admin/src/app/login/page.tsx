'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, I'd call the backend API here.
    // For now, I'll simulate success and redirect to dashboard.
    console.log('Logging in with:', email, password);
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,_#3B82F611_0%,_transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_60%,_#8B5CF611_0%,_transparent_50%)]"></div>
      
      <div className="w-full max-w-md stitch-card relative z-10">
        <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] rounded-xl mb-4 shadow-lg shadow-blue-500/20"></div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h1>
            <p className="text-slate-400 text-sm mt-2 text-center">Log in to the weRide Admin Control Center</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#ffffff05] border border-[#ffffff10] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F633] transition-all"
              placeholder="admin@weride.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#ffffff05] border border-[#ffffff10] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F633] transition-all"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-slate-800 checked:bg-blue-500" />
              <span className="text-slate-500 group-hover:text-slate-300">Remember me</span>
            </label>
            <a href="#" className="text-[#3B82F6] hover:underline">Forgot password?</a>
          </div>

          <button type="submit" className="w-full stitch-button py-4 text-lg">
            Access Dashboard
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-[#ffffff0a] text-center">
            <p className="text-sm text-slate-500">
                Need help? <a href="#" className="text-slate-300 hover:text-white transition-colors">Contact Support</a>
            </p>
        </div>
      </div>
    </div>
  );
}
