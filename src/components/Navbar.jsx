import { Bell, LogOut, ChevronDown } from "lucide-react";

export default function Navbar({ role, onRoleSwitch }) {
  const nutritionistLinks = ["Home", "Nutrition Search", "Chat", "Availability"];
  const userLinks         = ["Home", "Tools", "Health", "Diet", "Progress", "Blogs", "Appointments", "Plans"];
  const links             = role === "nutritionist" ? nutritionistLinks : userLinks;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center gap-6">

        {/* Brand */}
        <div className="font-sora text-xl font-bold shrink-0">
          <span className="text-orange-500">Track</span>
          <span className="text-gray-900">Intake</span>
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-1 flex-1 overflow-x-auto">
          {links.map((link, i) => (
            <a key={i} href="#"
              className={`text-sm font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                i === 0 ? "text-orange-500 font-semibold" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Role Toggle */}
          <div className="flex bg-gray-100 rounded-full p-0.5 border border-gray-200">
            <button
              onClick={() => onRoleSwitch("user")}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                role === "user" ? "bg-orange-500 text-white shadow-md shadow-orange-200" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              👤 User
            </button>
            <button
              onClick={() => onRoleSwitch("nutritionist")}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                role === "nutritionist" ? "bg-orange-500 text-white shadow-md shadow-orange-200" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              🥗 Nutritionist
            </button>
          </div>

          <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-gray-50 text-gray-500 hover:bg-orange-50 hover:text-orange-500 transition-all">
            <Bell size={16} />
          </button>

          {role === "nutritionist" ? (
            <button className="flex items-center gap-1.5 border border-gray-200 px-3 py-1.5 rounded-full text-xs font-medium text-gray-500 hover:border-red-300 hover:text-red-500 transition-all">
              <LogOut size={13} /> Logout
            </button>
          ) : (
            <div className="flex items-center gap-2 cursor-pointer border border-gray-200 px-3 py-1 rounded-full hover:bg-gray-50 transition-all">
            <span className="text-sm font-semibold text-gray-800">Logout</span>
              <ChevronDown size={13} className="text-gray-400" />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
