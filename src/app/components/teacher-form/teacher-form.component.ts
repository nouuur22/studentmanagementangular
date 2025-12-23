// src/app/components/teacher-form/teacher-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TeacherService } from '../../services/teacher.service';
import { Teacher } from '../../models/teacher';

@Component({
  selector: 'app-teacher-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.css']
})
export class TeacherFormComponent implements OnInit {
  teacherForm: FormGroup;
  isEditMode = false;
  teacherId: number | null = null;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private teacherService: TeacherService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.teacherForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      department: [''],
      specialization: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.teacherId = +id;
      this.loadTeacher(+id);
    }
  }

  loadTeacher(id: number): void {
    this.teacherService.getTeacherById(id).subscribe({
      next: (teacher) => {
        this.teacherForm.patchValue({
          name: teacher.name,
          email: teacher.email,
          phoneNumber: teacher.phoneNumber || '',
          department: teacher.department || '',
          specialization: teacher.specialization || ''
        });
      }
    });
  }

  onSubmit(): void {
    if (this.teacherForm.valid) {
      this.saving = true;
      const teacherData: Teacher = this.teacherForm.value;

      if (this.isEditMode && this.teacherId) {
        this.teacherService.updateTeacher(this.teacherId, teacherData).subscribe({
          next: () => {
            this.saving = false;
            this.router.navigate(['/teachers']);
          },
          error: (err) => {
            console.error('Error updating teacher:', err);
            this.saving = false;
          }
        });
      } else {
        this.teacherService.createTeacher(teacherData).subscribe({
          next: () => {
            this.saving = false;
            this.router.navigate(['/teachers']);
          },
          error: (err) => {
            console.error('Error creating teacher:', err);
            this.saving = false;
          }
        });
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/teachers']);
  }
}
