export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  videoId: string;
  questions: Question[];
}

export interface Video {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  thumbnail: string;
  category: string;
  rating: number;
}

export interface User {
  name: string;
  email: string;
  role: string;
  avatar: string;
  enrolledCourses: string[]; // IDs of videos/courses
  completedLessons: string[]; // IDs of videos
}

export interface LessonRequest {
  id: string;
  title: string;
  instructorId: string;
  studentName: string;
  dates: string[];
  time?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  alternativeDate?: string;
}
