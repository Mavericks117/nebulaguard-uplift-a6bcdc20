import fetch from "node-fetch";

const KC_URL = process.env.KEYCLOAK_URL!;
const REALM = process.env.KEYCLOAK_REALM!;
const CLIENT_ID = process.env.KC_ADMIN_CLIENT_ID!;
const CLIENT_SECRET = process.env.KC_ADMIN_CLIENT_SECRET!;

export async function getAdminToken() {
  const res = await fetch(
    `${KC_URL}/realms/${REALM}/protocol/openid-connect/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
    }
  );

  if (!res.ok) throw new Error("Failed to get Keycloak admin token");

  const data = await res.json();
  return data.access_token;
}

export async function fetchKeycloakEvents(token: string) {
  const res = await fetch(
    `${KC_URL}/admin/realms/${REALM}/events?max=50`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.json();
}

export async function fetchKeycloakAdminEvents(token: string) {
  const res = await fetch(
    `${KC_URL}/admin/realms/${REALM}/admin-events?max=50`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return res.json();
}
