'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { getAccessToken } from '@/lib/auth-storage';

export function HomeAccountLink() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(getAccessToken()));
  }, []);

  return (
    <Link
      href={isLoggedIn ? '/dashboard' : '/signup'}
      className="transition hover:text-white"
    >
      {isLoggedIn ? 'Dashboard' : 'Create Account'}
    </Link>
  );
}
