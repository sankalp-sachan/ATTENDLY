# Attendly

## Overview
Attendly is a modern, responsive attendance management application built with the MERN stack (MongoDB, Express, React, Node.js). It is designed to streamline the process of tracking attendance for students and administrators, offering a seamless user experience with a focus on performance and aesthetics.

## Features

### 🔐 Authentication & Security
- **Secure Login/Signup**: Robust authentication system with protected routes.
- **Role-Based Access Control**: specialized dashboards for Users and Administrators.
- **Session Management**: Automatic session handling with warning alerts to prevent data loss.

### 📊 Dashboard & Analytics
- **User Dashboard**: Real-time view of attendance records, stats, and history.
- **Admin Dashboard**: Comprehensive tools for managing users and attendance data.
- **Interactive UI**: Smooth transitions and animations powered by Framer Motion.

### 📱 PWA & Mobile Experience
- **Progressive Web App (PWA)**: Installable on mobile devices for a native app-like experience.
- **Install Overlay**: Prompts users to install the app for better accessibility.
- **Splash Screen**: Engaging loading experience with custom animations.

### 🚀 Performance & Tech
- **Speed Insights**: Integrated with Vercel Speed Insights for monitoring performance.
- **Optimized Build**: Built with Vite for lightning-fast development and optimized production builds.

## Tech Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Routing**: React Router DOM
- **State Management**: Context API (Auth & Attendance)
- **PWA Support**: Vite Plugin PWA
- **Icons**: Lucide React & React Icons

## Project Architecture

The frontend follows a modular component-based architecture:
- `src/components`: Reusable UI components (Splash Screen, Modals, Overlays).
- `src/pages`: Main application views (Auth, Dashboard, Admin).
- `src/context`: Global state management for Authentication and Attendance data.
- `src/services`: API handlers and service logic.

## Developer

Designed and developed with a focus on modern web standards and user-centric design. Check out the **About Developer** section within the app for more details.