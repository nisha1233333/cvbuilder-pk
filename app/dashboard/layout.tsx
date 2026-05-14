'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  FileText, LayoutDashboard, Briefcase, Sparkles, Settings,
  LogOut, Crown, ChevronLeft, ChevronRight, User, Menu, X,
  BookOpen,
} from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/builder', label: 'CV Builder', icon: FileText },
  { href: '/ai-tools', label: 'AI Tools', icon: Sparkles },
  { href: '/job-tracker', label: 'Job Tracker', icon: Briefcase },
  { href: '/blog', label: 'Blog', icon: BookOpen },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/billing', label: 'Upgrade', icon: Crown },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/auth/login');
        return;
      }
      setUser(session.user);
    });
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-2 px-4 py-4 border-b border-border ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-base text-foreground">
            CV<span className="text-blue-600">Builder</span>
            <span className="text-xs ml-1 text-blue-400 font-normal">PK</span>
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-blue-600' : ''}`} />
              {!collapsed && item.label}
              {!collapsed && item.label === 'Upgrade' && (
                <span className="ml-auto text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full font-medium">Pro</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User & Sign out */}
      <div className="border-t border-border px-2 py-3">
        {user && !collapsed && (
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-accent/50 mb-2">
            <Avatar className="w-7 h-7">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
                {(user.user_metadata?.full_name || user.email || '?')[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{user.user_metadata?.full_name || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col bg-white border-r border-border transition-all duration-200 ${collapsed ? 'w-16' : 'w-60'} flex-shrink-0 relative`}>
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 bg-white border border-border rounded-full flex items-center justify-center shadow-sm hover:bg-accent transition-colors z-10"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-60 bg-white border-r border-border z-10">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="lg:hidden bg-white border-b border-border px-4 py-3 flex items-center justify-between">
          <button onClick={() => setMobileOpen(true)} className="p-1.5 rounded-md hover:bg-accent">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-sm">CVBuilder PK</span>
          </div>
          <Avatar className="w-7 h-7">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
              {(user?.user_metadata?.full_name || user?.email || '?')[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
