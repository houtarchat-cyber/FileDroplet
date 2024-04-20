'use client';

import { Link } from 'react-router-dom';
import { Folder, ImageIcon, MessageSquare } from 'lucide-react';
import SettingsDialog from './Settings';
import HistoryPage from './History';

export default function Navbar() {
  return (
    <nav className="flex ml-auto items-center gap-4 md:gap-6 lg:gap-8">
      <Link
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
        to="/image"
        title="上传图片"
      >
        <ImageIcon className="h-6 w-6" />
      </Link>
      <Link
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:bg-gray-400 dark:hover:text-gray-50"
        to="/"
        title="上传文件"
      >
        <Folder className="h-6 w-6" />
      </Link>
      <Link
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
        to="/feedback"
        title="反馈意见"
      >
        <MessageSquare className="h-6 w-6" />
      </Link>
      <HistoryPage />
      <SettingsDialog />
    </nav>
  );
};
