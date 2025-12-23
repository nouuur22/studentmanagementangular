import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CourseService } from './course';

describe('CourseService', () => {
  let service: CourseService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CourseService]
    });
    
    service = TestBed.inject(CourseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify no outstanding HTTP requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch courses via GET', () => {
    const mockCourses = [
      { id: 1, name: 'Math 101', description: 'Basic Math', credits: 3, department: 'Science', teacher_id: 1 },
      { id: 2, name: 'Physics 101', description: 'Intro to Physics', credits: 4, department: 'Science', teacher_id: 1 }
    ];

    service.getCourses().subscribe(courses => {
      expect(courses.length).toBe(2);
      expect(courses).toEqual(mockCourses);
    });

    const req = httpMock.expectOne('https://ochreous-ozell-figurally.ngrok-free.dev/student_api/courses.php');
    expect(req.request.method).toBe('GET');
    req.flush(mockCourses);
  });

  it('should fetch a single course via GET with ID', () => {
    const mockCourse = { id: 1, name: 'Math 101', description: 'Basic Math', credits: 3, department: 'Science', teacher_id: 1 };

    service.getCourse(1).subscribe(course => {
      expect(course).toEqual(mockCourse);
    });

    const req = httpMock.expectOne('https://ochreous-ozell-figurally.ngrok-free.dev/student_api/courses.php?id=1');
    expect(req.request.method).toBe('GET');
    req.flush(mockCourse);
  });

  it('should create a course via POST', () => {
    const newCourse = { name: 'New Course', description: 'New Description', credits: 3, department: 'Science', teacher_id: 1 };

    service.createCourse(newCourse).subscribe(response => {
      expect(response).toEqual({ message: 'Course created successfully' });
    });

    const req = httpMock.expectOne('https://ochreous-ozell-figurally.ngrok-free.dev/student_api/courses.php');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(JSON.stringify(newCourse));
    req.flush({ message: 'Course created successfully' });
  });

  it('should update a course via PUT', () => {
    const updatedCourse = { id: 1, name: 'Updated Course', description: 'Updated Description', credits: 4, department: 'Math', teacher_id: 2 };

    service.updateCourse(1, updatedCourse).subscribe(response => {
      expect(response).toEqual({ message: 'Course updated successfully' });
    });

    const req = httpMock.expectOne('https://ochreous-ozell-figurally.ngrok-free.dev/student_api/courses.php');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(JSON.stringify(updatedCourse));
    req.flush({ message: 'Course updated successfully' });
  });

  it('should delete a course via DELETE', () => {
    service.deleteCourse(1).subscribe(response => {
      expect(response).toEqual({ message: 'Course deleted successfully' });
    });

    const req = httpMock.expectOne('https://ochreous-ozell-figurally.ngrok-free.dev/student_api/courses.php');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual(JSON.stringify({ id: 1 }));
    req.flush({ message: 'Course deleted successfully' });
  });
});