import { Platform, Post, User, UserRole } from './types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Sarah Admin',
    avatar: 'https://picsum.photos/id/64/100/100',
    role: UserRole.ADMIN,
    shares: 12,
    points: 120,
    connectedAccounts: [Platform.LINKEDIN],
  },
  {
    id: 'u2',
    name: 'Alex Employee',
    avatar: 'https://picsum.photos/id/91/100/100',
    role: UserRole.EMPLOYEE,
    shares: 45,
    points: 450,
    connectedAccounts: [Platform.INSTAGRAM, Platform.TIKTOK],
  },
  {
    id: 'u3',
    name: 'Jordan Creative',
    avatar: 'https://picsum.photos/id/129/100/100',
    role: UserRole.EMPLOYEE,
    shares: 38,
    points: 380,
    connectedAccounts: [],
  },
  {
    id: 'u4',
    name: 'Casey Social',
    avatar: 'https://picsum.photos/id/177/100/100',
    role: UserRole.EMPLOYEE,
    shares: 52,
    points: 520,
    connectedAccounts: [Platform.LINKEDIN, Platform.INSTAGRAM],
  },
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    title: 'Q3 Company Achievements',
    content: "We're thrilled to announce a 20% growth in Q3! Thanks to our amazing team and customers. #Growth #Success",
    platforms: [Platform.LINKEDIN, Platform.INSTAGRAM],
    imageUrl: 'https://picsum.photos/id/4/600/400',
    createdAt: new Date().toISOString(),
    authorId: 'u1',
    status: 'published',
    suggestedHashtags: ['#Business', '#Milestone', '#TeamWork'],
  },
  {
    id: 'p2',
    title: 'Office Life: Behind the Scenes',
    content: "Check out our new coffee station! ☕️ Fueling big ideas every day.",
    platforms: [Platform.TIKTOK, Platform.INSTAGRAM],
    imageUrl: 'https://picsum.photos/id/42/600/800',
    createdAt: new Date().toISOString(),
    authorId: 'u1',
    status: 'published',
    suggestedHashtags: ['#OfficeLife', '#CoffeeCulture', '#Vibes'],
  },
];