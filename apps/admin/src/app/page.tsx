import Sidebar from '@/components/layout/Sidebar';

export default function Home() {
  const stats = [
    { label: 'Live Rides', value: '4,312', trend: '+8%', color: 'text-emerald-400' },
    { label: 'Online Drivers', value: '12,850', trend: '-2%', color: 'text-rose-400' },
    { label: "Today's Revenue", value: '$198,450.70', trend: '+14.2%', color: 'text-blue-400' },
  ];

  const recentRides = [
    { id: '#RID-0291', customer: 'Sarah J.', driver: 'Mike K.', fare: '$28.50', status: 'In Progress' },
    { id: '#RID-0290', customer: 'John D.', driver: 'Elena R.', fare: '$15.20', status: 'Completed' },
    { id: '#RID-0289', customer: 'Alice W.', driver: 'Tomas P.', fare: '$42.10', status: 'Requested' },
  ];

  return (
    <div className="flex min-h-screen bg-[#0A0A0B]">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-10">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">Real-Time Operations</h2>
            <p className="text-slate-400">Welcome back, Sarah. Here's what's happening today.</p>
          </div>
          <div className="flex gap-4">
            <button className="glass-pill">Export Report</button>
            <button className="stitch-button">Generate AI Insights</button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="stitch-card group">
              <p className="text-slate-400 text-sm mb-2">{stat.label}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                <span className={`text-sm font-medium ${stat.color}`}>{stat.trend} ↑</span>
              </div>
              <div className="mt-4 h-1 w-full bg-[#ffffff0a] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] group-hover:w-full transition-all duration-1000 w-[60%]"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Content Section */}
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 stitch-card">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-semibold text-white">Live Operations Map</h4>
              <span className="glass-pill px-3 py-1 text-xs">Live Updates Every 5s</span>
            </div>
            <div className="h-64 rounded-xl bg-[#ffffff05] border border-[#ffffff0a] flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#3B82F611_0%,_transparent_70%)] animate-pulse"></div>
              <p className="text-slate-500 z-10">Mapbox Integration Pending Initialization...</p>
            </div>
          </div>

          <div className="stitch-card">
            <h4 className="text-lg font-semibold text-white mb-6">Recent Activity</h4>
            <div className="space-y-4">
              {recentRides.map((ride) => (
                <div key={ride.id} className="p-4 rounded-xl bg-[#ffffff03] border border-[#ffffff05] hover:bg-[#ffffff08] transition-colors cursor-pointer">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-mono text-[#3B82F6]">{ride.id}</span>
                    <span className="text-white font-semibold">{ride.fare}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-sm text-slate-300">{ride.customer}</p>
                      <p className="text-xs text-slate-500">to {ride.driver}</p>
                    </div>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded ${
                      ride.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {ride.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 text-sm text-[#3B82F6] font-medium border border-[#3B82F633] rounded-lg hover:bg-[#3B82F611] transition-colors">
              View All Transactions
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
