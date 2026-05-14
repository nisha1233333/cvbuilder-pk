'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Brain, PenLine, Mail, Hash, Award, Copy, Check, Sparkles, Loader as Loader2, RefreshCw, Linkedin } from 'lucide-react';

type ToolId = 'summary' | 'cover-letter' | 'linkedin' | 'bio' | 'email' | 'hashtags' | 'ats-keywords';

const tools: { id: ToolId; icon: any; label: string; desc: string; color: string; fields: { id: string; label: string; placeholder: string; type: 'input' | 'textarea' }[] }[] = [
  {
    id: 'summary',
    icon: Brain,
    label: 'Professional Summary',
    desc: 'AI-generated professional summary for your CV',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    fields: [
      { id: 'name', label: 'Your Name', placeholder: 'Ahmed Raza', type: 'input' },
      { id: 'title', label: 'Job Title / Field', placeholder: 'Software Engineer', type: 'input' },
      { id: 'experience', label: 'Years of Experience', placeholder: '3 years', type: 'input' },
      { id: 'skills', label: 'Key Skills', placeholder: 'React, Node.js, Python, AWS', type: 'input' },
      { id: 'achievement', label: 'Key Achievement (optional)', placeholder: 'Led team of 10, delivered project on time', type: 'textarea' },
    ],
  },
  {
    id: 'cover-letter',
    icon: PenLine,
    label: 'Cover Letter',
    desc: 'Personalized cover letter for any job application',
    color: 'bg-green-50 text-green-600 border-green-100',
    fields: [
      { id: 'name', label: 'Your Name', placeholder: 'Fatima Malik', type: 'input' },
      { id: 'position', label: 'Job Position', placeholder: 'Marketing Manager', type: 'input' },
      { id: 'company', label: 'Company Name', placeholder: 'Telenor Pakistan', type: 'input' },
      { id: 'experience', label: 'Relevant Experience', placeholder: '5 years in digital marketing', type: 'textarea' },
      { id: 'why', label: 'Why this company?', placeholder: 'Passionate about telecom industry growth in Pakistan', type: 'textarea' },
    ],
  },
  {
    id: 'linkedin',
    icon: Linkedin,
    label: 'LinkedIn Summary',
    desc: 'Optimized LinkedIn profile summary that attracts recruiters',
    color: 'bg-sky-50 text-sky-600 border-sky-100',
    fields: [
      { id: 'name', label: 'Your Name', placeholder: 'Hassan Ali', type: 'input' },
      { id: 'title', label: 'Current Role', placeholder: 'Financial Analyst at HBL', type: 'input' },
      { id: 'experience', label: 'Background Summary', placeholder: 'MBA Finance, 6 years banking experience', type: 'textarea' },
      { id: 'goals', label: 'Career Goals', placeholder: 'Looking for senior finance roles in Pakistan or UAE', type: 'textarea' },
    ],
  },
  {
    id: 'bio',
    icon: Award,
    label: 'Professional Bio',
    desc: 'Short bio for website, Twitter, or personal branding',
    color: 'bg-orange-50 text-orange-600 border-orange-100',
    fields: [
      { id: 'name', label: 'Name', placeholder: 'Sara Khan', type: 'input' },
      { id: 'title', label: 'Profession', placeholder: 'UX Designer', type: 'input' },
      { id: 'experience', label: 'Experience & Skills', placeholder: '4 years, Figma, user research, product design', type: 'textarea' },
    ],
  },
  {
    id: 'email',
    icon: Mail,
    label: 'Email Writer',
    desc: 'Professional emails for job applications, follow-ups',
    color: 'bg-rose-50 text-rose-600 border-rose-100',
    fields: [
      { id: 'type', label: 'Email Type', placeholder: 'Job application / Follow-up / Thank you / Cold outreach', type: 'input' },
      { id: 'to', label: 'Recipient (Role/Company)', placeholder: 'HR Manager, Engro Corporation', type: 'input' },
      { id: 'context', label: 'Context / Purpose', placeholder: 'Following up on my Software Engineer application from last week', type: 'textarea' },
    ],
  },
  {
    id: 'hashtags',
    icon: Hash,
    label: 'Hashtag Generator',
    desc: 'Trending hashtags for LinkedIn, Twitter, Instagram posts',
    color: 'bg-yellow-50 text-yellow-600 border-yellow-100',
    fields: [
      { id: 'topic', label: 'Post Topic', placeholder: 'Job hunting tips for fresh graduates in Pakistan', type: 'input' },
      { id: 'platform', label: 'Platform', placeholder: 'LinkedIn / Twitter / Instagram', type: 'input' },
    ],
  },
  {
    id: 'ats-keywords',
    icon: Sparkles,
    label: 'ATS Keywords',
    desc: 'Extract keywords from job descriptions to optimize your CV',
    color: 'bg-teal-50 text-teal-600 border-teal-100',
    fields: [
      { id: 'jobDescription', label: 'Paste Job Description', placeholder: 'Paste the full job description here...', type: 'textarea' },
      { id: 'field', label: 'Your Field / Industry', placeholder: 'Software Engineering / Finance / Marketing', type: 'input' },
    ],
  },
];

export default function AIToolsPage() {
  const [activeTool, setActiveTool] = useState<ToolId>('summary');
  const [fields, setFields] = useState<Record<string, string>>({});
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const tool = tools.find(t => t.id === activeTool)!;

  const handleGenerate = async () => {
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: activeTool, fields }),
      });
      const json = await res.json();
      setResult(json.result || json.error || 'Something went wrong. Please try again.');
    } catch {
      setResult('Failed to generate. Please check your connection and try again.');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToolChange = (id: ToolId) => {
    setActiveTool(id);
    setFields({});
    setResult('');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h1 className="text-2xl font-bold">AI Tools</h1>
          </div>
          <p className="text-muted-foreground">Generate professional content in seconds with AI</p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Tool selector */}
          <div className="bg-white rounded-xl border border-border p-3 h-fit lg:sticky lg:top-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">Tools</p>
            <div className="space-y-0.5">
              {tools.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleToolChange(t.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors ${
                    activeTool === t.id ? 'bg-blue-50 text-blue-700' : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg ${t.color} border flex items-center justify-center flex-shrink-0`}>
                    <t.icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[13px]">{t.label}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tool area */}
          <div className="space-y-4">
            {/* Tool header */}
            <div className="bg-white rounded-xl border border-border p-5">
              <div className="flex items-center gap-3 mb-1">
                <div className={`w-9 h-9 rounded-xl ${tool.color} border flex items-center justify-center`}>
                  <tool.icon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h2 className="font-semibold">{tool.label}</h2>
                  <p className="text-xs text-muted-foreground">{tool.desc}</p>
                </div>
              </div>
            </div>

            {/* Input fields */}
            <div className="bg-white rounded-xl border border-border p-5 space-y-4">
              <h3 className="font-medium text-sm">Input Details</h3>
              {tool.fields.map((field) => (
                <div key={field.id} className="space-y-1.5">
                  <Label className="text-xs">{field.label}</Label>
                  {field.type === 'textarea' ? (
                    <Textarea
                      placeholder={field.placeholder}
                      value={fields[field.id] || ''}
                      onChange={e => setFields(f => ({ ...f, [field.id]: e.target.value }))}
                      className="text-sm min-h-[80px]"
                    />
                  ) : (
                    <Input
                      placeholder={field.placeholder}
                      value={fields[field.id] || ''}
                      onChange={e => setFields(f => ({ ...f, [field.id]: e.target.value }))}
                      className="text-sm"
                    />
                  )}
                </div>
              ))}
              <Button onClick={handleGenerate} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto">
                {loading ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" />Generating...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-2" />Generate with AI</>
                )}
              </Button>
            </div>

            {/* Result */}
            {result && (
              <div className="bg-white rounded-xl border border-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-sm">Generated Result</h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs h-7 gap-1.5" onClick={() => { setResult(''); handleGenerate(); }}>
                      <RefreshCw className="w-3 h-3" />
                      Regenerate
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs h-7 gap-1.5" onClick={handleCopy}>
                      {copied ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 text-sm text-foreground whitespace-pre-wrap leading-relaxed border border-border">
                  {result}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
