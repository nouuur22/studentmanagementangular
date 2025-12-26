// src/app/components/student-form/student-form.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../services/student.service';
import { Student } from '../../models/student.model';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule], // ADD ReactiveFormsModule!
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit {
  studentForm: FormGroup; // ADD THIS
  isEditMode = false; // Track if editing or creating
  studentId: number | null = null; // Student ID for edit mode
  saving = false; // ADD THIS - loading state for save operation

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // INITIALIZE THE FORM GROUP with form controls and validators
    this.studentForm = this.fb.group({
      name: ['', Validators.required], // Required field
      email: ['', [Validators.required, Validators.email]], // Required with email format
      phoneNumber: [''], // Optional field
      address: [''] // Optional field
    });
  }

  ngOnInit(): void {
    // Get student ID from route parameter
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true; // Set to edit mode
      this.studentId = +id; // Convert to number
      this.loadStudent(+id); // Load student data
    }
  }

  // Load student data for editing
  loadStudent(id: number): void {
    this.studentService.getStudentById(id).subscribe({
      next: (student) => {
        // Populate form with existing student data
        this.studentForm.patchValue({
          name: student.name,
          email: student.email,
          phoneNumber: student.phoneNumber || '', // Use empty string if null
          address: student.address || '' // Use empty string if null
        });
      },
      error: (err) => {
        console.error('Error loading student:', err); // Log error
      }
    });
  }

  // Handle form submission
  onSubmit(): void {
    if (this.studentForm.valid) {
      this.saving = true; // Show saving indicator
      const studentData: Student = this.studentForm.value; // Get form values

      if (this.isEditMode && this.studentId) {
        // Update existing student
        this.studentService.updateStudent(this.studentId, studentData).subscribe({
          next: () => {
            this.saving = false; // Hide saving indicator
            this.router.navigate(['/students']); // Navigate back to list
          },
          error: (err) => {
            console.error('Error updating student:', err); // Log error
            this.saving = false; // Hide saving indicator
          }
        });
      } else {
        // Create new student
        this.studentService.createStudent(studentData).subscribe({
          next: () => {
            this.saving = false; // Hide saving indicator
            this.router.navigate(['/students']); // Navigate back to list
          },
          error: (err) => {
            console.error('Error creating student:', err); // Log error
            this.saving = false; // Hide saving indicator
          }
        });
      }
    }
  }

  goBack(): void { // ADD THIS METHOD - cancel/navigation back
    this.router.navigate(['/students']); // Navigate back to student list
  }
}
