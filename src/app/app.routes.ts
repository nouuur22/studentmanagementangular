import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  // Home route
  {
    path: '',
    component: HomeComponent
  },

  // Course routes
  {
    path: 'courses',
    loadComponent: () => import('./components/course-list/course-list.component').then(m => m.CourseListComponent)
  },
  {
    path: 'courses/new',
    loadComponent: () => import('./components/course-form/course-form.component').then(m => m.CourseFormComponent)
  },
  {
    path: 'courses/edit/:id',
    loadComponent: () => import('./components/course-form/course-form.component').then(m => m.CourseFormComponent)
  },
  {
    path: 'courses/:id',
    loadComponent: () => import('./components/course-detail/course-detail.component').then(m => m.CourseDetailComponent)
  },

  // Student routes (ADDED - missing from your original)
  {
    path: 'students',
    loadComponent: () => import('./components/student-list/student-list.component').then(m => m.StudentListComponent)
  },
  {
    path: 'students/new',
    loadComponent: () => import('./components/student-form/student-form.component').then(m => m.StudentFormComponent)
  },
  {
    path: 'students/edit/:id',
    loadComponent: () => import('./components/student-form/student-form.component').then(m => m.StudentFormComponent)
  },

  // Enrollment routes
 {
  path: 'enrollments',
  loadComponent: () => import('./components/enrollment-list/enrollment-list.component')
    .then(m => m.EnrollmentListComponent)
},
{
  path: 'enrollments/new',
  loadComponent: () => import('./components/enrollment-form/enrollment-form.component')
    .then(m => m.EnrollmentFormComponent)
},
{
  path: 'enrollments/edit/:id',
  loadComponent: () => import('./components/enrollment-form/enrollment-form.component')
    .then(m => m.EnrollmentFormComponent)
},


  // Default redirect

  {
   path: 'teachers',
    loadComponent: () => import('./components/teacher-list/teacher-list.component').then(m => m.TeacherListComponent)
  },
  {
    path: 'teachers/new',
    loadComponent: () => import('./components/teacher-form/teacher-form.component').then(m => m.TeacherFormComponent)
  },
  {
    path: 'teachers/edit/:id',
    loadComponent: () => import('./components/teacher-form/teacher-form.component').then(m => m.TeacherFormComponent)
  },
];
