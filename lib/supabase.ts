import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  phone: string;
  city: string;
  province: string;
  cnic: string;
  is_premium: boolean;
  premium_expires_at: string | null;
  ai_credits_used: number;
  ai_credits_limit: number;
  role: string;
  created_at: string;
  updated_at: string;
};

export type Resume = {
  id: string;
  user_id: string;
  title: string;
  template: string;
  data: ResumeData;
  is_public: boolean;
  language: string;
  thumbnail_url: string;
  download_count: number;
  created_at: string;
  updated_at: string;
};

export type ResumeData = {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  languages: LanguageEntry[];
  certifications: Certification[];
  projects: Project[];
  references: Reference[];
  summary: string;
};

export type PersonalInfo = {
  fullName: string;
  fatherName: string;
  cnic: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  nationality: string;
  religion: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  linkedin: string;
  github: string;
  website: string;
  photo: string;
};

export type Education = {
  id: string;
  level: string;
  degree: string;
  institution: string;
  board: string;
  startYear: string;
  endYear: string;
  grade: string;
  percentage: string;
  cgpa: string;
  subjects: string;
};

export type Experience = {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  location: string;
  description: string;
};

export type Skill = {
  id: string;
  name: string;
  level: string;
  category: string;
};

export type LanguageEntry = {
  id: string;
  name: string;
  proficiency: string;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  technologies: string;
  url: string;
  startDate: string;
  endDate: string;
};

export type Reference = {
  id: string;
  name: string;
  position: string;
  company: string;
  phone: string;
  email: string;
};

export type JobApplication = {
  id: string;
  user_id: string;
  company_name: string;
  job_title: string;
  job_url: string;
  status: 'saved' | 'applied' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
  applied_date: string | null;
  interview_date: string | null;
  salary_range: string;
  location: string;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  meta_description: string;
  published: boolean;
  published_at: string;
  author_name: string;
  read_time_minutes: number;
  view_count: number;
  featured_image: string;
  created_at: string;
  updated_at: string;
};

export const defaultResumeData: ResumeData = {
  personalInfo: {
    fullName: '',
    fatherName: '',
    cnic: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    nationality: 'Pakistani',
    religion: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    linkedin: '',
    github: '',
    website: '',
    photo: '',
  },
  education: [],
  experience: [],
  skills: [],
  languages: [{ id: '1', name: 'Urdu', proficiency: 'Native' }, { id: '2', name: 'English', proficiency: 'Proficient' }],
  certifications: [],
  projects: [],
  references: [],
  summary: '',
};