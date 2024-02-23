import React from 'react';

export default function Footer() {
  return (
    <footer className="flex h-14 items-center border-t px-4 text-sm dark:text-gray-400">
      © {new Date().getFullYear()} Houtar. All rights reserved.
    </footer>
  );
}