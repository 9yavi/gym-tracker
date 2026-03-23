const BASE_URL = "/api";

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function register(data) {
  console.log("[API] Register:", data.email);
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Registration failed");
  }
  return res.json();
}

export async function login(email, password) {
  console.log("[API] Login:", email);
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Invalid credentials");
  return res.json();
}

// ─── Users ───────────────────────────────────────────────────────────────────

export async function getUsers() {
  const res = await fetch(`${BASE_URL}/users/`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

// ─── Branches ────────────────────────────────────────────────────────────────

export async function getBranches() {
  const res = await fetch(`${BASE_URL}/branches/`);
  if (!res.ok) throw new Error("Failed to fetch branches");
  return res.json();
}

// ─── Memberships ─────────────────────────────────────────────────────────────

export async function getMemberships() {
  const res = await fetch(`${BASE_URL}/memberships/`);
  if (!res.ok) throw new Error("Failed to fetch memberships");
  return res.json();
}

export async function createMembership(data) {
  console.log("[API] Create membership:", data);
  const res = await fetch(`${BASE_URL}/memberships/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to create membership");
  }
  return res.json();
}

// ─── Workouts ─────────────────────────────────────────────────────────────────

export async function getWorkouts() {
  const res = await fetch(`${BASE_URL}/workouts/`);
  if (!res.ok) throw new Error("Failed to fetch workouts");
  return res.json();
}

export async function createWorkout(data) {
  const res = await fetch(`${BASE_URL}/workouts/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to create workout");
  }
  return res.json();
}

// ─── Workout Logs ─────────────────────────────────────────────────────────────

export async function getWorkoutLogs() {
  const res = await fetch(`${BASE_URL}/workout-logs/`);
  if (!res.ok) throw new Error("Failed to fetch workout logs");
  return res.json();
}

export async function postWorkoutLog(data) {
  console.log("[API] Post workout log:", data);
  const res = await fetch(`${BASE_URL}/workout-logs/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (res.status === 404) {
      throw new Error(
        "Membership not found — please create a membership first.",
      );
    }
    throw new Error(err.detail || "Failed to log workout");
  }
  const result = await res.json();
  console.log("[API] Workout log created:", result);
  return result;
}

// ─── Streaks ──────────────────────────────────────────────────────────────────

export async function getStreaks() {
  const res = await fetch(`${BASE_URL}/streaks/`);
  if (!res.ok) throw new Error("Failed to fetch streaks");
  return res.json();
}

// ─── Rankings ─────────────────────────────────────────────────────────────────

export async function getRankings() {
  const res = await fetch(`${BASE_URL}/rankings/`);
  if (!res.ok) throw new Error("Failed to fetch rankings");
  return res.json();
}

// ─── Sports ───────────────────────────────────────────────────────────────────

export async function getSports() {
  const res = await fetch(`${BASE_URL}/sports/`);
  if (!res.ok) throw new Error("Failed to fetch sports");
  return res.json();
}

// ─── Membership Sports ────────────────────────────────────────────────────────

export async function getMembershipSports() {
  const res = await fetch(`${BASE_URL}/membership-sports/`);
  if (!res.ok) throw new Error("Failed to fetch membership sports");
  return res.json();
}

export async function createMembershipSport(data) {
  const res = await fetch(`${BASE_URL}/membership-sports/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to add sport to membership");
  }
  return res.json();
}

// ─── Branch Sports ────────────────────────────────────────────────────────────

export async function getBranchSports() {
  const res = await fetch(`${BASE_URL}/branch-sports/`);
  if (!res.ok) throw new Error("Failed to fetch branch sports");
  return res.json();
}
