// src/app/services/enrollment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enrollment } from '../models/enrollment.model';

@Injectable({
  providedIn: 'root' // Service available app-wide
})
export class EnrollmentService {
  private apiUrl = 'http://localhost:8081/api/enrollments'; // API endpoint

  constructor(private http: HttpClient) {}

  // Get all enrollments
  getAllEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(this.apiUrl);
  }

  // Delete enrollment by ID
  deleteEnrollment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Create new enrollment
  createEnrollment(studentId: number, courseId: number): Observable<Enrollment> {
    const body = { studentId, courseId }; // Request body
    return this.http.post<Enrollment>(`${this.apiUrl}/enroll`, body);
  }

  // Update enrollment status and grade
  updateEnrollment(id: number, status: string, grade?: string): Observable<Enrollment> {
    let params = new HttpParams().set('status', status); // Set status param
    if (grade) {
      params = params.set('grade', grade); // Add grade param if provided
    }
    return this.http.put<Enrollment>(`${this.apiUrl}/${id}`, null, { params });
  }

  // Get enrollments for specific student
  getEnrollmentsByStudent(studentId: number): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/student/${studentId}`);
  }

  // Get enrollments for specific course
  getEnrollmentsByCourse(courseId: number): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/course/${courseId}`);
  }

  // Alias for createEnrollment
  enrollStudent(studentId: number, courseId: number): Observable<Enrollment> {
    return this.createEnrollment(studentId, courseId);
  }

  // Alias for updateEnrollment
  updateEnrollmentStatus(id: number, status: string, grade?: string): Observable<Enrollment> {
    return this.updateEnrollment(id, status, grade);
  }
}
