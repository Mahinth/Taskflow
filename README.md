# ✦ TaskFlow — Modern To-Do List Application

A modern, full-stack To-Do List web application built with **HTML, CSS, JavaScript, Node.js, Express**, and **MongoDB Atlas**.

![Node.js](https://img.shields.io/badge/Node.js-18-green)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-orange)

---

## 📋 Features

- ✅ **Create** new tasks
- 📝 **Edit** existing tasks inline
- ✔️ **Mark tasks** as complete/incomplete
- 🗑️ **Delete** tasks with smooth animations
- 🔍 **Filter** tasks by status (All / Active / Completed)
- 📊 **Task counter** showing remaining items
- 🌙 **Dark theme** with glassmorphism UI
- 📱 **Fully responsive** — works on all devices
- 🐳 **Docker** containerized
- 🚀 **CI/CD** pipeline via GitHub Actions

---

## 🏗️ Architecture

```
Frontend (HTML/CSS/JS)  →  Express.js REST API  →  MongoDB Atlas
```

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Cloud) |
| Container | Docker (multi-stage build) |
| CI/CD | GitHub Actions |

---

## 📁 Project Structure

```
todo-app/
├── public/                  # Frontend (served as static files)
│   ├── index.html           # Main HTML page
│   ├── style.css            # CSS styles (dark theme)
│   └── app.js               # Client-side JavaScript
├── models/
│   └── Task.js              # Mongoose Task model
├── routes/
│   └── tasks.js             # Express API routes
├── server.js                # Entry point — Express server
├── package.json
├── .env                     # Environment variables (not in Git)
├── .gitignore
├── .dockerignore
├── Dockerfile               # Multi-stage Docker build
├── .github/
│   └── workflows/
│       └── ci-cd.yml        # GitHub Actions pipeline
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas) (free tier)
- [Docker](https://www.docker.com/) (optional, for container deployment)

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/todo-app.git
cd todo-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/todolistDB?retryWrites=true&w=majority
PORT=3000
```

> ⚠️ Replace `<username>`, `<password>`, and `<cluster>` with your MongoDB Atlas credentials.

### 4. Run the Application

```bash
npm start
```

Open your browser and navigate to **http://localhost:3000**

---

## 🐳 Docker

### Build the Image

```bash
docker build -t todo-app .
```

### Run the Container

```bash
docker run -d -p 3000:3000 \
  -e MONGODB_URI="mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/todolistDB" \
  --name todo-app \
  todo-app
```

### Pull from DockerHub

```bash
docker pull <your-dockerhub-username>/todo-app:latest
docker run -d -p 3000:3000 \
  -e MONGODB_URI="your-mongodb-uri" \
  --name todo-app \
  <your-dockerhub-username>/todo-app:latest
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

The pipeline (`.github/workflows/ci-cd.yml`) has **3 stages**:

| Stage | Description |
|-------|------------|
| **1. Clone** | Checkout repository & setup Node.js |
| **2. Build** | Install dependencies & verify project structure |
| **3. Docker** | Build Docker image & push to DockerHub |

### Required GitHub Secrets

| Secret | Description |
|--------|------------|
| `DOCKERHUB_USERNAME` | Your DockerHub username |
| `DOCKERHUB_TOKEN` | DockerHub access token |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/tasks` | Get all tasks |
| `POST` | `/api/tasks` | Create a new task |
| `PUT` | `/api/tasks/:id` | Update a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `GET` | `/api/health` | Health check |

---

## 👥 User Stories

| ID | Story | Status |
|----|-------|--------|
| US-01 | Add a new task | ✅ |
| US-02 | View all tasks | ✅ |
| US-03 | Mark task as complete | ✅ |
| US-04 | Delete a task | ✅ |
| US-05 | Edit a task | ✅ |
| US-06 | Filter tasks by status | ✅ |
| US-07 | See task count | ✅ |
| US-08 | Responsive design | ✅ |
| US-09 | Visual feedback (toasts) | ✅ |
| US-10 | Dark/modern theme | ✅ |
| US-11 | Dockerfile | ✅ |
| US-12 | CI/CD pipeline | ✅ |
| US-13 | DockerHub push | ✅ |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a **Pull Request** to `main`

> **Note:** Direct pushes to `main` are not allowed. All changes must go through Pull Requests.

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgements

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) — Cloud database
- [Express.js](https://expressjs.com/) — Web framework
- [Docker](https://www.docker.com/) — Containerization
- [GitHub Actions](https://github.com/features/actions) — CI/CD
