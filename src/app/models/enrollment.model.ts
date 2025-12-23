// src/app/models/enrollment.model.ts
export interface Enrollment {
  id?: number;
  studentId: number;
  courseId: number;
  enrollmentDate: string;
  grade?: string;
  status: string;

  // ADD THESE - they come from backend response!
  student?: {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
    address?: string;
  };

  course?: {
    id: number;
    name: string;
    description?: string;
    credits?: number;
    department?: string;
    teacher?: {
      id: number;
      name?: string;
    };
  };
}
