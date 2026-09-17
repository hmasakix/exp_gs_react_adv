// app/Header.tsx
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white px-4 py-3">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <Link href="/">
          <p className="text-2xl font-bold text-black">AI練習コーチ</p>
        </Link>

        <Link href="/history" className="text-sm text-blue-600 underline">
          履歴を見る
        </Link>

        <div className="flex items-center gap-2">
          <SignedOut>
            <SignInButton />
            <SignUpButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
