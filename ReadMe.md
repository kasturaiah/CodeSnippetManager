# 🚀 Code Snippet Manager – Full Stack Application

A powerful and developer-friendly web application for saving, organizing, and sharing **code snippets**. Built using **React** (frontend) and **Node.js + SQLite** (backend). This app helps developers keep their useful code organized with syntax highlighting, search and filters, tags, and visibility controls.

---

# ✨ Features

### 👤 **User Authentication**

* Register & Login
* Stored in **localStorage** (no external DB)

### 📝 **Full CRUD for Snippets**

* Create, Read, Update, Delete code snippets
* Each snippet has:

  * Title
  * Code
  * Language (JS, Python, Java)
  * Tags
  * Public/Private visibility

### 🎨 **Syntax Highlighting**

* Supports multiple languages
* Powered by **react-syntax-highlighter**

### 🔍 **Search & Filter**

* Search by title or code content
* Filter by:

  * Tags
  * Language
  * Visibility

### 🔒 **Visibility Controls**

* Public snippets → visible to everyone
* Private snippets → only visible to the owner

### 🏷️ **Tags System**

* Add unlimited tags to a snippet
* Filter snippets using tags

### 📱 **Responsive & Clean UI**

* Mobile-friendly design
* Built with **plain CSS** (no Tailwind or external UI libraries)

### 💾 **Lightweight Database**

* Uses **SQLite** for file-based storage
* No external database required

---

# 🧰 Tech Stack

### **Frontend**

* React (Hooks)
* React Router
* react-syntax-highlighter
* Plain CSS (custom responsive UI)
* Fetch API

### **Backend**

* Node.js
* Express.js
* SQLite (better-sqlite3)
* CORS

---

# 📦 Prerequisites

* Node.js v16+ → [https://nodejs.org](https://nodejs.org)
* VSCode / Any editor
* Basic npm knowledge

---

# 🏗️ Installation & Setup Guide

Follow these steps to set up the project locally.

## 1️⃣ Create Project Structure

```
CodeSnippetManager/
├── backend/
└── frontend/
```

---

# 🔧 Backend Setup

### Navigate to backend folder

```bash
cd backend
```

### Initialize project

```bash
npm init -y
```

### Install dependencies

```bash
npm install express cors better-sqlite3
```

### Create required files

```
backend/
├── database.js
├── routes/
│   ├── snippets.js
│   └── tags.js
├── server.js
└── package.json
```

### Add backend code

Paste the provided backend logic into these files.

### Start backend

```bash
npm start
```

Backend runs on → **[http://localhost:5000](http://localhost:5000)**

---

# 🎨 Frontend Setup

### Navigate to frontend folder

```bash
cd ../frontend
```

### Create React app

```bash
npx create-react-app .
```

### Install frontend dependencies

```bash
npm install react-router-dom react-syntax-highlighter
```

### Add required source files

```
frontend/src/
├── components/
│   ├── Navbar.js
│   ├── SnippetForm.js
│   ├── SnippetList.js
│   ├── Login.js
│   ├── Register.js
│   └── SearchBar.js
├── pages/
│   ├── Home.js
│   ├── CreateSnippet.js
│   └── Profile.js
├── App.js
├── App.css
├── index.js
└── index.css
```

### Add proxy to package.json (so frontend calls backend easily)

```json
"proxy": "http://localhost:5000"
```

### Start frontend

```bash
npm start
```

Frontend runs on → **[http://localhost:3000](http://localhost:3000)**

---

# ▶️ Running the App

### 1. Backend

```bash
cd backend
npm start
```

➡ [http://localhost:5000](http://localhost:5000)

### 2. Frontend

```bash
cd frontend
npm start
```

➡ [http://localhost:3000](http://localhost:3000)

Open the frontend URL in
