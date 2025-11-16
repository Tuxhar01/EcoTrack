'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';

interface UpgradeAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpgradeAccountDialog({ open, onOpenChange }: UpgradeAccountDialogProps) {
  const router = useRouter();

  const handleUpgrade = () => {
    router.push('/signup');
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Upgrade to a Full Account</AlertDialogTitle>
          <AlertDialogDescription>
            You've reached the 10-activity limit for guest users. Please sign up for a free account to log unlimited activities and unlock all features.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleUpgrade}>Sign Up</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
