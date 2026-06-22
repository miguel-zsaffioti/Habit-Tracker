CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    data_nascimento DATE
);

CREATE TABLE habits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    tipo VARCHAR(20) DEFAULT 'desenvolver',
    meta_especifica VARCHAR(255),
    frequencia_dias INTEGER[],
    data_inicio DATE NOT NULL,
    data_fim DATE,
    ativo BOOLEAN DEFAULT TRUE,
    current_streak INTEGER DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE habit_logs (
    id SERIAL PRIMARY KEY,
    habit_id INTEGER REFERENCES habits(id) ON DELETE CASCADE,
    data_checkin DATE NOT NULL,
    concluido BOOLEAN DEFAULT TRUE,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(habit_id, data_checkin)
);

CREATE TABLE achievements (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    criterio_tipo VARCHAR(50),
    criterio_valor INTEGER NOT NULL,
    icone_referencia VARCHAR(100)
);

CREATE TABLE user_achievements (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INTEGER REFERENCES achievements(id) ON DELETE CASCADE,
    data_desbloqueio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, achievement_id)
);

INSERT INTO achievements (nome, descricao, criterio_tipo, criterio_valor, icone_referencia) VALUES
('Primeira chama', '7 dias seguidos.', 'streak', 7, 'chama'),
('Mês perfeito', '30 dias seguidos.', 'streak', 30, 'calendario'),
('Primeiro passo', '1º hábito criado.', 'total_habitos', 1, 'planta'),
('Comprometido', '3 hábitos ativos.', 'habitos_ativos', 3, 'musculo'),
('Diamante', '100 dias seguidos.', 'streak', 100, 'diamante');