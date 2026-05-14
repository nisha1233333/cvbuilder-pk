import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

function buildPrompt(tool: string, fields: Record<string, string>, data?: any): string {
  switch (tool) {
    case 'summary':
      return `Write a professional CV summary for a Pakistani job seeker.
Name: ${fields.name || data?.personalInfo?.fullName || 'Professional'}
Job Title: ${fields.title || 'Professional'}
Years of Experience: ${fields.experience || 'Several years'}
Key Skills: ${fields.skills || (data?.skills?.map((s: any) => s.name).join(', ') || 'Various skills')}
Achievement: ${fields.achievement || ''}
Education: ${data?.education?.[0]?.institution || ''}

Write a compelling 3-4 sentence professional summary. Focus on value delivered, key skills, and career goals. Keep it ATS-friendly and professional for the Pakistani job market. Do not use first person.`;
    case 'cover-letter':
      return `Write a professional cover letter for a Pakistani job seeker.
Name: ${fields.name}
Position: ${fields.position}
Company: ${fields.company}
Experience: ${fields.experience}
Why this company: ${fields.why}

Write a professional cover letter (3 paragraphs). Opening: Express interest. Middle: Highlight relevant experience. Closing: Call to action. Make it professional, concise, and tailored for Pakistani corporate culture.`;
    case 'linkedin':
      return `Write an optimized LinkedIn profile summary for a Pakistani professional.
Name: ${fields.name}
Current Role: ${fields.title}
Background: ${fields.experience}
Goals: ${fields.goals}

Write a compelling LinkedIn summary (150-200 words) that:
1. Opens with a strong hook
2. Highlights key expertise
3. Shows career achievements
4. Ends with a call to action
Make it engaging for Pakistani and international recruiters.`;
    case 'bio':
      return `Write a short professional bio.
Name: ${fields.name}
Profession: ${fields.title}
Experience: ${fields.experience}

Write a concise, engaging professional bio (2-3 sentences, max 80 words) suitable for website About page, Twitter bio, or email signature. Third person voice.`;
    case 'email':
      return `Write a professional email.
Email Type: ${fields.type}
Recipient: ${fields.to}
Context: ${fields.context}

Write a professional, concise email. Include subject line. Keep it to the point, polite, and professional. Suitable for Pakistani corporate environment.`;
    case 'hashtags':
      return `Generate relevant hashtags for a social media post.
Topic: ${fields.topic}
Platform: ${fields.platform || 'LinkedIn'}

Generate 20-25 relevant, trending hashtags. Include:
- Topic-specific hashtags
- Career/job-related hashtags
- Pakistani context hashtags where relevant
- Industry hashtags
Format as: #hashtag1 #hashtag2 ...`;
    case 'ats-keywords':
      return `Analyze this job description and extract ATS keywords.
Job Description: ${fields.jobDescription}
Field: ${fields.field || 'General'}

Extract and categorize:
1. **Hard Skills / Technical Skills** (most important)
2. **Soft Skills**
3. **Industry Keywords**
4. **Action Verbs** to use in CV
5. **Recommended CV phrases**

Format clearly with bullet points under each category.`;
    default:
      return `Generate professional content for: ${tool}. Input: ${JSON.stringify(fields)}`;
  }
}

async function callOpenAI(prompt: string): Promise<string> {
  if (!OPENAI_API_KEY) { return generateMockResponse(prompt); }
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a professional CV and career consultant specializing in the Pakistani job market. You write ATS-friendly, professional content tailored for Pakistani professionals seeking jobs locally and internationally.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 600,
      temperature: 0.7,
    }),
  });
  if (!response.ok) { const err = await response.json(); throw new Error(err.error?.message || 'OpenAI API error'); }
  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

function generateMockResponse(prompt: string): string {
  if (prompt.includes('professional summary') || prompt.includes('CV summary')) {
    return 'Results-driven professional with extensive experience in delivering high-quality outcomes. Demonstrated expertise in leveraging technical skills and industry knowledge to drive organizational success. Adept at collaborating with cross-functional teams to achieve strategic objectives. Committed to continuous learning and professional development in a dynamic environment.';
  }
  if (prompt.includes('cover letter')) {
    return `Subject: Application for the Position

Dear Hiring Manager,

I am writing to express my strong interest in the advertised position at your esteemed organization. With my relevant experience and demonstrated capabilities, I am confident in my ability to contribute meaningfully to your team.

Throughout my career, I have consistently delivered results that align with organizational goals. My technical expertise, combined with strong communication and problem-solving skills, positions me as an ideal candidate for this role.

I would welcome the opportunity to discuss how my background aligns with your requirements. I am available for an interview at your earliest convenience.

Thank you for considering my application.

Yours Sincerely,
[Your Name]`;
  }
  if (prompt.includes('hashtags')) {
    return '#JobSearch #CareerTips #Pakistan #JobHunting #CVTips #ProfessionalDevelopment #LinkedInTips #Hiring #JobOpportunity #CareerGrowth #Resume #WorkInPakistan #Recruitment #JobSeeker #CareerAdvice #ProfessionalNetworking #Jobs #Employment #CareerSuccess #SkillsDevelopment';
  }
  if (prompt.includes('ATS keywords') || prompt.includes('job description')) {
    return `**Hard Skills / Technical Skills:**
- Project Management
- Data Analysis
- Microsoft Office Suite
- Communication Skills
- Problem Solving

**Soft Skills:**
- Leadership
- Teamwork
- Time Management
- Adaptability
- Critical Thinking

**Industry Keywords:**
- Strategic Planning
- Process Improvement
- Stakeholder Management

**Action Verbs to use in CV:**
- Managed, Led, Developed, Implemented, Achieved, Delivered, Optimized

**Recommended CV phrases:**
- "Drove significant improvement in..."
- "Successfully managed cross-functional team..."`;
  }
  return 'Professional content generated successfully. Please configure your OpenAI API key in environment variables for personalized AI-generated content.';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tool, fields, data } = body;
    const prompt = buildPrompt(tool, fields || {}, data);
    const result = await callOpenAI(prompt);
    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('AI generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate content', result: 'Unable to generate at this time. Please try again.' },
      { status: 500 }
    );
  }
}