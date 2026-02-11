'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Lightning, Sparkle, Brain } from "@phosphor-icons/react";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-primary-main w-11 h-11 rounded-xl flex items-center justify-center shadow-lg shadow-primary-main/20">
            <Sparkle weight="fill" className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-neutral-900">PEPL <span className="text-primary-main">HRMS</span></span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost">About</Button>
          <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <Button className="rounded-xl px-8 bg-primary-main hover:bg-primary-dark transition-all shadow-lg shadow-primary-main/20 font-bold">
                Login
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard">
              <Button className="rounded-xl px-8 bg-primary-main hover:bg-primary-dark transition-all shadow-lg shadow-primary-main/20 font-bold">
                Dashboard
              </Button>
            </Link>
          </SignedIn>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-main/10 border border-primary-main/20 text-primary-main text-xs font-black uppercase tracking-widest mb-6 animate-fade-in">
              <Sparkle weight="fill" className="w-4 h-4" />
              <span>AI-Powered Workforce Intelligent System</span>
            </div>
            <h1 className="text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6">
              Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">People</span>, <br />
              Accelerating Growth.
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
              PEPL is a 10/10 HRMS designed for high-performance teams.
              Built with Gemini AI to predict attrition, automate payroll,
              and optimize incentives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <SignedOut>
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <Button size="lg" className="rounded-xl px-10 h-16 text-lg bg-primary-main shadow-xl shadow-primary-main/30 hover:translate-y-[-4px] active:scale-95 transition-all font-black">
                    Get Started <ArrowRight weight="bold" className="ml-2 w-6 h-6" />
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard">
                  <Button size="lg" className="rounded-xl px-10 h-16 text-lg bg-primary-main shadow-xl shadow-primary-main/30 hover:translate-y-[-4px] active:scale-95 transition-all font-black">
                    Go to Dashboard <ArrowRight weight="bold" className="ml-2 w-6 h-6" />
                  </Button>
                </Link>
              </SignedIn>
              <Button size="lg" variant="outline" className="rounded-xl px-10 h-16 text-lg border-2 border-neutral-200 hover:bg-neutral-50 font-bold">
                Book a Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-16 flex items-center gap-12 border-t border-border pt-8">
              <div>
                <div className="text-3xl font-bold">100%</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">Compliance</div>
              </div>
              <div className="border-l border-border pl-12">
                <div className="text-3xl font-bold">Gemini 2.0</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">AI Engine</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 bg-white p-4 rounded-[3rem] border-4 border-white shadow-2xl overflow-hidden animate-float">
              <div className="bg-neutral-900 rounded-[2.5rem] overflow-hidden aspect-[4/3] flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary-main/20 to-transparent" />
                <Brain weight="duotone" className="w-40 h-40 text-primary-main/40" />

                {/* Decorative elements */}
                <div className="absolute top-8 left-8 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 shadow-2xl">
                  <div className="w-16 h-2 rounded-full bg-primary-main mb-2" />
                  <div className="w-10 h-2 rounded-full bg-white/20" />
                </div>
                <div className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/20 shadow-2xl">
                  <div className="flex items-center gap-3">
                    <ShieldCheck weight="fill" className="w-6 h-6 text-accent-success" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">Verified</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 blur-[100px] z-0 rounded-full" />
          </div>
        </div>
      </main>

      {/* Features Preview */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Lightning weight="duotone" className="w-8 h-8 text-accent-warning" />}
            title="Intelligent Incentives"
            description="Automated multi-tier incentive calculations for sales teams."
          />
          <FeatureCard
            icon={<Brain weight="duotone" className="w-8 h-8 text-primary-main" />}
            title="AI Attrition Risk"
            description="Predict employee turnover using Gemini AI insights."
          />
          <FeatureCard
            icon={<ShieldCheck weight="duotone" className="w-8 h-8 text-accent-success" />}
            title="Audit-First Ready"
            description="Every action is logged with detailed audit trails and RLS."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white border-2 border-neutral-100 p-8 rounded-[2.5rem] hover:translate-y-[-8px] transition-all group cursor-default shadow-sm hover:shadow-2xl hover:shadow-primary-main/10">
      <div className="w-16 h-16 rounded-[1.5rem] bg-neutral-50 border-2 border-neutral-50 flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 group-hover:bg-white transition-all">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-neutral-900 mb-4 tracking-tighter">{title}</h3>
      <p className="text-neutral-500 font-medium leading-relaxed italic">{description}</p>
    </div>
  );
}
