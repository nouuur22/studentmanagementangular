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
  isEditMode = false;
  studentId: number | null = null;
  saving = false; // ADD THIS

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // INITIALIZE THE FORM GROUP
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      address: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.studentId = +id;
      this.loadStudent(+id);
    }
  }

  loadStudent(id: number): void {
    this.studentService.getStudentById(id).subscribe({
      next: (student) => {
        this.studentForm.patchValue({
          name: student.name,
          email: student.email,
          phoneNumber: student.phoneNumber || '',
          address: student.address || ''
        });
      },
      error: (err) => {
        console.error('Error loading student:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      this.saving = true;
      const studentData: Student = this.studentForm.value;

      if (this.isEditMode && this.studentId) {
        this.studentService.updateStudent(this.studentId, studentData).subscribe({
          next: () => {
            this.saving = false;
            this.router.navigate(['/students']);
          },
          error: (err) => {
            console.error('Error updating student:', err);
            this.saving = false;
          }
        });
      } else {
        this.studentService.createStudent(studentData).subscribe({
          next: () => {
            this.saving = false;
            this.router.navigate(['/students']);
          },
          error: (err) => {
            console.error('Error creating student:', err);
            this.saving = false;
          }
        });
      }
    }
  }

  goBack(): void { // ADD THIS METHOD
    this.router.navigate(['/students']);
  }
}
