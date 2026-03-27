
//my backend deployement link https://trackintake-backend-hmly.onrender.com/api
const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// ------------------
// Nutritionists
// ------------------
export const fetchNutritionists = async () => {
  const res = await fetch(`${BASE}/nutritionists/`);
  if (!res.ok) throw new Error("Nutritionists fetch failed");
  return res.json();
};
export const fetchNutritionistAppointments = async (nutritionistId, date = null) => {
  const params = new URLSearchParams({ nutritionist_id: nutritionistId });
  if (date) params.append("date", date);

  const res = await fetch(`${BASE}/appointments/?${params}`);
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
};

// ------------------
// Slots (Available slots for a specific date)
// ------------------
export const fetchSlots = async (nutritionistId, date) => {
  if (!nutritionistId || nutritionistId === "undefined") {
    console.warn("fetchSlots called without a valid nutritionistId");
    return []; 
  }

  const res = await fetch(
    `${BASE}/appointments/slots/?nutritionist_id=${nutritionistId}&date=${date}`
  );

  if (!res.ok) throw new Error("Slots fetch failed");
  return res.json();
};

// ------------------
// Book Appointment (POST)
// ------------------
export const bookAppointment = async ({
  userId,
  nutritionistId,
  date,
  time,
  topic,
  appointmentType
}) => {
  const res = await fetch(`${BASE}/appointments/book/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user: userId,
      nutritionist: nutritionistId,
      appointment_date: date,
      start_time: time,
      topic: topic || "Nutrition Consultation",
      appointment_type: appointmentType || "virtual"
    })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Booking failed");
  }

  return res.json();
};

// ------------------
// User Appointments (List)
// ------------------
export const fetchUserAppointments = async (userId) => {
  const res = await fetch(`${BASE}/appointments/?user_id=${userId}`);
  if (!res.ok) throw new Error("Fetch user appointments failed");
  return res.json();
};

// ------------------
// Cancel Appointment (PATCH)
// ------------------
export const cancelAppointment = async (appointmentId) => {
  const res = await fetch(`${BASE}/appointments/${appointmentId}/cancel/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Cancellation failed");
  }

  return res.json();
};

// ------------------
// Reschedule Appointment (PATCH)
// ------------------
export const rescheduleAppointment = async (appointmentId, newDate, newTime) => {
  const res = await fetch(`${BASE}/appointments/${appointmentId}/reschedule/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      appointment_date: newDate,
      start_time: newTime
    })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Rescheduling failed");
  }
  return res.json();
};
