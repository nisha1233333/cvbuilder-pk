'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { supabase, defaultResumeData } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Save, Download, Loader as Loader2, Plus, Trash2, ArrowLeft, Sparkles, User, GraduationCap, Briefcase, Wrench, Globe, Award, FolderOpen, Users as Users2, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import type { ResumeData, Education, Experience, Skill, Certification, Project, Reference, LanguageEntry } from '@/lib/supabase';
import CVPreview from '@/components/CVPreview';

const provinces = ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Islamabad (ICT)', 'AJK', 'Gilgit-Baltistan'];
const educationLevels = ['Matric / SSC', 'Intermediate / FA / FSc / ICS / ICom', 'O-Levels', 'A-Levels', 'Bachelor\'s Degree', 'Master\'s Degree', 'PhD', 'Diploma / Certificate', 'Other'];
const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const languageProficiencies = ['Basic', 'Conversational', 'Proficient', 'Fluent', 'Native'];
const templates = ['modern', 'ats', 'executive', 'minimal'];

function uid() { return Math.random().toString(36).slice(2); }

export default function BuilderEditorPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [title, setTitle] = useState('My CV');
  const [template, setTemplate] = useState('modern');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [showPreview, setShowPreview] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/auth/login'); return; }
      const { data } = await supabase.from('resumes').select('*').eq('id', id).eq('user_id', session.user.id).maybeSingle();
      if (data) {
        setTitle(data.title);
        setTemplate(data.template);
        setResumeData(data.data as ResumeData || defaultResumeData);
      }
      setLoading(false);
    };
    load();
  }, [id, router]);

  const save = useCallback(async () => {
    setSaving(true);
    await supabase.from('resumes').update({ title, template, data: resumeData, updated_at: new Date().toISOString() }).eq('id', id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }, [id, title, template, resumeData]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); save(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [save]);

  const updatePersonal = (field: string, value: string) => {
    setResumeData(d => ({ ...d, personalInfo: { ...d.personalInfo, [field]: value } }));
  };

  const addEducation = () => {
    const entry: Education = { id: uid(), level: '', degree: '', institution: '', board: '', startYear: '', endYear: '', grade: '', percentage: '', cgpa: '', subjects: '' };
    setResumeData(d => ({ ...d, education: [...d.education, entry] }));
  };
  const updateEducation = (idx: number, field: string, value: string) => {
    setResumeData(d => ({ ...d, education: d.education.map((e, i) => i === idx ? { ...e, [field]: value } : e) }));
  };
  const removeEducation = (idx: number) => setResumeData(d => ({ ...d, education: d.education.filter((_, i) => i !== idx) }));

  const addExperience = () => {
    const entry: Experience = { id: uid(), company: '', position: '', startDate: '', endDate: '', current: false, location: '', description: '' };
    setResumeData(d => ({ ...d, experience: [...d.experience, entry] }));
  };
  const updateExperience = (idx: number, field: string, value: string | boolean) => {
    setResumeData(d => ({ ...d, experience: d.experience.map((e, i) => i === idx ? { ...e, [field]: value } : e) }));
  };
  const removeExperience = (idx: number) => setResumeData(d => ({ ...d, experience: d.experience.filter((_, i) => i !== idx) }));

  const addSkill = () => setResumeData(d => ({ ...d, skills: [...d.skills, { id: uid(), name: '', level: 'Intermediate', category: 'Technical' }] }));
  const updateSkill = (idx: number, field: string, value: string) => setResumeData(d => ({ ...d, skills: d.skills.map((s, i) => i === idx ? { ...s, [field]: value } : s) }));
  const removeSkill = (idx: number) => setResumeData(d => ({ ...d, skills: d.skills.filter((_, i) => i !== idx) }));

  const addLanguage = () => setResumeData(d => ({ ...d, languages: [...d.languages, { id: uid(), name: '', proficiency: 'Proficient' }] }));
  const updateLanguage = (idx: number, field: string, value: string) => setResumeData(d => ({ ...d, languages: d.languages.map((l, i) => i === idx ? { ...l, [field]: value } : l) }));
  const removeLanguage = (idx: number) => setResumeData(d => ({ ...d, languages: d.languages.filter((_, i) => i !== idx) }));

  const addCert = () => setResumeData(d => ({ ...d, certifications: [...d.certifications, { id: uid(), name: '', issuer: '', date: '', url: '' }] }));
  const updateCert = (idx: number, field: string, value: string) => setResumeData(d => ({ ...d, certifications: d.certifications.map((c, i) => i === idx ? { ...c, [field]: value } : c) }));
  const removeCert = (idx: number) => setResumeData(d => ({ ...d, certifications: d.certifications.filter((_, i) => i !== idx) }));

  const addProject = () => setResumeData(d => ({ ...d, projects: [...d.projects, { id: uid(), name: '', description: '', technologies: '', url: '', startDate: '', endDate: '' }] }));
  const updateProject = (idx: number, field: string, value: string) => setResumeData(d => ({ ...d, projects: d.projects.map((p, i) => i === idx ? { ...p, [field]: value } : p) }));
  const removeProject = (idx: number) => setResumeData(d => ({ ...d, projects: d.projects.filter((_, i) => i !== idx) }));

  const addReference = () => setResumeData(d => ({ ...d, references: [...d.references, { id: uid(), name: '', position: '', company: '', phone: '', email: '' }] }));
  const updateReference = (idx: number, field: string, value: string) => setResumeData(d => ({ ...d, references: d.references.map((r, i) => i === idx ? { ...r, [field]: value } : r) }));
  const removeReference = (idx: number) => setResumeData(d => ({ ...d, references: d.references.filter((_, i) => i !== idx) }));

  const generateSummary = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: 'summary', data: resumeData }),
      });
      const json = await res.json();
      if (json.result) setResumeData(d => ({ ...d, summary: json.result }));
    } catch {}
    setAiLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'summary', label: 'Summary', icon: Sparkles },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'skills', label: 'Skills', icon: Wrench },
    { id: 'languages', label: 'Languages', icon: Globe },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'references', label: 'References', icon: Users2 },
  ];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Top bar */}
      <div className="bg-white border-b border-border px-4 py-3 flex items-center gap-3 no-print flex-shrink-0">
        <Link href="/builder">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
        </Link>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="max-w-xs h-8 text-sm font-medium border-0 bg-accent/50 focus-visible:ring-1"
        />
        <div className="ml-auto flex items-center gap-2">
          <Select value={template} onValueChange={setTemplate}>
            <SelectTrigger className="h-8 w-36 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {templates.map(t => (
                <SelectItem key={t} value={t} className="text-xs capitalize">{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Preview</span>
          </Button>
          <Button size="sm" variant="outline" className="h-8 text-xs gap-1.5" onClick={handlePrint}>
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PDF</span>
          </Button>
          <Button size="sm" className="h-8 text-xs gap-1.5 bg-blue-600 hover:bg-blue-700 text-white" onClick={save} disabled={saving}>
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {saved ? 'Saved!' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Editor Panel */}
        <div className={`${showPreview ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-1/2 bg-white border-r border-border overflow-hidden`}>
          {/* Section tabs */}
          <div className="border-b border-border overflow-x-auto">
            <div className="flex gap-0 px-2 pt-2 min-w-max">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveTab(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === s.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <s.icon className="w-3.5 h-3.5" />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {activeTab === 'personal' && (
              <div className="space-y-4">
                <h2 className="font-semibold text-sm text-foreground">Personal Information</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div><Label className="text-xs mb-1 block">Full Name *</Label><Input value={resumeData.personalInfo.fullName} onChange={e => updatePersonal('fullName', e.target.value)} placeholder="Ahmed Raza" /></div>
                  <div><Label className="text-xs mb-1 block">Father&apos;s Name</Label><Input value={resumeData.personalInfo.fatherName} onChange={e => updatePersonal('fatherName', e.target.value)} placeholder="Muhammad Raza" /></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs mb-1 block">CNIC</Label>
                    <Input value={resumeData.personalInfo.cnic} onChange={e => updatePersonal('cnic', e.target.value)} placeholder="XXXXX-XXXXXXX-X" maxLength={15} />
                  </div>
                  <div><Label className="text-xs mb-1 block">Date of Birth</Label><Input type="date" value={resumeData.personalInfo.dateOfBirth} onChange={e => updatePersonal('dateOfBirth', e.target.value)} /></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs mb-1 block">Gender</Label>
                    <Select value={resumeData.personalInfo.gender} onValueChange={v => updatePersonal('gender', v)}>
                      <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs mb-1 block">Marital Status</Label>
                    <Select value={resumeData.personalInfo.maritalStatus} onValueChange={v => updatePersonal('maritalStatus', v)}>
                      <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div><Label className="text-xs mb-1 block">Email *</Label><Input type="email" value={resumeData.personalInfo.email} onChange={e => updatePersonal('email', e.target.value)} placeholder="you@email.com" /></div>
                  <div><Label className="text-xs mb-1 block">Phone *</Label><Input value={resumeData.personalInfo.phone} onChange={e => updatePersonal('phone', e.target.value)} placeholder="03XX-XXXXXXX" /></div>
                </div>
                <div><Label className="text-xs mb-1 block">Address</Label><Input value={resumeData.personalInfo.address} onChange={e => updatePersonal('address', e.target.value)} placeholder="House #, Street, Area" /></div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div><Label className="text-xs mb-1 block">City</Label><Input value={resumeData.personalInfo.city} onChange={e => updatePersonal('city', e.target.value)} placeholder="Lahore" /></div>
                  <div>
                    <Label className="text-xs mb-1 block">Province</Label>
                    <Select value={resumeData.personalInfo.province} onValueChange={v => updatePersonal('province', v)}>
                      <SelectTrigger><SelectValue placeholder="Select province" /></SelectTrigger>
                      <SelectContent>
                        {provinces.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs mb-1 block">Religion</Label>
                    <Select value={resumeData.personalInfo.religion} onValueChange={v => updatePersonal('religion', v)}>
                      <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Islam">Islam</SelectItem>
                        <SelectItem value="Christianity">Christianity</SelectItem>
                        <SelectItem value="Hinduism">Hinduism</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label className="text-xs mb-1 block">Nationality</Label><Input value={resumeData.personalInfo.nationality} onChange={e => updatePersonal('nationality', e.target.value)} placeholder="Pakistani" /></div>
                </div>
                <div className="pt-1 border-t border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-3">Online Presence</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div><Label className="text-xs mb-1 block">LinkedIn URL</Label><Input value={resumeData.personalInfo.linkedin} onChange={e => updatePersonal('linkedin', e.target.value)} placeholder="linkedin.com/in/username" /></div>
                    <div><Label className="text-xs mb-1 block">GitHub URL</Label><Input value={resumeData.personalInfo.github} onChange={e => updatePersonal('github', e.target.value)} placeholder="github.com/username" /></div>
                    <div><Label className="text-xs mb-1 block">Website / Portfolio</Label><Input value={resumeData.personalInfo.website} onChange={e => updatePersonal('website', e.target.value)} placeholder="yourwebsite.com" /></div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'summary' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-sm">Professional Summary</h2>
                  <Button size="sm" variant="outline" className="text-xs h-7 gap-1.5" onClick={generateSummary} disabled={aiLoading}>
                    {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 text-blue-600" />}
                    AI Generate
                  </Button>
                </div>
                <Textarea
                  value={resumeData.summary}
                  onChange={e => setResumeData(d => ({ ...d, summary: e.target.value }))}
                  placeholder="Write a compelling professional summary that highlights your key skills, experience, and career goals..."
                  className="min-h-[180px] text-sm"
                />
                <p className="text-xs text-muted-foreground">Tip: Keep it 3-4 sentences. Use AI to generate one based on your profile.</p>
              </div>
            )}

            {activeTab === 'education' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-sm">Education</h2>
                  <Button size="sm" variant="outline" className="text-xs h-7 gap-1.5" onClick={addEducation}>
                    <Plus className="w-3.5 h-3.5" /> Add
                  </Button>
                </div>
                {resumeData.education.length === 0 && (
                  <div className="text-center py-8 border border-dashed border-border rounded-xl">
                    <GraduationCap className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
                    <p className="text-sm text-muted-foreground mb-3">No education entries</p>
                    <Button size="sm" variant="outline" onClick={addEducation}><Plus className="w-3.5 h-3.5 mr-1.5" />Add Education</Button>
                  </div>
                )}
                {resumeData.education.map((edu, idx) => (
                  <div key={edu.id} className="border border-border rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-muted-foreground">Education #{idx + 1}</span>
                      <button onClick={() => removeEducation(idx)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <div>
                      <Label className="text-xs mb-1 block">Education Level *</Label>
                      <Select value={edu.level} onValueChange={v => updateEducation(idx, 'level', v)}>
                        <SelectTrigger className="text-xs"><SelectValue placeholder="Select level" /></SelectTrigger>
                        <SelectContent>
                          {educationLevels.map(l => <SelectItem key={l} value={l} className="text-xs">{l}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    {(edu.level?.includes('Bachelor') || edu.level?.includes('Master') || edu.level?.includes('PhD') || edu.level?.includes('Diploma')) && (
                      <div><Label className="text-xs mb-1 block">Degree / Program</Label><Input className="text-xs" value={edu.degree} onChange={e => updateEducation(idx, 'degree', e.target.value)} placeholder="B.Sc Computer Science" /></div>
                    )}
                    <div><Label className="text-xs mb-1 block">Institution / School *</Label><Input className="text-xs" value={edu.institution} onChange={e => updateEducation(idx, 'institution', e.target.value)} placeholder="University of Punjab, Lahore" /></div>
                    {(edu.level?.includes('Matric') || edu.level?.includes('Intermediate')) && (
                      <div><Label className="text-xs mb-1 block">Board</Label><Input className="text-xs" value={edu.board} onChange={e => updateEducation(idx, 'board', e.target.value)} placeholder="BISE Lahore" /></div>
                    )}
                    <div className="grid grid-cols-2 gap-2">
                      <div><Label className="text-xs mb-1 block">Start Year</Label><Input className="text-xs" value={edu.startYear} onChange={e => updateEducation(idx, 'startYear', e.target.value)} placeholder="2019" /></div>
                      <div><Label className="text-xs mb-1 block">End Year</Label><Input className="text-xs" value={edu.endYear} onChange={e => updateEducation(idx, 'endYear', e.target.value)} placeholder="2023" /></div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div><Label className="text-xs mb-1 block">Grade</Label><Input className="text-xs" value={edu.grade} onChange={e => updateEducation(idx, 'grade', e.target.value)} placeholder="A+" /></div>
                      <div><Label className="text-xs mb-1 block">Percentage</Label><Input className="text-xs" value={edu.percentage} onChange={e => updateEducation(idx, 'percentage', e.target.value)} placeholder="87%" /></div>
                      <div><Label className="text-xs mb-1 block">CGPA</Label><Input className="text-xs" value={edu.cgpa} onChange={e => updateEducation(idx, 'cgpa', e.target.value)} placeholder="3.8" /></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-sm">Work Experience</h2>
                  <Button size="sm" variant="outline" className="text-xs h-7 gap-1.5" onClick={addExperience}><Plus className="w-3.5 h-3.5" /> Add</Button>
                </div>
                {resumeData.experience.length === 0 && (
                  <div className="text-center py-8 border border-dashed border-border rounded-xl">
                    <Briefcase className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
                    <p className="text-sm text-muted-foreground mb-3">No experience entries</p>
                    <Button size="sm" variant="outline" onClick={addExperience}><Plus className="w-3.5 h-3.5 mr-1.5" />Add Experience</Button>
                  </div>
                )}
                {resumeData.experience.map((exp, idx) => (
                  <div key={exp.id} className="border border-border rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-muted-foreground">Experience #{idx + 1}</span>
                      <button onClick={() => removeExperience(idx)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      <div><Label className="text-xs mb-1 block">Position / Title *</Label><Input className="text-xs" value={exp.position} onChange={e => updateExperience(idx, 'position', e.target.value)} placeholder="Software Engineer" /></div>
                      <div><Label className="text-xs mb-1 block">Company *</Label><Input className="text-xs" value={exp.company} onChange={e => updateExperience(idx, 'company', e.target.value)} placeholder="TechCorp Pakistan" /></div>
                    </div>
                    <div><Label className="text-xs mb-1 block">Location</Label><Input className="text-xs" value={exp.location} onChange={e => updateExperience(idx, 'location', e.target.value)} placeholder="Lahore, Pakistan" /></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><Label className="text-xs mb-1 block">Start Date</Label><Input type="month" className="text-xs" value={exp.startDate} onChange={e => updateExperience(idx, 'startDate', e.target.value)} /></div>
                      <div>
                        <Label className="text-xs mb-1 block">End Date</Label>
                        {exp.current ? (
                          <Input className="text-xs" value="Present" disabled />
                        ) : (
                          <Input type="month" className="text-xs" value={exp.endDate} onChange={e => updateExperience(idx, 'endDate', e.target.value)} />
                        )}
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
                      <input type="checkbox" checked={exp.current} onChange={e => updateExperience(idx, 'current', e.target.checked)} className="rounded" />
                      Currently working here
                    </label>
                    <div>
                      <Label className="text-xs mb-1 block">Description / Responsibilities</Label>
                      <Textarea className="text-xs min-h-[100px]" value={exp.description} onChange={e => updateExperience(idx, 'description', e.target.value)} placeholder="• Developed React applications...\n• Led a team of 5 engineers..." />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-sm">Skills</h2>
                  <Button size="sm" variant="outline" className="text-xs h-7 gap-1.5" onClick={addSkill}><Plus className="w-3.5 h-3.5" /> Add</Button>
                </div>
                {resumeData.skills.length === 0 && (
                  <div className="text-center py-8 border border-dashed border-border rounded-xl">
                    <Wrench className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
                    <p className="text-sm text-muted-foreground mb-3">No skills added</p>
                    <Button size="sm" variant="outline" onClick={addSkill}><Plus className="w-3.5 h-3.5 mr-1.5" />Add Skill</Button>
                  </div>
                )}
                <div className="space-y-2">
                  {resumeData.skills.map((skill, idx) => (
                    <div key={skill.id} className="flex items-center gap-2">
                      <Input className="text-xs flex-1" value={skill.name} onChange={e => updateSkill(idx, 'name', e.target.value)} placeholder="Skill name (e.g. React, MS Excel)" />
                      <Select value={skill.level} onValueChange={v => updateSkill(idx, 'level', v)}>
                        <SelectTrigger className="text-xs w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {skillLevels.map(l => <SelectItem key={l} value={l} className="text-xs">{l}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <button onClick={() => removeSkill(idx)} className="text-muted-foreground hover:text-destructive flex-shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'languages' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-sm">Languages</h2>
                  <Button size="sm" variant="outline" className="text-xs h-7 gap-1.5" onClick={addLanguage}><Plus className="w-3.5 h-3.5" /> Add</Button>
                </div>
                <div className="space-y-2">
                  {resumeData.languages.map((lang, idx) => (
                    <div key={lang.id} className="flex items-center gap-2">
                      <Input className="text-xs flex-1" value={lang.name} onChange={e => updateLanguage(idx, 'name', e.target.value)} placeholder="Language (e.g. Urdu, English, Punjabi)" />
                      <Select value={lang.proficiency} onValueChange={v => updateLanguage(idx, 'proficiency', v)}>
                        <SelectTrigger className="text-xs w-36"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {languageProficiencies.map(l => <SelectItem key={l} value={l} className="text-xs">{l}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <button onClick={() => removeLanguage(idx)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'certifications' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-sm">Certifications</h2>
                  <Button size="sm" variant="outline" className="text-xs h-7 gap-1.5" onClick={addCert}><Plus className="w-3.5 h-3.5" /> Add</Button>
                </div>
                {resumeData.certifications.map((cert, idx) => (
                  <div key={cert.id} className="border border-border rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Cert #{idx + 1}</span>
                      <button onClick={() => removeCert(idx)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      <div><Label className="text-xs mb-1 block">Certificate Name</Label><Input className="text-xs" value={cert.name} onChange={e => updateCert(idx, 'name', e.target.value)} placeholder="AWS Certified Developer" /></div>
                      <div><Label className="text-xs mb-1 block">Issuing Organization</Label><Input className="text-xs" value={cert.issuer} onChange={e => updateCert(idx, 'issuer', e.target.value)} placeholder="Amazon Web Services" /></div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      <div><Label className="text-xs mb-1 block">Date</Label><Input type="month" className="text-xs" value={cert.date} onChange={e => updateCert(idx, 'date', e.target.value)} /></div>
                      <div><Label className="text-xs mb-1 block">Certificate URL</Label><Input className="text-xs" value={cert.url} onChange={e => updateCert(idx, 'url', e.target.value)} placeholder="https://..." /></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-sm">Projects</h2>
                  <Button size="sm" variant="outline" className="text-xs h-7 gap-1.5" onClick={addProject}><Plus className="w-3.5 h-3.5" /> Add</Button>
                </div>
                {resumeData.projects.map((proj, idx) => (
                  <div key={proj.id} className="border border-border rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Project #{idx + 1}</span>
                      <button onClick={() => removeProject(idx)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <div><Label className="text-xs mb-1 block">Project Name</Label><Input className="text-xs" value={proj.name} onChange={e => updateProject(idx, 'name', e.target.value)} placeholder="E-commerce Platform" /></div>
                    <div><Label className="text-xs mb-1 block">Technologies Used</Label><Input className="text-xs" value={proj.technologies} onChange={e => updateProject(idx, 'technologies', e.target.value)} placeholder="React, Node.js, MongoDB" /></div>
                    <div><Label className="text-xs mb-1 block">Description</Label><Textarea className="text-xs min-h-[80px]" value={proj.description} onChange={e => updateProject(idx, 'description', e.target.value)} placeholder="Built a full-stack e-commerce platform..." /></div>
                    <div><Label className="text-xs mb-1 block">Project URL</Label><Input className="text-xs" value={proj.url} onChange={e => updateProject(idx, 'url', e.target.value)} placeholder="https://github.com/..." /></div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'references' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-sm">References</h2>
                  <Button size="sm" variant="outline" className="text-xs h-7 gap-1.5" onClick={addReference}><Plus className="w-3.5 h-3.5" /> Add</Button>
                </div>
                {resumeData.references.map((ref, idx) => (
                  <div key={ref.id} className="border border-border rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs text-muted-foreground">Reference #{idx + 1}</span>
                      <button onClick={() => removeReference(idx)} className="text-muted-foreground hover:text-destructive"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      <div><Label className="text-xs mb-1 block">Name</Label><Input className="text-xs" value={ref.name} onChange={e => updateReference(idx, 'name', e.target.value)} placeholder="Dr. Muhammad Ali" /></div>
                      <div><Label className="text-xs mb-1 block">Position</Label><Input className="text-xs" value={ref.position} onChange={e => updateReference(idx, 'position', e.target.value)} placeholder="Head of Department" /></div>
                    </div>
                    <div><Label className="text-xs mb-1 block">Company / Institution</Label><Input className="text-xs" value={ref.company} onChange={e => updateReference(idx, 'company', e.target.value)} placeholder="NUST Islamabad" /></div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      <div><Label className="text-xs mb-1 block">Phone</Label><Input className="text-xs" value={ref.phone} onChange={e => updateReference(idx, 'phone', e.target.value)} placeholder="03XX-XXXXXXX" /></div>
                      <div><Label className="text-xs mb-1 block">Email</Label><Input className="text-xs" value={ref.email} onChange={e => updateReference(idx, 'email', e.target.value)} placeholder="email@example.com" /></div>
                    </div>
                  </div>
                ))}
                {resumeData.references.length === 0 && (
                  <div className="text-center py-6 border border-dashed border-border rounded-xl">
                    <p className="text-xs text-muted-foreground mb-2">You can add references or write &ldquo;References available upon request&rdquo;</p>
                    <Button size="sm" variant="outline" onClick={addReference}><Plus className="w-3.5 h-3.5 mr-1.5" />Add Reference</Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className={`${showPreview ? 'flex' : 'hidden lg:flex'} flex-1 bg-slate-200 overflow-auto`}>
          <div className="w-full min-h-full p-4 sm:p-6 flex justify-center">
            <div className="w-full max-w-[210mm] print:max-w-none">
              <CVPreview data={resumeData} template={template} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
