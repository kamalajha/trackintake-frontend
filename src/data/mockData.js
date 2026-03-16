// Sirf UI ke liye fallback data
// Real data backend se aayega

export const today = new Date().toISOString().split("T")[0];

export const mockNutritionists = [
  {
    nutritionist_id:  1,
    full_name:        "Yash Saini",
    specialization:   "Weight Management",
    experience_years: 6,
    fee:              499,
    rating:           4.9,
    avatar:           "YS",
    available_modes:  ["virtual", "in_person"],
  },
  {
    nutritionist_id:  2,
    full_name:        "Priya Mehta",
    specialization:   "Sports Nutrition",
    experience_years: 4,
    fee:              399,
    rating:           4.7,
    avatar:           "PM",
    available_modes:  ["virtual"],
  },
  {
    nutritionist_id:  3,
    full_name:        "Arjun Kapoor",
    specialization:   "Diabetes & Heart Health",
    experience_years: 9,
    fee:              599,
    rating:           4.8,
    avatar:           "AK",
    available_modes:  ["virtual", "in_person"],
  },
  {
    nutritionist_id:  4,
    full_name:        "Sneha Iyer",
    specialization:   "Pediatric Nutrition",
    experience_years: 5,
    fee:              449,
    rating:           4.6,
    avatar:           "SI",
    available_modes:  ["in_person"],
  },
];
