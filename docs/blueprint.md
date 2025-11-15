# **App Name**: EcoTrack

## Core Features:

- User Authentication: Secure user sign-up, login, and profile management with session-based authentication stored in PostgreSQL.
- Activity Logging: Form-based input for activities (transport, electricity, diet, shopping) with client-side (React Hook Form + Zod) and server-side validation. Store carbon emissions and track via connect-pg-simple sessions and a Neon serverless PostgreSQL database.
- Carbon Footprint Calculation: Backend service calculating footprint per activity, aggregating emissions (daily, weekly, monthly) per user, with emission factors configurable in the database via REST endpoint
- Analytics Dashboard: React dashboard visualizing emissions (daily, weekly, monthly) and breakdowns by category using simple charts and TanStack Query (React Query) for data fetching.
- Action Suggestions: AI-assisted recommendations for users on how to reduce their footprint (e.g., public transport, LED bulbs).  The reasoning process will be performed using a Gemini tool.
- FAQ Chatbot: AI chatbot (Gemini API) that answers carbon-emission and EcoTrack-related questions and will give helpful activity logging. Uses a backend Node/Express route to filter user messages.
- Gamification: Gamification layer: implement badges and reduction streaks and store that information in a database using REST endpoints.

## Style Guidelines:

- Primary color: Forest green (#388E3C) to reflect nature and sustainability.
- Background color: Light beige (#F5F5DC), providing a neutral and calming backdrop.
- Accent color: Burnt orange (#D35400) to highlight key actions and information.
- Body and headline font: 'PT Sans' (sans-serif) for a modern and readable feel.
- Use clean and minimalist icons representing various activities (transport, energy, diet).
- Responsive, mobile-first design with a clear separation between sections (dashboard, activity log, chatbot).
- Subtle transitions and animations on data updates and user interactions.