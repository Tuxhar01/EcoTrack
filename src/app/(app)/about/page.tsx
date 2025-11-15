import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, History } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="text-2xl font-semibold font-headline md:text-3xl">
          About EcoTrack
        </h1>
      </div>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-primary" />
            Our Mission
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Welcome to EcoTrack, your personal partner in building a more sustainable future. Our mission is to empower individuals to understand and reduce their carbon footprint through small, manageable steps. We believe that collective action, composed of individual efforts, can lead to a significant positive impact on our planet.
          </p>
          <p>
            EcoTrack provides intuitive tools to log your daily activities—from your commute to your meals—and calculates their carbon equivalent. But we don't just stop at tracking. Our AI-powered insights offer personalized suggestions to help you make more environmentally friendly choices that fit your lifestyle.
          </p>
          <p className="pt-4">
            Join us on this journey to make a difference. Small steps, big impact.
          </p>
        </CardContent>
      </Card>
      
      <Card className="max-w-4xl mx-auto mt-8 w-full">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <History className="h-6 w-6 text-primary" />
                Version History
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <h3 className="text-xl font-semibold text-foreground">Version 1.1</h3>
                <p className="text-sm text-muted-foreground mb-3">Released on 20 October 2025</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li><span className="font-semibold">Activity Logging:</span> Easily record your activities across various categories like travel, energy, food, and more.</li>
                    <li><span className="font-semibold">Carbon Calculation:</span> Get instant feedback on the carbon footprint of your activities based on scientific data.</li>
                    <li><span className="font-semibold">AI-Powered Insights:</span> Receive personalized suggestions from our AI Coach on how to reduce your emissions.</li>
                    <li><span className="font-semibold">Progress Tracking:</span> Visualize your carbon emissions over time with our interactive dashboard and charts.</li>
                    <li><span className="font-semibold">Gamification:</span> Stay motivated by earning badges and maintaining activity streaks.</li>
                </ul>
            </div>
        </CardContent>
      </Card>
    </main>
  );
}
