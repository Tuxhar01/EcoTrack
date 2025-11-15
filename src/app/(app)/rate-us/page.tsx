'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockReviews } from '@/lib/data';
import type { Review } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function RateUsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || rating === 0 || !comment) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill out all fields to submit your review.',
      });
      return;
    }

    const newReview: Review = {
      id: (mockReviews.length + 1 + Date.now()).toString(),
      name,
      rating,
      comment,
      avatarUrl: `https://picsum.photos/seed/${name}/100/100`,
    };

    // In a real app, you'd send this to a backend.
    // Here we'll use localStorage to persist it across the session.
    try {
        const existingReviews = JSON.parse(localStorage.getItem('ecotrack-reviews') || JSON.stringify(mockReviews));
        const updatedReviews = [newReview, ...existingReviews];
        localStorage.setItem('ecotrack-reviews', JSON.stringify(updatedReviews));
        
        // This makes other tabs aware of the change
        window.dispatchEvent(new Event('storage'));

    } catch (error) {
        console.error("Could not save review to local storage", error);
    }


    toast({
      title: 'Review Submitted!',
      description: 'Thank you for your feedback.',
    });

    router.push('/');
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center p-4 md:p-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Share Your Feedback</CardTitle>
          <CardDescription>
            We'd love to hear what you think about EcoTrack.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tushar"
              />
            </div>
            <div className="space-y-2">
              <Label>Your Rating</Label>
              <div
                className="flex items-center space-x-1"
                onMouseLeave={() => setHoverRating(0)}
              >
                {[...Array(5)].map((_, index) => {
                  const starValue = index + 1;
                  return (
                    <Star
                      key={starValue}
                      className={cn(
                        'h-8 w-8 cursor-pointer',
                        starValue <= (hoverRating || rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-gray-300'
                      )}
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoverRating(starValue)}
                    />
                  );
                })}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Your Review</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="It's been a great experience..."
                rows={5}
              />
            </div>
            <Button type="submit" className="w-full">
              Submit Review
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
