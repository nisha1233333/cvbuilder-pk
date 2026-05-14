'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import { FileText, Sparkles, Briefcase, Download, CircleCheck as CheckCircle2, Star, ArrowRight, Shield, Globe, Brain, PenLine, Hash, Award, Mail, Linkedin } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Pakistani CV Format',
    description: "CNIC field, Father's name, Province selector, Matric/FSc/Intermediate sections — built for Pakistan's job market.",
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Content',
    description: 'Generate professional summaries, cover letters, LinkedIn profiles, and more with advanced AI.',
    color: 'bg-green-50 text-green-600',
  },
  {
    icon: Shield,
    title: 'ATS Optimized',
    description: 'All templates are ATS-friendly. Beat applicant tracking systems used by top Pakistani companies.',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: Download,
    title: 'PDF Export',
    description: 'Download clean, print-ready PDFs. No watermarks on premium. Pixel-perfect formatting guaranteed.',
    color: 'bg-rose-50 text-rose-600',
  },
  {
    icon: Briefcase,
    title: 'Job Tracker',
    description: 'Track your applications, interview dates, and follow-ups in one organized dashboard.',
    color: 'bg-yellow-50 text-yellow-600',
  },
  {
    icon: Globe,
    title: 'Multiple Templates',
    description: 'Modern, ATS Professional, Executive, and Minimal — all optimized for Pakistani employers.',
    color: 'bg-teal-50 text-teal-600',
  },
];

const aiTools = [
  { icon: Brain, label: 'Summary Generator', desc: 'AI professional summary' },
  { icon: PenLine, label: 'Cover Letter AI', desc: 'Personalized cover letters' },
  { icon: Linkedin, label: 'LinkedIn Summary', desc: 'Profile optimization' },
  { icon: Mail, label: 'Email Writer', desc: 'Professional emails' },
  { icon: Hash, label: 'Hashtag Generator', desc: 'Social media boost' },
  { icon: Award, label: 'ATS Keywords', desc: 'Keyword suggestions' },
];

const testimonials = [
  {
    name: 'Ahmed Raza',
    title: 'Software Engineer, Lahore',
    avatar: 'A',
    text: 'Got my dream job at a top tech company in Lahore within 2 weeks. The ATS optimization is incredible!',
    stars: 5,
  },
  {
    name: 'Fatima Malik',
    title: 'Fresh Graduate, Karachi',
    avatar: 'F',
    text: 'As a fresh grad, I had no idea how to structure my CV. The AI summary generator helped me highlight my skills perfectly.',
    stars: 5,
  },
  {
    name: 'Hassan Ali',
    title: 'MBA Student, Islamabad',
    avatar: 'H',
    text: 'The Pakistani format with CNIC and Matric sections is exactly what local employers want. Finally a tool made for us!',
    stars: 5,
  },
];

const stats = [
  { value: '50,000+', label: 'CVs Created' },
  { value: '95%', label: 'ATS Pass Rate' },
  { value: '4.9/5', label: 'User Rating' },
  { value: '3x', label: 'Faster Hiring' },
];

const templates = [
  { name: 'Modern', tag: 'Most Popular', color: 'from-blue-600 to-blue-800' },
  { name: 'ATS Professional', tag: 'Best for MNCs', color: 'from-slate-600 to-slate-800' },
  { name: 'Executive', tag: 'For Seniors', color: 'from-green-600 to-green-800' },
  { name: 'Minimal', tag: 'Clean & Simple', color: 'from-gray-600 to-gray-800' },
];

const pricingPlans = [
  {
    name: 'Free',
    price: 'PKR 0',
    period: '/month',
    features: ['3 CV downloads/month', '2 AI tool uses/month', 'All templates', 'Job tracker (5 jobs)', 'Basic PDF export'],
    cta: 'Start Free',
    href: '/auth/signup',
    popular: false,
  },
  {
    name: 'Pro',
    price: 'PKR 799',
    period: '/month',
    features: ['Unlimited CV downloads', 'Unlimited AI tools', 'No watermarks', 'Unlimited job tracking', 'Priority support', 'ATS score checker', 'Resume import'],
    cta: 'Start Pro',
    href: '/auth/signup?plan=pro',
    popular: true,
  },
  {
    name: 'Premium',
    price: 'PKR 1,499',
    period: '/month',
    features: ['Everything in Pro', 'LinkedIn optimization', 'Interview prep AI', 'Custom domains', 'Team access (3 users)', 'WhatsApp support'],
    cta: 'Start Premium',
    href: '/auth/signup?plan=premium',
    popular: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 pt-24 pb-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600')] bg-cover bg-center opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-blue-700/90" />
        </div>
        <div className="absolute top-1/4 right-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-56 h-56 bg-blue-300/10 rounded-full blur-2xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6 text-sm text-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            Pakistan&apos;s #1 AI-Powered CV Builder
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Build a Professional CV
            <br />
            <span className="text-blue-300">Made for Pakistan</span>
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Create ATS-optimized CVs with Pakistani format — CNIC field, Matric/FSc sections, province selector, and AI-generated content. Get hired faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-8 h-12 shine text-base">
                Build My CV Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="#templates">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white font-medium px-8 h-12 text-base">
                View Templates
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-blue-200 text-sm">
            {['No credit card required', 'Free forever plan', '50,000+ CVs created'].map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-white py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-3">Why CVBuilder PK</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Everything You Need to Get Hired in Pakistan</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Built specifically for the Pakistani job market — because one size does not fit all.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-xl p-6 border border-border card-hover">
                <div className={`w-11 h-11 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Tools */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-3 bg-blue-50 text-blue-700">AI Toolkit</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                6 Powerful AI Tools
                <br />
                <span className="gradient-text">All in One Place</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                Generate professional content in seconds. No more staring at a blank screen.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {aiTools.map((t) => (
                  <div key={t.label} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-blue-200 hover:bg-blue-50 transition-colors">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <t.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.label}</p>
                      <p className="text-xs text-muted-foreground">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/ai-tools">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Try AI Tools Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <Brain className="w-5 h-5 text-blue-300" />
                  <span className="text-sm font-medium text-blue-200">AI Summary Generator</span>
                </div>
                <div className="bg-white/10 rounded-xl p-4 mb-4 text-sm leading-relaxed">
                  Results-driven Software Engineer with 3+ years of experience in full-stack development. Expertise in React, Node.js, and cloud technologies. Led development of 5 enterprise applications serving 100,000+ users.
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-200">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                  Generated in 3 seconds
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-xl border border-border p-4 shadow-lg">
                <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  ATS Score: 94/100
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-3">CV Templates</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">4 Professional Templates</h2>
            <p className="text-muted-foreground text-lg">All templates are ATS-optimized and tailored for the Pakistani job market.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {templates.map((t) => (
              <div key={t.name} className="group bg-white rounded-xl border border-border overflow-hidden card-hover">
                <div className={`h-48 bg-gradient-to-br ${t.color} flex items-center justify-center relative">
                  <div className="w-24 h-32 bg-white/20 rounded-lg backdrop-blur-sm flex flex-col gap-2 p-3">
                    <div className="w-12 h-2 bg-white/60 rounded" />
                    <div className="w-8 h-1.5 bg-white/40 rounded" />
                    <div className="mt-1 space-y-1">
                      {[1,2,3].map(i => <div key={i} className="w-full h-1 bg-white/30 rounded" />)}
                    </div>
                    <div className="mt-1 space-y-1">
                      {[1,2].map(i => <div key={i} className="w-full h-1 bg-white/20 rounded" />)}
                    </div>
                  </div>
                  <Badge className="absolute top-3 right-3 bg-white/20 border-white/30 text-white text-xs">{t.tag}</Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-sm mb-2">{t.name}</h3>
                  <Link href="/auth/signup">
                    <Button size="sm" variant="outline" className="w-full text-xs group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                      Use Template
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-3">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Trusted by Pakistani Job Seekers</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 stagger-children">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-slate-50 rounded-xl p-6 border border-border">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-sm">{t.avatar}</div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <Badge variant="secondary" className="mb-3">Pricing</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, Affordable Pricing</h2>
            <p className="text-muted-foreground text-lg">Starting at just PKR 799/month. Pay with JazzCash, EasyPaisa, or card.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto stagger-children">
            {pricingPlans.map((plan) => (
              <div key={plan.name} className={`bg-white rounded-xl border-2 p-6 flex flex-col relative ${plan.popular ? 'border-blue-600 shadow-lg shadow-blue-100' : 'border-border'}`}>
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4">Most Popular</Badge>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}>
                  <Button className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}`} variant={plan.popular ? 'default' : 'outline'}>
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-8">All prices in PKR. JazzCash &amp; EasyPaisa accepted.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-700 to-blue-900">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Land Your Dream Job?</h2>
          <p className="text-blue-200 text-lg mb-8">Join 50,000+ Pakistanis who built their CVs with us. It&apos;s free to start.</p>
          <Link href="/auth/signup">
            <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50 font-semibold px-10 h-12 shine text-base">
              Build Your CV Free
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-white font-bold">CVBuilder PK</span>
              </div>
              <p className="text-sm leading-relaxed">Pakistan&apos;s #1 AI-powered CV builder. Built for Pakistani job seekers.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-sm">
                {[['CV Builder', '/builder'], ['AI Tools', '/ai-tools'], ['Job Tracker', '/job-tracker'], ['Templates', '/#templates'], ['Pricing', '/#pricing']].map(([label, href]) => (
                  <li key={label}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Resources</h4>
              <ul className="space-y-2 text-sm">
                {[['Blog', '/blog'], ['CV Format Pakistan', '/blog/cv-format-pakistan-2025'], ['ATS CV Guide', '/blog/ats-cv-pakistan'], ['Fresh Graduate CV', '/blog/fresh-graduate-cv-pakistan']].map(([label, href]) => (
                  <li key={label}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-sm">
                {[['About', '/about'], ['Privacy Policy', '/privacy'], ['Terms of Service', '/terms'], ['Contact', '/contact']].map(([label, href]) => (
                  <li key={label}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm">
            <p>&copy; 2025 CVBuilder Pakistan. All rights reserved.</p>
            <p>Made with love in Pakistan</p>
          </div>
        </div>
      </footer>
    </div>
  );
}