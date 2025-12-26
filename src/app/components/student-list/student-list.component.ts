// src/app/components/student-list/student-list.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';
import { DeleteButtonComponent } from '../shared/delete-button/delete-button.component'; // ADD THIS

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    DeleteButtonComponent // ADD THIS
  ],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  // Array to store student data
  students: Student[] = [];
  // Loading state for UI indicators
  loading = false; // RENAME from isLoading to loading
  // Error message display
  error = ''; // ADD THIS

  // Inject StudentService dependency
  constructor(private studentService: StudentService) {}

  // Initialize component - load students on init
  ngOnInit(): void {
    this.loadStudents();
  }

  // Load all students from service
  loadStudents(): void {
    this.loading = true; // Show loading state
    this.studentService.getAllStudents().subscribe({
      // Success callback
      next: (data: Student[]) => {
        this.students = data; // Store student data
        this.loading = false; // Hide loading state
      },
      // Error callback
      error: (err: any) => {
        console.error('Error fetching students:', err); // Log error
        this.error = 'Failed to load students'; // Set error message
        this.loading = false; // Hide loading state
      }
    });
  }

  // Delete student by ID
  deleteStudent(id: number): void {
    // Confirm before deletion
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(id).subscribe({
        // Success callback - reload list
        next: () => {
          this.loadStudents(); // Refresh the list
        },
        // Error callback
        error: (err: any) => {
          console.error('Error deleting student:', err); // Log error
          alert('Failed to delete student'); // Show alert
        }
      });
    }
  }
}
