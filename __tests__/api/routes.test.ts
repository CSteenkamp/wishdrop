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

import bcrypt from 'bcryptjs';
import { generateGroupInviteCode } from '@/lib/utils';

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
    const req = makePostRequest(url, { groupName: 'Test', adminPassword: '12345' });
    const res = await createGroup(req);
    expect(res.status).toBe(400);
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
    expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
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
      loginCode: 'LOGIN123',
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
      { id: 'p-1', name: 'Alice', loginCode: 'CODE1', _count: { wishlistItems: 2 } },
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
      id: 'p-1', name: 'Bob', loginCode: 'LOGIN123', registryId: 'reg-1',
    });
    const req = makePostRequest('http://localhost:3000/api/people', { name: 'Bob', groupId: 'reg-1' });
    const res = await createPerson(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.person.name).toBe('Bob');
  });
});

// DELETE /api/people/[id]
describe('DELETE /api/people/[id]', () => {
  it('returns 200 on successful deletion', async () => {
    mockPrisma.participant.delete.mockResolvedValue({ id: 'p-1' });
    const req = makeDeleteRequest('http://localhost:3000/api/people/p-1');
    const res = await deletePerson(req, { params: { id: 'p-1' } } as any);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });
});

// POST /api/wishlist
describe('POST /api/wishlist', () => {
  it('returns 400 when participantId is missing', async () => {
    const req = makePostRequest('http://localhost:3000/api/wishlist', { items: [] });
    const res = await updateWishlist(req);
    expect(res.status).toBe(400);
  });

  it('returns 404 when participant not found', async () => {
    mockPrisma.participant.findUnique.mockResolvedValue(null);
    const req = makePostRequest('http://localhost:3000/api/wishlist', {
      personId: 'bad-id',
      items: [{ title: 'Item', link: '' }],
    });
    const res = await updateWishlist(req);
    expect(res.status).toBe(404);
  });

  it('saves wishlist items successfully', async () => {
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

  it('returns 400 when fields are missing', async () => {
    const req = makePostRequest(url, { itemId: 'i-1' });
    const res = await claimItem(req);
    expect(res.status).toBe(400);
  });

  it('returns 404 when item not found', async () => {
    mockPrisma.wishlistItem.findUnique.mockResolvedValue(null);
    const req = makePostRequest(url, { itemId: 'bad', participantId: 'p-1', participantName: 'Alice' });
    const res = await claimItem(req);
    expect(res.status).toBe(404);
  });

  it('returns 409 when item already claimed', async () => {
    mockPrisma.wishlistItem.findUnique.mockResolvedValue({
      id: 'i-1', participantId: 'p-2', claimedById: 'p-3',
    });
    const req = makePostRequest(url, { itemId: 'i-1', participantId: 'p-1', participantName: 'Alice' });
    const res = await claimItem(req);
    expect(res.status).toBe(409);
  });

  it('returns 400 when claiming own item', async () => {
    mockPrisma.wishlistItem.findUnique.mockResolvedValue({
      id: 'i-1', participantId: 'p-1', claimedById: null,
    });
    const req = makePostRequest(url, { itemId: 'i-1', participantId: 'p-1', participantName: 'Alice' });
    const res = await claimItem(req);
    expect(res.status).toBe(400);
  });

  it('claims item successfully', async () => {
    mockPrisma.wishlistItem.findUnique.mockResolvedValue({
      id: 'i-1', participantId: 'p-2', claimedById: null,
    });
    mockPrisma.wishlistItem.update.mockResolvedValue({
      id: 'i-1', claimedById: 'p-1', claimedByName: 'Alice',
    });
    const req = makePostRequest(url, { itemId: 'i-1', participantId: 'p-1', participantName: 'Alice' });
    const res = await claimItem(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.item.claimedByName).toBe('Alice');
  });
});

// POST /api/wishlist/unclaim
describe('POST /api/wishlist/unclaim', () => {
  const url = 'http://localhost:3000/api/wishlist/unclaim';

  it('returns 403 when unclaiming item claimed by someone else', async () => {
    mockPrisma.wishlistItem.findUnique.mockResolvedValue({
      id: 'i-1', claimedById: 'p-other',
    });
    const req = makePostRequest(url, { itemId: 'i-1', participantId: 'p-1' });
    const res = await unclaimItem(req);
    expect(res.status).toBe(403);
  });

  it('unclaims item successfully', async () => {
    mockPrisma.wishlistItem.findUnique.mockResolvedValue({
      id: 'i-1', claimedById: 'p-1',
    });
    mockPrisma.wishlistItem.update.mockResolvedValue({
      id: 'i-1', claimedById: null, claimedByName: null,
    });
    const req = makePostRequest(url, { itemId: 'i-1', participantId: 'p-1' });
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
    const req = makePostRequest(url, { password: 'pass123', groupId: 'bad-id' });
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
