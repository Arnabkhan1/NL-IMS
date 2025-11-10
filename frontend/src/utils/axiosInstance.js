import axios from "axios";

// 🧠 Allowed Origins (সব ডোমেইন এখানে রাখো)
const allowedOrigins = [
  "http://localhost:5173", // Dev (local)
  "https://nl-ims-frontend.vercel.app", // Vercel live
  "https://ims.novumlabs.in", // Optional custom domain
  "https://uxui.designworld.io", // তোমার পুরনো domain থাকলে এটাও
];

// ✅ Smart CORS handler
app.use(
  cors({
    origin: function (origin, callback) {
      // যদি request কোনো allowed list-এ থাকে বা local হয়
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`❌ Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔐 Auto attach token if present
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// 🧩 Export instance
export default API;
