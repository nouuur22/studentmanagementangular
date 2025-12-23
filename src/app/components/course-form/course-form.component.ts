// src/app/components/course-form/course-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.css']
})
export class CourseFormComponent implements OnInit {
  courseForm: FormGroup;
  isEditMode = false;
  courseId: number | null = null;
  errorMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.courseForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      credits: ['', [Validators.required, Validators.min(1)]],
      department: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.courseId = +id;
      this.courseService.getCourseById(+id).subscribe({
        next: (course) => {
          this.courseForm.patchValue({
            name: course.name,
            description: course.description || '',
            credits: course.credits,
            department: course.department || ''
          });
        },
        error: (error) => {
          console.error('Error loading course:', error);
          this.errorMessage = 'Failed to load course data';
        }
      });
    }
  }

  onSubmit(): void {
    if (this.courseForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formValues = this.courseForm.value;

      const courseData: any = {
        name: formValues.name,
        description: formValues.description || null,
        credits: formValues.credits,
        department: formValues.department || null
      };

      console.log('Sending course data:', courseData);

      if (this.isEditMode && this.courseId) {
        this.courseService.updateCourse(this.courseId, courseData).subscribe({
          next: () => {
            console.log('Course updated successfully');
            this.router.navigate(['/courses']);
          },
          error: (error) => {
            console.error('Update error:', error);
            this.handleError(error);
            this.isLoading = false;
          }
        });
      } else {
        this.courseService.createCourse(courseData).subscribe({
          next: () => {
            console.log('Course created successfully');
            this.router.navigate(['/courses']);
          },
          error: (error) => {
            console.error('Create error:', error);
            this.handleError(error);
            this.isLoading = false;
          }
        });
      }
    } else {
      Object.keys(this.courseForm.controls).forEach(key => {
        const control = this.courseForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  private handleError(error: any): void {
    console.error('Full error details:', error);

    if (error.status === 0) {
      this.errorMessage = 'Cannot connect to server. Please check if the backend is running.';
    } else if (error.status === 500) {
      this.errorMessage = 'Server error. Please check the backend logs.';
    } else if (error.status === 400) {
      this.errorMessage = 'Invalid data. Please check your input.';
      if (error.error && error.error.message) {
        this.errorMessage += ` Details: ${error.error.message}`;
      }
    } else if (error.error && error.error.message) {
      this.errorMessage = error.error.message;
    } else {
      this.errorMessage = 'An unexpected error occurred.';
    }
  }

  onCancel(): void {
    this.router.navigate(['/courses']);
  }
}
