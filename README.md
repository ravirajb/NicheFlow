# NicheFlow CRM MVP

A modern, lightweight CRM solution specifically designed for independent creative consultants and micro-agencies.

## Features

- Simplified contact management
- Integrated project tracking
- Client communication hub
- Basic file management
- Simple time tracking & invoicing
- Minimalist client portal

## Tech Stack

- Frontend: Next.js with TypeScript
- UI: Material UI
- Backend: Supabase
- Authentication: Supabase Auth
- State Management: Zustand

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── lib/           # Utility functions and configurations
├── pages/         # Next.js pages
├── api/           # API routes
└── types/         # TypeScript interfaces
```

## Development

The application uses Supabase for backend services, including:
- Database
- Authentication
- Storage
- Real-time updates

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT
