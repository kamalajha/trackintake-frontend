import { useState, useEffect } from "react";
import {
  Calendar, Video, Clock, CheckCircle, MapPin,
  User, Loader2, Search, ChevronRight, Heart, Users,
  Stethoscope, Sparkles, ArrowRight, X, RotateCcw,
  Shield, Star, Zap
} from "lucide-react";

import {
  fetchNutritionists, fetchSlots,
  bookAppointment, fetchUserAppointments,
  cancelAppointment, rescheduleAppointment
} from "../api/appointmentApi";

export default function UserDashboard() {
  const testUsers = [
    { id: 1, name: "Rahul Verma", goal: "Weight Loss" },
    { id: 2, name: "Sneha Sharma", goal: "Muscle Gain" },
    { id: 3, name: "Amit Singh", goal: "Weight Gain" },
    { id: 4, name: "Priya Gupta", goal: "Healthy Diet" },
  ];

  const [currentUser, setCurrentUser] = useState(testUsers[0]);
  const [activeCategory, setActiveCategory] = useState("in_house");
  const [nutritionists, setNutritionists] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [myAppointments, setMyAppointments] = useState([]);
  const [bookedApt, setBookedApt] = useState(null);
  const [booking, setBooking] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    fetchNutritionists().then((data) => {
      setNutritionists(data);
      const firstMatch = data.find(
        (n) => (n.doctor_type || "").toLowerCase() === activeCategory.toLowerCase()
      );
      if (firstMatch) setSelectedId(firstMatch.nutritionist_id || firstMatch.id);
    });
  }, []);

  useEffect(() => {
    if (nutritionists.length > 0) {
      const match = nutritionists.find(
        (n) => (n.doctor_type || "").toLowerCase() === activeCategory.toLowerCase()
      );
      setSelectedId(match ? match.nutritionist_id || match.id : "");
    }
    setSlots([]);
    setSelectedSlot(null);
  }, [activeCategory, nutritionists]);

  useEffect(() => {
    fetchUserAppointments(currentUser.id).then(setMyAppointments);
  }, [bookedApt, currentUser]);

  const handleBookSlot = async (slot) => {
    if (booking) return;
    setBooking(true);
    setSelectedSlot(slot.time);
    try {
      const apt = await bookAppointment({
        user: currentUser.id,
        nutritionist: selectedId,
        date: selectedDate,
        time: slot.time,
        topic: "Nutrition Consultation",
        appointmentType: activeCategory === "expert" ? "virtual" : "in_person",
      });
      setBookedApt(apt);
      setSlots([]);
      setSelectedSlot(null);
      alert("✅ Appointment Booked!");
    } catch (e) {
      alert("❌ Error: " + e.message);
    } finally {
      setBooking(false);
    }
  };

  const filteredDoctors = nutritionists.filter((n) => {
    const docType = (n.doctor_type || "").replace("-", "_").toLowerCase().trim();
    const category = (activeCategory || "").replace("-", "_").toLowerCase().trim();
    return docType === category;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#faf8f5", fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@600&display=swap" rel="stylesheet" />

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .apt-card { transition: all 0.25s ease; }
        .apt-card:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
        .slot-btn { transition: all 0.18s ease; }
        .slot-btn:hover { transform: translateY(-1px); }
        .slot-btn.active { background: #e8603c; color: white; border-color: #e8603c; }
        .toggle-btn { transition: all 0.2s ease; }
        .check-btn { transition: all 0.2s ease; }
        .check-btn:hover { background: #d44f2b; }
        .check-btn:active { transform: scale(0.98); }
        select, input[type="date"] {
          appearance: none;
          -webkit-appearance: none;
          outline: none;
          cursor: pointer;
        }
        select:focus, input[type="date"]:focus {
          border-color: #e8603c !important;
          box-shadow: 0 0 0 3px rgba(232,96,60,0.1);
        }
        .action-icon-btn { transition: all 0.18s ease; }
        .action-icon-btn:hover { background: #fff3f0; color: #e8603c; }
        .cancel-btn:hover { background: #fff0f0 !important; color: #e53e3e !important; }
        .join-btn { transition: all 0.2s ease; }
        .join-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(232,96,60,0.35); }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        .pill-tag { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e8d5cc; border-radius: 4px; }
      `}</style>

      {/* ── TESTING TOOLBAR ── */}
      <div style={{
        background: "white",
        borderBottom: "1px solid #f0ece8",
        padding: "10px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: "linear-gradient(135deg, #e8603c, #f59072)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Users size={15} color="white" />
          </div>
          <div>
            <p style={{ fontSize: 10, color: "#e8603c", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Dev Mode</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#2d2520" }}>Viewing as {currentUser.name}</p>
          </div>
        </div>
        <select
          value={currentUser.name}
          onChange={(e) => setCurrentUser(testUsers.find((u) => u.name === e.target.value))}
          style={{
            padding: "8px 16px", borderRadius: 10,
            border: "1.5px solid #f0ece8", background: "#faf8f5",
            fontSize: 13, fontWeight: 600, color: "#2d2520", cursor: "pointer",
          }}
        >
          {testUsers.map((u) => <option key={u.id} value={u.name}>{u.name}</option>)}
        </select>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 28, alignItems: "start" }}>

          {/* ── LEFT COLUMN ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* BOOKING CARD */}
            <div style={{
              background: "white",
              borderRadius: 24,
              border: "1px solid #f0ece8",
              overflow: "hidden",
              boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
            }} className="fade-up">

              {/* Card Header */}
              <div style={{
                padding: "24px 28px 20px",
                borderBottom: "1px solid #faf0ec",
                display: "flex", alignItems: "center", gap: 14,
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 14,
                  background: "linear-gradient(135deg, #fff3f0, #fde8e1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Calendar size={20} color="#e8603c" />
                </div>
                <div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1410", fontFamily: "'Playfair Display', serif" }}>
                    Book Appointment
                  </h2>
                  <p style={{ fontSize: 13, color: "#a09080", marginTop: 2 }}>Schedule your consultation</p>
                </div>
              </div>

              <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Toggle */}
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr",
                  background: "#faf0ec", borderRadius: 14, padding: 4,
                  border: "1px solid #f5e6e0",
                }}>
                  {[
                    { key: "in_house", label: "In-House", icon: <Stethoscope size={14} /> },
                    { key: "expert", label: "Expert", icon: <Sparkles size={14} /> },
                  ].map(({ key, label, icon }) => (
                    <button
                      key={key}
                      className="toggle-btn"
                      onClick={() => setActiveCategory(key)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        gap: 7, padding: "11px 0", borderRadius: 10, border: "none",
                        cursor: "pointer", fontSize: 13, fontWeight: 700,
                        background: activeCategory === key
                          ? "linear-gradient(135deg, #e8603c, #f07050)"
                          : "transparent",
                        color: activeCategory === key ? "white" : "#a09080",
                        boxShadow: activeCategory === key ? "0 4px 16px rgba(232,96,60,0.3)" : "none",
                      }}
                    >
                      {icon} {label}
                    </button>
                  ))}
                </div>

                {/* Doctor Select */}
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#8a7a70", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                    Select Doctor
                  </label>
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}>
                      <User size={15} color="#c8b8b0" />
                    </div>
                    <select
                      value={selectedId}
                      onChange={(e) => setSelectedId(e.target.value)}
                      style={{
                        width: "100%", padding: "12px 14px 12px 38px",
                        borderRadius: 12, border: "1.5px solid #f0e8e4",
                        background: "#fdfbfa", fontSize: 14,
                        fontWeight: 500, color: "#2d2520",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      <option value="">— Select a doctor —</option>
                      {filteredDoctors.map((doc) => (
                        <option key={doc.nutritionist_id} value={doc.nutritionist_id}>
                          {doc.full_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date + Type Row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#8a7a70", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                      Select Date
                    </label>
                    <div style={{ position: "relative" }}>
                      <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                        <Calendar size={15} color="#c8b8b0" />
                      </div>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={{
                          width: "100%", padding: "12px 14px 12px 38px",
                          borderRadius: 12, border: "1.5px solid #f0e8e4",
                          background: "#fdfbfa", fontSize: 14,
                          fontWeight: 500, color: "#2d2520",
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#8a7a70", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                      Appointment Type
                    </label>
                    <div style={{
                      padding: "12px 14px", borderRadius: 12,
                      border: `1.5px solid ${activeCategory === "in_house" ? "#f0e8e4" : "#dde8ff"}`,
                      background: activeCategory === "in_house" ? "#fdf9f8" : "#f4f7ff",
                      display: "flex", alignItems: "center", gap: 8,
                      fontSize: 13, fontWeight: 700,
                      color: activeCategory === "in_house" ? "#c87050" : "#4a6cf7",
                    }}>
                      {activeCategory === "in_house"
                        ? <><MapPin size={15} /> In Person</>
                        : <><Video size={15} /> Virtual Call</>
                      }
                    </div>
                  </div>
                </div>

                {/* Check Availability Button */}
                <button
                  className="check-btn"
                  disabled={slotsLoading}
                  onClick={async () => {
                    if (!selectedId || !selectedDate) return alert("Select doctor and date");
                    setSlotsLoading(true);
                    setSlots([]);
                    const data = await fetchSlots(selectedId, selectedDate);
                    setSlots(data);
                    setSlotsLoading(false);
                  }}
                  style={{
                    width: "100%", padding: "14px",
                    background: slotsLoading ? "#f0a090" : "linear-gradient(135deg, #e8603c, #f07050)",
                    color: "white", border: "none", borderRadius: 14,
                    fontSize: 14, fontWeight: 700, cursor: slotsLoading ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    boxShadow: "0 4px 20px rgba(232,96,60,0.25)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {slotsLoading ? (
                    <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Checking...</>
                  ) : (
                    <><Clock size={16} /> Check Availability <ArrowRight size={15} /></>
                  )}
                </button>

                {/* Slots */}
                {slots.length > 0 && (
                  <div className="fade-up">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#8a7a70", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        Available Slots
                      </p>
                      <span style={{
                        fontSize: 11, fontWeight: 700, color: "#e8603c",
                        background: "#fff3f0", padding: "3px 10px", borderRadius: 20,
                      }}>
                        {slots.length} slots
                      </span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                      {slots.map((s, i) => (
                        <button
                          key={i}
                          className={`slot-btn ${booking && selectedSlot === s.time ? "active" : ""}`}
                          onClick={() => handleBookSlot(s)}
                          disabled={booking}
                          style={{
                            padding: "10px 6px", borderRadius: 10,
                            border: "1.5px solid #f0e8e4",
                            background: selectedSlot === s.time ? "#e8603c" : "#fdfbfa",
                            color: selectedSlot === s.time ? "white" : "#4a3830",
                            fontSize: 12, fontWeight: 700, cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                          }}
                        >
                          <Clock size={10} /> {s.time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {slots.length === 0 && !slotsLoading && selectedDate && selectedId && (
                  <p style={{ textAlign: "center", fontSize: 13, color: "#b8a8a0", padding: "8px 0" }}>
                    No slots available for this date.
                  </p>
                )}
              </div>
            </div>

            {/* MY APPOINTMENTS */}
            <div style={{
              background: "white",
              borderRadius: 24,
              border: "1px solid #f0ece8",
              overflow: "hidden",
              boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
            }} className="fade-up">
              <div style={{
                padding: "24px 28px 18px",
                borderBottom: "1px solid #faf0ec",
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 14,
                    background: "linear-gradient(135deg, #fff3f0, #fde8e1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Calendar size={20} color="#e8603c" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1410", fontFamily: "'Playfair Display', serif" }}>
                      My Appointments
                    </h2>
                    <p style={{ fontSize: 13, color: "#a09080", marginTop: 2 }}>Manage your scheduled consultations</p>
                  </div>
                </div>
                {myAppointments.length > 0 && (
                  <span style={{
                    fontSize: 12, fontWeight: 700, color: "#e8603c",
                    background: "#fff3f0", padding: "5px 12px",
                    borderRadius: 20, border: "1px solid #fde0d8",
                  }}>
                    {myAppointments.length} total
                  </span>
                )}
              </div>

              <div style={{ padding: "20px 28px", display: "flex", flexDirection: "column", gap: 14 }}>
                {myAppointments.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px 0" }}>
                    <div style={{
                      width: 60, height: 60, borderRadius: 20,
                      background: "#faf0ec", margin: "0 auto 14px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <Calendar size={26} color="#e8b8a8" />
                    </div>
                    <p style={{ fontSize: 14, color: "#b8a8a0", fontWeight: 500 }}>No appointments scheduled yet.</p>
                  </div>
                ) : (
                  myAppointments.map((apt) => (
                    <div
                      key={apt.appointment_id || apt.id}
                      className="apt-card"
                      style={{
                        padding: "18px 20px",
                        borderRadius: 16,
                        border: "1.5px solid #f5ede8",
                        background: "#fdfbfa",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 16,
                      }}
                    >
                      {/* Left: icon + info */}
                      <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
                        <div style={{
                          width: 46, height: 46, borderRadius: 14, flexShrink: 0,
                          background: apt.appointment_type === "virtual" ? "#eef2ff" : "#edfbf4",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {apt.appointment_type === "virtual"
                            ? <Video size={20} color="#4a6cf7" />
                            : <MapPin size={20} color="#22c55e" />
                          }
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 15, fontWeight: 700, color: "#1a1410", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {apt.nutritionist?.full_name || "Nutritionist"}
                          </p>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 5, flexWrap: "wrap" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#908070" }}>
                              <Calendar size={11} color="#c8b8b0" /> {apt.appointment_date}
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#908070" }}>
                              <Clock size={11} color="#c8b8b0" /> {apt.start_time}
                            </span>
                            <span style={{
                              fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 20,
                              background: apt.status === "confirmed" ? "#edfbf4" : "#fff0f0",
                              color: apt.status === "confirmed" ? "#16a34a" : "#e53e3e",
                              border: `1px solid ${apt.status === "confirmed" ? "#bbf7d0" : "#fecaca"}`,
                            }}>
                              {apt.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: actions */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        {/* Reschedule */}
                        <button
                          className="action-icon-btn"
                          title="Reschedule"
                          onClick={async () => {
                            const nD = prompt("New Date:", apt.appointment_date);
                            const nT = prompt("New Time:", apt.start_time);
                            if (nD && nT) {
                              await rescheduleAppointment(apt.appointment_id, nD, nT);
                              setBookedApt(Math.random());
                            }
                          }}
                          style={{
                            width: 36, height: 36, borderRadius: 10,
                            border: "1.5px solid #f0e8e4", background: "#fdfbfa",
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#a09080",
                          }}
                        >
                          <RotateCcw size={15} />
                        </button>

                        {/* Cancel */}
                        <button
                          className="action-icon-btn cancel-btn"
                          title="Cancel"
                          onClick={async () => {
                            if (window.confirm("Cancel this appointment?")) {
                              await cancelAppointment(apt.appointment_id);
                              setBookedApt(Math.random());
                            }
                          }}
                          style={{
                            width: 36, height: 36, borderRadius: 10,
                            border: "1.5px solid #f0e8e4", background: "#fdfbfa",
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#a09080",
                          }}
                        >
                          <X size={15} />
                        </button>

                        {/* Join Meeting */}
                        {apt.appointment_type === "virtual" && (
                          <a
                            href={apt.meeting_url || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="join-btn"
                            style={{
                              display: "flex", alignItems: "center", gap: 7,
                              padding: "8px 16px", borderRadius: 10,
                              background: apt.meeting_url
                                ? "linear-gradient(135deg, #e8603c, #f07050)"
                                : "#f0e8e4",
                              color: apt.meeting_url ? "white" : "#c0a898",
                              fontSize: 12, fontWeight: 700,
                              textDecoration: "none",
                              pointerEvents: apt.meeting_url ? "auto" : "none",
                              boxShadow: apt.meeting_url ? "0 4px 14px rgba(232,96,60,0.25)" : "none",
                            }}
                          >
                            <Video size={13} /> Join
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ── SIDEBAR ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Sponsored Card */}
            <div style={{
              background: "white", borderRadius: 24,
              border: "1px solid #f0ece8", overflow: "hidden",
              boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
            }}>
              <div style={{ position: "relative" }}>
                <img
                  src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500"
                  alt="Smart BP Monitor"
                  style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
                />
                <div style={{
                  position: "absolute", top: 12, left: 12,
                  background: "rgba(255,255,255,0.92)",
                  backdropFilter: "blur(6px)",
                  borderRadius: 20, padding: "4px 10px",
                  display: "flex", alignItems: "center", gap: 5,
                  fontSize: 10, fontWeight: 800, color: "#e8603c",
                  letterSpacing: "0.07em", textTransform: "uppercase",
                }}>
                  <Heart size={10} fill="#e8603c" color="#e8603c" /> Sponsored
                </div>
              </div>

              <div style={{ padding: "18px 20px 20px" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1410", marginBottom: 6 }}>
                  Smart BP Monitor
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: 13, color: "#a09080", textDecoration: "line-through" }}>₹3,999</span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: "#1a1410" }}>₹2,799</span>
                  <span style={{
                    fontSize: 11, fontWeight: 800, color: "#16a34a",
                    background: "#edfbf4", padding: "3px 8px", borderRadius: 6,
                  }}>30% OFF</span>
                </div>
                <div style={{ display: "flex", gap: 7, marginBottom: 16, flexWrap: "wrap" }}>
                  {["±2 mmHg Accuracy", "Bluetooth"].map((tag) => (
                    <span key={tag} style={{
                      fontSize: 11, fontWeight: 600, color: "#908070",
                      background: "#faf0ec", padding: "4px 10px", borderRadius: 20,
                      border: "1px solid #f0e4dc",
                    }}>{tag}</span>
                  ))}
                </div>
                <button style={{
                  width: "100%", padding: "13px",
                  background: "linear-gradient(135deg, #e8603c, #f07050)",
                  color: "white", border: "none", borderRadius: 12,
                  fontSize: 13, fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  boxShadow: "0 4px 16px rgba(232,96,60,0.28)",
                  letterSpacing: "0.02em",
                }}>
                  Shop Now <ArrowRight size={14} />
                </button>
                <p style={{ textAlign: "center", fontSize: 11, color: "#b8a8a0", marginTop: 10 }}>
                  Free shipping · 1 year warranty
                </p>
              </div>
            </div>

            {/* Quick Tips Card */}
            <div style={{
              background: "white", borderRadius: 24,
              border: "1px solid #f0ece8",
              boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
              padding: "20px",
            }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#8a7a70", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>
                Before Your Visit
              </p>
              {[
                { icon: <Shield size={14} />, text: "Keep a 3-day food diary ready", color: "#4a6cf7", bg: "#eef2ff" },
                { icon: <Star size={14} />, text: "Note your health goals clearly", color: "#f59e0b", bg: "#fffbeb" },
                { icon: <Zap size={14} />, text: "Arrive 10 min early for check-in", color: "#22c55e", bg: "#f0fdf4" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: i < 2 ? 12 : 0 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 10,
                    background: item.bg, color: item.color,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>{item.icon}</div>
                  <p style={{ fontSize: 13, color: "#6a5a50", fontWeight: 500, lineHeight: 1.4 }}>{item.text}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
