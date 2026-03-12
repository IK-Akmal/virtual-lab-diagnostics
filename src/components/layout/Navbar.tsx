"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Microscope, LogOut, User, LayoutDashboard } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white border-b border-[var(--color-border)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2 text-[var(--color-primary)] font-bold text-xl">
            <Microscope className="w-7 h-7" />
            <span className="hidden sm:inline">Виртуальная лаборатория</span>
            <span className="sm:hidden">ВирЛаб</span>
          </Link>

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Дашборд</span>
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">{session.user?.name}</span>
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-error)] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Выйти</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                >
                  Войти
                </Link>
                <Link
                  href="/register"
                  className="text-sm bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
                >
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
