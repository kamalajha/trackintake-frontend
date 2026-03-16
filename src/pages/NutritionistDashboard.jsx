import { useState, useEffect } from "react";
import { Calendar, Users, Clock, CheckCircle, Video, Search, UserPlus, TrendingUp, Loader2, MoreHorizontal } from "lucide-react";
import { today } from "../data/mockData";
import { fetchNutritionistAppointments } from "../api/appointmentApi";

const CURRENT_NUTRITIONIST_ID = 1;

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100 hover:-translate-y-0.5 transition-transform">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
         style={{ background: color + "20", color }}>
      {icon}
    </div>
    <div>
      <div className="font-sora text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-xs text-gray-500 font-medium mt-0.5">{label}</div>
    </div>
  </div>
);

export default function NutritionistDashboard() {
  const [searchQuery,       setSearchQuery]       = useState("");
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [allAppointments,   setAllAppointments]   = useState([]);
  const [loading,           setLoading]           = useState(true);

  useEffect(() => {
    // Today's appointments
    fetchNutritionistAppointments(CURRENT_NUTRITIONIST_ID, today)
      .then(setTodayAppointments)
      .catch(() => setTodayAppointments([]));

    // All appointments (patient list ke liye)
    fetchNutritionistAppointments(CURRENT_NUTRITIONIST_ID)
      .then(setAllAppointments)
      .catch(() => setAllAppointments([]))
      .finally(() => setLoading(false));
  }, []);

  // Unique patients from appointments
  const patients = [...new Map(
    allAppointments.map((a) => [a.user?.user_id, a.user])
  ).values()].filter(Boolean);

  const filteredPatients = patients.filter((p) =>
    p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    { label: "Total Patients",   value: patients.length,                                                  icon: <Users size={20} />,     color: "#f97316" },
    { label: "Today's Sessions", value: todayAppointments.length,                                         icon: <Calendar size={20} />,  color: "#10b981" },
    { label: "Virtual Today",    value: todayAppointments.filter((a) => a.appointment_type === "virtual").length, icon: <Video size={20} />, color: "#6366f1" },
    { label: "Total Booked",     value: allAppointments.length,                                           icon: <TrendingUp size={20} />, color: "#f59e0b" },
  ];

  return (
    <div className="flex flex-col gap-5">

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h1 className="font-sora text-2xl font-bold text-gray-900">Nutritionist Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and view your appointments.</p>
        <div className="flex items-center gap-3 mt-5">
          <div className="flex-1 flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-orange-400 transition-colors">
            <Search size={15} className="text-gray-400 shrink-0" />
            <input
              className="bg-transparent outline-none text-sm w-full text-gray-800 placeholder-gray-400"
              placeholder="Search patients by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 border border-gray-200 bg-white px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:border-orange-400 hover:text-orange-500 transition-all whitespace-nowrap">
            <Calendar size={14} /> Manage Availability
          </button>
          <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-orange-200 transition-all whitespace-nowrap">
            <UserPlus size={14} /> Add New Patient
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>

      <div className="grid grid-cols-2 gap-5">

        {/* Today's Appointments */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sora font-bold text-gray-900 flex items-center gap-2">
              <Calendar size={17} className="text-orange-500" />
              Today's Appointments
            </h2>
            <span className="bg-orange-50 text-orange-500 text-xs font-semibold px-3 py-1 rounded-full">
              {todayAppointments.length} Today
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-10 gap-2 text-gray-400">
              <Loader2 size={16} className="animate-spin" /> Loading...
            </div>
          ) : todayAppointments.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Aaj koi appointment nahi.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {todayAppointments.map((apt) => (
                <div key={apt.appointment_id} className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/40 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {apt.user?.full_name?.slice(0, 2).toUpperCase() || "U"}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{apt.user?.full_name || `User #${apt.user?.user_id}`}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{apt.topic}</div>
                      <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <Clock size={10} /> {String(apt.start_time).slice(0, 5)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg bg-violet-100 text-violet-700">
                      <Video size={10} /> Virtual
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 capitalize">
                      <CheckCircle size={10} /> {apt.status}
                    </span>
                    {/* Nutritionist ka Start button — host_join_url */}
                    {apt.host_join_url ? (
                      <a
                        href={apt.host_join_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
                      >
                        <Video size={11} /> Start
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">Link pending</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Patients List */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sora font-bold text-gray-900 flex items-center gap-2">
              <Users size={17} className="text-orange-500" />
              Your Patients
            </h2>
            <span className="text-xs text-gray-400 font-medium">{filteredPatients.length} Total</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-10 gap-2 text-gray-400">
              <Loader2 size={16} className="animate-spin" /> Loading...
            </div>
          ) : filteredPatients.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Koi patient nahi mila.</p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {filteredPatients.map((p) => (
                <div key={p.user_id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/40 transition-all group">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {p.full_name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900">{p.full_name}</div>
                    <div className="text-xs text-gray-400 truncate">{p.email}</div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-gray-100 text-gray-400 transition-all">
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
