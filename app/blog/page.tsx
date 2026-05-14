import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - CV Tips & Career Advice for Pakistan',
  description: 'Expert CV tips, career advice, and job search strategies for Pakistani professionals. Free guides on CV format, ATS optimization, and more.',
};

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  const categoryColors: Record<string, string> = {
    'cv-tips': 'bg-blue-100 text-blue-700',
    'ats': 'bg-green-100 text-green-700',
    'templates': 'bg-orange-100 text-orange-700',
    'general': 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 rounded-full px-4 py-1.5 mb-4 text-sm font-medium">
            <BookOpen className="w-4 h-4" />
            Career Resources
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">CV Tips & Career Advice</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Expert guides for Pakistani job seekers — CV format, ATS tips, and career strategies.
          </p>
        </div>

        {/* Featured post */}
        {posts && posts.length > 0 && (
          <Link href={`/blog/${posts[0].slug}`} className="block mb-8">
            <div className="bg-white rounded-2xl border border-border overflow-hidden card-hover">
              <div className="h-48 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                <div className="text-white text-center px-6">
                  <p className="text-blue-200 text-sm mb-2">Featured Article</p>
                  <h2 className="text-xl sm:text-2xl font-bold">{posts[0].title}</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {posts[0].category && (
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${categoryColors[posts[0].category] || categoryColors.general}`}>
                      {posts[0].category.replace('-', ' ').toUpperCase()}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground text-sm mb-3 leading-relaxed">{posts[0].excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {posts[0].read_time_minutes} min read
                    </span>
                    <span>By {posts[0].author_name}</span>
                  </div>
                  <span className="text-blue-600 text-sm font-medium flex items-center gap-1">
                    Read article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* All posts grid */}
        {posts && posts.length > 1 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">All Articles</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {posts.slice(1).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article className="bg-white rounded-xl border border-border p-5 card-hover h-full">
                    {post.category && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${categoryColors[post.category] || categoryColors.general}`}>
                        {post.category.replace('-', ' ')}
                      </span>
                    )}
                    <h3 className="font-semibold mt-2 mb-2 text-sm leading-snug">{post.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />{post.read_time_minutes} min read
                      </span>
                      <span className="text-blue-600 text-xs font-medium flex items-center gap-1">
                        Read <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}

        {(!posts || posts.length === 0) && (
          <div className="text-center py-12 bg-white rounded-xl border border-border">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
            <p className="text-muted-foreground">No articles published yet.</p>
          </div>
        )}

        {/* SEO Links */}
        <div className="mt-12 bg-white rounded-xl border border-border p-6">
          <h2 className="font-semibold mb-4">Popular CV Guides for Pakistan</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              ['CV Format Pakistan 2025', '/blog/cv-format-pakistan-2025'],
              ['Fresh Graduate CV Template', '/blog/fresh-graduate-cv-pakistan'],
              ['ATS-Friendly CV Pakistan', '/blog/ats-cv-pakistan'],
              ['Teacher CV Format Pakistan', '/blog/teacher-cv-pakistan'],
            ].map(([label, href]) => (
              <Link key={href} href={href} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                <ArrowRight className="w-3.5 h-3.5" />{label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
