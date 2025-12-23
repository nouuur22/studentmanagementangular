// src/app/components/enrollment-form/enrollment-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EnrollmentService } from '../../services/enrollment.service';
import { StudentService } from '../../services/student.service';
import { CourseService } from '../../services/course.service';
import { Enrollment } from '../../models/enrollment.model';
import { Student } from '../../models/student.model';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-enrollment-form',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './enrollment-form.component.html',
  styleUrls: ['./enrollment-form.component.css']
})
export class EnrollmentFormComponent implements OnInit {
  enrollmentForm: FormGroup;
  isEditMode = false;
  enrollmentId: number | null = null;
  errorMessage = '';
  isLoading = false;

  students: Student[] = [];
  courses: Course[] = [];

  constructor(
    private fb: FormBuilder,
    private enrollmentService: EnrollmentService,
    private studentService: StudentService,
    private courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.enrollmentForm = this.fb.group({
      studentId: ['', Validators.required],
      courseId: ['', Validators.required],
      enrollmentDate: [this.getTodayDate(), Validators.required],
      grade: [''],
      status: ['ACTIVE', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadStudents();
    this.loadCourses();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.enrollmentId = +id;
      this.loadEnrollment(+id);
    }
  }

  private getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  loadStudents(): void {
    this.studentService.getAllStudents().subscribe({
      next: (students) => {
        this.students = students;
      },
      error: (err) => {
        console.error('Error loading students:', err);
        this.errorMessage = 'Failed to load students';
      }
    });
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
      },
      error: (err) => {
        console.error('Error loading courses:', err);
        this.errorMessage = 'Failed to load courses';
      }
    });
  }

  loadEnrollment(id: number): void {
    this.isLoading = true;
    this.enrollmentService.getAllEnrollments().subscribe({
      next: (enrollments) => {
        const foundEnrollment = enrollments.find(e => e.id === id);
        if (foundEnrollment) {
          let formattedDate = foundEnrollment.enrollmentDate;
          if (foundEnrollment.enrollmentDate) {
            const date = new Date(foundEnrollment.enrollmentDate);
            formattedDate = date.toISOString().split('T')[0];
          }

          this.enrollmentForm.patchValue({
            studentId: foundEnrollment.student?.id || foundEnrollment.studentId,
            courseId: foundEnrollment.course?.id || foundEnrollment.courseId,
            enrollmentDate: formattedDate,
            grade: foundEnrollment.grade || '',
            status: foundEnrollment.status
          });

          if (this.isEditMode) {
            this.enrollmentForm.get('studentId')?.disable();
            this.enrollmentForm.get('courseId')?.disable();
          }
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading enrollment:', err);
        this.errorMessage = 'Failed to load enrollment data';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.enrollmentForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formValues = this.enrollmentForm.value;

      if (this.isEditMode && this.enrollmentId) {
        this.enrollmentService.updateEnrollment(
          this.enrollmentId,
          formValues.status,
          formValues.grade || undefined
        ).subscribe({
          next: () => {
            this.router.navigate(['/enrollments']);
          },
          error: (error) => {
            this.handleError(error);
            this.isLoading = false;
          }
        });
      } else {
        this.enrollmentService.createEnrollment(
          +formValues.studentId,
          +formValues.courseId
        ).subscribe({
          next: () => {
            this.router.navigate(['/enrollments']);
          },
          error: (error) => {
            this.handleError(error);
            this.isLoading = false;
          }
        });
      }
    } else {
      Object.keys(this.enrollmentForm.controls).forEach(key => {
        const control = this.enrollmentForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  private handleError(error: any): void {
    console.error('Full error details:', error);

    if (error.status === 0) {
      this.errorMessage = 'Cannot connect to server.';
    } else if (error.status === 500) {
      this.errorMessage = 'Server error.';
    } else if (error.status === 400) {
      if (error.error && error.error.message && error.error.message.includes('already enrolled')) {
        this.errorMessage = 'Student is already enrolled in this course.';
      } else {
        this.errorMessage = 'Invalid data. Please check your input.';
      }
    } else if (error.status === 404) {
      this.errorMessage = 'Student or course not found.';
    } else if (error.error && error.error.message) {
      this.errorMessage = error.error.message;
    } else {
      this.errorMessage = 'An unexpected error occurred.';
    }
  }

  onCancel(): void {
    this.router.navigate(['/enrollments']);
  }
}
