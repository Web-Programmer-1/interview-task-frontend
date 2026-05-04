import { redirect } from "next/navigation";

// Home page → redirect to Al-Fatiha (Surah 1)
export default function HomePage() {
  redirect("/reading/1");
}
