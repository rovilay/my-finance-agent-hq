# Finance Agent HQ - Web Application

Modern Next.js web application for secure tax document management with AI-powered extraction.

## Features

- 🎨 **Modern Design System**: Professional color palette with Primary Blue, Secondary Green, and Accent Amber
- 🔒 **Secure by Design**: Integration with envelope-encrypted backend
- 🤖 **AI-Powered**: Connected to Gemini AI for intelligent document extraction
- 📱 **Responsive**: Mobile-first design with Tailwind CSS
- ⚡ **Fast**: Next.js 15 with App Router for optimal performance

## Design System

### Color Palette

- **Primary (Deep Blue)**: Trust & Professionalism - `#2563eb`
- **Secondary (Emerald Green)**: Growth & Success - `#10b981`
- **Accent (Amber)**: Important Actions - `#f59e0b`
- **Neutral (Slate)**: Text & Backgrounds

### Typography

- **Display Font**: Cal Sans (headings)
- **Sans Font**: Inter (body text)
- **Mono Font**: JetBrains Mono (code)

### Components

All UI components are built with:

- Consistent spacing and sizing
- Accessible color contrasts
- Smooth animations
- Responsive design

## Getting Started

### Prerequisites

```bash
# Install dependencies from workspace root
pnpm install
```

### Development

```bash
# Run development server
cd apps/web
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3333/graphql
```

## Project Structure

```
apps/web/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── page.tsx      # Home page
│   │   ├── dashboard/    # Dashboard
│   │   └── upload/       # Upload page
│   ├── components/       # React components
│   │   ├── ui/          # Reusable UI components
│   │   └── Logo.tsx     # Brand logo
│   ├── lib/             # Utilities and configs
│   │   ├── apollo-client.ts    # GraphQL client
│   │   ├── design-system.ts    # Design tokens
│   │   ├── utils.ts            # Helper functions
│   │   └── graphql/            # GraphQL queries/mutations
│   └── styles/          # Global styles
│       └── globals.css  # Tailwind + custom styles
├── public/              # Static assets
├── next.config.js       # Next.js configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## Key Pages

### Home (`/`)

- Hero section with value proposition
- Feature showcase
- How it works section
- Call-to-action

### Documents (`/document`)

- Document list with status
- Statistics overview
- Quick actions

### Upload (`/documents/upload`)

- Secure file upload interface
- Retention policy selection
- Real-time upload progress
- Success confirmation

## Reusable Components

### Buttons

```tsx
<Button variant="primary" size="md">
  Click me
</Button>
```

### Cards

```tsx
<Card hover>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>
```

### Inputs

```tsx
<Input label="Email" error="Invalid email" placeholder="you@example.com" />
```

### Badges

```tsx
<Badge variant="success">Verified</Badge>
```

## Backend Integration

The app connects to the GraphQL backend at `http://localhost:4000/graphql`:

- **Upload Document**: Sends encrypted file to backend
- **Verify & Finalize**: User confirmation workflow
- **Get Documents**: Fetch user's document list

## Build for Production

```bash
pnpm build
pnpm start
```

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Apollo Client (GraphQL)
- **Icons**: Lucide React
- **Utilities**: clsx for className management

## License

Private - Finance Agent HQ
