  import express from "express";
  import {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserStats ,
    getAdminStats
  } from "../controllers/adminController.js";
  import { protect, adminOnly } from "../middleware/authMiddleware.js";

  const router = express.Router();

  // 🧩 All routes protected + admin-only
  router.use(protect, adminOnly);

  router.get("/users", getAllUsers);
  router.post("/users", createUser);
  router.put("/users/:id", updateUser);
  router.delete("/users/:id", deleteUser);
  router.get("/stats", getUserStats);
  router.get("/stats", getAdminStats);


  export default router;
