// src/app/components/teacher-list/teacher-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TeacherService } from '../../services/teacher.service';
import { Teacher } from '../../models/teacher';
import { DeleteButtonComponent } from '../shared/delete-button/delete-button.component';

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DeleteButtonComponent],
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.css']
})
export class TeacherListComponent implements OnInit {
  teachers: Teacher[] = [];
  loading = false;
  error = '';

  constructor(private teacherService: TeacherService) {}

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers(): void {
    this.loading = true;
    this.teacherService.getAllTeachers().subscribe({
      next: (data) => {
        this.teachers = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching teachers:', err);
        this.error = 'Failed to load teachers';
        this.loading = false;
      }
    });
  }

  deleteTeacher(id: number): void {
    if (confirm('Are you sure you want to delete this teacher?')) {
      this.teacherService.deleteTeacher(id).subscribe({
        next: () => this.loadTeachers(),
        error: (err) => {
          console.error('Error deleting teacher:', err);
          this.error = 'Failed to delete teacher';
        }
      });
    }
  }
}
