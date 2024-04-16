'use client';

import { Link } from 'react-router-dom';
import { Folder, ImageIcon, MessageSquare } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="flex ml-auto items-center gap-4 md:gap-6 lg:gap-8">
      <Link
        className="flex items-center gap-2 text-sm font-medium rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
        to="/image"
      >
        <ImageIcon className="h-4 w-4" />
        图片
      </Link>
      <Link
        className="flex items-center gap-2 text-sm font-medium rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:bg-gray-400 dark:hover:text-gray-50"
        to="/"
      >
        <Folder className="h-4 w-4" />
        文件
      </Link>
      <Link
        className="flex items-center gap-2 text-sm font-medium rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
        to="/feedback"
      >
        <MessageSquare className="h-4 w-4" />
        反馈意见
      </Link>
    </nav>
  );
};
