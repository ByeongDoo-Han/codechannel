'use client';

import Link from 'next/link';

interface QuickActionsSectionProps {
  isDarkMode: boolean;
}

export default function QuickActionsSection({ isDarkMode }: QuickActionsSectionProps) {
  const actions = [
    {
      href: "/info-share?filter=스터디 카페",
      title: "스터디 카페",
      icon: <svg className="w-5 h-5 sm:w-6 sm:h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
      color: "blue"
    },
    {
      href: "/info-share?filter=부트 캠프",
      title: "부트 캠프",
      icon: <svg className="w-5 h-5 sm:w-6 sm:h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
      color: "green"
    },
    {
      href: "/info-share?filter=강의 추천",
      title: "강의 추천",
      icon: <svg className="w-5 h-5 sm:w-6 sm:h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>,
      color: "purple"
    },
    {
      href: "/info-share?filter=취업 정보",
      title: "취업 정보",
      icon: <svg className="w-5 h-5 sm:w-6 sm:h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>,
      color: "gray"
    }
  ];

  return (
    <section className={`backdrop-blur-sm rounded-xl shadow-sm border p-4 sm:p-6 hover:shadow-md transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-800/70 border-gray-700' 
        : 'bg-white/70 border-gray-200'
    }`}>
      <h2 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>정보 공유</h2>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className={`p-3 sm:p-4 rounded-lg border transition-colors group ${
              isDarkMode 
                ? `border-${action.color}-800 bg-${action.color}-900/30 hover:bg-${action.color}-900/50 active:bg-${action.color}-900/70` 
                : `border-${action.color}-200 bg-${action.color}-50/50 hover:bg-${action.color}-100/50 active:bg-${action.color}-200/50`
            }`}
          >
            <div className={`text-${action.color}-600 mb-2`}>
              {action.icon}
            </div>
            <p className={`text-xs sm:text-sm font-medium group-hover:text-${action.color}-700 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>{action.title}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
