# Quran Interview Project - Frontend

A professional, feature-rich Quran reading application built with Next.js, Redux Toolkit, and Tailwind CSS.

## 🌟 Features

- **Mushaf View**: High-fidelity reading interface with "aged paper" aesthetic.
- **Surah Navigation**: Easy access to all 114 Surahs.
- **Search**: Fast and efficient search for verses.
- **Settings**: Customizable reading experience (Translation toggle, Font sizes, themes).
- **Audio Integration**: Listen to recitations (in progress).
- **Responsive Design**: Fully optimized for mobile and desktop.
- **Wishlist & Bookmarks**: Save your favorite verses and surahs.

## 🚀 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **State Management**: Redux Toolkit & RTK Query
- **Styling**: Tailwind CSS & Lucide Icons
- **Language**: TypeScript
- **API**: Integration with a NestJS backend (deployed on Vercel)

## 🛠️ Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Web-Programmer-1/interview-task-frontend.git
   cd interview-task-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root and add your backend URL:
   ```env
   NEXT_PUBLIC_API_URL=https://interview-task-backend-nu.vercel.app/api
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open the app**:
   Navigate to [http://localhost:3000](http://localhost:3000).

## 📁 Project Structure

- `src/app`: Next.js pages and layouts.
- `src/features`: Feature-sliced components and logic (Reader, Search, etc.).
- `src/components`: Common UI and layout components.
- `src/store`: Redux store and API slices.
- `src/types`: TypeScript interfaces.

## 📄 License

This project is licensed under the MIT License.
