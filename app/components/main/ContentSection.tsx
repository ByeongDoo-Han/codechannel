'use client';

import Link from 'next/link';

interface ContentItem {
  href: string;
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
}

interface ContentSectionProps {
  title: string;
  items: ContentItem[];
  isDarkMode: boolean;
}

export default function ContentSection({ title, items, isDarkMode }: ContentSectionProps) {
  return (
    <section className={`backdrop-blur-sm rounded-xl shadow-sm border p-4 sm:p-6 hover:shadow-md transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-800/70 border-gray-700' 
        : 'bg-white/70 border-gray-200'
    }`}>
      <h2 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{title}</h2>
      <div className="space-y-3 sm:space-y-4">
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`flex items-start space-x-3 p-3 sm:p-4 rounded-lg border transition-all cursor-pointer ${
              isDarkMode 
                ? 'border-gray-700 hover:border-gray-600 hover:bg-gray-700/50' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
            }`}
          >
            {item.icon && (
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mt-0.5 flex-shrink-0">
                {item.icon}
              </div>
            )}
            {!item.icon && (
                <div className={`w-2 h-2 ${item.badgeColor || 'bg-blue-500'} rounded-full mt-2 sm:mt-3 flex-shrink-0`}></div>
            )}
            <div className="flex-1 min-w-0">
              <p className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</p>
              <p className={`text-xs sm:text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.subtitle}</p>
            </div>
            {item.badge && (
              <span className={`text-xs ${item.badgeColor ? `bg-${item.badgeColor}-100 text-${item.badgeColor}-700` : 'bg-blue-100 text-blue-700'} px-2 py-1 rounded-full flex-shrink-0`}>{item.badge}</span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
