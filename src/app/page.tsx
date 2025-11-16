
'use client';

import { useState, useEffect } from 'react';
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
import { Star, Leaf, LogIn, Footprints, Lightbulb, BarChart } from 'lucide-react';
import { mockReviews } from '@/lib/data';
import { Review } from '@/lib/types';
import Autoplay from 'embla-carousel-autoplay';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider, SidebarTrigger, SidebarInset, useSidebar } from '@/components/ui/sidebar';
import { useUser } from '@/firebase';
import Image from 'next/image';
import { AppFooter } from '@/components/footer';

const mottos = [
  'Small steps, big impact.',
  'Your journey to a greener planet starts here.',
  'Track, understand, and reduce your footprint.',
];

const animatedImages = [
  { src: 'https://picsum.photos/seed/nature1/1920/1080', hint: 'lush forest' },
  { src: 'https://picsum.photos/seed/nature2/1920/1080', hint: 'mountain sunrise' },
  { src: 'https://picsum.photos/seed/nature3/1920/1080', hint: 'clean energy' },
];

function HomePageContent() {
  const [currentMottoIndex, setCurrentMottoIndex] = useState(0);
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    const mottoInterval = setInterval(() => {
      setCurrentMottoIndex((prevIndex) => (prevIndex + 1) % mottos.length);
    }, 4000);

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
    <div className="flex flex-col min-h-screen bg-background">
       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex items-center">
            <SidebarTrigger className="mr-2" />
            <Link href="/" className="flex items-center gap-2 text-lg font-bold font-headline">
              <Leaf className="h-6 w-6 text-primary" />
              EcoTrack
            </Link>
          </div>
           <div className="w-full flex-1 flex justify-end">
              {!isUserLoading && user?.isAnonymous && (
                  <Button asChild variant="outline" size="sm">
                      <Link href="/login">
                          <LogIn className="mr-2 h-4 w-4" />
                          Login / Sign Up
                      </Link>
                  </Button>
              )}
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-[70vh] flex items-center justify-center text-center text-white">
          <Carousel
            className="absolute inset-0 w-full h-full"
            plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
            opts={{ loop: true }}
          >
            <CarouselContent>
              {animatedImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="w-full h-[70vh] relative">
                    <Image
                      src={image.src}
                      alt={`Background image ${index + 1}`}
                      fill
                      className="object-cover"
                      data-ai-hint={image.hint}
                      priority={index === 0}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/30" />
          <div className="relative z-10 p-4 flex flex-col items-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl font-headline animate-fade-in-down">
              EcoTrack
            </h1>
            <div className="mt-4 text-lg text-gray-200 h-6">
                <p className="transition-opacity duration-1000 ease-in-out">
                    {mottos[currentMottoIndex]}
                </p>
            </div>
            <Button asChild size="lg" className="mt-8 animate-fade-in-up">
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container py-16 md:py-24">
          <h2 className="text-3xl font-bold text-center mb-12 font-headline">
            Take Control of Your Carbon Footprint
          </h2>
          <div className="grid gap-8 auto-rows-fr grid-cols-1 md:grid-cols-3">
            <Card className="hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center p-6">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Footprints className="h-8 w-8 text-primary" />
              </div>
              <CardHeader className="p-0">
                <CardTitle>Log Activities</CardTitle>
              </CardHeader>
              <CardContent className="p-0 mt-2 flex-grow">
                <p className="text-muted-foreground">
                  Easily track your daily travel, food, and energy consumption.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center p-6">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <BarChart className="h-8 w-8 text-primary" />
              </div>
              <CardHeader className="p-0">
                <CardTitle>Visualize Your Impact</CardTitle>
              </CardHeader>
              <CardContent className="p-0 mt-2 flex-grow">
                <p className="text-muted-foreground">
                  Interactive charts show your emission trends over time.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-xl transition-shadow duration-300 flex flex-col items-center text-center p-6">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                <Lightbulb className="h-8 w-8 text-primary" />
              </div>
              <CardHeader className="p-0">
                <CardTitle>Get AI Insights</CardTitle>
              </CardHeader>
              <CardContent className="p-0 mt-2 flex-grow">
                <p className="text-muted-foreground">
                  Receive smart, personalized tips to reduce your footprint.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {/* Quote Section */}
        <section className="bg-muted py-16 md:py-24">
            <div className="container">
                <Card className="max-w-4xl mx-auto border-l-4 border-primary bg-background">
                    <CardContent className="p-8">
                        <blockquote className="text-xl italic text-foreground relative">
                            <span className="absolute -top-4 -left-4 text-6xl text-primary/20 font-serif">“</span>
                            The greatest threat to our planet is the belief that someone else will save it.
                        </blockquote>
                        <p className="mt-4 font-semibold text-muted-foreground text-right">- Robert Swan</p>
                    </CardContent>
                </Card>
            </div>
        </section>


        {/* Reviews Section */}
        <section id="reviews" className="container py-16 md:py-24">
          <h2 className="text-3xl font-bold text-center mb-12 font-headline">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <Card key={review.id} className="flex flex-col bg-background/50">
                <CardContent className="pt-6 flex-1 flex flex-col">
                  <p className="text-muted-foreground text-sm flex-grow">
                    "{review.comment}"
                  </p>
                   <div className="flex items-center mt-6">
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

      <AppFooter />
    </div>
  );
}

export default function HomePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
         <HomePageContent />
      </SidebarInset>
    </SidebarProvider>
  )
}
