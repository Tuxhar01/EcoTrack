
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth, useUser } from '@/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, linkWithPopup, signInWithPopup } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { ChromeIcon, Leaf, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleEmailSignIn = async (values: LoginFormValues) => {
    if (!auth) return;
    setIsLoading(true);

    try {
        if (user && user.isAnonymous) {
            const credential = EmailAuthProvider.credential(values.email, values.password);
            // This will fail if the email is already in use, which is handled in catch.
            // A more robust solution might check first, but for this app, we link or fail.
            await linkWithCredential(user, credential);
        } else {
            await signInWithEmailAndPassword(auth, values.email, values.password);
        }
        toast({ title: 'Success', description: 'Logged in successfully!' });
        router.push('/dashboard');
    } catch (error: any) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: error.message || 'An unknown error occurred.',
        });
    } finally {
        setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    try {
        if (user && user.isAnonymous) {
            await linkWithPopup(user, provider);
        } else {
            await signInWithPopup(auth, provider);
        }
        toast({ title: 'Success', description: 'Logged in successfully!' });
        router.push('/dashboard');
    } catch (error: any) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Google Sign-In Failed',
            description: error.message || 'An unknown error occurred.',
        });
    } finally {
        setIsLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center mb-4">
              <Leaf className="h-8 w-8 text-primary" />
            </div>
          <CardTitle className="text-2xl font-headline">Login to EcoTrack</CardTitle>
          <CardDescription>Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleEmailSignIn)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Login
              </Button>
            </form>
          </Form>
          <Separator className="my-6" />
           <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
            <ChromeIcon className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>

          <div className="mt-6 text-center text-sm">
            Don't have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

