export interface Contact {
  name: string;
  email: string;
  phone?: string;
}

export interface SocialMediaAccount {
  id: string;
  platform: 'TikTok' | 'Instagram';
  username: string;
  phoneDevice: string;
  monthlyEarnings: number;
  contact: Contact;
  postsPerDay: number;
}

export interface Post {
  id: string;
  content: string;
  completed: boolean;
}

export interface DailySchedule {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  accounts: {
    accountId: string;
    posts: Post[];
  }[];
}

export interface WeeklySchedule {
  weekStartDate: string;
  dailySchedules: DailySchedule[];
} 