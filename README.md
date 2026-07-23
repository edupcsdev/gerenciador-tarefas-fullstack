# DevConnect - Gerenciador de Tarefas Full Stack

O **DevConnect** é uma aplicação web completa (Full Stack) desenvolvida para auxiliar desenvolvedores e estudantes na organização de suas tarefas diárias, estudos e projetos. O sistema conta com autenticação individual de usuários via JSON Web Token (JWT) e armazenamento persistente em banco de dados relacional PostgreSQL.

---

## Links do Projeto
- **Frontend (Vercel):** [Acesse a aplicação aqui](https://gerenciador-tarefas-fullstack.vercel.app)
- **Backend API (Render):** [Acesse a API aqui](https://gerenciador-tarefas-fullstack.onrender.com)

## Credenciais de Teste para Avaliação

Para facilitar os testes da avaliação sem a necessidade de cadastrar uma nova conta, utilize o usuário pré-cadastrado abaixo:

* **E-mail de Teste:** `teste@email.com`
* **Senha de Teste:** `123`

*(Nota: O sistema também possui a funcionalidade de cadastro de novos usuários totalmente operacional na tela inicial).*

---

## Tecnologias Utilizadas

### **Backend**
* **Node.js** & **Express.js** — Construção da API RESTful.
* **PostgreSQL (Neon DB)** — Banco de dados relacional.
* **pg (node-postgres)** — Driver de conexão ao PostgreSQL.
* **JSON Web Token (JWT)** — Autenticação e proteção das rotas.
* **Bcrypt.js** — Criptografia e hashing seguro de senhas.
* **CORS** — Habilitação de requisições entre origens cruzadas.
* **Dotenv** — Gerenciamento de variáveis de ambiente.

### **Frontend**
* **HTML5** & **CSS3** — Estrutura e estilização.
* **Bootstrap 5** & **Bootstrap Icons** — Interface moderna, responsiva e ícones dinâmicos.
* **JavaScript Vanilla (ES6+)** — Manipulação dinâmica do DOM e consumo da API.

---

## Arquitetura do Projeto (MVC)

O backend foi estruturado seguindo o padrão arquitetural **MVC (Model-View-Controller)**:

```text
backend-gerenciador/
├── src/
│   ├── config/          # Conexão com o banco (db.js) e criação de tabelas (initDb.js)
│   ├── controllers/     # Regras de negócio (authController.js, taskController.js)
│   ├── middlewares/     # Middleware de proteção JWT (authMiddleware.js)
│   ├── models/          # Consultas SQL (taskModel.js, userModel.js)
│   ├── routes/          # Endpoints REST (authRoutes.js, taskRoutes.js)
│   └── server.js        # Ponto de entrada do Express
├── .env                 # Variáveis de ambiente
└── package.json
