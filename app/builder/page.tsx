'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase, defaultResumeData } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Clock, Eye, Trash2, Loader as Loader2, ArrowRight } from 'lucide-react';
import type { Resume } from '@/lib/supabase';

export default function BuilderListPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/auth/login'); return; }
      const { data } = await supabase.from('resumes').select('*').order('updated_at', { ascending: false });
      if (data) setResumes(data as Resume[]);
      setLoading(false);
    };
    load();
  }, [router]);

  const createNew = async () => {
    setCreating(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    const { data } = await supabase.from('resumes').insert({
      user_id: session.user.id,
      title: 'My CV',
      template: 'modern',
      data: defaultResumeData,
      language: 'en',
    }).select().single();
    if (data) router.push(`/builder/${data.id}`);
    setCreating(false);
  };

  const deleteResume = async (id: string) => {
    if (!confirm('Delete this CV?')) return;
    await supabase.from('resumes').delete().eq('id', id);
    setResumes(r => r.filter(x => x.id !== id));
  };

  const templateColors: Record<string, string> = {
    modern: 'from-blue-600 to-blue-800',
    ats: 'from-slate-600 to-slate-800',
    executive: 'from-green-600 to-green-800',
    minimal: 'from-gray-600 to-gray-800',
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">My CVs</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Build and manage your professional CVs</p>
        </div>
        <Button onClick={createNew} disabled={creating} className="bg-blue-600 hover:bg-blue-700 text-white shine">
          {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
          New CV
        </Button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1,2,3].map(i => <div key={i} className="h-56 bg-muted rounded-xl animate-pulse" />)}
        </div>
      ) : resumes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-border">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="font-semibold mb-2">No CVs yet</h3>
          <p className="text-sm text-muted-foreground mb-5">Create your first professional Pakistani CV</p>
          <Button onClick={createNew} disabled={creating} className="bg-blue-600 hover:bg-blue-700 text-white">
            {creating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            Build My First CV
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* New CV card */}
          <button
            onClick={createNew}
            disabled={creating}
            className="border-2 border-dashed border-blue-200 rounded-xl flex flex-col items-center justify-center gap-3 p-8 hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer h-56 group"
          >
            <div className="w-12 h-12 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center transition-colors">
              {creating ? <Loader2 className="w-6 h-6 text-blue-600 animate-spin" /> : <Plus className="w-6 h-6 text-blue-600" />}
            </div>
            <div className="text-center">
              <p className="font-medium text-blue-600 text-sm">New CV</p>
              <p className="text-xs text-muted-foreground">Start from scratch</p>
            </div>
          </button>

          {resumes.map((resume) => (
            <div key={resume.id} className="bg-white rounded-xl border border-border overflow-hidden card-hover group">
              {/* Preview */}
              <div className={`h-36 bg-gradient-to-br ${templateColors[resume.template] || templateColors.modern} p-4 flex items-center justify-center relative`}>
                <div className="w-20 h-28 bg-white/20 rounded-lg flex flex-col gap-1.5 p-2.5">
                  <div className="w-10 h-1.5 bg-white/60 rounded" />
                  <div className="w-7 h-1 bg-white/40 rounded" />
                  <div className="mt-1 space-y-0.5">
                    {[1,2,3].map(i => <div key={i} className="w-full h-0.5 bg-white/30 rounded" />)}
                  </div>
                </div>
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteResume(resume.id); }}
                    className="w-7 h-7 bg-white/20 hover:bg-red-500 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm truncate">{resume.title}</h3>
                  <Badge variant="secondary" className="text-xs capitalize flex-shrink-0">{resume.template}</Badge>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3">
                  <Clock className="w-3 h-3" />
                  {new Date(resume.updated_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
                <Link href={`/builder/${resume.id}`}>
                  <Button size="sm" className="w-full text-xs bg-blue-600 hover:bg-blue-700 text-white">
                    Edit CV
                    <ArrowRight className="w-3 h-3 ml-1.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
