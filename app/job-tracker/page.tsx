'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Briefcase, Trash2, Loader as Loader2, ExternalLink, Calendar, MapPin, DollarSign, CreditCard as Edit3, X, Check, ChevronDown } from 'lucide-react';
import type { JobApplication } from '@/lib/supabase';

const statuses = [
  { value: 'saved', label: 'Saved', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  { value: 'applied', label: 'Applied', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'interview', label: 'Interview', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  { value: 'offer', label: 'Offer', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'withdrawn', label: 'Withdrawn', color: 'bg-gray-100 text-gray-600 border-gray-200' },
];

const emptyForm = { company_name: '', job_title: '', job_url: '', status: 'saved', applied_date: '', interview_date: '', salary_range: '', location: '', notes: '' };

export default function JobTrackerPage() {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/auth/login'); return; }
      const { data } = await supabase.from('job_applications').select('*').order('created_at', { ascending: false });
      if (data) setJobs(data as JobApplication[]);
      setLoading(false);
    };
    load();
  }, [router]);

  const handleSave = async () => {
    if (!form.company_name || !form.job_title) return;
    setSaving(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    if (editingId) {
      const { data } = await supabase.from('job_applications').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editingId).select().single();
      if (data) setJobs(j => j.map(x => x.id === editingId ? data as JobApplication : x));
    } else {
      const { data } = await supabase.from('job_applications').insert({ ...form, user_id: session.user.id }).select().single();
      if (data) setJobs(j => [data as JobApplication, ...j]);
    }
    setForm(emptyForm);
    setShowForm(false);
    setEditingId(null);
    setSaving(false);
  };

  const handleEdit = (job: JobApplication) => {
    setForm({
      company_name: job.company_name,
      job_title: job.job_title,
      job_url: job.job_url || '',
      status: job.status,
      applied_date: job.applied_date || '',
      interview_date: job.interview_date ? job.interview_date.slice(0, 16) : '',
      salary_range: job.salary_range || '',
      location: job.location || '',
      notes: job.notes || '',
    });
    setEditingId(job.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this job application?')) return;
    await supabase.from('job_applications').delete().eq('id', id);
    setJobs(j => j.filter(x => x.id !== id));
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('job_applications').update({ status }).eq('id', id);
    setJobs(j => j.map(x => x.id === id ? { ...x, status: status as any } : x));
  };

  const filtered = filter === 'all' ? jobs : jobs.filter(j => j.status === filter);

  const statusObj = (s: string) => statuses.find(x => x.value === s) || statuses[0];

  const stats = statuses.map(s => ({ ...s, count: jobs.filter(j => j.status === s.value).length }));

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="w-5 h-5 text-blue-600" />
              <h1 className="text-2xl font-bold">Job Tracker</h1>
            </div>
            <p className="text-muted-foreground text-sm">Track your job applications and interviews</p>
          </div>
          <Button onClick={() => { setForm(emptyForm); setEditingId(null); setShowForm(true); }} className="bg-blue-600 hover:bg-blue-700 text-white shine">
            <Plus className="w-4 h-4 mr-2" />
            Add Application
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
          {stats.map(s => (
            <button
              key={s.value}
              onClick={() => setFilter(filter === s.value ? 'all' : s.value)}
              className={`bg-white rounded-xl border p-3 text-center transition-all card-hover ${filter === s.value ? 'ring-2 ring-blue-500 border-blue-300' : 'border-border'}`}
            >
              <p className="text-xl font-bold text-foreground">{s.count}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </button>
          ))}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl border border-border p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">{editingId ? 'Edit Application' : 'New Application'}</h2>
              <button onClick={() => { setShowForm(false); setEditingId(null); }} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label className="text-xs mb-1 block">Company Name *</Label><Input value={form.company_name} onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))} placeholder="Telenor Pakistan" /></div>
              <div><Label className="text-xs mb-1 block">Job Title *</Label><Input value={form.job_title} onChange={e => setForm(f => ({ ...f, job_title: e.target.value }))} placeholder="Software Engineer" /></div>
              <div><Label className="text-xs mb-1 block">Job URL</Label><Input value={form.job_url} onChange={e => setForm(f => ({ ...f, job_url: e.target.value }))} placeholder="https://linkedin.com/jobs/..." /></div>
              <div>
                <Label className="text-xs mb-1 block">Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {statuses.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label className="text-xs mb-1 block">Applied Date</Label><Input type="date" value={form.applied_date} onChange={e => setForm(f => ({ ...f, applied_date: e.target.value }))} /></div>
              <div><Label className="text-xs mb-1 block">Interview Date & Time</Label><Input type="datetime-local" value={form.interview_date} onChange={e => setForm(f => ({ ...f, interview_date: e.target.value }))} /></div>
              <div><Label className="text-xs mb-1 block">Salary Range</Label><Input value={form.salary_range} onChange={e => setForm(f => ({ ...f, salary_range: e.target.value }))} placeholder="PKR 100K-150K / month" /></div>
              <div><Label className="text-xs mb-1 block">Location</Label><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Lahore, Pakistan" /></div>
              <div className="sm:col-span-2"><Label className="text-xs mb-1 block">Notes</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Interview tips, contact person, follow-up reminders..." className="min-h-[70px]" /></div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
                {editingId ? 'Update' : 'Save Application'}
              </Button>
              <Button variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</Button>
            </div>
          </div>
        )}

        {/* Job list */}
        {loading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-20 bg-white rounded-xl border border-border animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-border p-12 text-center">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
            <p className="text-muted-foreground mb-4">{filter === 'all' ? 'No job applications yet' : `No ${filter} applications`}</p>
            <Button onClick={() => { setForm(emptyForm); setShowForm(true); }} size="sm" variant="outline">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Add Application
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(job => {
              const s = statusObj(job.status);
              return (
                <div key={job.id} className="bg-white rounded-xl border border-border p-4 sm:p-5 hover:shadow-sm transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold">{job.job_title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${s.color}`}>{s.label}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{job.company_name}</p>
                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                        {job.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>}
                        {job.applied_date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Applied {new Date(job.applied_date).toLocaleDateString('en-PK')}</span>}
                        {job.interview_date && <span className="flex items-center gap-1 text-yellow-600"><Calendar className="w-3 h-3" />Interview {new Date(job.interview_date).toLocaleDateString('en-PK')}</span>}
                        {job.salary_range && <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{job.salary_range}</span>}
                      </div>
                      {job.notes && <p className="text-xs text-muted-foreground mt-2 bg-slate-50 rounded p-2 border border-border">{job.notes}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Select value={job.status} onValueChange={(v) => updateStatus(job.id, v)}>
                        <SelectTrigger className="h-7 text-xs w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map(s => <SelectItem key={s.value} value={s.value} className="text-xs">{s.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {job.job_url && (
                        <a href={job.job_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button onClick={() => handleEdit(job)} className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(job.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
