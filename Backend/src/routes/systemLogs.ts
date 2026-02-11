import express from "express";
import {
  getAdminToken,
  fetchKeycloakEvents,
  fetchKeycloakAdminEvents,
} from "../services/keycloakAdmin";

const router = express.Router();

router.get("/superadmin/system-logs", async (req, res) => {
  try {
    const token = await getAdminToken();

    const [userEvents, adminEvents] = await Promise.all([
      fetchKeycloakEvents(token),
      fetchKeycloakAdminEvents(token),
    ]);

    const unified = [
      ...userEvents.map((e: any) => ({
        id: `user-${e.time}-${e.type}-${e.userId}`,
        timestamp: new Date(e.time).toISOString(),
        event: e.type,
        user: e.username || e.userId,
        ipAddress: e.ipAddress,
        source: "USER_EVENT",
        severity: e.type.includes("ERROR") ? "high" : "low",
        details: e.details || null,
        read: false,
      })),
      ...adminEvents.map((e: any) => ({
        id: `admin-${e.time}-${e.operationType}-${e.resourceType}`,
        timestamp: new Date(e.time).toISOString(),
        event: `${e.operationType} ${e.resourceType}`,
        user: e.authDetails?.userId || "admin",
        ipAddress: e.authDetails?.ipAddress || "—",
        source: "ADMIN_EVENT",
        severity: "medium",
        details: e.representation || null,
        read: false,
      })),
    ];

    res.json(unified);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

export default router;
