export enum Platform {
  INSTAGRAM = 'Instagram',
  TIKTOK = 'TikTok',
  LINKEDIN = 'LinkedIn',
}

export enum UserRole {
  ADMIN = 'Admin',
  EMPLOYEE = 'Employee',
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  role: UserRole;
  shares: number;
  points: number;
  connectedAccounts: Platform[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  platforms: Platform[];
  imageUrl?: string;
  createdAt: string;
  authorId: string;
  status: 'draft' | 'published';
  suggestedHashtags: string[];
}

export interface ShareLog {
  id: string;
  userId: string;
  postId: string;
  platform: Platform;
  timestamp: string;
}