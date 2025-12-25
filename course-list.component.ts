import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';
import { DeleteButtonComponent } from '../shared/delete-button/delete-button.component';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterModule, DeleteButtonComponent],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getAllCourses().subscribe({
      next: (courses) => this.courses = courses,
      error: (error) => console.error('Error loading courses:', error)
    });
  }

  deleteCourse(id: number): void {
    this.courseService.deleteCourse(id).subscribe({
      next: () => {
        this.courses = this.courses.filter(course => course.id !== id);
      },
      error: (error) => console.error('Error deleting course:', error)
    });
  }
}
