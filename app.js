require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

const { sequelize } = require('./models');


console.log('--- TESTE DE CONFIGURAÇÃO ---');
console.log('Chave encontrada:', process.env.GEMINI_API_KEY ? 'Sim (Inicia com ' + process.env.GEMINI_API_KEY.substring(0, 4) + ')' : 'Não encontrada!');
console.log('-----------------------------');

// Routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/usersRoutes');
const clientRouter = require('./routes/clientRoutes'); // rotas de clientes
const projectRouter = require('./routes/projectRoutes'); // ✅ rotas de projetos
const attachmentRouter = require('./routes/attachmentRoutes');

const app = express();

/* ---------- Middlewares base ---------- */
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

/* ---------- CORS (permite local e rede) ---------- */
const allowlist = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://192.168.0.8:3000',
];

app.use(
  cors({
    origin: (origin, cb) => {
      // allow tools (Postman/cURL) sem origin e origens na allowlist
      if (!origin || allowlist.includes(origin)) return cb(null, true);
      return cb(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use('/files', express.static(path.resolve(__dirname, 'uploads')));

/* ---------- Sincronização das tabelas ---------- */
sequelize
  .sync({ alter: true })
  .then(() => console.log('[DB] Tabelas OK'))
  .catch((err) => console.error('[DB] Erro ao sincronizar:', err));

/* ---------- /api/v1 ---------- */
const api = express.Router();

api.get('/health', (_req, res) => res.json({ ok: true }));

api.use('/users', usersRouter); // /api/v1/users/...
api.use('/clients', clientRouter); // /api/v1/clients/...
api.use('/projects', projectRouter); // ✅ /api/v1/projects/...
api.use('/attachments', attachmentRouter);

app.use('/api/v1', api);

/* ---------- Rota raiz opcional ---------- */
app.use('/', indexRouter);

/* ---------- 404 ---------- */
app.use(function (req, res, next) {
  next(createError(404, 'Endpoint não encontrado'));
});

/* ---------- Handler de erro ---------- */
app.use(function (err, req, res, _next) {
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Erro interno no servidor',
      status: err.status || 500,
    },
  });
});

module.exports = app;
