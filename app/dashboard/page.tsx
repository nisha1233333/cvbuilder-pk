'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Sparkles, Briefcase, ArrowRight, Clock, Crown, TrendingUp, CircleCheck as CheckCircle2, Calendar } from 'lucide-react';
import type { Resume, JobApplication } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export default function DashboardPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setUser(session.user);

      const [resumesRes, jobsRes] = await Promise.all([
        supabase.from('resumes').select('*').order('updated_at', { ascending: false }).limit(5),
        supabase.from('job_applications').select('*').order('created_at', { ascending: false }).limit(5),
      ]);

      if (resumesRes.data) setResumes(resumesRes.data as Resume[]);
      if (jobsRes.data) setJobs(jobsRes.data as JobApplication[]);
      setLoading(false);
    };
    init();
  }, []);

  const statusColors: Record<string, string> = {
    saved: 'bg-slate-100 text-slate-700',
    applied: 'bg-blue-100 text-blue-700',
    interview: 'bg-yellow-100 text-yellow-700',
    offer: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    withdrawn: 'bg-gray-100 text-gray-600',
  };

  const stats = [
    { label: 'CVs Created', value: resumes.length, icon: FileText, color: 'bg-blue-50 text-blue-600' },
    { label: 'Jobs Tracked', value: jobs.length, icon: Briefcase, color: 'bg-green-50 text-green-600' },
    { label: 'Interviews', value: jobs.filter(j => j.status === 'interview').length, icon: Calendar, color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Offers', value: jobs.filter(j => j.status === 'offer').length, icon: CheckCircle2, color: 'bg-teal-50 text-teal-600' },
  ];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {greeting()}, {user?.user_metadata?.full_name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-muted-foreground mt-0.5">Here&apos;s an overview of your career progress.</p>
        </div>
        <Link href="/builder">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white shine">
            <Plus className="w-4 h-4 mr-2" />
            New CV
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-border p-4">
            <div className={`w-9 h-9 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-4.5 h-4.5" />
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { href: '/builder', icon: FileText, label: 'Build New CV', desc: 'Pakistani format with AI', color: 'bg-blue-600', textColor: 'text-white' },
          { href: '/ai-tools', icon: Sparkles, label: 'AI Tools', desc: 'Generate content with AI', color: 'bg-white', textColor: 'text-foreground' },
          { href: '/job-tracker', icon: Briefcase, label: 'Track Jobs', desc: 'Add a new application', color: 'bg-white', textColor: 'text-foreground' },
        ].map((a) => (
          <Link key={a.href} href={a.href}>
            <div className={`${a.color} rounded-xl border border-border p-5 flex items-center gap-4 card-hover cursor-pointer`}>
              <div className={`w-10 h-10 rounded-xl ${a.color === 'bg-blue-600' ? 'bg-white/20' : 'bg-blue-50'} flex items-center justify-center flex-shrink-0`}>
                <a.icon className={`w-5 h-5 ${a.color === 'bg-blue-600' ? 'text-white' : 'text-blue-600'}`} />
              </div>
              <div>
                <p className={`font-semibold text-sm ${a.textColor}`}>{a.label}</p>
                <p className={`text-xs ${a.color === 'bg-blue-600' ? 'text-blue-200' : 'text-muted-foreground'}`}>{a.desc}</p>
              </div>
              <ArrowRight className={`w-4 h-4 ml-auto ${a.color === 'bg-blue-600' ? 'text-blue-200' : 'text-muted-foreground'}`} />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent CVs */}
        <div className="bg-white rounded-xl border border-border">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-sm">Recent CVs</h2>
            <Link href="/builder" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />)}
            </div>
          ) : resumes.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-sm text-muted-foreground mb-3">No CVs yet</p>
              <Link href="/builder">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  Build your first CV
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {resumes.map((resume) => (
                <div key={resume.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-accent/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{resume.title}</p>
                      <p className="text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {new Date(resume.updated_at).toLocaleDateString('en-PK')}
                      </p>
                    </div>
                  </div>
                  <Link href={`/builder/${resume.id}`}>
                    <Button size="sm" variant="ghost" className="text-xs h-7">Edit</Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Job Applications */}
        <div className="bg-white rounded-xl border border-border">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-sm">Job Applications</h2>
            <Link href="/job-tracker" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />)}
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-8 text-center">
              <Briefcase className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-sm text-muted-foreground mb-3">No job applications tracked</p>
              <Link href="/job-tracker">
                <Button size="sm" variant="outline">
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  Add Application
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {jobs.slice(0, 5).map((job) => (
                <div key={job.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-accent/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{job.job_title}</p>
                      <p className="text-xs text-muted-foreground truncate">{job.company_name}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize flex-shrink-0 ml-2 ${statusColors[job.status] || statusColors.saved}`}>
                    {job.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upgrade Banner */}
      <div className="mt-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Crown className="w-5 h-5 text-yellow-300" />
          </div>
          <div>
            <p className="font-semibold">Upgrade to Pro</p>
            <p className="text-blue-200 text-sm">Unlimited CVs, no watermarks, unlimited AI tools — PKR 799/month</p>
          </div>
        </div>
        <Link href="/dashboard/billing">
          <Button size="sm" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold flex-shrink-0 shine">
            Upgrade Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
