'use client';

import type { ResumeData } from '@/lib/supabase';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface CVPreviewProps {
  data: ResumeData;
  template: string;
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  if (dateStr === 'Present') return 'Present';
  try {
    const d = new Date(dateStr + '-01');
    return d.toLocaleDateString('en-PK', { month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export default function CVPreview({ data, template }: CVPreviewProps) {
  const { personalInfo: p, education, experience, skills, languages, certifications, projects, references, summary } = data;

  const levelWidth: Record<string, string> = {
    Beginner: '25%', Intermediate: '50%', Advanced: '75%', Expert: '100%',
  };

  if (template === 'modern') return <ModernTemplate data={data} />;
  if (template === 'ats') return <ATSTemplate data={data} />;
  if (template === 'executive') return <ExecutiveTemplate data={data} />;
  return <MinimalTemplate data={data} />;
}

function ModernTemplate({ data }: { data: ResumeData }) {
  const p = data.personalInfo;
  return (
    <div className="bg-white shadow-sm font-sans text-[11px] leading-relaxed min-h-[297mm]" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div className="bg-blue-700 text-white px-8 py-6">
        <h1 className="text-[22px] font-bold tracking-wide mb-0.5">{p.fullName || 'Your Full Name'}</h1>
        {p.fatherName && <p className="text-blue-200 text-[10px] mb-2">S/O {p.fatherName}</p>}
        <div className="flex flex-wrap gap-3 text-[9.5px] text-blue-100">
          {p.email && <span className="flex items-center gap-1"><Mail size={9} />{p.email}</span>}
          {p.phone && <span className="flex items-center gap-1"><Phone size={9} />{p.phone}</span>}
          {(p.city || p.province) && <span className="flex items-center gap-1"><MapPin size={9} />{[p.city, p.province].filter(Boolean).join(', ')}</span>}
          {p.linkedin && <span className="flex items-center gap-1"><Linkedin size={9} />{p.linkedin.replace('https://', '').replace('http://', '')}</span>}
          {p.github && <span className="flex items-center gap-1"><Github size={9} />{p.github.replace('https://', '').replace('http://', '')}</span>}
        </div>
        <div className="flex flex-wrap gap-4 text-[9px] text-blue-200 mt-1.5">
          {p.cnic && <span>CNIC: {p.cnic}</span>}
          {p.dateOfBirth && <span>DOB: {p.dateOfBirth}</span>}
          {p.gender && <span>Gender: {p.gender}</span>}
          {p.maritalStatus && <span>Status: {p.maritalStatus}</span>}
          {p.religion && <span>Religion: {p.religion}</span>}
          {p.nationality && <span>Nationality: {p.nationality}</span>}
        </div>
      </div>

      <div className="flex">
        {/* Left sidebar */}
        <div className="w-[35%] bg-slate-50 px-5 py-5 space-y-5">
          {/* Skills */}
          {data.skills.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold text-blue-700 uppercase tracking-wider border-b border-blue-200 pb-1 mb-2">Skills</h2>
              <div className="space-y-1.5">
                {data.skills.map(s => (
                  <div key={s.id}>
                    <div className="flex justify-between text-[9.5px] mb-0.5">
                      <span>{s.name}</span>
                      <span className="text-slate-400">{s.level}</span>
                    </div>
                    <div className="h-1 bg-slate-200 rounded-full">
                      <div className="h-1 bg-blue-600 rounded-full" style={{ width: { Beginner: '25%', Intermediate: '50%', Advanced: '75%', Expert: '100%' }[s.level] || '50%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {data.languages.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold text-blue-700 uppercase tracking-wider border-b border-blue-200 pb-1 mb-2">Languages</h2>
              <div className="space-y-1">
                {data.languages.map(l => (
                  <div key={l.id} className="flex justify-between text-[9.5px]">
                    <span>{l.name}</span>
                    <span className="text-slate-500">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {data.certifications.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold text-blue-700 uppercase tracking-wider border-b border-blue-200 pb-1 mb-2">Certifications</h2>
              <div className="space-y-2">
                {data.certifications.map(c => (
                  <div key={c.id}>
                    <p className="text-[9.5px] font-semibold">{c.name}</p>
                    <p className="text-[9px] text-slate-500">{c.issuer}</p>
                    {c.date && <p className="text-[9px] text-slate-400">{formatDate(c.date)}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* References */}
          {data.references.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold text-blue-700 uppercase tracking-wider border-b border-blue-200 pb-1 mb-2">References</h2>
              <div className="space-y-2">
                {data.references.map(r => (
                  <div key={r.id}>
                    <p className="text-[9.5px] font-semibold">{r.name}</p>
                    <p className="text-[9px] text-slate-500">{r.position}</p>
                    <p className="text-[9px] text-slate-500">{r.company}</p>
                    {r.phone && <p className="text-[9px] text-slate-400">{r.phone}</p>}
                    {r.email && <p className="text-[9px] text-slate-400">{r.email}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right main content */}
        <div className="flex-1 px-6 py-5 space-y-5">
          {/* Summary */}
          {data.summary && (
            <div>
              <h2 className="text-[10px] font-bold text-blue-700 uppercase tracking-wider border-b-2 border-blue-600 pb-1 mb-2">Professional Summary</h2>
              <p className="text-[10px] text-slate-700 leading-relaxed">{data.summary}</p>
            </div>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold text-blue-700 uppercase tracking-wider border-b-2 border-blue-600 pb-1 mb-3">Work Experience</h2>
              <div className="space-y-3">
                {data.experience.map(exp => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[11px] font-bold text-slate-800">{exp.position}</p>
                        <p className="text-[10px] font-semibold text-blue-600">{exp.company}</p>
                        {exp.location && <p className="text-[9.5px] text-slate-400">{exp.location}</p>}
                      </div>
                      <div className="text-[9px] text-slate-500 text-right whitespace-nowrap">
                        {formatDate(exp.startDate)} — {exp.current ? 'Present' : formatDate(exp.endDate)}
                      </div>
                    </div>
                    {exp.description && (
                      <div className="mt-1 text-[9.5px] text-slate-600 whitespace-pre-line">{exp.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {data.education.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold text-blue-700 uppercase tracking-wider border-b-2 border-blue-600 pb-1 mb-3">Education</h2>
              <div className="space-y-2.5">
                {data.education.map(edu => (
                  <div key={edu.id} className="flex justify-between items-start">
                    <div>
                      <p className="text-[11px] font-bold text-slate-800">{edu.degree || edu.level}</p>
                      <p className="text-[10px] font-semibold text-blue-600">{edu.institution}</p>
                      {edu.board && <p className="text-[9.5px] text-slate-500">Board: {edu.board}</p>}
                      <div className="flex gap-3 text-[9px] text-slate-500 mt-0.5">
                        {edu.percentage && <span>Marks: {edu.percentage}</span>}
                        {edu.cgpa && <span>CGPA: {edu.cgpa}</span>}
                        {edu.grade && <span>Grade: {edu.grade}</span>}
                      </div>
                    </div>
                    <div className="text-[9px] text-slate-500 text-right whitespace-nowrap">
                      {edu.startYear}{edu.endYear ? ` — ${edu.endYear}` : ''}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {data.projects.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold text-blue-700 uppercase tracking-wider border-b-2 border-blue-600 pb-1 mb-3">Projects</h2>
              <div className="space-y-2">
                {data.projects.map(proj => (
                  <div key={proj.id}>
                    <p className="text-[10.5px] font-bold text-slate-800">{proj.name}</p>
                    {proj.technologies && <p className="text-[9px] text-blue-600">Tech: {proj.technologies}</p>}
                    {proj.description && <p className="text-[9.5px] text-slate-600 mt-0.5">{proj.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ATSTemplate({ data }: { data: ResumeData }) {
  const p = data.personalInfo;
  return (
    <div className="bg-white shadow-sm font-sans text-[10.5px] leading-relaxed px-10 py-8 min-h-[297mm]" style={{ fontFamily: 'Calibri, Arial, sans-serif' }}>
      <div className="text-center border-b-2 border-slate-800 pb-4 mb-5">
        <h1 className="text-[20px] font-bold text-slate-900 uppercase tracking-widest">{p.fullName || 'Your Full Name'}</h1>
        {p.fatherName && <p className="text-[9.5px] text-slate-600 mt-0.5">S/O {p.fatherName}</p>}
        <div className="flex flex-wrap justify-center gap-3 text-[9.5px] text-slate-600 mt-2">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {(p.city || p.province) && <span>{[p.city, p.province].filter(Boolean).join(', ')}</span>}
          {p.linkedin && <span>{p.linkedin}</span>}
        </div>
        {(p.cnic || p.dateOfBirth || p.nationality) && (
          <div className="flex flex-wrap justify-center gap-3 text-[9px] text-slate-500 mt-1">
            {p.cnic && <span>CNIC: {p.cnic}</span>}
            {p.dateOfBirth && <span>DOB: {p.dateOfBirth}</span>}
            {p.gender && <span>{p.gender}</span>}
            {p.nationality && <span>{p.nationality}</span>}
          </div>
        )}
      </div>

      {data.summary && (
        <div className="mb-4">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-800 mb-1.5">Professional Summary</h2>
          <p className="text-[10px] text-slate-700">{data.summary}</p>
        </div>
      )}

      {data.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">Work Experience</h2>
          {data.experience.map(exp => (
            <div key={exp.id} className="mb-2.5">
              <div className="flex justify-between">
                <span className="font-bold text-[10.5px]">{exp.position} — {exp.company}</span>
                <span className="text-[9.5px] text-slate-500">{formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
              </div>
              {exp.location && <p className="text-[9.5px] text-slate-500">{exp.location}</p>}
              {exp.description && <p className="text-[9.5px] text-slate-700 mt-0.5 whitespace-pre-line">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {data.education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">Education</h2>
          {data.education.map(edu => (
            <div key={edu.id} className="flex justify-between mb-1.5">
              <div>
                <span className="font-bold text-[10.5px]">{edu.degree || edu.level}</span>
                <span className="text-[10px] text-slate-600"> — {edu.institution}</span>
                {edu.board && <span className="text-[9.5px] text-slate-500"> ({edu.board})</span>}
                {(edu.percentage || edu.cgpa) && <span className="text-[9.5px] text-slate-500"> | {edu.percentage || ''} {edu.cgpa ? `CGPA ${edu.cgpa}` : ''}</span>}
              </div>
              <span className="text-[9.5px] text-slate-500">{edu.startYear}{edu.endYear ? `–${edu.endYear}` : ''}</span>
            </div>
          ))}
        </div>
      )}

      {data.skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">Skills</h2>
          <p className="text-[10px] text-slate-700">{data.skills.map(s => s.name).join(' • ')}</p>
        </div>
      )}

      {data.languages.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">Languages</h2>
          <p className="text-[10px] text-slate-700">{data.languages.map(l => `${l.name} (${l.proficiency})`).join(' • ')}</p>
        </div>
      )}

      {data.certifications.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">Certifications</h2>
          {data.certifications.map(c => (
            <div key={c.id} className="flex justify-between text-[9.5px] mb-1">
              <span><strong>{c.name}</strong> — {c.issuer}</span>
              <span className="text-slate-500">{formatDate(c.date)}</span>
            </div>
          ))}
        </div>
      )}

      {data.references.length > 0 && (
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-1 mb-2">References</h2>
          <div className="grid grid-cols-2 gap-3">
            {data.references.map(r => (
              <div key={r.id} className="text-[9.5px]">
                <p className="font-bold">{r.name}</p>
                <p className="text-slate-600">{r.position}, {r.company}</p>
                {r.phone && <p className="text-slate-500">{r.phone}</p>}
                {r.email && <p className="text-slate-500">{r.email}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ExecutiveTemplate({ data }: { data: ResumeData }) {
  const p = data.personalInfo;
  return (
    <div className="bg-white shadow-sm font-sans text-[10.5px] leading-relaxed min-h-[297mm]" style={{ fontFamily: 'Georgia, serif' }}>
      <div className="bg-green-800 text-white px-8 py-6">
        <h1 className="text-[24px] font-bold mb-1">{p.fullName || 'Your Full Name'}</h1>
        {p.fatherName && <p className="text-green-200 text-[9px] mb-2">S/O {p.fatherName}</p>}
        <div className="flex flex-wrap gap-4 text-[9.5px] text-green-100">
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {(p.city || p.province) && <span>{[p.city, p.province].filter(Boolean).join(', ')}</span>}
        </div>
        {p.cnic && <p className="text-[9px] text-green-200 mt-1">CNIC: {p.cnic} {p.dateOfBirth ? `| DOB: ${p.dateOfBirth}` : ''} {p.gender ? `| ${p.gender}` : ''}</p>}
      </div>
      <div className="px-8 py-6 space-y-5">
        {data.summary && (
          <div className="border-l-4 border-green-700 pl-4">
            <h2 className="text-[10px] font-bold text-green-800 uppercase tracking-wider mb-1.5">Executive Summary</h2>
            <p className="text-[10px] text-slate-700 italic">{data.summary}</p>
          </div>
        )}
        {data.experience.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold text-green-800 uppercase tracking-wider border-b-2 border-green-700 pb-1 mb-3">Career History</h2>
            {data.experience.map(exp => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between">
                  <div><p className="text-[11px] font-bold">{exp.position}</p><p className="text-[10px] text-green-700 font-semibold">{exp.company} {exp.location ? `· ${exp.location}` : ''}</p></div>
                  <p className="text-[9.5px] text-slate-500">{formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}</p>
                </div>
                {exp.description && <p className="text-[9.5px] text-slate-600 mt-1 whitespace-pre-line">{exp.description}</p>}
              </div>
            ))}
          </div>
        )}
        {data.education.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold text-green-800 uppercase tracking-wider border-b-2 border-green-700 pb-1 mb-3">Education</h2>
            {data.education.map(edu => (
              <div key={edu.id} className="flex justify-between mb-2">
                <div>
                  <p className="text-[10.5px] font-bold">{edu.degree || edu.level}</p>
                  <p className="text-[10px] text-green-700">{edu.institution}</p>
                  {(edu.percentage || edu.cgpa) && <p className="text-[9.5px] text-slate-500">{edu.percentage}{edu.cgpa ? ` | CGPA: ${edu.cgpa}` : ''}</p>}
                </div>
                <p className="text-[9.5px] text-slate-500">{edu.startYear}{edu.endYear ? `–${edu.endYear}` : ''}</p>
              </div>
            ))}
          </div>
        )}
        <div className="grid grid-cols-2 gap-6">
          {data.skills.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold text-green-800 uppercase tracking-wider border-b border-green-200 pb-1 mb-2">Core Competencies</h2>
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map(s => <span key={s.id} className="bg-green-50 text-green-800 text-[9px] px-2 py-0.5 rounded border border-green-200">{s.name}</span>)}
              </div>
            </div>
          )}
          {data.languages.length > 0 && (
            <div>
              <h2 className="text-[10px] font-bold text-green-800 uppercase tracking-wider border-b border-green-200 pb-1 mb-2">Languages</h2>
              {data.languages.map(l => <div key={l.id} className="flex justify-between text-[9.5px]"><span>{l.name}</span><span className="text-slate-500">{l.proficiency}</span></div>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MinimalTemplate({ data }: { data: ResumeData }) {
  const p = data.personalInfo;
  return (
    <div className="bg-white shadow-sm font-sans text-[10.5px] leading-relaxed px-10 py-8 min-h-[297mm]" style={{ fontFamily: 'Arial, sans-serif' }}>
      <h1 className="text-[22px] font-bold text-slate-900 mb-0.5">{p.fullName || 'Your Full Name'}</h1>
      {p.fatherName && <p className="text-[9.5px] text-slate-500 mb-1">S/O {p.fatherName}</p>}
      <div className="flex flex-wrap gap-3 text-[9.5px] text-slate-500 mb-1">
        {p.email && <span>{p.email}</span>}
        {p.phone && <span>{p.phone}</span>}
        {(p.city || p.province) && <span>{[p.city, p.province].filter(Boolean).join(', ')}</span>}
        {p.linkedin && <span>{p.linkedin}</span>}
      </div>
      {(p.cnic || p.dateOfBirth) && (
        <div className="flex gap-4 text-[9px] text-slate-400 mb-1">
          {p.cnic && <span>CNIC: {p.cnic}</span>}
          {p.dateOfBirth && <span>DOB: {p.dateOfBirth}</span>}
          {p.gender && <span>{p.gender}</span>}
        </div>
      )}
      <hr className="border-slate-800 border-t-2 mt-3 mb-4" />

      {data.summary && (
        <div className="mb-4">
          <p className="text-[10px] text-slate-700">{data.summary}</p>
        </div>
      )}

      {data.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-700 mb-2">Experience</h2>
          {data.experience.map(exp => (
            <div key={exp.id} className="mb-2.5">
              <div className="flex justify-between items-baseline">
                <span className="text-[10.5px] font-bold">{exp.position}</span>
                <span className="text-[9px] text-slate-500">{formatDate(exp.startDate)} – {exp.current ? 'Present' : formatDate(exp.endDate)}</span>
              </div>
              <p className="text-[10px] text-slate-600">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
              {exp.description && <p className="text-[9.5px] text-slate-600 mt-0.5 whitespace-pre-line">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      {data.education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-700 mb-2">Education</h2>
          {data.education.map(edu => (
            <div key={edu.id} className="flex justify-between mb-1.5">
              <div>
                <span className="text-[10.5px] font-bold">{edu.degree || edu.level}</span>
                <span className="text-[10px] text-slate-600"> — {edu.institution}</span>
                {(edu.percentage || edu.cgpa) && <span className="text-[9.5px] text-slate-400"> | {edu.percentage}{edu.cgpa ? ` CGPA ${edu.cgpa}` : ''}</span>}
              </div>
              <span className="text-[9.5px] text-slate-500">{edu.startYear}{edu.endYear ? `–${edu.endYear}` : ''}</span>
            </div>
          ))}
        </div>
      )}

      {data.skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-700 mb-1.5">Skills</h2>
          <p className="text-[10px] text-slate-600">{data.skills.map(s => s.name).join(', ')}</p>
        </div>
      )}

      {data.languages.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-700 mb-1.5">Languages</h2>
          <p className="text-[10px] text-slate-600">{data.languages.map(l => `${l.name} (${l.proficiency})`).join(' · ')}</p>
        </div>
      )}

      {data.references.length > 0 && (
        <div>
          <h2 className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-700 mb-2">References</h2>
          <div className="grid grid-cols-2 gap-3">
            {data.references.map(r => (
              <div key={r.id} className="text-[9.5px]">
                <p className="font-bold">{r.name}</p>
                <p className="text-slate-500">{r.position}, {r.company}</p>
                {r.phone && <p className="text-slate-400">{r.phone}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
