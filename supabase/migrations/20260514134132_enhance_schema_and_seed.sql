/*
  # Enhance existing schema with missing columns and seed data

  1. Add missing columns to existing tables
  2. Seed blog posts with Pakistani CV content
  3. Add subscriptions table
*/

-- Add missing columns to profiles
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'ai_credits_used') THEN
    ALTER TABLE profiles ADD COLUMN ai_credits_used integer DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'ai_credits_limit') THEN
    ALTER TABLE profiles ADD COLUMN ai_credits_limit integer DEFAULT 10;
  END IF;
END $$;

-- Add missing columns to blog_posts
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'category') THEN
    ALTER TABLE blog_posts ADD COLUMN category text DEFAULT 'general';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'author_name') THEN
    ALTER TABLE blog_posts ADD COLUMN author_name text DEFAULT 'CVBuilder Pakistan Team';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'read_time_minutes') THEN
    ALTER TABLE blog_posts ADD COLUMN read_time_minutes integer DEFAULT 5;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'view_count') THEN
    ALTER TABLE blog_posts ADD COLUMN view_count integer DEFAULT 0;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'featured_image') THEN
    ALTER TABLE blog_posts ADD COLUMN featured_image text DEFAULT '';
  END IF;
END $$;

-- Add missing columns to resumes
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'resumes' AND column_name = 'download_count') THEN
    ALTER TABLE resumes ADD COLUMN download_count integer DEFAULT 0;
  END IF;
END $$;

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan text NOT NULL DEFAULT 'free',
  status text NOT NULL DEFAULT 'active',
  payment_method text DEFAULT '',
  payment_id text DEFAULT '',
  amount_pkr integer DEFAULT 0,
  starts_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscriptions" ON subscriptions;

CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscriptions" ON subscriptions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions(user_id);

-- Seed blog posts
INSERT INTO blog_posts (slug, title, excerpt, content, category, tags, meta_description, published, read_time_minutes, author_name)
VALUES
('cv-format-pakistan-2025', 'CV Format Pakistan 2025: Complete Guide for Job Seekers', 'Learn the perfect CV format for Pakistani job market in 2025.', '# CV Format Pakistan 2025

Creating a professional CV is crucial for landing your dream job in Pakistan.

## Key Sections of a Pakistani CV

### 1. Personal Information
- Full Name
- Father''s Name
- CNIC Number
- Date of Birth
- Address
- Contact Number
- Email Address

### 2. Education
- University/College Degree (with CGPA/Percentage)
- FSc/ICS/ICom/FA (with marks/grade)
- Matric/SSC (with marks/grade)

### 3. Work Experience
- Company name
- Job title
- Duration
- Key responsibilities

### 4. Skills
- Technical skills
- Soft skills
- Language proficiency', 'cv-tips', ARRAY['cv format', 'pakistan', '2025', 'resume'], 'Complete CV format guide for Pakistan 2025.', true, 7, 'CVBuilder Pakistan Team'),
('fresh-graduate-cv-pakistan', 'Fresh Graduate CV Template Pakistan', 'How to create a winning CV as a fresh graduate in Pakistan.', '# Fresh Graduate CV Pakistan

As a fresh graduate, your education, skills, and potential are your strongest assets.

## Focus on Your Strengths

### Education First
- University name and degree
- CGPA or percentage
- Relevant coursework
- Final year project

### Internships and Training
- Company name
- Duration
- What you learned

### Projects
- Describe the project briefly
- Mention technologies used
- Show results or impact

## Tips
1. Keep it to 1 page
2. Use action verbs
3. Quantify achievements
4. Include relevant skills', 'cv-tips', ARRAY['fresh graduate', 'cv', 'pakistan'], 'Fresh graduate CV template for Pakistan.', true, 5, 'CVBuilder Pakistan Team'),
('ats-cv-pakistan', 'ATS-Friendly CV Pakistan: Beat the Bots', 'Learn how to create an ATS-optimized CV.', '# ATS-Friendly CV Pakistan

Applicant Tracking Systems (ATS) are now used by 90% of large companies in Pakistan.

## What is ATS?
ATS software scans CVs for keywords, proper formatting, and standard section headings.

## ATS Optimization Tips

### 1. Use Standard Headings
- "Work Experience" not "Career Journey"
- "Education" not "Academic Background"

### 2. Include Keywords
- Required skills mentioned
- Software/tools listed
- Industry-specific terms

### 3. Formatting Rules
- Use standard fonts
- Avoid tables and text boxes
- Simple bullet points

### 4. File Format
- Save as PDF or DOCX', 'ats', ARRAY['ats', 'cv', 'pakistan'], 'Create ATS-friendly CV for Pakistani job market.', true, 6, 'CVBuilder Pakistan Team'),
('teacher-cv-pakistan', 'Teacher CV Format Pakistan', 'Professional teacher CV templates for Pakistani schools.', '# Teacher CV Pakistan

Teaching is one of the most respected professions in Pakistan.

## Teacher CV Sections

### Personal Information
- Full name, CNIC, Date of Birth
- Contact details

### Teaching Qualifications
- B.Ed / M.Ed degrees
- Subject specialization

### Work Experience
- School/College name
- Subjects taught
- Grade levels
- Duration

### Skills
- Classroom management
- Curriculum development
- Student assessment
- Subject expertise', 'templates', ARRAY['teacher', 'cv', 'pakistan', 'education'], 'Teacher CV format for Pakistan.', true, 5, 'CVBuilder Pakistan Team')
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  category = EXCLUDED.category,
  tags = EXCLUDED.tags,
  meta_description = EXCLUDED.meta_description,
  published = EXCLUDED.published,
  read_time_minutes = EXCLUDED.read_time_minutes,
  author_name = EXCLUDED.author_name,
  updated_at = now();