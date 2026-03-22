import { NextRequest } from 'next/server';

// Mock Prisma
const mockPrisma = {
  registry: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
  participant: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
  },
  wishlistItem: {
    deleteMany: jest.fn(),
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  adminConfig: {
    findUnique: jest.fn(),
  },
  magicLinkToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  $disconnect: jest.fn(),
};

jest.mock('@/lib/db', () => ({
  prisma: mockPrisma,
}));

jest.mock('bcryptjs', () => ({
  __esModule: true,
  default: {
    hash: jest.fn().mockResolvedValue('hashed-password'),
    compare: jest.fn(),
  },
}));

jest.mock('@/lib/utils', () => ({
  generateGroupInviteCode: jest.fn().mockReturnValue('ABC123'),
  generateLoginCode: jest.fn().mockReturnValue('LOGIN123'),
  validateWishlistItems: jest.fn(),
}));

jest.mock('@/lib/email', () => ({
  generateMagicToken: jest.fn().mockReturnValue('mock-magic-token'),
  sendMagicLinkEmail: jest.fn().mockResolvedValue(true),
  verifyMagicToken: jest.fn(),
}));

// Mock auth module
jest.mock('@/lib/auth', () => ({
  setSessionCookie: jest.fn((res) => res),
  setAdminSessionCookie: jest.fn((res) => res),
  clearSessionCookies: jest.fn((res) => res),
  getSessionFromRequest: jest.fn().mockReturnValue(null),
  getAdminSessionFromRequest: jest.fn().mockReturnValue(null),
  hashLoginCode: jest.fn().mockReturnValue('hashed-login-code'),
}));

// Mock rate limiting to always allow
jest.mock('@/lib/rate-limit', () => ({
  checkRateLimit: jest.fn().mockReturnValue({ allowed: true, remaining: 10, retryAfterMs: 0 }),
  getClientIp: jest.fn().mockReturnValue('127.0.0.1'),
}));

import bcrypt from 'bcryptjs';
import { generateGroupInviteCode } from '@/lib/utils';
import { getSessionFromRequest, getAdminSessionFromRequest } from '@/lib/auth';

import { POST as createGroup } from '@/app/api/groups/create/route';
import { POST as verifyGroup } from '@/app/api/groups/verify/route';
import { POST as loginAuth } from '@/app/api/auth/login/route';
import { GET as getPeople, POST as createPerson } from '@/app/api/people/route';
import { DELETE as deletePerson } from '@/app/api/people/[id]/route';
import { POST as updateWishlist } from '@/app/api/wishlist/route';
import { POST as claimItem } from '@/app/api/wishlist/claim/route';
import { POST as unclaimItem } from '@/app/api/wishlist/unclaim/route';
import { POST as adminAuth } from '@/app/api/admin/auth/route';

function makePostRequest(url: string, body: Record<string, unknown>): NextRequest {
  return new NextRequest(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

function makeGetRequest(url: string): NextRequest {
  return new NextRequest(url);
}

function makeDeleteRequest(url: string): NextRequest {
  return new NextRequest(url, { method: 'DELETE' });
}

beforeEach(() => {
  jest.clearAllMocks();
  // Reset auth mocks to unauthenticated by default
  (getSessionFromRequest as jest.Mock).mockReturnValue(null);
  (getAdminSessionFromRequest as jest.Mock).mockReturnValue(null);
});

// POST /api/groups/create
describe('POST /api/groups/create', () => {
  const url = 'http://localhost:3000/api/groups/create';

  it('returns 400 when registry name is missing', async () => {
    const req = makePostRequest(url, { groupName: '', adminPassword: 'password123' });
    const res = await createGroup(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Registry name is required');
  });

  it('returns 400 when admin password is too short', async () => {
    const req = makePostRequest(url, { groupName: 'Test', adminPassword: '1234567' });
    const res = await createGroup(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Admin password must be at least 8 characters');
  });

  it('returns 201 on successful creation', async () => {
    mockPrisma.registry.findUnique.mockResolvedValue(null);
    mockPrisma.registry.create.mockResolvedValue({
      id: 'reg-1',
      name: 'Test Registry',
      inviteCode: 'ABC123',
      occasion: 'birthday',
      adminConfig: { id: 'ac-1' },
    });

    const req = makePostRequest(url, { groupName: 'Test Registry', adminPassword: 'password123', occasion: 'birthday' });
    const res = await createGroup(req);
    expect(res.status).toBe(201);

    const json = await res.json();
    expect(json.group.name).toBe('Test Registry');
    expect(json.group.inviteCode).toBe('ABC123');
    expect(generateGroupInviteCode).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 12);
  });
});

// POST /api/groups/verify
describe('POST /api/groups/verify', () => {
  const url = 'http://localhost:3000/api/groups/verify';

  it('returns 400 when invite code is missing', async () => {
    const req = makePostRequest(url, {});
    const res = await verifyGroup(req);
    expect(res.status).toBe(400);
  });

  it('returns 404 when invite code is invalid', async () => {
    mockPrisma.registry.findUnique.mockResolvedValue(null);
    const req = makePostRequest(url, { inviteCode: 'WRONG1' });
    const res = await verifyGroup(req);
    expect(res.status).toBe(404);
  });

  it('returns 200 for valid invite code', async () => {
    mockPrisma.registry.findUnique.mockResolvedValue({
      id: 'reg-1', name: 'Test', inviteCode: 'ABC123', occasion: 'birthday',
    });
    const req = makePostRequest(url, { inviteCode: 'abc123' });
    const res = await verifyGroup(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.group.name).toBe('Test');
  });
});

// POST /api/auth/login
describe('POST /api/auth/login', () => {
  const url = 'http://localhost:3000/api/auth/login';

  it('returns 400 when login code is missing', async () => {
    const req = makePostRequest(url, { groupId: 'reg-1' });
    const res = await loginAuth(req);
    expect(res.status).toBe(400);
  });

  it('returns 401 for invalid login code', async () => {
    mockPrisma.participant.findFirst.mockResolvedValue(null);
    const req = makePostRequest(url, { loginCode: 'WRONG', groupId: 'reg-1' });
    const res = await loginAuth(req);
    expect(res.status).toBe(401);
  });

  it('returns 200 with participant data for valid code', async () => {
    mockPrisma.participant.findFirst.mockResolvedValue({
      id: 'p-1',
      name: 'Alice',
      loginCode: 'hashed-login-code',
      registry: { id: 'reg-1', name: 'Test', occasion: 'birthday', eventDate: null },
      wishlistItems: [],
    });
    const req = makePostRequest(url, { loginCode: 'LOGIN123', groupId: 'reg-1' });
    const res = await loginAuth(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.person.name).toBe('Alice');
  });
});

// GET/POST /api/people
describe('GET /api/people', () => {
  it('returns 400 when registryId is missing', async () => {
    const req = makeGetRequest('http://localhost:3000/api/people');
    const res = await getPeople(req);
    expect(res.status).toBe(400);
  });

  it('returns participants for valid registryId', async () => {
    mockPrisma.participant.findMany.mockResolvedValue([
      { id: 'p-1', name: 'Alice', loginCode: 'hashed', _count: { wishlistItems: 2 } },
    ]);
    const req = makeGetRequest('http://localhost:3000/api/people?groupId=reg-1');
    const res = await getPeople(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.people).toHaveLength(1);
  });
});

describe('POST /api/people', () => {
  it('returns 400 when name is missing', async () => {
    const req = makePostRequest('http://localhost:3000/api/people', { name: '', groupId: 'reg-1' });
    const res = await createPerson(req);
    expect(res.status).toBe(400);
  });

  it('returns 201 on successful creation', async () => {
    mockPrisma.participant.findFirst.mockResolvedValue(null);
    mockPrisma.participant.create.mockResolvedValue({
      id: 'p-1', name: 'Bob', loginCode: 'hashed-login-code', registryId: 'reg-1',
    });
    const req = makePostRequest('http://localhost:3000/api/people', { name: 'Bob', groupId: 'reg-1' });
    const res = await createPerson(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.person.name).toBe('Bob');
    // Plaintext code returned at creation time
    expect(json.person.loginCode).toBe('LOGIN123');
  });
});

// DELETE /api/people/[id]
describe('DELETE /api/people/[id]', () => {
  it('returns 403 when not admin', async () => {
    mockPrisma.participant.findUnique.mockResolvedValue({ registryId: 'reg-1' });
    (getAdminSessionFromRequest as jest.Mock).mockReturnValue(null);
    const req = makeDeleteRequest('http://localhost:3000/api/people/p-1');
    const res = await deletePerson(req, { params: { id: 'p-1' } } as any);
    expect(res.status).toBe(403);
  });

  it('returns 200 on successful deletion by admin', async () => {
    mockPrisma.participant.findUnique.mockResolvedValue({ registryId: 'reg-1' });
    mockPrisma.participant.delete.mockResolvedValue({ id: 'p-1' });
    (getAdminSessionFromRequest as jest.Mock).mockReturnValue({ groupId: 'reg-1', groupName: 'Test', inviteCode: 'ABC123' });
    const req = makeDeleteRequest('http://localhost:3000/api/people/p-1');
    const res = await deletePerson(req, { params: { id: 'p-1' } } as any);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });
});

// POST /api/wishlist
describe('POST /api/wishlist', () => {
  it('returns 401 when not authenticated', async () => {
    const req = makePostRequest('http://localhost:3000/api/wishlist', { personId: 'p-1', items: [{ title: 'Item' }] });
    const res = await updateWishlist(req);
    expect(res.status).toBe(401);
  });

  it('returns 403 when updating someone else\'s wishlist', async () => {
    (getSessionFromRequest as jest.Mock).mockReturnValue({
      personId: 'p-2', personName: 'Alice', groupId: 'reg-1', groupName: 'Test', loginMethod: 'code',
    });
    const req = makePostRequest('http://localhost:3000/api/wishlist', {
      personId: 'p-1',
      items: [{ title: 'Item', link: '' }],
    });
    const res = await updateWishlist(req);
    expect(res.status).toBe(403);
  });

  it('saves wishlist items successfully', async () => {
    (getSessionFromRequest as jest.Mock).mockReturnValue({
      personId: 'p-1', personName: 'Alice', groupId: 'reg-1', groupName: 'Test', loginMethod: 'code',
    });
    mockPrisma.participant.findUnique.mockResolvedValue({ id: 'p-1' });
    mockPrisma.wishlistItem.deleteMany.mockResolvedValue({ count: 0 });
    mockPrisma.wishlistItem.create.mockResolvedValue({ id: 'wi-1', title: 'Gadget', link: '', order: 0 });

    const req = makePostRequest('http://localhost:3000/api/wishlist', {
      personId: 'p-1',
      items: [{ title: 'Gadget', link: 'https://example.com' }],
    });
    const res = await updateWishlist(req);
    expect(res.status).toBe(200);
  });
});

// POST /api/wishlist/claim
describe('POST /api/wishlist/claim', () => {
  const url = 'http://localhost:3000/api/wishlist/claim';

  it('returns 401 when not authenticated', async () => {
    const req = makePostRequest(url, { itemId: 'i-1' });
    const res = await claimItem(req);
    expect(res.status).toBe(401);
  });

  it('returns 404 when item not found', async () => {
    (getSessionFromRequest as jest.Mock).mockReturnValue({
      personId: 'p-1', personName: 'Alice', groupId: 'reg-1', groupName: 'Test', loginMethod: 'code',
    });
    mockPrisma.wishlistItem.findUnique.mockResolvedValue(null);
    const req = makePostRequest(url, { itemId: 'bad' });
    const res = await claimItem(req);
    expect(res.status).toBe(404);
  });

  it('returns 409 when item already claimed', async () => {
    (getSessionFromRequest as jest.Mock).mockReturnValue({
      personId: 'p-1', personName: 'Alice', groupId: 'reg-1', groupName: 'Test', loginMethod: 'code',
    });
    mockPrisma.wishlistItem.findUnique.mockResolvedValue({
      id: 'i-1', participantId: 'p-2', claimedById: 'p-3',
      participant: { registryId: 'reg-1' },
    });
    const req = makePostRequest(url, { itemId: 'i-1' });
    const res = await claimItem(req);
    expect(res.status).toBe(409);
  });

  it('returns 400 when claiming own item', async () => {
    (getSessionFromRequest as jest.Mock).mockReturnValue({
      personId: 'p-1', personName: 'Alice', groupId: 'reg-1', groupName: 'Test', loginMethod: 'code',
    });
    mockPrisma.wishlistItem.findUnique.mockResolvedValue({
      id: 'i-1', participantId: 'p-1', claimedById: null,
      participant: { registryId: 'reg-1' },
    });
    const req = makePostRequest(url, { itemId: 'i-1' });
    const res = await claimItem(req);
    expect(res.status).toBe(400);
  });

  it('claims item successfully', async () => {
    (getSessionFromRequest as jest.Mock).mockReturnValue({
      personId: 'p-1', personName: 'Alice', groupId: 'reg-1', groupName: 'Test', loginMethod: 'code',
    });
    mockPrisma.wishlistItem.findUnique.mockResolvedValue({
      id: 'i-1', participantId: 'p-2', claimedById: null,
      participant: { registryId: 'reg-1' },
    });
    mockPrisma.wishlistItem.update.mockResolvedValue({
      id: 'i-1', claimedById: 'p-1', claimedByName: 'Alice',
    });
    const req = makePostRequest(url, { itemId: 'i-1' });
    const res = await claimItem(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.item.claimedByName).toBe('Alice');
  });
});

// POST /api/wishlist/unclaim
describe('POST /api/wishlist/unclaim', () => {
  const url = 'http://localhost:3000/api/wishlist/unclaim';

  it('returns 401 when not authenticated', async () => {
    const req = makePostRequest(url, { itemId: 'i-1' });
    const res = await unclaimItem(req);
    expect(res.status).toBe(401);
  });

  it('returns 403 when unclaiming item claimed by someone else', async () => {
    (getSessionFromRequest as jest.Mock).mockReturnValue({
      personId: 'p-1', personName: 'Alice', groupId: 'reg-1', groupName: 'Test', loginMethod: 'code',
    });
    mockPrisma.wishlistItem.findUnique.mockResolvedValue({
      id: 'i-1', claimedById: 'p-other',
    });
    const req = makePostRequest(url, { itemId: 'i-1' });
    const res = await unclaimItem(req);
    expect(res.status).toBe(403);
  });

  it('unclaims item successfully', async () => {
    (getSessionFromRequest as jest.Mock).mockReturnValue({
      personId: 'p-1', personName: 'Alice', groupId: 'reg-1', groupName: 'Test', loginMethod: 'code',
    });
    mockPrisma.wishlistItem.findUnique.mockResolvedValue({
      id: 'i-1', claimedById: 'p-1',
    });
    mockPrisma.wishlistItem.update.mockResolvedValue({
      id: 'i-1', claimedById: null, claimedByName: null,
    });
    const req = makePostRequest(url, { itemId: 'i-1' });
    const res = await unclaimItem(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.item.claimedById).toBeNull();
  });
});

// POST /api/admin/auth
describe('POST /api/admin/auth', () => {
  const url = 'http://localhost:3000/api/admin/auth';

  it('returns 400 when password is missing', async () => {
    const req = makePostRequest(url, { groupId: 'reg-1' });
    const res = await adminAuth(req);
    expect(res.status).toBe(400);
  });

  it('returns 404 when registry not found', async () => {
    mockPrisma.adminConfig.findUnique.mockResolvedValue(null);
    const req = makePostRequest(url, { password: 'pass1234', groupId: 'bad-id' });
    const res = await adminAuth(req);
    expect(res.status).toBe(404);
  });

  it('returns 401 for invalid password', async () => {
    mockPrisma.adminConfig.findUnique.mockResolvedValue({
      id: 'ac-1',
      hashedPassword: 'hashed',
      registry: { id: 'reg-1', name: 'Test', inviteCode: 'ABC123', occasion: 'birthday' },
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    const req = makePostRequest(url, { password: 'wrong', groupId: 'reg-1' });
    const res = await adminAuth(req);
    expect(res.status).toBe(401);
  });

  it('returns 200 for valid password', async () => {
    mockPrisma.adminConfig.findUnique.mockResolvedValue({
      id: 'ac-1',
      hashedPassword: 'hashed',
      registry: { id: 'reg-1', name: 'Test', inviteCode: 'ABC123', occasion: 'birthday' },
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    const req = makePostRequest(url, { password: 'correct', groupId: 'reg-1' });
    const res = await adminAuth(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.group.name).toBe('Test');
  });
});
