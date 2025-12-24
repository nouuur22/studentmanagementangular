// src/app/components/teacher-list/teacher-list.component.ts

// Import necessary Angular core modules
import { Component, OnInit } from '@angular/core';
// Import CommonModule for common Angular directives
import { CommonModule } from '@angular/common';
// Import routing modules for navigation
import { RouterModule } from '@angular/router';
// Import the TeacherService to interact with teacher data
import { TeacherService } from '../../services/teacher.service';
// Import the Teacher model for type safety
import { Teacher } from '../../models/teacher';
// Import the reusable DeleteButtonComponent
import { DeleteButtonComponent } from '../shared/delete-button/delete-button.component';

// Component decorator defining metadata for TeacherListComponent
@Component({
  selector: 'app-teacher-list', // HTML tag to use this component
  standalone: true, // Marks this as a standalone component
  imports: [
    CommonModule, // Import common directives like *ngIf, *ngFor
    RouterModule, // Import routing directives
    DeleteButtonComponent // Import reusable delete button component
  ],
  templateUrl: './teacher-list.component.html', // Path to the component's HTML template
  styleUrls: ['./teacher-list.component.css'] // Path to the component's CSS styles
})
export class TeacherListComponent implements OnInit {
  // Array to store teacher data
  teachers: Teacher[] = [];
  // Loading state to show/hide loading indicators
  loading = false;
  // Property to store error messages
  error = '';

  // Constructor with dependency injection for TeacherService
  constructor(private teacherService: TeacherService) {}

  // Lifecycle hook: Called once after component initialization
  ngOnInit(): void {
    // Load teachers when component initializes
    this.loadTeachers();
  }

  // Method to load all teachers from the service
  loadTeachers(): void {
    this.loading = true; // Start loading indicator
    this.teacherService.getAllTeachers().subscribe({
      // Success callback
      next: (data) => {
        this.teachers = data; // Store teacher data
        this.loading = false; // Stop loading indicator
      },
      // Error callback
      error: (err) => {
        console.error('Error fetching teachers:', err); // Log error
        this.error = 'Failed to load teachers'; // Set user-friendly error message
        this.loading = false; // Stop loading indicator
      }
    });
  }

  // Method to delete a teacher by ID
  deleteTeacher(id: number): void {
    // Confirm with user before deleting
    if (confirm('Are you sure you want to delete this teacher?')) {
      // Call service to delete teacher
      this.teacherService.deleteTeacher(id).subscribe({
        // Success callback
        next: () => {
          // Reload teachers list after successful deletion
          this.loadTeachers();
        },
        // Error callback
        error: (err) => {
          console.error('Error deleting teacher:', err); // Log error
          this.error = 'Failed to delete teacher'; // Set error message
        }
      });
    }
  }
}
