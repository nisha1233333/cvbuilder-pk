import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data } = await supabase.from('blog_posts').select('title, meta_description').eq('slug', params.slug).maybeSingle();
  if (!data) return { title: 'Article Not Found' };
  return {
    title: data.title,
    description: data.meta_description,
  };
}

function renderMarkdown(content: string) {
  const lines = content.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mt-6 mb-3">{line.slice(2)}</h1>;
    if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-5 mb-2 text-blue-800">{line.slice(3)}</h2>;
    if (line.startsWith('### ')) return <h3 key={i} className="text-base font-bold mt-4 mb-1.5">{line.slice(4)}</h3>;
    if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc text-slate-700">{line.slice(2)}</li>;
    if (line.match(/^\d+\. /)) return <li key={i} className="ml-4 list-decimal text-slate-700">{line.replace(/^\d+\. /, '')}</li>;
    if (line.trim() === '') return <br key={i} />;
    return <p key={i} className="text-slate-700 leading-relaxed">{line}</p>;
  });
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', params.slug)
    .eq('published', true)
    .maybeSingle();

  if (!post) notFound();

  const { data: relatedPosts } = await supabase
    .from('blog_posts')
    .select('id, slug, title, read_time_minutes, category')
    .eq('published', true)
    .neq('slug', params.slug)
    .limit(3);

  const categoryColors: Record<string, string> = {
    'cv-tips': 'bg-blue-100 text-blue-700',
    'ats': 'bg-green-100 text-green-700',
    'templates': 'bg-orange-100 text-orange-700',
    'general': 'bg-slate-100 text-slate-700',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Back */}
        <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Article */}
        <article className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="h-40 bg-gradient-to-br from-blue-600 to-blue-800 flex items-end p-6">
            {post.category && (
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${categoryColors[post.category] || categoryColors.general}`}>
                {post.category.replace('-', ' ').toUpperCase()}
              </span>
            )}
          </div>
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.read_time_minutes} min read
              </span>
              <span>By {post.author_name || 'CVBuilder Pakistan Team'}</span>
              {post.created_at && (
                <span>{new Date(post.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              )}
            </div>

            <div className="prose-custom text-sm space-y-1">
              {renderMarkdown(post.content)}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                ))}
              </div>
            )}

            {/* CTA */}
            <div className="mt-8 pt-6 border-t border-border bg-blue-50 rounded-xl p-5">
              <h3 className="font-semibold mb-1">Ready to build your professional CV?</h3>
              <p className="text-sm text-muted-foreground mb-3">Use CVBuilder Pakistan to create an ATS-optimized CV in minutes.</p>
              <Link href="/auth/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                  Build Your CV Free
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </article>

        {/* Related posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="mt-8">
            <h2 className="font-semibold mb-4">Related Articles</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedPosts.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`}>
                  <div className="bg-white rounded-xl border border-border p-4 card-hover">
                    <h3 className="text-sm font-medium leading-snug mb-2">{p.title}</h3>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {p.read_time_minutes} min read
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
