// src/app/components/enrollment-list/enrollment-list.component.ts

// Import necessary Angular core modules
import { Component, OnInit } from '@angular/core';
// Import CommonModule for common Angular directives
import { CommonModule } from '@angular/common';
// Import routing modules for navigation
import { RouterModule } from '@angular/router';
// Import HttpClientModule for HTTP client functionality
import { HttpClientModule } from '@angular/common/http';
// Import the EnrollmentService to interact with enrollment data
import { EnrollmentService } from '../../services/enrollment.service';
// Import the Enrollment model for type safety
import { Enrollment } from '../../models/enrollment.model';

// Import Pipe and PipeTransform for creating custom pipe
import { Pipe, PipeTransform } from '@angular/core';

// Custom pipe to transform enrollment status to Bootstrap badge classes
@Pipe({
  name: 'statusColor', // Name of the pipe used in templates
  standalone: true // Marks this as a standalone pipe
})
export class StatusColorPipe implements PipeTransform {
  // Method to transform status string to CSS class
  transform(status: string): string {
    // Switch based on status (converted to uppercase for case-insensitive comparison)
    switch(status?.toUpperCase()) {
      case 'ACTIVE': return 'badge bg-success'; // Green badge for active status
      case 'COMPLETED': return 'badge bg-secondary'; // Grey badge for completed status
      case 'DROPPED': return 'badge bg-danger'; // Red badge for dropped status
      default: return 'badge bg-light'; // Light badge for unknown status
    }
  }
}

// Component decorator defining metadata for EnrollmentListComponent
@Component({
  selector: 'app-enrollment-list', // HTML tag to use this component
  standalone: true, // Marks this as a standalone component
  imports: [
    CommonModule, // Import common directives like *ngIf, *ngFor
    RouterModule, // Import routing directives
    HttpClientModule, // Import HTTP client functionality
    StatusColorPipe // Import custom pipe for status styling
  ],
  templateUrl: './enrollment-list.component.html', // Path to the component's HTML template
  styleUrls: ['./enrollment-list.component.css'] // Path to the component's CSS styles
})
export class EnrollmentListComponent implements OnInit {
  // Array to store enrollment data
  enrollments: Enrollment[] = [];
  // Loading state to show/hide loading indicators
  loading = false;
  // Property to store error messages
  error = '';

  // Constructor with dependency injection for EnrollmentService
  constructor(private enrollmentService: EnrollmentService) {}

  // Lifecycle hook: Called once after component initialization
  ngOnInit(): void {
    // Load enrollments when component initializes
    this.loadEnrollments();
  }

  // Method to load all enrollments from the service
  loadEnrollments(): void {
    this.loading = true; // Start loading indicator
    this.enrollmentService.getAllEnrollments().subscribe({
      // Success callback
      next: (data) => {
        this.enrollments = data; // Store enrollment data
        this.loading = false; // Stop loading indicator
      },
      // Error callback
      error: (err) => {
        console.error('Error fetching enrollments:', err); // Log error
        this.error = 'Failed to load enrollments'; // Set user-friendly error message
        this.loading = false; // Stop loading indicator
      }
    });
  }

  // Method to delete an enrollment by ID
  deleteEnrollment(id: number): void {
    // Confirm with user before deleting
    if (confirm('Are you sure you want to delete this enrollment?')) {
      // Call service to delete enrollment
      this.enrollmentService.deleteEnrollment(id).subscribe({
        // Success callback
        next: () => {
          // Reload enrollments list after successful deletion
          this.loadEnrollments();
        },
        // Error callback
        error: (err) => {
          console.error('Error deleting enrollment:', err); // Log error
          alert('Failed to delete enrollment'); // Show alert to user
        }
      });
    }
  }
}
