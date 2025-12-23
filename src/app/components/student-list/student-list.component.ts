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
  students: Student[] = [];
  loading = false; // RENAME from isLoading to loading
  error = ''; // ADD THIS

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.loading = true;
    this.studentService.getAllStudents().subscribe({
      next: (data: Student[]) => {
        this.students = data;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching students:', err);
        this.error = 'Failed to load students';
        this.loading = false;
      }
    });
  }

  deleteStudent(id: number): void {
  if (confirm('Are you sure you want to delete this student?')) {
    this.studentService.deleteStudent(id).subscribe({
      next: () => {
        this.loadStudents(); // Refresh the list
      },
      error: (err: any) => {
        console.error('Error deleting student:', err);
        alert('Failed to delete student');
      }
    });
  }
}
}
