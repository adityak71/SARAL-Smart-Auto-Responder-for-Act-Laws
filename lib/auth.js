import crypto from "crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

const JWT_SECRET =
  process.env.JWT_SECRET || "saral_fallback_default_jwt_secret_key_change_in_production_2026";

/**
 * Base64URL encoding helper
 */
function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
 * Base64URL decoding helper
 */
function base64UrlDecode(str) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) {
    str += "=";
  }
  return Buffer.from(str, "base64").toString();
}

/**
 * Signs a standard JWT with HMAC-SHA256
 * @param {object} payload - { userId, email, role, fullName }
 * @param {number} expiresInSeconds - Default 7 days
 * @returns {string} Signed JWT Token
 */
export function signToken(payload, expiresInSeconds = 7 * 24 * 60 * 60) {
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const fullPayload = { ...payload, exp, iat: Math.floor(Date.now() / 1000) };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));

  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest("base64url");

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Verifies a JWT and extracts payload
 * @param {string} token - Raw JWT token string
 * @returns {object|null} Decoded payload or null if invalid/expired
 */
export function verifyToken(token) {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [encodedHeader, encodedPayload, signature] = parts;

  try {
    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest("base64url");

    if (
      !crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      )
    ) {
      return null;
    }

    const payload = JSON.parse(base64UrlDecode(encodedPayload));

    // Check expiration
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
      return null;
    }

    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Extracts and verifies user session from Request headers or cookies
 * @param {Request} request Next.js Route Request
 * @returns {object|null} Authenticated user payload { userId, email, role, fullName }
 */
export function getAuthSession(request) {
  try {
    // 1. Check Authorization Header: Bearer <token>
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const user = verifyToken(token);
      if (user) return user;
    }

    // 2. Check HTTP Cookie: saral_session
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      const cookies = Object.fromEntries(
        cookieHeader.split("; ").map((c) => {
          const [k, ...v] = c.split("=");
          return [k, decodeURIComponent(v.join("="))];
        })
      );
      if (cookies.saral_session) {
        const user = verifyToken(cookies.saral_session);
        if (user) return user;
      }
    }

    return null;
  } catch (e) {
    return null;
  }
}

/**
 * Route protection guard for Role-Based Access Control (RBAC)
 * @param {Request} request Next.js Route Request
 * @param {Array<string>} allowedRoles e.g. ["CITIZEN"], ["OFFICER"], ["ADMIN"]
 * @returns {{ user: object, response: null } | { user: null, response: NextResponse }}
 */
export function requireRole(request, allowedRoles = []) {
  const user = getAuthSession(request);

  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        { success: false, error: "Authentication required. Please sign in." },
        { status: 401 }
      ),
    };
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return {
      user: null,
      response: NextResponse.json(
        {
          success: false,
          error: `Forbidden. Role '${user.role}' is not authorized to access this resource. Required: ${allowedRoles.join(
            " or "
          )}`,
        },
        { status: 403 }
      ),
    };
  }

  return { user, response: null };
}

/**
 * Hashes password using bcrypt
 */
export async function hashPassword(plainPassword) {
  return await bcrypt.hash(plainPassword, 10);
}

/**
 * Compares password against hash using bcrypt
 */
export async function comparePassword(plainPassword, passwordHash) {
  return await bcrypt.compare(plainPassword, passwordHash);
}
