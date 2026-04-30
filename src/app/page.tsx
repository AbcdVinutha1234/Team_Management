
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, ShieldCheck, Target, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-8 py-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl">
            <Sparkles className="text-primary-foreground h-6 w-6" />
          </div>
          <span className="text-2xl font-bold font-headline tracking-tight text-primary">WorkLink</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="font-semibold">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button className="rounded-xl px-6 font-bold shadow-lg shadow-primary/20">Sign up free</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-8 text-center max-w-4xl mx-auto w-full py-20">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent-foreground font-semibold text-sm animate-bounce">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Task Management</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black font-headline tracking-tighter leading-tight text-slate-900">
            Link your team to <br />
            <span className="text-primary">peak productivity.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The all-in-one workspace for modern teams. Manage projects, assign tasks, and track progress with role-based clarity and AI assistance.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="h-16 px-10 rounded-2xl text-lg font-bold shadow-xl shadow-primary/30 group">
                Go to Dashboard <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-16 px-10 rounded-2xl text-lg font-bold border-2">
              Book a Demo
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-32">
          {[
            { 
              icon: Target, 
              title: "Project Lifecycle", 
              desc: "From kickoff to completion, manage every phase with ease." 
            },
            { 
              icon: Users, 
              title: "Role-Based Access", 
              desc: "Define permissions for Admins and Members precisely." 
            },
            { 
              icon: ShieldCheck, 
              title: "Secure & Stable", 
              desc: "Professional grade security for your team's sensitive data." 
            }
          ].map((feature, i) => (
            <div key={i} className="p-8 bg-white rounded-3xl shadow-sm border border-border/50 hover:shadow-md transition-shadow text-left space-y-4">
              <div className="bg-primary/5 p-3 rounded-2xl inline-block">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold font-headline">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-12 border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary h-5 w-5" />
            <span className="font-bold">WorkLink</span>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2024 WorkLink. All rights reserved. Built for efficiency.
          </div>
          <div className="flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
