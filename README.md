# Birthday Perks Tracker

A web application to track and manage birthday perks and redemptions. Built with Next.js, Tailwind CSS, and Firebase.

## Features

- **Perks Management**: Add, edit, and delete birthday perks from various businesses
- **Categories**: Organize perks by category (food, beauty, retail, etc.)
- **Status Tracking**: Track the status of each perk (not started, reminder sent, redeemed, etc.)
- **Expiration Dates**: Keep track of when perks expire
- **Modern UI**: Clean, responsive interface built with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend/Database**: Firebase Firestore
- **Deployment**: Vercel

## Prerequisites

Before you begin, ensure you have the following:

- Node.js (v18 or newer)
- npm or yarn
- A Firebase account

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/Victoriayse95/bdayperkstracker.git
cd bdayperkstracker
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root directory with your Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAh89n6Z-woeHHZWhfIQ84qcWXDBbcJ3r4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=bdayperkstracker.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=bdayperkstracker
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=bdayperkstracker.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=695345747562
NEXT_PUBLIC_FIREBASE_APP_ID=1:695345747562:web:5ac3a44742918b8a6edc13
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Deployment

### Deploying to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and sign in with GitHub
3. Click "New Project" and import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: (default)
   - Output Directory: (default)
5. Add environment variables:
   - Add all Firebase config variables from your `.env.local` file
6. Click "Deploy"

Once deployed, Vercel will provide you with a URL for your live application.

## Firebase Setup

The application uses Firebase for data storage. The Firebase configuration is included in the `src/firebase` directory.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the styling utilities
- Firebase for the backend services
