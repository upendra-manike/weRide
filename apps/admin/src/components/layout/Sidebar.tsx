import React from 'react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Rides', icon: '🚗' },
    { name: 'Drivers', icon: '👤' },
    { name: 'Payments', icon: '💳' },
    { name: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-[#0A0A0B] border-r border-[#ffffff1a] h-screen p-6 fixed left-0 top-0">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 bg-gradient-to-tr from-[#3B82F6] to-[#8B5CF6] rounded-lg"></div>
        <h1 className="text-xl font-bold tracking-tight text-white">weRide <span className="text-[#3B82F6]">AI</span></h1>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-[#ffffff0a] cursor-pointer transition-all duration-200"
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </div>
        ))}
      </nav>
      
      <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#ffffff05] border border-[#ffffff0a]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700"></div>
          <div>
            <p className="text-sm font-semibold text-white">Admin User</p>
            <p className="text-xs text-slate-500">Super Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
