
'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAuth, useUser } from '@/firebase';
import { GoogleAuthProvider, signInWithPopup, signInAnonymously, linkWithCredential, EmailAuthProvider } from 'firebase/auth';
import { ChromeIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AuthPopup() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const [isSigningIn, setIsSigningIn] = useState(false);

  // The popup should only be open if the user is not logged in at all.
  // It should not appear for anonymous/guest users.
  const isOpen = !isUserLoading && !user;

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setIsSigningIn(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: 'Signed in!',
        description: 'You have successfully signed in with Google.',
      });
    } catch (error: any) {
      if (error.code === 'auth/operation-not-allowed') {
         toast({
          variant: 'destructive',
          title: 'Sign-in Failed',
          description: 'Google Sign-in is not enabled. Please enable it in your Firebase project settings.',
        });
      } else {
        console.error("Google sign-in error", error);
        toast({
          variant: 'destructive',
          title: 'Sign-in Failed',
          description: 'Could not sign in with Google. Please try again.',
        });
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGuestSignIn = async () => {
    if (!auth) return;
    setIsSigningIn(true);
    try {
      await signInAnonymously(auth);
       toast({
        title: 'Welcome, Guest!',
        description: 'You are browsing as a guest. Your data will be temporary.',
      });
    } catch (error: any) {
       if (error.code === 'auth/operation-not-allowed') {
         toast({
          variant: 'destructive',
          title: 'Sign-in Failed',
          description: 'Guest Sign-in is not enabled. Please enable it in your Firebase project settings.',
        });
       } else {
         console.error("Anonymous sign-in error", error);
         toast({
          variant: 'destructive',
          title: 'Sign-in Failed',
          description: 'Could not sign in as a guest. Please try again.',
        });
       }
    } finally {
      setIsSigningIn(false);
    }
  };


  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Welcome to EcoTrack</DialogTitle>
          <DialogDescription>
            Sign in to track your carbon footprint or continue as a guest.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button onClick={handleGoogleSignIn} disabled={isSigningIn}>
            <ChromeIcon className="mr-2 h-4 w-4" />
            {isSigningIn ? 'Signing in...' : 'Sign in with Google'}
          </Button>
          <Button variant="secondary" onClick={handleGuestSignIn} disabled={isSigningIn}>
            {isSigningIn ? '...' : 'Continue as Guest'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
