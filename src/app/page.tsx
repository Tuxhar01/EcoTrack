
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Leaf, Star } from 'lucide-react';
import { mockReviews } from '@/lib/data';
import { Review } from '@/lib/types';
import Autoplay from 'embla-carousel-autoplay';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger, SidebarInset, useSidebar } from '@/components/ui/sidebar';

const mottos = [
  'Small steps, big impact.',
  'Your journey to a greener planet starts here.',
  'Track, understand, and reduce your footprint.',
];

const animatedImages = [
  'https://picsum.photos/seed/anim1/1200/600',
  'https://picsum.photos/seed/anim2/1200/600',
  'https://picsum.photos/seed/anim3/1200/600',
];

function HomePageContent() {
  const [currentMottoIndex, setCurrentMottoIndex] = useState(0);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    const mottoInterval = setInterval(() => {
      setCurrentMottoIndex((prevIndex) => (prevIndex + 1) % mottos.length);
    }, 3000);

    // This is a way to listen for new reviews from the rating page
    const handleStorageChange = () => {
      const newReviews = localStorage.getItem('ecotrack-reviews');
      if (newReviews) {
        setReviews(JSON.parse(newReviews));
      }
    };
    window.addEventListener('storage', handleStorageChange);

    handleStorageChange(); // check on initial load

    return () => {
      clearInterval(mottoInterval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <SidebarInset className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center">
            <SidebarTrigger className="mr-2" />
            <Link href="/" className="text-lg font-bold font-headline">
              EcoTrack
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-auto">
            <Link className="transition-colors hover:text-foreground/80 text-foreground/60" href="/login">Login</Link>
            <Button>Sign Up</Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-[60vh] flex items-center justify-center text-center">
          <Carousel
            className="absolute inset-0 w-full h-full"
            plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
            opts={{ loop: true }}
          >
            <CarouselContent>
              {animatedImages.map((src, index) => (
                <CarouselItem key={index}>
                  <div
                    className="w-full h-[60vh] bg-cover bg-center"
                    style={{ backgroundImage: `url(${src})` }}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 p-4">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl font-headline">
              EcoTrack
            </h1>
            <div className="mt-4 text-lg text-gray-300 h-6">
                <p className="transition-opacity duration-1000 ease-in-out">
                    {mottos[currentMottoIndex]}
                </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container py-12 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Visualize your carbon footprint at a glance.
                </p>
                <Button asChild className="w-full">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Log Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Track your daily activities to see their impact.
                </p>
                <Button asChild className="w-full">
                  <Link href="/activities">Go to Activities</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>More Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Explore insights, chat with our AI, and more.
                  </p>
                  <Button onClick={toggleSidebar} className="w-full">
                    View All
                  </Button>
                </CardContent>
              </Card>
          </div>
        </section>

        {/* Thought Card Section */}
        <section className="bg-muted py-12 md:py-20">
            <div className="container">
                <Card className="max-w-3xl mx-auto">
                    <CardContent className="p-6 text-center">
                        <blockquote className="text-xl italic text-foreground">
                            "The greatest threat to our planet is the belief that someone else will save it."
                        </blockquote>
                        <p className="mt-4 font-semibold text-muted-foreground">- Robert Swan, Author</p>
                    </CardContent>
                </Card>
            </div>
        </section>


        {/* Reviews Section */}
        <section id="reviews" className="container py-12 md:py-20">
          <h2 className="text-3xl font-bold text-center mb-10 font-headline">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <Card key={review.id} className="flex flex-col">
                <CardContent className="pt-6 flex-1">
                  <div className="flex items-center mb-4">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={review.avatarUrl} alt={review.name} />
                      <AvatarFallback>{review.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{review.name}</h3>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < review.rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    "{review.comment}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link href="/rate-us">Rate Us & Share Your Story</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="mt-auto border-t bg-background py-4">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground md:px-8">
            <p>&copy; {new Date().getFullYear()} EcoTrack. All rights reserved. v1.1</p>
            <p className="mt-1">
              Made with <span className="text-primary">♥</span> for a greener
              planet.
            </p>
          </div>
        </footer>
    </SidebarInset>
  );
}

export default function HomePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <HomePageContent />
    </SidebarProvider>
  )
}
