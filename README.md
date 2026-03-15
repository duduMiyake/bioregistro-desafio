# 🏦 FinTrack – Desafio Técnico
Resolução do desafio

# 🚀 Tecnologias Utilizadas

### Backend
- Java 17
- Quarkus 3

### Frontend
- React 18
- Vite
- TypeScript

### Testes
- JUnit 5
- Mockito

### Banco de Dados
- PostgreSQL

### Documentação
- OpenAPI / Swagger

### Container
- Docker
- Docker Compose

### ORM 
- Hibernate ORM Panache

---

# 🐛 Bugs Identificados e Corrigidos

Durante a análise do código foram encontrados diversos problemas que afetavam o funcionamento correto da aplicação.

## 1️⃣ Erro na rota de listagem de transações

A rota no backend estava definida como:

```
/api/transacoes
```

Porém o frontend consumia:

```
/api/transacao
```

### Correção

Foi ajustado apenas o **controller** para manter o padrão já utilizado no frontend, evitando múltiplas alterações no front-end.

---

## 2️⃣ Erro ao deletar transações

Ao tentar deletar uma transação, a operação não era persistida no banco de dados.

### Causa

O método não possuía a anotação:

```java
@Transactional
```

### Correção

Adição da anotação `@Transactional` no método de delete do controller de transações.

---

## 3️⃣ Erro ao criar registros de transação e categoria

Ao criar novos registros, ocorria erro relacionado à geração de IDs.

### Causa

As entidades estavam utilizando:

```java
PanacheEntity
```

O Hibernate tentava gerar IDs utilizando sequências no formato:

```
*_SEQ
```

Sequências essas que **não existiam no banco de dados**.

### Correção

Substituição de:

```java
PanacheEntity
```

por:

```java
PanacheEntityBase
```

permitindo definir explicitamente o campo `id`.

---

## 4️⃣ Erro no cálculo do resumo financeiro

O cálculo estava invertendo receitas e despesas.

### Problema

Receitas estavam sendo somadas como despesas e vice-versa.

### Correção

Ajuste na lógica do método `calcularResumo`.

---

## 5️⃣ Erro no filtro por período

O método do repository responsável por buscar transações por período possuía erro lógico.

### Problema

Os parâmetros estavam invertidos:

```
dataInicio ↔ dataFim
```

O que fazia com que nenhuma transação fosse encontrada (Por requisição do lado do servidor).

### Correção

Correção da ordem dos parâmetros na consulta.

---

## 6️⃣ Problema de responsividade no frontend

A interface não se comportava corretamente em telas menores.

### Correção

Implementado:

- Sidebar com comportamento **collapse em mobile**
- Layout reorganizado para **coluna única em telas pequenas**

---

# ✨ Funcionalidades Implementadas

## Backend

- CRUD completo de **transações**
- CRUD completo de **categorias**
- Filtro de transações por:
  - período
  - categoria
- Endpoint de **resumo financeiro**
- Validações de regras de negócio
- Endpoint de **health check**
- Integração com PostgreSQL via Panache
- Tratamento adequado de erros HTTP

---

## Frontend

- Dashboard com resumo financeiro
- Listagem de transações
- Filtros por data e categoria
- Formulários de criação e edição
- Gerenciamento de categorias
- Interface responsiva

---

# ⭐ Diferenciais Implementados

## Cache no backend

Implementação de cache utilizando **Quarkus Cache** para otimizar consultas frequentes.

Endpoints cacheados:

- `resumoFinanceiro`
- `listarTodasCategorias`

### Motivo da escolha

`resumoFinanceiro`

- envolve cálculo de saldo
- consulta todas as transações
- maior custo computacional

`listarTodasCategorias`

- baixo volume de mudanças
- página dedicada de visualização

A listagem de transações **não foi cacheada**, pois é mais dinâmica.

---

## Paginação no frontend

Foi implementada paginação na listagem de transações permitindo:

- controle de itens por página
- navegação entre páginas

---

## Testes no backend

Foram adicionados testes unitários utilizando:

- **JUnit 5**
- **Mockito**

Testes criados para:

- cálculo do resumo financeiro
- listagens
- verificações de exceções
- validações de regras
- cenários de erro

---

## Endpoint de Health Check

Implementado endpoint:

```
GET /api/health
```

Resposta:

```json
{
  "status": "UP",
  "version": "1.0.0"
}
```

---

## Documentação da API

A API possui documentação automática utilizando **OpenAPI / Swagger**.

Disponível em:

```
http://localhost:8080/q/swagger-ui
```

---

# Como Executar o Projeto

Clone o repositório:

```bash
git clone <url-do-repositorio>
```

Entre na pasta:

```bash
cd fintrack
```

Suba todos os serviços:

```bash
docker-compose up --build
```

---

# 🌐 Acessos

Frontend

```
http://localhost:3000
```

Backend

```
http://localhost:8080
```

Swagger

```
http://localhost:8080/q/swagger-ui
```

PostgreSQL

```
localhost:5432
```

---

# 🧪 Executando os Testes

Backend:

```bash
cd backend
mvn test
```

---

# 📐 Regras de Negócio Implementadas

- Transações possuem:
  - descrição
  - valor
  - tipo
  - data
  - categoria
- Saldo calculado como:

```
receitas - despesas
```

- Valor da transação deve ser **positivo**
- Descrição deve possuir **mínimo de 3 caracteres**
- Datas futuras **não são permitidas**
- Exclusão de categorias trata transações vinculadas

---

## 🏗️ Estrutura do Projeto

```
fintrack/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/br/com/fintrack/
│       │   │   ├── controller/
│       │   │   ├── model/
│       │   │   ├── repository/
│       │   │   ├── service/
│       │   │   └── dto/
│       │   └── resources/
│       │       ├── application.properties
│       │       └── import.sql
│       └── test/
│           └── java/br/com/fintrack/  
│               └── service/
│                   ├── CategoriaServiceTest.java
│                   └── TransacaoServiceTest.java
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── types/
│       ├── components/
│       ├── services/
│       └── App.tsx
└── init.sql
```

---