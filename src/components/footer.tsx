import React from 'react';
import { Leaf } from 'lucide-react';

export function AppFooter() {
  return (
    <footer className="mt-auto border-t bg-background py-4">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground md:px-8">
        <p className="font-bold">&copy; {new Date().getFullYear()} EcoTrack. All rights reserved.</p>
        <p className="mt-1 flex items-center justify-center gap-1 font-bold">
          Sustainably Developed By T.E.
          <Leaf className="h-4 w-4 text-primary" />
        </p>
      </div>
    </footer>
  );
}
