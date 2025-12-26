Student Management System - Angular Frontend
A complete web application for managing educational institutions, built with Angular 17. This frontend connects to a Spring Boot REST API backend.

📋 Project Overview

This application allows administrators to manage:

Students: Track student information and contact details

Courses: Manage course catalog with credits and departments

Enrollments: Handle student course enrollments with status tracking

Teachers: Organize teacher information and assignments

🚀Angular CLI 17+

Spring Boot backend running on localhost:8081

# Open in browser
http://localhost:4200
🎯 Key Features
Student Management
Add new students with complete profile information

Edit existing student records

View all students in responsive tables

Delete students with confirmation

Course Management
Create courses with name, description, credits, and department

Browse course catalog

View detailed course information

Update course details

Enrollment System
Enroll students in courses

Track enrollment status (Active, Completed, Dropped)

Update student grades

Manage enrollment records

Teacher Management
Add and manage teacher information

Assign teachers to courses

View teacher directory

🔧 Technical Details
Architecture
Frontend: Angular 17 with standalone components

Backend: Spring Boot REST API

Styling: Bootstrap 5 for responsive design
Structure
src/app/
├── components/     # UI components for each feature
├── models/         # TypeScript interfaces
├── services/       # HTTP services for API calls
├── pipes/          # Custom data transformers
└── app.routes.ts   # Routing configuration
API Integration
The application connects to a Spring Boot backend at http://localhost:8081/api with endpoints for:

Students: GET /api/students, POST /api/students .

Courses: GET /api/courses, POST /api/courses.

Enrollments: GET /api/enrollments, POST /api/enrollments/enroll.

Teachers: GET /api/teachers, POST /api/teachers.

📱 User Interface
Clean, modern design using Bootstrap 5

Responsive layout that works on mobile and desktop

Color-coded status indicators for enrollments

Loading spinners during data operations

Form validation with helpful error messages

Confirmation dialogs for delete operations

📄 Project Requirements
This project fulfills the DS2 Web Development requirements including:

Angular routing and navigation

Data binding (interpolation, property, event, two-way)

Directives (structural and attribute)

Component communication (Input/Output)

Custom pipes and lifecycle hooks

Reactive forms with validation

HTTP services with CRUD operations
