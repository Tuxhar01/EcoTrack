import React from 'react';

export function AppFooter() {
  return (
    <footer className="mt-auto border-t bg-background py-4">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground md:px-8">
        <p>&copy; {new Date().getFullYear()} EcoTrack. All rights reserved.</p>
        <p className="mt-1">Sustainably Developed By T.E.</p>
      </div>
    </footer>
  );
}
