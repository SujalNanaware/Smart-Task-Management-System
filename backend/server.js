const crypto = require('node:crypto');
const fs = require('node:fs/promises');
const path = require('node:path');
const { promisify } = require('node:util');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const PASSWORD_HASH_BYTES = 64;
const scrypt = promisify(crypto.scrypt);
const dataFile = process.env.DATA_FILE
  ? path.resolve(process.env.DATA_FILE)
  : path.join(__dirname, 'data', 'store.json');

let store;
let writeQueue = Promise.resolve();

class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email };
}

function publicTask(task) {
  const { ownerId, ...visibleTask } = task;
  return { ...visibleTask, description: task.desc };
}

async function initializeStore() {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });

  try {
    const savedStore = JSON.parse(await fs.readFile(dataFile, 'utf8'));
    if (
      !savedStore
      || !Array.isArray(savedStore.users)
      || !Array.isArray(savedStore.sessions)
      || !Array.isArray(savedStore.tasks)
    ) {
      throw new Error('The data file has an invalid format.');
    }
    store = savedStore;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    store = { users: [], sessions: [], tasks: [] };
    await fs.writeFile(dataFile, JSON.stringify(store, null, 2), 'utf8');
  }
}

function updateStore(update) {
  const operation = writeQueue.then(async () => {
    const nextStore = JSON.parse(JSON.stringify(store));
    const result = await update(nextStore);
    const temporaryFile = `${dataFile}.${process.pid}.${crypto.randomUUID()}.tmp`;
    await fs.writeFile(temporaryFile, JSON.stringify(nextStore, null, 2), 'utf8');
    await fs.rename(temporaryFile, dataFile);
    store = nextStore;
    return result;
  });

  writeQueue = operation.catch(() => {});
  return operation;
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = await scrypt(password, salt, PASSWORD_HASH_BYTES);
  return { salt, hash: hash.toString('hex') };
}

async function passwordsMatch(password, user) {
  const { hash } = await hashPassword(password, user.salt);
  const expected = Buffer.from(user.passwordHash, 'hex');
  const actual = Buffer.from(hash, 'hex');
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

function createSession(storeData, user) {
  const token = crypto.randomBytes(32).toString('base64url');
  storeData.sessions.push({
    tokenHash: hashToken(token),
    userId: user.id,
    expiresAt: new Date(Date.now() + SESSION_DURATION_MS).toISOString(),
  });
  return token;
}

function validateTaskInput(input, { partial = false } = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new ApiError(400, 'Provide task details as a JSON object.');
  }

  const task = {};
  if (!partial || Object.hasOwn(input, 'title')) {
    if (typeof input.title !== 'string' || !input.title.trim() || input.title.trim().length > 100) {
      throw new ApiError(400, 'Task title is required and must be 100 characters or fewer.');
    }
    task.title = input.title.trim();
  }

  if (!partial || Object.hasOwn(input, 'desc') || Object.hasOwn(input, 'description')) {
    const description = input.desc ?? input.description ?? '';
    if (typeof description !== 'string' || description.length > 500) {
      throw new ApiError(400, 'Task description must be 500 characters or fewer.');
    }
    task.desc = description.trim();
  }

  if (!partial || Object.hasOwn(input, 'category')) {
    const category = input.category ?? 'Other';
    if (typeof category !== 'string' || !category.trim() || category.trim().length > 50) {
      throw new ApiError(400, 'Task category must be between 1 and 50 characters.');
    }
    task.category = category.trim();
  }

  if (!partial || Object.hasOwn(input, 'priority')) {
    const priority = input.priority ?? 'Medium';
    if (!['Low', 'Medium', 'High'].includes(priority)) {
      throw new ApiError(400, 'Priority must be Low, Medium, or High.');
    }
    task.priority = priority;
  }

  if (!partial || Object.hasOwn(input, 'dueDate')) {
    const dueDate = input.dueDate ?? '';
    const parsedDueDate = dueDate ? new Date(`${dueDate}T00:00:00.000Z`) : null;
    if (
      typeof dueDate !== 'string'
      || (dueDate !== '' && !/^\d{4}-\d{2}-\d{2}$/.test(dueDate))
      || (dueDate !== '' && (
        Number.isNaN(parsedDueDate.getTime())
        || parsedDueDate.toISOString().slice(0, 10) !== dueDate
      ))
    ) {
      throw new ApiError(400, 'Due date must be a valid date in YYYY-MM-DD format.');
    }
    task.dueDate = dueDate;
  }

  if (Object.hasOwn(input, 'status')) {
    if (!['Pending', 'In Progress', 'Completed'].includes(input.status)) {
      throw new ApiError(400, 'Status must be Pending, In Progress, or Completed.');
    }
    task.status = input.status;
  } else if (!partial) {
    task.status = 'Pending';
  }

  if (Object.hasOwn(input, 'progress')) {
    if (!Number.isInteger(input.progress) || input.progress < 0 || input.progress > 100) {
      throw new ApiError(400, 'Progress must be an integer between 0 and 100.');
    }
    task.progress = input.progress;
  }

  return task;
}

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    callback(new ApiError(403, 'This origin is not allowed to access the API.'));
  },
}));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (request, response) => {
  response.json({ status: 'ok' });
});

app.post('/api/auth/register', async (request, response) => {
  const { name, email, password } = request.body || {};
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

  if (typeof name !== 'string' || !name.trim() || name.trim().length > 80) {
    throw new ApiError(400, 'Name is required and must be 80 characters or fewer.');
  }
  if (
    normalizedEmail.length > 254
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
  ) {
    throw new ApiError(400, 'Enter a valid email address.');
  }
  if (
    typeof password !== 'string'
    || password.length < 8
    || !/[A-Z]/.test(password)
    || !/\d/.test(password)
  ) {
    throw new ApiError(400, 'Password must have at least 8 characters, one uppercase letter, and one number.');
  }

  const credentials = await hashPassword(password);
  const result = await updateStore((nextStore) => {
    if (nextStore.users.some((user) => user.email === normalizedEmail)) {
      throw new ApiError(409, 'An account with this email already exists.');
    }

    const user = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      salt: credentials.salt,
      passwordHash: credentials.hash,
      createdAt: new Date().toISOString(),
    };
    nextStore.users.push(user);
    return { user: publicUser(user) };
  });

  response.status(201).json(result);
});

app.post('/api/auth/login', async (request, response) => {
  const { email, password } = request.body || {};
  const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
  const user = store.users.find((entry) => entry.email === normalizedEmail);

  if (
    typeof password !== 'string'
    || !user
    || !(await passwordsMatch(password, user))
  ) {
    throw new ApiError(401, 'Email or password is incorrect.');
  }

  const result = await updateStore((nextStore) => ({
    token: createSession(nextStore, user),
    user: publicUser(user),
  }));
  response.json(result);
});

async function requireAuthentication(request, response, next) {
  const authorization = request.get('authorization') || '';
  const match = authorization.match(/^Bearer ([\w-]+)$/);
  if (!match) throw new ApiError(401, 'Sign in to continue.');

  const tokenHash = hashToken(match[1]);
  const session = store.sessions.find((entry) => entry.tokenHash === tokenHash);
  if (!session || new Date(session.expiresAt).getTime() <= Date.now()) {
    throw new ApiError(401, 'Your session has expired. Please sign in again.');
  }

  const user = store.users.find((entry) => entry.id === session.userId);
  if (!user) throw new ApiError(401, 'Your account could not be found.');
  request.user = user;
  request.session = session;
  next();
}

app.get('/api/auth/me', requireAuthentication, (request, response) => {
  response.json({ user: publicUser(request.user) });
});

app.post('/api/auth/logout', requireAuthentication, async (request, response) => {
  await updateStore((nextStore) => {
    nextStore.sessions = nextStore.sessions.filter(
      (session) => session.tokenHash !== request.session.tokenHash,
    );
  });
  response.status(204).end();
});

app.get('/api/tasks', requireAuthentication, (request, response) => {
  const tasks = store.tasks
    .filter((task) => task.ownerId === request.user.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map(publicTask);
  response.json({ tasks });
});

app.post('/api/tasks', requireAuthentication, async (request, response) => {
  const taskFields = validateTaskInput(request.body);
  const task = {
    id: crypto.randomUUID(),
    ...taskFields,
    ownerId: request.user.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await updateStore((nextStore) => {
    nextStore.tasks.push(task);
  });
  response.status(201).json({ task: publicTask(task) });
});

app.put('/api/tasks/:id', requireAuthentication, async (request, response) => {
  const taskFields = validateTaskInput(request.body, { partial: true });
  const task = await updateStore((nextStore) => {
    const existingTask = nextStore.tasks.find(
      (entry) => entry.id === request.params.id && entry.ownerId === request.user.id,
    );
    if (!existingTask) throw new ApiError(404, 'Task not found.');
    Object.assign(existingTask, taskFields, { updatedAt: new Date().toISOString() });
    return existingTask;
  });
  response.json({ task: publicTask(task) });
});

app.delete('/api/tasks/:id', requireAuthentication, async (request, response) => {
  const deleted = await updateStore((nextStore) => {
    const taskIndex = nextStore.tasks.findIndex(
      (entry) => entry.id === request.params.id && entry.ownerId === request.user.id,
    );
    if (taskIndex === -1) return false;
    nextStore.tasks.splice(taskIndex, 1);
    return true;
  });
  if (!deleted) throw new ApiError(404, 'Task not found.');
  response.status(204).end();
});

app.use((request, response) => {
  response.status(404).json({ error: 'Endpoint not found.' });
});

app.use((error, request, response, next) => {
  if (response.headersSent) {
    next(error);
    return;
  }
  if (error instanceof ApiError) {
    response.status(error.status).json({ error: error.message });
    return;
  }
  if (error instanceof SyntaxError && Object.hasOwn(error, 'body')) {
    response.status(400).json({ error: 'Request body must contain valid JSON.' });
    return;
  }
  console.error(error);
  response.status(500).json({ error: 'An unexpected server error occurred.' });
});

initializeStore()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`TaskFlow API listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to initialize the data store:', error);
    process.exitCode = 1;
  });
