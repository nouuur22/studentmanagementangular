// src/app/models/course.model.ts - FIXED VERSION
export interface Course {
  id?: number;
  name: string;
  description?: string;
  credits: number;
  department?: string;
  teacher?: {
    id: number;
    name?: string;
  };
}
// Make sure there are NO duplicate Course interfaces
