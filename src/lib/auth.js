import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const SESSION_COOKIE = "pnx_session";
const DEMO_COOKIE = "pnx_demo";

// ---- password helpers -----------------------------------------------
export async function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
}

export async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

// ---- session (logged-in users) ---------------------------------------
export function createSessionToken(payload) {
  // payload: { userId, companyId, role, name }
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function readSessionToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}

export function setSessionCookie(token) {
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearSessionCookie() {
  cookies().delete(SESSION_COOKIE);
}

export function setDemoCookie(companyId) {
  cookies().set(DEMO_COOKIE, companyId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24, // demo workspace lasts 24h
  });
}

// Resolves the current "workspace" for any request:
// 1) a logged-in user session (real company, real role) OR
// 2) an anonymous demo cookie (auto-created sandbox company, ADMIN access)
export function getSession() {
  const store = cookies();
  const sessionCookie = store.get(SESSION_COOKIE)?.value;

  if (sessionCookie) {
    const decoded = readSessionToken(sessionCookie);
    if (decoded) {
      return {
        userId: decoded.userId,
        companyId: decoded.companyId,
        role: decoded.role,
        name: decoded.name,
        isDemo: false,
      };
    }
  }

  const demoCompanyId = store.get(DEMO_COOKIE)?.value;
  if (demoCompanyId) {
    return {
      userId: null,
      companyId: demoCompanyId,
      role: "ADMIN",
      name: "Demo Admin",
      isDemo: true,
    };
  }

  return null;
}

export const COOKIE_NAMES = { SESSION_COOKIE, DEMO_COOKIE };
