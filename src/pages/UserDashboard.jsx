import { useState, useEffect } from "react";
import {
  Calendar, Video, Clock, CheckCircle, ChevronRight,
  User, Heart, ExternalLink, Loader2, AlertCircle, MapPin
} from "lucide-react";
import { today, mockNutritionists } from "../data/mockData";
import {
  fetchNutritionists, fetchSlots,
  bookAppointment, fetchUserAppointments
} from "../api/appointmentApi";

const CURRENT_USER_ID = 1;

export default function UserDashboard() {
  const [nutritionists, setNutritionists] = useState([]);
  // Using .id instead of .nutritionist_id to match Django models
  const [selectedId, setSelectedId] = useState(""); 
  const [selectedDate, setSelectedDate] = useState(today);
  const [aptType, setAptType] = useState("virtual");
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsChecked, setSlotsChecked] = useState(false);
  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState(null);
  const [bookedApt, setBookedApt] = useState(null);
  const [myAppointments, setMyAppointments] = useState([]);
  const [aptsLoading, setAptsLoading] = useState(true);

  // Load Nutritionists
useEffect(() => {
  fetchNutritionists()
    .then((data) => {
      setNutritionists(data);
      if (data && data.length > 0) {
        setSelectedId(data[0].id || data[0].nutritionist_id); // Pehle expert ko default select kar lo
      }
    })
    .catch((err) => console.error("No data found:", err));
}, []);

  // Load User Appointments
  useEffect(() => {
    setAptsLoading(true);
    fetchUserAppointments(CURRENT_USER_ID)
      .then(setMyAppointments)
      .catch(() => setMyAppointments([]))
      .finally(() => setAptsLoading(false));
  }, [bookedApt]);

  const expert = nutritionists.find((n) => (n.id || n.nutritionist_id) == selectedId) || nutritionists[0];

  const handleCheckAvailability = async () => {
    if (!selectedId || selectedId === "undefined") {
      setBookingError("Please select a nutritionist first.");
      return;
    }
    setSlotsLoading(true);
    setSlotsChecked(false);
    setBookingError(null);
    try {
      const data = await fetchSlots(selectedId, selectedDate);
      setSlots(data);
      setSlotsChecked(true);
    } catch {
      setBookingError("Slots fetch nahi hue. Backend check karein.");
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleBookSlot = async (slot) => {
    if (!slot.is_available || booking) return;
    setBooking(true);
    setBookingError(null);
    try {
      const apt = await bookAppointment({
        userId: CURRENT_USER_ID,
        nutritionistId: selectedId,
        date: selectedDate,
        time: slot.time,
        topic: "Nutrition Consultation",
        appointmentType: aptType,
      });
      setBookedApt(apt);
      setSlotsChecked(false);
      setSlots([]);
    } catch (e) {
      setBookingError(e.message);
    } finally {
      setBooking(false);
    }
  };
console.log(nutritionists)
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* 1. Booking Confirmed Banner */}
      {bookedApt && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle size={20} className="text-emerald-500 shrink-0" />
            <div>
              <div className="text-sm font-bold text-emerald-800">Appointment Confirmed!</div>
              <div className="text-xs text-emerald-600 mt-0.5">
                {bookedApt.appointment_date} · {String(bookedApt.start_time).slice(0, 5)} ·{" "}
                {bookedApt.appointment_type === "virtual" ? "Virtual" : "In Person"}
              </div>
            </div>
          </div>
          {bookedApt.meeting_url && (
            <a href={bookedApt.meeting_url} target="_blank" rel="noopener noreferrer" className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-2">
              <Video size={14} /> Join Meeting
            </a>
          )}
        </div>
      )}

      {/* 2. Main Grid: Booking Form & Sponsored Card */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">
        {/* Booking Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 pb-4 flex items-center gap-3 border-b border-gray-50">
            <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
              <Calendar size={18} className="text-orange-500" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Book Appointment</h2>
              <p className="text-xs text-gray-400">Schedule your consultation</p>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-5">
            {/* Select Expert */}
           {/* Select Expert Dropdown */}
<select 
  value={selectedId} 
  onChange={(e) => setSelectedId(e.target.value)}
  className="w-full p-3 border rounded-xl"
>
  <option value="">-- Select Expert --</option>
  {nutritionists.length > 0 ? (
    nutritionists.map((n) => (
      <option key={n.id || n.nutritionist_id} value={n.id || n.nutritionist_id}>
        {/* Ye line 'full_name' ya 'name' jo bhi milega dikha degi */}
        {n.full_name || n.name || "Unknown Expert"}
      </option>
    ))
  ) : (
    <option disabled>No experts found in database</option>
  )}
</select>


            {/* Select Date */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-2 block">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                min={today}
                onChange={(e) => { setSelectedDate(e.target.value); setSlotsChecked(false); setSlots([]); }}
                className="w-full bg-orange-50/50 border border-orange-100 rounded-xl p-3 text-sm outline-none"
              />
            </div>

            {/* Appointment Type */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-2 block">Appointment Type</label>
              <div className="grid grid-cols-2 gap-2 bg-orange-50/60 rounded-xl p-1.5">
                <button onClick={() => setAptType("in_person")} className={`py-2 rounded-lg text-sm font-semibold ${aptType === "in_person" ? "bg-white shadow-sm" : "text-gray-400"}`}>In Person</button>
                <button onClick={() => setAptType("virtual")} className={`py-2 rounded-lg text-sm font-semibold ${aptType === "virtual" ? "bg-orange-500 text-white shadow-md" : "text-gray-400"}`}>Virtual</button>
              </div>
            </div>

            <button onClick={handleCheckAvailability} disabled={slotsLoading} className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2">
              {slotsLoading ? <Loader2 size={16} className="animate-spin" /> : <Clock size={16} />}
              {slotsLoading ? "Checking..." : "Check Availability"}
            </button>

            {bookingError && <div className="text-red-500 text-xs bg-red-50 p-2 rounded-lg border border-red-100 flex items-center gap-2"><AlertCircle size={14}/> {bookingError}</div>}

            {slotsChecked && (
              <div className="grid grid-cols-4 gap-2 mt-2">
                {slots.map((slot, i) => (
                  <button key={i} disabled={!slot.is_available || booking} onClick={() => handleBookSlot(slot)} className={`text-xs font-semibold py-2 rounded-lg border ${slot.is_available ? "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-500 hover:text-white" : "bg-gray-100 text-gray-300 line-through cursor-not-allowed"}`}>
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sponsored Ad */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 bg-gray-50 text-center text-xs font-bold text-gray-400 tracking-widest uppercase">Sponsored</div>
          <img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=200&fit=crop" alt="Ad" className="w-full h-40 object-cover" />
          <div className="p-4 text-center">
            <h3 className="font-bold text-gray-900">Smart BP Monitor</h3>
            <button className="w-full mt-3 bg-orange-500 text-white py-2 rounded-xl text-sm font-bold">Shop Now</button>
          </div>
        </div>
      </div>

      {/* 3. My Appointments Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 text-lg flex items-center gap-3">
          <Calendar className="text-orange-500" size={20} /> My Appointments
        </h2>
        
        {aptsLoading ? (
          <div className="py-10 text-center text-gray-400 flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={20}/> Loading...</div>
        ) : myAppointments.length === 0 ? (
          <p className="text-center py-10 text-gray-400">No appointments found.</p>
        ) : (
          <div className="mt-5 space-y-3">
            {myAppointments.map((apt) => (
              <div key={apt.id || apt.appointment_id} className="p-4 border rounded-xl flex justify-between items-center hover:bg-gray-50 transition-all">
                <div>
                  <div className="text-sm font-bold text-gray-900">{apt.nutritionist?.name || apt.nutritionist?.full_name}</div>
                  <div className="text-xs text-gray-500">{apt.appointment_date} · {apt.start_time}</div>
                </div>
                <div className="flex gap-2">
                   <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg uppercase">{apt.status}</span>
                   {apt.meeting_url && <a href={apt.meeting_url} className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-lg">Join</a>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}