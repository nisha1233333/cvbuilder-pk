'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader as Loader2, Save, User } from 'lucide-react';
import type { Profile } from '@/lib/supabase';

const provinces = ['Punjab', 'Sindh', 'KPK', 'Balochistan', 'Islamabad (ICT)', 'AJK', 'Gilgit-Baltistan'];

export default function ProfilePage() {
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
      if (data) setProfile(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    await supabase.from('profiles').upsert({ ...profile, id: session.user.id, updated_at: new Date().toISOString() });
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground text-sm">Update your personal information</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Full Name</Label>
            <Input value={profile.full_name || ''} onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))} placeholder="Ahmed Raza" />
          </div>
          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input value={profile.phone || ''} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="03XX-XXXXXXX" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>CNIC</Label>
          <Input value={profile.cnic || ''} onChange={e => setProfile(p => ({ ...p, cnic: e.target.value }))} placeholder="XXXXX-XXXXXXX-X" maxLength={15} />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>City</Label>
            <Input value={profile.city || ''} onChange={e => setProfile(p => ({ ...p, city: e.target.value }))} placeholder="Lahore" />
          </div>
          <div className="space-y-1.5">
            <Label>Province</Label>
            <Select value={profile.province || ''} onValueChange={v => setProfile(p => ({ ...p, province: v }))}>
              <SelectTrigger><SelectValue placeholder="Select province" /></SelectTrigger>
              <SelectContent>
                {provinces.map(prov => <SelectItem key={prov} value={prov}>{prov}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {success && (
          <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg border border-green-200">
            Profile saved successfully!
          </div>
        )}

        <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
