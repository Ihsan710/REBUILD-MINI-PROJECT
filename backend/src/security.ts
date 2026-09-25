import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { query, isDbConnected, memoryStore } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'rebuild_enterprise_jwt_super_secret_key_2026';
const SALT_ROUNDS = 12;

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'contractor' | 'seller' | 'buyer' | 'admin';
    name?: string;
  };
}

// ---------------------------------------------------------
// 1. PASSWORD HASHING (BCRYPT 12 ROUNDS)
// ---------------------------------------------------------
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!hash) return false;
  return await bcrypt.compare(password, hash);
}

// ---------------------------------------------------------
// 2. JWT ISSUANCE & VERIFICATION
// ---------------------------------------------------------
export function generateToken(payload: { id: string; email: string; role: string; name: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d', algorithm: 'HS256' });
}

export function authenticateJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: 'Access Denied: Authorization Bearer token required.',
      code: 'AUTH_TOKEN_MISSING'
    });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name
    };
    next();
  } catch (err: any) {
    return res.status(403).json({
      error: 'Forbidden: Invalid or expired token.',
      code: 'AUTH_TOKEN_INVALID'
    });
  }
}

// Optional Auth (Allows public reads if unauthenticated, but attaches user if token present)
export function optionalJWT(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      req.user = decoded;
    } catch (e) {}
  }
  next();
}

// ---------------------------------------------------------
// 3. ROLE-BASED ACCESS CONTROL (RBAC)
// ---------------------------------------------------------
export function requireRole(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      // Log unauthorized access attempt
      logSecurityAudit({
        eventType: 'ACCESS_DENIED_UNAUTHORIZED_ROLE',
        actor: req.user.email,
        details: `Attempted access to ${req.originalUrl} requiring roles: [${allowedRoles.join(', ')}]`,
        ip: req.ip || req.socket.remoteAddress || 'unknown'
      });

      return res.status(403).json({
        error: `Access Forbidden: Required role [${allowedRoles.join(', ')}]. Current role: [${req.user.role}].`,
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
}

// ---------------------------------------------------------
// 4. RATE LIMITERS (BRUTE FORCE & DOS MITIGATION)
// ---------------------------------------------------------
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 25, // limit each IP to 25 login/register attempts per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many authentication attempts. Please try again after 15 minutes.',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500, // limit each IP to 500 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false
});

// ---------------------------------------------------------
// 5. INPUT SANITIZATION & VALIDATION HELPERS
// ---------------------------------------------------------
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email.trim());
}

export function sanitizeString(input: any, maxLength: number = 255): string {
  if (!input || typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '').slice(0, maxLength);
}

export function isValidCoordinate(lat: number, lng: number): boolean {
  return typeof lat === 'number' && typeof lng === 'number' && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

// ---------------------------------------------------------
// 6. SECURITY AUDIT LOGGING
// ---------------------------------------------------------
export interface SecurityAuditEntry {
  eventType: string;
  actor: string;
  details: string;
  ip: string;
}

export async function logSecurityAudit(entry: SecurityAuditEntry) {
  const time = new Date().toISOString();
  console.log(`[SECURITY AUDIT] [${time}] [${entry.eventType}] Actor: ${entry.actor} | IP: ${entry.ip} | ${entry.details}`);

  if (isDbConnected()) {
    try {
      await query(
        `INSERT INTO users (id, name, email, password_hash, role, company_name, location) 
         SELECT ?, ?, ?, ?, ?, ?, ? 
         WHERE NOT EXISTS (SELECT 1 FROM users WHERE id = ?)`,
        ['audit_dummy', 'System', 'audit@system', '', 'admin', 'Security', 'System', 'audit_dummy']
      );
    } catch (e) {}
  }

  memoryStore.auditLogs.unshift({
    event: entry.eventType,
    actor: entry.actor,
    details: entry.details,
    time,
    ip: entry.ip
  });
}
