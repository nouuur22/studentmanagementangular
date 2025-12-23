// src/app/components/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseService } from '../../services/course.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { Course } from '../../models/course.model';
import { Enrollment } from '../../models/enrollment.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  courseCount: number = 0;
  enrollmentCount: number = 0;

  constructor(
    private courseService: CourseService,
    private enrollmentService: EnrollmentService
  ) {}

  ngOnInit(): void {
    this.loadCounts();
  }

  loadCounts(): void {
    this.courseService.getAllCourses().subscribe({
      next: (courses: Course[]) => {
        this.courseCount = courses.length;
      },
      error: (err: any) => {
        console.error('Error fetching courses:', err);
      }
    });

    this.enrollmentService.getAllEnrollments().subscribe({
      next: (enrollments: Enrollment[]) => {
        this.enrollmentCount = enrollments.length;
      },
      error: (err: any) => {
        console.error('Error fetching enrollments:', err);
      }
    });
  }
}
