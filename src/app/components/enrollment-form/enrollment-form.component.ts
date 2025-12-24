// src/app/components/enrollment-form/enrollment-form.component.ts

// Import necessary Angular core modules
import { Component, OnInit } from '@angular/core';
// Import form-related modules for reactive forms
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// Import routing modules for navigation and route parameters
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// Import CommonModule for common Angular directives
import { CommonModule } from '@angular/common';
// Import services for enrollment, student, and course operations
import { EnrollmentService } from '../../services/enrollment.service';
import { StudentService } from '../../services/student.service';
import { CourseService } from '../../services/course.service';
import { Enrollment } from '../../models/enrollment.model';
import { Student } from '../../models/student.model';
import { Course } from '../../models/course.model';

// Component decorator defining metadata for EnrollmentFormComponent
@Component({
  selector: 'app-enrollment-form', // HTML tag to use this component
  standalone: true, // Marks this as a standalone component
  imports: [CommonModule, RouterModule, ReactiveFormsModule], // Import required modules
  templateUrl: './enrollment-form.component.html', // Path to the component's HTML template
  styleUrls: ['./enrollment-form.component.css'] // Path to the component's CSS styles
})
export class EnrollmentFormComponent implements OnInit {
  // FormGroup to manage the reactive form for enrollments
  enrollmentForm: FormGroup;
  // Flag to determine if we're in edit mode (true) or create mode (false)
  isEditMode = false;
  // Store the enrollment ID when in edit mode, null for create mode
  enrollmentId: number | null = null;
  // Property to store error messages for display
  errorMessage = '';
  // Loading state to show/hide loading indicators
  isLoading = false;

  // Arrays to store lists of students and courses for dropdowns
  students: Student[] = [];
  courses: Course[] = [];

  // Constructor with dependency injection for all required services
  constructor(
    private fb: FormBuilder, // FormBuilder for creating form controls
    private enrollmentService: EnrollmentService, // Service for enrollment operations
    private studentService: StudentService, // Service for student operations
    private courseService: CourseService, // Service for course operations
    private router: Router, // Router for navigation
    private route: ActivatedRoute // ActivatedRoute for accessing route parameters
  ) {
    // Initialize the form with controls and validators
    this.enrollmentForm = this.fb.group({
      studentId: ['', Validators.required], // Required field for student selection
      courseId: ['', Validators.required], // Required field for course selection
      enrollmentDate: [this.getTodayDate(), Validators.required], // Default to today's date, required
      grade: [''], // Optional field for grade
      status: ['ACTIVE', Validators.required] // Default status is ACTIVE, required
    });
  }

  // Lifecycle hook: Called once after component initialization
  ngOnInit(): void {
    // Load students and courses for dropdowns
    this.loadStudents();
    this.loadCourses();

    // Get enrollment ID from URL route parameter
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // If ID exists, we're in edit mode
      this.isEditMode = true;
      this.enrollmentId = +id; // Convert string to number
      this.loadEnrollment(+id); // Load existing enrollment data
    }
  }

  // Private helper method to get today's date in YYYY-MM-DD format
  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  // Method to load all students from the service
  loadStudents(): void {
    this.studentService.getAllStudents().subscribe({
      // Success callback
      next: (students) => {
        this.students = students; // Store students for dropdown
      },
      // Error callback
      error: (err) => {
        console.error('Error loading students:', err); // Log error
        this.errorMessage = 'Failed to load students'; // Set user-friendly error message
      }
    });
  }

  // Method to load all courses from the service
  loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      // Success callback
      next: (courses) => {
        this.courses = courses; // Store courses for dropdown
      },
      // Error callback
      error: (err) => {
        console.error('Error loading courses:', err); // Log error
        this.errorMessage = 'Failed to load courses'; // Set user-friendly error message
      }
    });
  }

  // Method to load a specific enrollment by ID
  loadEnrollment(id: number): void {
    this.isLoading = true; // Start loading indicator
    this.enrollmentService.getAllEnrollments().subscribe({
      // Success callback
      next: (enrollments) => {
        // Find the enrollment with matching ID
        const foundEnrollment = enrollments.find(e => e.id === id);
        if (foundEnrollment) {
          // Format the enrollment date for the date input
          let formattedDate = foundEnrollment.enrollmentDate;
          if (foundEnrollment.enrollmentDate) {
            const date = new Date(foundEnrollment.enrollmentDate);
            formattedDate = date.toISOString().split('T')[0]; // Convert to YYYY-MM-DD format
          }

          // Populate form with existing enrollment data
          this.enrollmentForm.patchValue({
            studentId: foundEnrollment.student?.id || foundEnrollment.studentId,
            courseId: foundEnrollment.course?.id || foundEnrollment.courseId,
            enrollmentDate: formattedDate,
            grade: foundEnrollment.grade || '', // Use empty string if null/undefined
            status: foundEnrollment.status
          });

          // In edit mode, disable student and course selection (they shouldn't change)
          if (this.isEditMode) {
            this.enrollmentForm.get('studentId')?.disable();
            this.enrollmentForm.get('courseId')?.disable();
          }
        }
        this.isLoading = false; // Stop loading indicator
      },
      // Error callback
      error: (err) => {
        console.error('Error loading enrollment:', err); // Log error
        this.errorMessage = 'Failed to load enrollment data'; // Set error message
        this.isLoading = false; // Stop loading indicator
      }
    });
  }

  // Method called when form is submitted
  onSubmit(): void {
    // Check if form is valid before proceeding
    if (this.enrollmentForm.valid) {
      // Set loading state and clear previous errors
      this.isLoading = true;
      this.errorMessage = '';

      // Get form values
      const formValues = this.enrollmentForm.value;

      // Determine whether to update or create based on mode
      if (this.isEditMode && this.enrollmentId) {
        // Update existing enrollment (only status and grade can be updated)
        this.enrollmentService.updateEnrollment(
          this.enrollmentId,
          formValues.status,
          formValues.grade || undefined // Send undefined if grade is empty
        ).subscribe({
          // Success callback for update
          next: () => {
            // Navigate back to enrollments list
            this.router.navigate(['/enrollments']);
          },
          // Error callback for update
          error: (error) => {
            this.handleError(error); // Handle the error
            this.isLoading = false; // Reset loading state
          }
        });
      } else {
        // Create new enrollment
        this.enrollmentService.createEnrollment(
          +formValues.studentId, // Convert to number
          +formValues.courseId // Convert to number
        ).subscribe({
          // Success callback for create
          next: () => {
            // Navigate back to enrollments list
            this.router.navigate(['/enrollments']);
          },
          // Error callback for create
          error: (error) => {
            this.handleError(error); // Handle the error
            this.isLoading = false; // Reset loading state
          }
        });
      }
    } else {
      // If form is invalid, mark all controls as touched to trigger validation messages
      Object.keys(this.enrollmentForm.controls).forEach(key => {
        const control = this.enrollmentForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  // Private method to handle different types of errors
  private handleError(error: any): void {
    // Log full error details for debugging
    console.error('Full error details:', error);

    // Handle specific HTTP error status codes
    if (error.status === 0) {
      // Network error or backend not running
      this.errorMessage = 'Cannot connect to server.';
    } else if (error.status === 500) {
      // Server internal error
      this.errorMessage = 'Server error.';
    } else if (error.status === 400) {
      // Bad request - validation errors
      if (error.error && error.error.message && error.error.message.includes('already enrolled')) {
        // Special case: student already enrolled in this course
        this.errorMessage = 'Student is already enrolled in this course.';
      } else {
        this.errorMessage = 'Invalid data. Please check your input.';
      }
    } else if (error.status === 404) {
      // Resource not found
      this.errorMessage = 'Student or course not found.';
    } else if (error.error && error.error.message) {
      // Use server-provided error message
      this.errorMessage = error.error.message;
    } else {
      // Generic error message for unexpected errors
      this.errorMessage = 'An unexpected error occurred.';
    }
  }

  // Method to handle cancel action
  onCancel(): void {
    // Navigate back to enrollments list without saving
    this.router.navigate(['/enrollments']);
  }
}
