"use client";

export interface UserAccount {
  id: string;
  name: string;
  username: string;
  email?: string;
  passwordHash: string; // The plain unique password for checking
  role: string;
  memberSince: string;
  favoriteFrame: string;
  prescription: {
    sph: string;
    cyl: string;
    axis: string;
    pd: string;
  };
  bespokeNotes: string;
  avatarInitials: string;
  bagDiscountPercent: number;
}

export const ATELIER_ACCOUNTS: UserAccount[] = [
  {
    id: "ganesh",
    name: "Ganesh Reddy",
    username: "ganeshreddy",
    passwordHash: "Ganesh#Atelier2026!",
    role: "VIP Patron & Guild Member",
    memberSince: "Autumn 2024",
    favoriteFrame: "meridian",
    prescription: {
      sph: "−2.50",
      cyl: "−0.75",
      axis: "180°",
      pd: "63 mm",
    },
    bespokeNotes: "Prefers ultra-thin 1.74 High-Index glazing with Sepia driving tint.",
    avatarInitials: "GR",
    bagDiscountPercent: 15,
  },
  {
    id: "subham",
    name: "Subham",
    username: "subham",
    passwordHash: "Subham*Optics99$",
    role: "Atelier Connoisseur",
    memberSince: "Spring 2025",
    favoriteFrame: "aurelia",
    prescription: {
      sph: "−1.75",
      cyl: "−0.50",
      axis: "90°",
      pd: "65 mm",
    },
    bespokeNotes: "Signature titanium brushed brass collector; sensitive to glare.",
    avatarInitials: "SB",
    bagDiscountPercent: 12,
  },
  {
    id: "sathwik",
    name: "Sathwik",
    username: "sathwik",
    passwordHash: "Sathwik^Titanium44@",
    role: "Master Collector",
    memberSince: "Summer 2025",
    favoriteFrame: "solstice",
    prescription: {
      sph: "−3.25",
      cyl: "−1.00",
      axis: "175°",
      pd: "64 mm",
    },
    bespokeNotes: "Dual brow titanium aviator enthusiast with UV400 anti-reflective sage tint.",
    avatarInitials: "SW",
    bagDiscountPercent: 15,
  },
];

const STORAGE_KEY = "marlowe_user_session";
const CUSTOM_ACCOUNTS_KEY = "marlowe_custom_accounts";

export function getCustomAccounts(): UserAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_ACCOUNTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCustomAccounts(accounts: UserAccount[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CUSTOM_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error(e);
  }
}

export function getAllAccounts(): UserAccount[] {
  const custom = getCustomAccounts();
  return [...ATELIER_ACCOUNTS, ...custom];
}

export function getCurrentUser(): UserAccount | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function loginUser(
  usernameInput: string,
  passwordInput: string
): { success: boolean; user?: UserAccount; error?: string } {
  const cleanUser = usernameInput.trim().toLowerCase();
  const cleanPass = passwordInput.trim();

  const all = getAllAccounts();
  const found = all.find(
    (u) =>
      (u.username.toLowerCase() === cleanUser ||
        u.id.toLowerCase() === cleanUser ||
        u.name.toLowerCase() === cleanUser) &&
      u.passwordHash === cleanPass
  );

  if (found) {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(found));
      } catch (e) {
        console.error(e);
      }
    }
    return { success: true, user: found };
  }

  return {
    success: false,
    error: "Invalid username or password. Check Atelier registry or Register.",
  };
}

export function registerUser(payload: {
  name: string;
  username: string;
  password: string;
  role?: string;
  prescription?: {
    sph: string;
    cyl: string;
    axis: string;
    pd: string;
  };
  favoriteFrame?: string;
  bespokeNotes?: string;
}): { success: boolean; user?: UserAccount; error?: string } {
  const name = payload.name.trim();
  const username = payload.username.trim().toLowerCase();
  const password = payload.password.trim();

  if (!name || name.length < 2) {
    return { success: false, error: "Please enter your full name." };
  }
  if (!username || username.length < 3) {
    return { success: false, error: "Username must be at least 3 characters." };
  }
  if (!password || password.length < 4) {
    return { success: false, error: "Password must be at least 4 characters." };
  }

  const all = getAllAccounts();
  const existing = all.find((u) => u.username.toLowerCase() === username);
  if (existing) {
    return { success: false, error: `Username "${username}" is already taken.` };
  }

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const newUser: UserAccount = {
    id: `user-${Date.now()}`,
    name,
    username,
    passwordHash: password,
    role: payload.role || "Atelier Guild Patron",
    memberSince: "Member 2026",
    favoriteFrame: payload.favoriteFrame || "meridian",
    prescription: payload.prescription || {
      sph: "−2.00",
      cyl: "−0.50",
      axis: "180°",
      pd: "64 mm",
    },
    bespokeNotes: payload.bespokeNotes || "Registered via Atelier Bespoke Portal.",
    avatarInitials: initials || "AP",
    bagDiscountPercent: 10,
  };

  const custom = getCustomAccounts();
  custom.push(newUser);
  saveCustomAccounts(custom);

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    } catch (e) {
      console.error(e);
    }
  }

  return { success: true, user: newUser };
}

export function updateUserProfile(
  userId: string,
  updates: Partial<UserAccount>
): { success: boolean; user?: UserAccount; error?: string } {
  const current = getCurrentUser();
  if (!current) {
    return { success: false, error: "No active session found." };
  }

  const updated: UserAccount = {
    ...current,
    ...updates,
    prescription: {
      ...current.prescription,
      ...(updates.prescription || {}),
    },
  };

  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  }

  // Update in custom accounts if it's there
  const custom = getCustomAccounts();
  const idx = custom.findIndex((u) => u.id === userId || u.username === updated.username);
  if (idx > -1) {
    custom[idx] = updated;
    saveCustomAccounts(custom);
  }

  return { success: true, user: updated };
}

export function resetPassword(
  usernameInput: string,
  newPassword: string
): { success: boolean; message?: string; error?: string } {
  const cleanUser = usernameInput.trim().toLowerCase();
  const cleanPass = newPassword.trim();

  if (!cleanPass || cleanPass.length < 4) {
    return { success: false, error: "New password must be at least 4 characters long." };
  }

  const all = getAllAccounts();
  const user = all.find(
    (u) =>
      u.username.toLowerCase() === cleanUser ||
      u.name.toLowerCase() === cleanUser ||
      u.id.toLowerCase() === cleanUser
  );

  if (!user) {
    return { success: false, error: `Account with username "${usernameInput}" not found in Atelier registry.` };
  }

  // If built-in account or custom account, update in custom registry or inform
  const custom = getCustomAccounts();
  const cIdx = custom.findIndex((u) => u.username.toLowerCase() === cleanUser || u.id === user.id);
  if (cIdx > -1) {
    custom[cIdx].passwordHash = cleanPass;
    saveCustomAccounts(custom);
  } else {
    // If it was a built-in account, store overridden password copy in custom
    const copiedUser: UserAccount = { ...user, passwordHash: cleanPass };
    custom.push(copiedUser);
    saveCustomAccounts(custom);
  }

  return { success: true, message: `Password for @${user.username} has been successfully updated.` };
}

export function logoutUser(): void {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  }
}
