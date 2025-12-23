// src/app/services/enrollment.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enrollment } from '../models/enrollment.model';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private apiUrl = 'http://localhost:8081/api/enrollments';

  constructor(private http: HttpClient) {}

  getAllEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(this.apiUrl);
  }

  deleteEnrollment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  createEnrollment(studentId: number, courseId: number): Observable<Enrollment> {
    const body = { studentId, courseId };
    return this.http.post<Enrollment>(`${this.apiUrl}/enroll`, body);
  }

  updateEnrollment(id: number, status: string, grade?: string): Observable<Enrollment> {
    let params = new HttpParams().set('status', status);
    if (grade) {
      params = params.set('grade', grade);
    }
    return this.http.put<Enrollment>(`${this.apiUrl}/${id}`, null, { params });
  }

  getEnrollmentsByStudent(studentId: number): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/student/${studentId}`);
  }

  getEnrollmentsByCourse(courseId: number): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/course/${courseId}`);
  }

  enrollStudent(studentId: number, courseId: number): Observable<Enrollment> {
    return this.createEnrollment(studentId, courseId);
  }

  updateEnrollmentStatus(id: number, status: string, grade?: string): Observable<Enrollment> {
    return this.updateEnrollment(id, status, grade);
  }
}
