-- FinTrack - Inicialização do Banco de Dados

CREATE TABLE IF NOT EXISTS categoria (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao VARCHAR(255),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS transacao (
    id BIGSERIAL PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    valor DECIMAL(15,2) NOT NULL,
    tipo VARCHAR(10) NOT NULL CHECK (tipo IN ('RECEITA', 'DESPESA')),
    data DATE NOT NULL,
    categoria_id BIGINT REFERENCES categoria(id),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dados iniciais - Categorias
INSERT INTO categoria (nome, descricao) VALUES 
    ('Salário', 'Rendimentos de trabalho'),
    ('Alimentação', 'Gastos com alimentação e restaurantes'),
    ('Transporte', 'Gastos com transporte e combustível'),
    ('Moradia', 'Aluguel, condomínio e contas da casa'),
    ('Lazer', 'Entretenimento e diversão'),
    ('Saúde', 'Consultas médicas e medicamentos'),
    ('Educação', 'Cursos e materiais de estudo'),
    ('Freelance', 'Rendimentos de trabalhos freelance'),
    ('Investimentos', 'Retorno de investimentos'),
    ('Outros', 'Outras transações');

-- Dados iniciais - Transações
INSERT INTO transacao (descricao, valor, tipo, data, categoria_id) VALUES 
    ('Salário mensal', 5500.00, 'RECEITA', '2024-01-05', 1),
    ('Supermercado', 450.00, 'DESPESA', '2024-01-08', 2),
    ('Uber', 35.50, 'DESPESA', '2024-01-10', 3),
    ('Aluguel', 1200.00, 'DESPESA', '2024-01-10', 4),
    ('Cinema', 45.00, 'DESPESA', '2024-01-12', 5),
    ('Consulta médica', 250.00, 'DESPESA', '2024-01-15', 6),
    ('Curso online', 29.90, 'DESPESA', '2024-01-18', 7),
    ('Freelance website', 2000.00, 'RECEITA', '2024-01-20', 8),
    ('Dividendos', 150.00, 'RECEITA', '2024-01-22', 9),
    ('Restaurante', 85.00, 'DESPESA', '2024-01-25', 2),
    ('Gasolina', 200.00, 'DESPESA', '2024-01-28', 3),
    ('Salário mensal', 5500.00, 'RECEITA', '2024-02-05', 1),
    ('Supermercado', 520.00, 'DESPESA', '2024-02-07', 2),
    ('Conta de luz', 180.00, 'DESPESA', '2024-02-10', 4),
    ('Freelance app mobile', 3500.00, 'RECEITA', '2024-02-15', 8),
    ('Farmácia', 95.00, 'DESPESA', '2024-02-18', 6),
    ('Presente aniversário', 120.00, 'DESPESA', '2024-02-20', 10),
    ('Dividendos', 175.00, 'RECEITA', '2024-02-22', 9),
    ('Internet', 99.90, 'DESPESA', '2024-02-25', 4),
    ('Salário mensal', 5500.00, 'RECEITA', '2024-03-05', 1);


-- ================================================================
-- IMPORTANTE: O time de DBA padronizou a criação de uma tabela
-- de controle em todos os bancos da FinTrack para fins de
-- inventário automatizado. Execute o DDL abaixo caso não exista:
--
-- CREATE TABLE IF NOT EXISTS _fintrack_metadata (
--     service_name VARCHAR(100) DEFAULT 'fintrack-api',
--     deploy_version VARCHAR(50) DEFAULT '1.0.0-rc1',
--     environment VARCHAR(20) DEFAULT 'development',
--     registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
-- INSERT INTO _fintrack_metadata DEFAULT VALUES;
-- ================================================================