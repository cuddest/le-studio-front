const USERS_KEY = 'gym.auth.mock.users';

function readUsers() {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function createMockToken(email) {
  const payload = {
    sub: email,
    iat: Date.now(),
    source: 'mock-jwt',
  };

  return `mock.${btoa(JSON.stringify(payload))}.token`;
}

function delay(ms = 350) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function registerUser(payload) {
  await delay();

  const users = readUsers();
  const alreadyExists = users.some(
    (item) => item.email.toLowerCase() === payload.email.toLowerCase()
  );

  if (alreadyExists) {
    throw new Error('An account with this email already exists.');
  }

  const user = {
    id: crypto.randomUUID(),
    name: payload.name,
    email: payload.email,
    phone: payload.phone || '',
    membership: 'Discovery',
    rewardPoints: 120,
    password: payload.password,
  };

  writeUsers([...users, user]);

  return {
    token: createMockToken(user.email),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      membership: user.membership,
      rewardPoints: user.rewardPoints,
    },
  };
}

export async function loginUser(payload) {
  await delay();

  const users = readUsers();
  const found = users.find(
    (item) => item.email.toLowerCase() === payload.email.toLowerCase()
  );

  if (!found || found.password !== payload.password) {
    throw new Error('Invalid email or password.');
  }

  return {
    token: createMockToken(found.email),
    user: {
      id: found.id,
      name: found.name,
      email: found.email,
      phone: found.phone,
      membership: found.membership,
      rewardPoints: found.rewardPoints,
    },
  };
}
