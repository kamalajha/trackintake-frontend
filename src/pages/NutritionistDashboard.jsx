import { useState, useEffect } from "react";
import { 
  Calendar, Users, Clock, CheckCircle, Video, Search, 
  UserPlus, TrendingUp, Loader2, ChevronRight, Filter,
  CheckCircle2, XCircle, ExternalLink
} from "lucide-react";
const today = new Date().toISOString().split('T')[0];
import { fetchNutritionistAppointments, cancelAppointment } from "../api/appointmentApi";

// --- Sub-Component: Status Badge ---
const StatusBadge = ({ status }) => {
  const styles = {
    confirmed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    cancelled: "bg-red-50 text-red-600 border-red-100",
    completed: "bg-blue-50 text-blue-600 border-blue-100",
    pending: "bg-amber-50 text-amber-600 border-amber-100",
  };
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
};

export default function NutritionistDashboard() {
  const testDoctors = [
    { id: 1, name: 'Dr Anjali Sharma', spec: 'Weight Loss' },
    { id: 2, name: 'Dr Rohan Mehta', spec: 'Sports Nutrition' },
    { id: 3, name: 'Dr Neha Kapoor', spec: 'Clinical Nutrition' }
  ];

  const [currentDoctor, setCurrentDoctor] = useState(testDoctors[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [appointments, setAppointments] = useState({ today: [], all: [] });
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch Logic with Dual-Stream
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [todayData, allData] = await Promise.all([
          fetchNutritionistAppointments(currentDoctor.name, today),
          fetchNutritionistAppointments(currentDoctor.name)
        ]);
        setAppointments({ today: todayData, all: allData });
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentDoctor, refreshTrigger]);

  // Handler: Status Update (Mark as Complete/Cancel)
  const handleUpdateStatus = async (id, action) => {
    if(!window.confirm(`Are you sure you want to ${action} this session?`)) return;
    try {
      // Note: Backend endpoint for 'complete' might be needed, currently using cancel for logic
      await cancelAppointment(id); 
      setRefreshTrigger(prev => prev + 1);
    } catch (err) { alert("Failed to update status"); }
  };

  // Unique Patients Logic
  const patients = [...new Map(
    appointments.all.map((a) => [a.user?.user_id || a.user_name, a.user || {full_name: a.user_name}])
  ).values()].filter(p => p?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* --- TOP NAV: DOCTOR SWITCHER --- */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100">
              <UserPlus size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900 leading-tight">Expert Portal</h1>
              <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">{currentDoctor.name} • {currentDoctor.spec}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-100">
            <Filter size={16} className="text-gray-400 ml-2" />
            <select 
              className="bg-transparent text-sm font-bold text-gray-700 outline-none pr-4"
              value={currentDoctor.name}
              onChange={(e) => setCurrentDoctor(testDoctors.find(d => d.name === e.target.value))}
            >
              {testDoctors.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </div>
        </div>

        {/* --- METRICS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Patients", val: patients.length, icon: <Users />, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Today's Load", val: appointments.today.length, icon: <Calendar />, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Pending Virtual", val: appointments.today.filter(a => a.appointment_type === 'virtual' && a.status !== 'completed').length, icon: <Video />, color: "text-indigo-600", bg: "bg-indigo-50" },
            { label: "Avg. Daily", val: Math.round(appointments.all.length / 7), icon: <TrendingUp />, color: "text-orange-600", bg: "bg-orange-50" },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm">
              <div className={`${stat.bg} ${stat.color} w-10 h-10 rounded-xl flex items-center justify-center mb-3`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-black text-gray-900">{stat.val}</div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">
          
          {/* --- MAIN QUEUE: TODAY'S SESSIONS --- */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                <Clock className="text-indigo-500" size={24} /> Active Queue
              </h2>
              <div className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full uppercase">Live Update</div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-500" size={40} /></div>
            ) : appointments.today.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-[24px] border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold">No sessions scheduled for today.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.today.map((apt) => (
                  <div key={apt.appointment_id || apt.id} className="group p-5 border border-gray-50 rounded-[24px] flex flex-col md:flex-row items-center justify-between hover:border-indigo-100 hover:bg-indigo-50/20 transition-all gap-4">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center font-black text-gray-400 text-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        {(apt.user?.full_name || "P").charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{apt.user?.full_name || "Anonymous Patient"}</h4>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Clock size={12} /> {String(apt.start_time).slice(0, 5)} • {apt.appointment_type}
                        </p>
                      </div>
                      <StatusBadge status={apt.status} />
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                      {apt.appointment_type === 'virtual' && apt.status === 'confirmed' && (
                        <a href={apt.host_join_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                          <Video size={16} /> START
                        </a>
                      )}
                      <button 
                        onClick={() => handleUpdateStatus(apt.appointment_id, 'complete')}
                        className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                        title="Mark Complete"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --- PATIENT DIRECTORY --- */}
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl font-black text-gray-800">Patient Database</h2>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
                  placeholder="Filter by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {patients.map((p, i) => (
                <div key={i} className="group p-4 flex items-center justify-between hover:bg-indigo-50/50 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-indigo-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 font-bold group-hover:bg-white group-hover:text-indigo-600 transition-all">
                      {(p.full_name || "P").charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-black text-gray-700">{p.full_name}</div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase">Registered Patient</div>
                    </div>
                  </div>
                  <button className="p-2 text-gray-300 group-hover:text-indigo-500">
                    <ExternalLink size={16} />
                  </button>
                </div>
              ))}
              {patients.length === 0 && <p className="text-center text-gray-400 py-10 font-bold">No patients found.</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
