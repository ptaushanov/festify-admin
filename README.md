# ⚙️ Administration app for the _festify_ project ⚙️

**Festify Admin** is a React JS web application for managing the content and
user interactions of the Festify educational multiplatform app (uses React
Native & Expo). It allows teachers to create and edit lesson content, manage
rewards and communicate with students through various channels. The app uses
Firebase Firestore for real-time updates and offers gamification elements to
engage and motivate students in their learning.

## 📱 Screenshots 📱

## 🛠️ Build with 🛠️

### Server Stack

- [TRPC](https://trpc.io/) - TypeScript RPC framework
- [Firebase Admin](https://firebase.google.com/) - Firestore, Authentication,
  Cloud Functions, Cloud Storage
- [Node.js](https://nodejs.org/en/) - JavaScript runtime environment
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript at Any Scale
- [Expo Server SDK](https://github.com/expo/expo-server-sdk-node) - Expo Server
  SDK
- [Zod](https://zod.dev) - TypeScript-first schema validation with static type
  inference
- [Resend](https://resend.com) - Email delivery service

### Client Stack

- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript at Any Scale
- [React Router DOM](https://reactrouter.com) - Declarative routing for React
- [React Query](https://react-query.tanstack.com/) - Performant and powerful
  data synchronization for React
- [React Hook Form](https://react-hook-form.com/) - Performant, flexible and
  extensible forms with easy-to-use validation
- [Zod](https://zod.dev) - TypeScript-first schema validation with static type
  inference
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for
  rapidly building custom designs
- [DaisyUI](https://daisyui.com/) - Tailwind CSS components
- [TRPC](https://trpc.io/) - TypeScript RPC framework
- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [Firebase](https://firebase.google.com/) - Firestore, Authentication, Cloud
  Functions, Cloud Storage
- [DND Kit](https://dndkit.com/) - A modern, lightweight, performant, accessible
  and extensible drag & drop toolkit for React
- [DevExtreme](https://js.devexpress.com/) - JavaScript UI widgets for
  progressive web and hybrid apps

## 🚀 Getting Started 🚀

### Prerequisites

Node.js and npm are required to run the project. You can download them from
[here](https://nodejs.org/en/). Also, you need to have a Firebase project with
Firestore, Authentication and Cloud Storage enabled. You can create a new
project from [here](https://console.firebase.google.com/).

Also for the notifications to work you need to have an Expo account and a
project with a server token. You can create a new project from
[here](https://expo.io/).

Email delivery is handled by Resend. You need to create an account and get an
API key from [here](https://resend.com/).

### Clone the repository

```bash
    git clone https://github.com/ptaushanov/festify-admin.git
    cd festify-admin
    
    cd client
    npm install

    cd ../server
    npm install
```

### Configure the project

1. Create a `.env` file inside the `client` & `server` folders and copy the
   contents from the example bellow. Fill in the values with your Firebase, Expo
   and Resend credentials.

---

**For the client:**

```env
# Firebase configuration
VITE_API_KEY = 
VITE_AUTH_DOMAIN = 
VITE_PROJECT_ID = 
VITE_STORAGE_BUCKET = 
VITE_MESSAGING_SENDERID = 
VITE_APP_ID = 

# Server connection
VITE_SERVER_URL = "http://localhost:5000"
```

---

**For the server:**

```env
API_KEY = 
AUTH_DOMAIN = 
PROJECT_ID = 
STORAGE_BUCKET = 
MESSAGING_SENDERID = 
APP_ID = 

RESEND_API_KEY = 
EXPO_ACCESS_TOKEN =
```

2. Copy the `serviceAccountKey.json` file from your Firebase project and paste
   it inside the `server` folder. This file is used for the Firebase Admin SDK
   to authenticate with Firebase.

## ⚙️ Running the project ⚙️

### Start the server

```bash
cd server
npm run dev
```

### Start the client

```bash
cd client
npm run dev
```

## ✒️ Authors ✒️

- **Petar Taushanov** - [ptaushanov](https://github.com/ptaushanov)

## 📄 License 📄

This project is licensed under the MIT License - _see the_
[LICENSE.md](https://github.com/ptaushanov/festify-admin/blob/master/LICENSE)
_file for details._
