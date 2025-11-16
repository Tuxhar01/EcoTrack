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
             <div className="pt-4">
                <h3 className="text-xl font-semibold text-foreground">Version 1.2 – Coming Soon</h3>
                <ul className="mt-4 space-y-4 text-muted-foreground">
                    <li>
                        <strong className="text-foreground">App Development (React Native)</strong>
                        <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                            <li>Add Text-to-Speech and Speech-to-Text features inside the chatbot.</li>
                            <li>Integrate ElevenLabs & Deepgram API for smooth, high-quality voice interactions.</li>
                        </ul>
                    </li>
                    <li>
                        <strong className="text-foreground">User Authentication</strong>
                        <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                            <li>Enable secure and fast Google Sign-In to make user onboarding simple.</li>
                        </ul>
                    </li>
                    <li>
                        <strong className="text-foreground">Agriculture-Focused Features</strong>
                        <ul className="list-disc list-inside pl-4 mt-2 space-y-2">
                            <li>
                                <strong>N₂O Emission Tracking:</strong>
                                <p className="pl-4">Track nitrous oxide emissions caused by fertilizers and pesticides. N₂O is almost 300× more harmful than CO₂, making it a major contributor to agricultural greenhouse gas emissions.</p>
                            </li>
                            <li>
                                <strong>Machinery Tracking:</strong>
                                <p className="pl-4">Monitor and log ploughing and irrigation hours to understand energy usage and field activity patterns.</p>
                            </li>
                             <li>
                                <strong className="text-foreground">Advanced System for Large-Scale Farmers</strong>
                                <ul className="list-disc list-inside pl-4 mt-2 space-y-2">
                                    <li>
                                        <strong>NDVI (Vegetation Health Monitoring):</strong>
                                        <p className="pl-4">NDVI is a satellite-based index that measures how healthy and green crops are. It helps detect crop stress early and monitor field health over time.</p>
                                    </li>
                                    <li>
                                        <strong>Soil Moisture Detection:</strong>
                                        <p className="pl-4">Detects how much water is present in the soil using IoT sensors or satellite data to avoid over-irrigation and protect crops from drought.</p>
                                    </li>
                                     <li>
                                        <strong>Biomass Estimation:</strong>
                                        <p className="pl-4">Estimate crop growth and predict yield using satellite data, drone images, or machine-learning models to track productivity.</p>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </CardContent>
      </Card>
    </main>
  );
}
