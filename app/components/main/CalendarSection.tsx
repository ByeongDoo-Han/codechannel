'use client';

interface CalendarSectionProps {
    isDarkMode: boolean;
    isDateInitialized: boolean;
    currentYear: number;
    currentMonth: number;
    monthNames: string[];
    today: Date | null;
    goToPrevMonth: () => void;
    goToNextMonth: () => void;
    generateCalendarDays: () => { day: number; isCurrentMonth: boolean; date: Date; }[];
    getDayStyle: (dayInfo: { day: number; isCurrentMonth: boolean; date: Date; }) => string;
    hasStudyOnDate: (date: Date) => boolean;
    openCalendarPopup: (date: Date) => void;
}

export default function CalendarSection({
    isDarkMode,
    isDateInitialized,
    currentYear,
    currentMonth,
    monthNames,
    today,
    goToPrevMonth,
    goToNextMonth,
    generateCalendarDays,
    getDayStyle,
    hasStudyOnDate,
    openCalendarPopup,
}: CalendarSectionProps) {
  return (
    <section className={`backdrop-blur-sm rounded-xl shadow-sm border p-4 sm:p-6 hover:shadow-md transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-800/70 border-gray-700' 
        : 'bg-white/70 border-gray-200'
    }`}>
      {isDateInitialized ? (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-between items-center">
            <button onClick={goToPrevMonth} className={`p-2 sm:p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700 active:bg-gray-600' : 'hover:bg-gray-100 active:bg-gray-200'
            }`}>
              <svg className={`w-4 h-4 sm:w-4 sm:h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 className={`font-semibold text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{currentYear}년 {monthNames[currentMonth]}</h3>
            <button onClick={goToNextMonth} className={`p-2 sm:p-2 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-700 active:bg-gray-600' : 'hover:bg-gray-100 active:bg-gray-200'
            }`}>
              <svg className={`w-4 h-4 sm:w-4 sm:h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center">
            <div className="text-xs font-medium text-red-500 p-2">일</div>
            <div className={`text-xs font-medium p-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>월</div>
            <div className={`text-xs font-medium p-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>화</div>
            <div className={`text-xs font-medium p-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>수</div>
            <div className={`text-xs font-medium p-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>목</div>
            <div className={`text-xs font-medium p-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>금</div>
            <div className="text-xs font-medium text-blue-500 p-2">토</div>
            
            {generateCalendarDays().map((dayInfo, index) => (
              <div 
                key={index} 
                className={getDayStyle(dayInfo)}
                onClick={() => {
                  if (dayInfo.isCurrentMonth && hasStudyOnDate(dayInfo.date)) {
                    openCalendarPopup(dayInfo.date);
                  }
                }}
              >
                <span>{dayInfo.day}</span>
                {dayInfo.isCurrentMonth && hasStudyOnDate(dayInfo.date) && (
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-0.5"></div>
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-2 sm:mt-3">
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Today: {today ? `${today.getMonth() + 1}월 ${today.getDate()}일` : '로딩 중...'}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-between items-center">
            <div className={`p-2 sm:p-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className={`w-4 h-4 sm:w-4 sm:h-4 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded`}></div>
            </div>
            <h3 className={`font-semibold text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>2024년 7월</h3>
            <div className={`p-2 sm:p-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className={`w-4 h-4 sm:w-4 sm:h-4 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded`}></div>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 text-center">
            <div className="text-xs font-medium text-red-500 p-2">일</div>
            <div className={`text-xs font-medium p-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>월</div>
            <div className={`text-xs font-medium p-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>화</div>
            <div className={`text-xs font-medium p-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>수</div>
            <div className={`text-xs font-medium p-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>목</div>
            <div className={`text-xs font-medium p-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>금</div>
            <div className="text-xs font-medium text-blue-500 p-2">토</div>
            
            {/* 로딩 중인 달력 */}
            {Array.from({ length: 42 }, (_, index) => (
              <div key={index} className={`p-1 sm:p-2 text-xs font-medium rounded-md min-h-[2rem] sm:min-h-[2.5rem] flex items-center justify-center ${isDarkMode ? 'bg-gray-700 text-gray-600' : 'bg-gray-100 text-gray-400'}`}>
                •
              </div>
            ))}
          </div>
          
          <div className="text-center mt-2 sm:mt-3">
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              로딩 중...
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
