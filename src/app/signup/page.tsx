
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Sparkles, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function SignupPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) return;
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

      const userData = {
        id: user.uid,
        name,
        firstName: name.split(' ')[0] || name,
        lastName: name.split(' ').slice(1).join(' ') || '',
        email,
        role: 'Member',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Create user profile in Firestore
      setDoc(doc(db, 'users', user.uid), userData)
        .catch(async (error) => {
          const permissionError = new FirestorePermissionError({
            path: `users/${user.uid}`,
            operation: 'create',
            requestResourceData: userData,
          });
          errorEmitter.emit('permission-error', permissionError);
        });

      toast({
        title: "Account created",
        description: "Welcome to WorkLink! Your workspace is ready.",
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Could not create account.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-none shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="space-y-1 text-center pt-8">
          <div className="flex justify-center mb-4">
            <div className="bg-primary p-3 rounded-2xl shadow-lg shadow-primary/20">
              <Sparkles className="text-primary-foreground h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold font-headline tracking-tight text-primary">Join WorkLink</CardTitle>
          <CardDescription className="text-muted-foreground">
            Start collaborating with your team today
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                placeholder="Alex Rivera" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
                className="rounded-xl border-muted-foreground/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="alex@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="rounded-xl border-muted-foreground/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="rounded-xl border-muted-foreground/20"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pb-8">
            <Button type="submit" className="w-full rounded-xl h-12 font-bold text-lg group shadow-lg shadow-primary/20" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : (
                <>Get Started <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></>
              )}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-bold hover:underline">Sign in</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
