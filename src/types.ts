export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  language?: string;
  interests?: string[];
  enrolledCourses?: string[];
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  language: string;
  category: string;
  videoUrl: string;
  thumbnail: string;
  duration: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
