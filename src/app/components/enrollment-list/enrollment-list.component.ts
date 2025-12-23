// src/app/components/enrollment-list/enrollment-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { EnrollmentService } from '../../services/enrollment.service';
import { Enrollment } from '../../models/enrollment.model';

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusColor',
  standalone: true
})
export class StatusColorPipe implements PipeTransform {
  transform(status: string): string {
    switch(status?.toUpperCase()) {
      case 'ACTIVE': return 'badge bg-success';
      case 'COMPLETED': return 'badge bg-secondary';
      case 'DROPPED': return 'badge bg-danger';
      default: return 'badge bg-light';
    }
  }
}

@Component({
  selector: 'app-enrollment-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    StatusColorPipe // ADD COMMA and put inside array
  ],
  templateUrl: './enrollment-list.component.html',
  styleUrls: ['./enrollment-list.component.css']
})
export class EnrollmentListComponent implements OnInit {
  enrollments: Enrollment[] = [];
  loading = false;
  error = '';

  constructor(private enrollmentService: EnrollmentService) {}

  ngOnInit(): void {
    this.loadEnrollments();
  }

  loadEnrollments(): void {
    this.loading = true;
    this.enrollmentService.getAllEnrollments().subscribe({
      next: (data) => {
        this.enrollments = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching enrollments:', err);
        this.error = 'Failed to load enrollments';
        this.loading = false;
      }
    });
  }

  deleteEnrollment(id: number): void {
    if (confirm('Are you sure you want to delete this enrollment?')) {
      this.enrollmentService.deleteEnrollment(id).subscribe({
        next: () => {
          this.loadEnrollments();
        },
        error: (err) => {
          console.error('Error deleting enrollment:', err);
          alert('Failed to delete enrollment');
        }
      });
    }
  }
}
