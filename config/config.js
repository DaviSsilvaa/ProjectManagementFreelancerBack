require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'senha_test',
    database: process.env.DB_NAME || 'freela_db',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,  // Desabilita o log de queries
  },
  test: {
    username: 'postgres',
    password: 'senha_test',
    database: 'freela_db_test',
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    use_env_variable: 'DATABASE_URL',  // Para produção, usa variável de ambiente
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Ignora verificação SSL (caso seja necessário para produção)
      },
    },
  },
};
