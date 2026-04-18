import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const SESSION_COOKIE = 'wd_session';
const ADMIN_SESSION_COOKIE = 'wd_admin_session';
const SESSION_SECRET = () => {
  const secret = process.env.MAGIC_LINK_SECRET;
  if (!secret) throw new Error('FATAL: MAGIC_LINK_SECRET environment variable is not set');
  return secret;
};
const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export interface SessionData {
  personId: string;
  personName: string;
  groupId: string;
  groupName: string;
  loginMethod: 'code' | 'magic-link';
}

export interface AdminSessionData {
  groupId: string;
  groupName: string;
  inviteCode: string;
}

function sign(payload: string): string {
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET())
    .update(payload)
    .digest('hex');
  return `${payload}.${signature}`;
}

function verify(signedValue: string): string | null {
  const lastDot = signedValue.lastIndexOf('.');
  if (lastDot === -1) return null;

  const payload = signedValue.substring(0, lastDot);
  const signature = signedValue.substring(lastDot + 1);

  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET())
    .update(payload)
    .digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'))) {
    return null;
  }

  return payload;
}

// Create a session cookie and attach it to a NextResponse
export function setSessionCookie(response: NextResponse, data: SessionData): NextResponse {
  const payload = Buffer.from(JSON.stringify({
    ...data,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  })).toString('base64url');

  const signed = sign(payload);

  response.cookies.set(SESSION_COOKIE, signed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });

  return response;
}

export function setAdminSessionCookie(response: NextResponse, data: AdminSessionData): NextResponse {
  const payload = Buffer.from(JSON.stringify({
    ...data,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  })).toString('base64url');

  const signed = sign(payload);

  response.cookies.set(ADMIN_SESSION_COOKIE, signed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });

  return response;
}

export function clearSessionCookies(response: NextResponse): NextResponse {
  response.cookies.set(SESSION_COOKIE, '', { maxAge: 0, path: '/' });
  response.cookies.set(ADMIN_SESSION_COOKIE, '', { maxAge: 0, path: '/' });
  return response;
}

// Verify session from a request (for API routes and middleware)
export function getSessionFromRequest(request: NextRequest): SessionData | null {
  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  if (!cookie) return null;

  const payload = verify(cookie);
  if (!payload) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (data.exp < Date.now()) return null;
    const { exp, ...session } = data;
    return session as SessionData;
  } catch {
    return null;
  }
}

export function getAdminSessionFromRequest(request: NextRequest): AdminSessionData | null {
  const cookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!cookie) return null;

  const payload = verify(cookie);
  if (!payload) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (data.exp < Date.now()) return null;
    const { exp, ...session } = data;
    return session as AdminSessionData;
  } catch {
    return null;
  }
}

// Hash a login code deterministically for storage/lookup (HMAC-SHA256, no salt)
export function hashLoginCode(code: string): string {
  return crypto
    .createHmac('sha256', SESSION_SECRET())
    .update(code.toUpperCase())
    .digest('hex');
}
