'use client';

import { useState, useEffect } from 'react';
import { useStudy } from './context/StudyContext';
import { useAuth } from './context/AuthContext';
import Header from './components/main/Header';
import StudySection from './components/main/StudySection';
import ContentSection from './components/main/ContentSection';
import ProjectSection from './components/main/ProjectSection';
import CalendarSection from './components/main/CalendarSection';
import QuickActionsSection from './components/main/QuickActionsSection';

export default function Main() {
  // Hydration-safe 상태 관리
  const [isClient, setIsClient] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isStudyDetailPopupOpen, setIsStudyDetailPopupOpen] = useState(false);
  const [isProjectDetailPopupOpen, setIsProjectDetailPopupOpen] = useState(false);
  const [popupStudyId, setPopupStudyId] = useState<string | null>(null);
  const [popupProjectId, setPopupProjectId] = useState<string | null>(null);
  const [isCalendarPopupOpen, setIsCalendarPopupOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [userSelections, setUserSelections] = useState<{ [studyId: string]: 'attend' | 'unattend' | null }>({});
  
  // 클라이언트에서만 실행되도록 보장
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // 스터디 Context 사용
  const { studies, updateStudy } = useStudy();
  
  // Auth Context 사용
  const { openLoginModal, openSignupModal } = useAuth();
  
  // 프로젝트 데이터 (메인 페이지용 샘플)
  const projectData = {
    ecommerce: {
      name: 'E-Commerce Platform',
      description: 'React와 Node.js를 사용한 전자상거래 플랫폼 개발',
      tech: ['React', 'Node.js', 'MongoDB', 'Express'],
      status: 'development' as const,
      team: ['김민수', '이지은', '박준호', '최수진'],
      startDate: '2024-01-15',
      endDate: '2024-04-30',
      progress: 65,
      repository: 'https://github.com/team/ecommerce-platform'
    },
    chatapp: {
      name: 'Real-time Chat App',
      description: 'Socket.io를 활용한 실시간 채팅 애플리케이션',
      tech: ['Next.js', 'Socket.io', 'PostgreSQL', 'Redis'],
      status: 'testing' as const,
      team: ['이민호', '김서연', '박지훈'],
      startDate: '2024-02-01',
      endDate: '2024-03-31',
      progress: 85,
      repository: 'https://github.com/team/chat-app'
    },
    dashboard: {
      name: 'Analytics Dashboard',
      description: 'D3.js를 이용한 데이터 시각화 대시보드',
      tech: ['Vue.js', 'D3.js', 'Python', 'FastAPI'],
      status: 'planning' as const,
      team: ['정수아', '최민준', '윤하늘', '한지민'],
      startDate: '2024-03-15',
      endDate: '2024-06-15',
      progress: 20,
      repository: 'https://github.com/team/analytics-dashboard'
    }
  };
  
  // 날짜 관련 상태 관리 - Hydration 에러 방지를 위해 null로 초기화
  const [today, setToday] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [isDateInitialized, setIsDateInitialized] = useState(false);
  
  // 클라이언트에서만 실제 날짜로 초기화 (Hydration 에러 방지)
  useEffect(() => {
    const now = new Date();
    setToday(now);
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setIsDateInitialized(true);
  }, []);
  
  // 현재 날짜 정보 - 초기화된 후에만 실제 날짜 사용
  const currentYear = currentDate?.getFullYear() ?? 2024;
  const currentMonth = currentDate?.getMonth() ?? 11; // 12월 (0부터 시작)
  
  // 다크모드 토글
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // 참석/불참석 처리
  const handleAttendance = (studyId: string, action: 'attend' | 'unattend') => {
    const study = studies.find(s => s.id === studyId);
    if (!study) return;

    setUserSelections(prevSelections => ({ ...prevSelections, [studyId]: action === 'attend' ? 'attend' : 'unattend' }));
    updateStudy(studyId, { isAttending: action === 'attend' });
  };

  // 스터디 상세 팝업 열기/닫기
  const openStudyDetailPopup = (studyId: string) => {
    setPopupStudyId(studyId);
    setIsStudyDetailPopupOpen(true);
  };

  const closeStudyDetailPopup = () => {
    setIsStudyDetailPopupOpen(false);
    setPopupStudyId(null);
  };

  // 프로젝트 상세 팝업 열기/닫기
  const openProjectDetailPopup = (projectId: string) => {
    setPopupProjectId(projectId);
    setIsProjectDetailPopupOpen(true);
  };

  const closeProjectDetailPopup = () => {
    setIsProjectDetailPopupOpen(false);
    setPopupProjectId(null);
  };

  // 달력 팝업 열기/닫기
  const openCalendarPopup = (date: Date) => {
    setSelectedDate(date);
    setIsCalendarPopupOpen(true);
  };

  const closeCalendarPopup = () => {
    setIsCalendarPopupOpen(false);
    setSelectedDate(null);
  };

  // 특정 날짜에 스터디 일정이 있는지 확인
  const getStudiesForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return studies.filter(study => {
      // 간단한 예시로 특정 날짜에 스터디가 있다고 가정
      const studyDates = [
        '2024-12-25', '2024-12-26', '2024-12-28', '2024-12-30',
        '2024-01-02', '2024-01-05', '2024-01-08', '2024-01-12'
      ];
      return studyDates.includes(dateString);
    });
  };

  // 날짜에 스터디 일정이 있는지 확인
  const hasStudyOnDate = (date: Date) => {
    return getStudiesForDate(date).length > 0;
  };


  
  // 이전/다음 달로 이동
  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  // 달력 날짜 생성
  const generateCalendarDays = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // 이전 달의 날짜들
    const prevMonth = new Date(currentYear, currentMonth - 1, 0);
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonth.getDate() - i;
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonth - 1, day)
      });
    }
    
    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        day,
        isCurrentMonth: true,
        date: new Date(currentYear, currentMonth, day)
      });
    }
    
    // 다음 달의 날짜들 (42칸을 채우기 위해)
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonth + 1, day)
      });
    }
    
    return days;
  };
  
  // 날짜 스타일 결정
  const getDayStyle = (dayInfo: { day: number; isCurrentMonth: boolean; date: Date }) => {
    const { day, isCurrentMonth, date } = dayInfo;
    const dayOfWeek = date.getDay();
        const isToday = isCurrentMonth && today && isClient &&
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
    
    const baseStyle = "p-1 sm:p-2 text-xs font-medium cursor-pointer rounded-md transition-colors min-h-[2rem] sm:min-h-[2.5rem] flex flex-col items-center justify-center relative";
    
    if (isToday) {
      return `${baseStyle} bg-blue-500 text-white`;
    } else if (!isCurrentMonth) {
      return `${baseStyle} ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`;
    } else if (dayOfWeek === 0) { // 일요일
      return `${baseStyle} text-red-500 ${isDarkMode ? 'hover:bg-red-900/30 active:bg-red-900/50' : 'hover:bg-red-50 active:bg-red-100'}`;
    } else if (dayOfWeek === 6) { // 토요일
      return `${baseStyle} text-blue-500 ${isDarkMode ? 'hover:bg-blue-900/30 active:bg-blue-900/50' : 'hover:bg-blue-50 active:bg-blue-100'}`;
    } else {
      return `${baseStyle} ${isDarkMode ? 'text-gray-300 hover:bg-gray-700 active:bg-gray-600' : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'}`;
    }
  };
  
  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  // 클라이언트가 준비되지 않았을 때는 기본 레이아웃만 표시
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white/80 shadow-sm border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <nav className="flex justify-between items-center">
              <div className="flex items-center">
                <a href="/main" className="text-xl sm:text-2xl font-bold">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                    Code Channel
                  </span>
                </a>
              </div>
            </nav>
          </div>
        </header>
        <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">로딩 중...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        openLoginModal={openLoginModal}
        openSignupModal={openSignupModal}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">


            <StudySection 
              // studies={studies}
              openStudyDetailPopup={openStudyDetailPopup}
              handleAttendance={handleAttendance}
              userSelections={userSelections}
              isDarkMode={isDarkMode}
            />

            {/* <ContentSection
                title="코드 공유"
                isDarkMode={isDarkMode}
                items={[{
                    href: "/code-share",
                    icon: <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>,
                    title: "Repository Management",
                    subtitle: "GitHub integration for code sharing"
                }]}
            /> */}

            <ContentSection
                title="Q&A"
                isDarkMode={isDarkMode}
                items={[
                    { href: "/qa", title: "React useState best practices", subtitle: "1시간 전 • 답변 3개", badge: "Open", badgeColor: "bg-blue-500" },
                    { href: "/qa", title: "JavaScript async/await patterns", subtitle: "3시간 전 • 답변 5개", badge: "Solved", badgeColor: "bg-green-500" },
                    { href: "/qa", title: "CSS Flexbox alignment guide", subtitle: "1일 전 • 답변 2개", badge: "Closed", badgeColor: "bg-purple-500" },
                    { href: "/qa", title: "Python list comprehension syntax", subtitle: "2일 전 • 답변 1개", badge: "Pending", badgeColor: "bg-yellow-500" }
                ]}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">
            <ProjectSection 
              projectData={projectData}
              openProjectDetailPopup={openProjectDetailPopup}
              isDarkMode={isDarkMode}
            />

            <CalendarSection 
              isDarkMode={isDarkMode}
              isDateInitialized={isDateInitialized}
              currentYear={currentYear}
              currentMonth={currentMonth}
              monthNames={monthNames}
              today={today}
              goToPrevMonth={goToPrevMonth}
              goToNextMonth={goToNextMonth}
              generateCalendarDays={generateCalendarDays}
              getDayStyle={getDayStyle}
              hasStudyOnDate={hasStudyOnDate}
              openCalendarPopup={openCalendarPopup}
            />

            <QuickActionsSection isDarkMode={isDarkMode} />
          </div>
        </div>
      </main>

      {/* 스터디 상세 팝업 */}
      {isStudyDetailPopupOpen && popupStudyId && (() => {
        const popupStudy = studies.find(s => s.id === popupStudyId);
        if (!popupStudy) return null;
        
        return (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-96 max-w-[calc(100vw-2rem)]">
            <div className={`rounded-xl shadow-2xl ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border`}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    스터디 상세 정보
                  </h3>
                  <button
                    onClick={closeStudyDetailPopup}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* 스터디 헤더 */}
                  <div className="flex items-center space-x-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${popupStudy.color} rounded-xl flex items-center justify-center`}>
                      <span className="text-white font-bold text-lg">{popupStudy.icon}</span>
                    </div>
                    <div>
                      <h4 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {popupStudy.name}
                      </h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {popupStudy.description}
                      </p>
                    </div>
                  </div>

                  {/* 스터디 정보 그리드 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h5 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>시간</h5>
                      <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {popupStudy.time}
                      </p>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h5 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>장소</h5>
                      <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {popupStudy.location}
                      </p>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h5 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>상태</h5>
                      <span className="inline-flex px-2 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-700">
                        진행중
                      </span>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h5 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>참여자</h5>
                      <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {popupStudy.participants.length}명
                      </p>
                    </div>
                  </div>

                  {/* 참여자 목록 */}
                  <div>
                    <h5 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      참여자 목록
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {popupStudy.participants.map((participant: string, index: number) => (
                        <span key={index} className={`px-3 py-1 text-sm rounded-full ${
                          isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {participant}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 액션 버튼들 */}
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAttendance(popupStudy.id, 'attend');
                      }}
                      className={`px-6 py-3 sm:px-4 sm:py-2 rounded-lg font-medium border transition-colors ${
                        userSelections[popupStudy.id] === 'attend'
                          ? 'bg-green-600 text-white border-green-600 hover:bg-green-700 hover:border-green-700 active:bg-green-800 active:border-green-800'
                          : 'bg-transparent text-green-600 border-green-600 hover:bg-green-600 hover:text-white active:bg-green-700 active:text-white'
                      }`}
                    >
                      참석
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAttendance(popupStudy.id, 'unattend');
                      }}
                      className={`px-6 py-3 sm:px-4 sm:py-2 rounded-lg font-medium border transition-colors ${
                        userSelections[popupStudy.id] === 'unattend'
                          ? 'bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700 active:bg-red-800 active:border-red-800'
                          : 'bg-transparent text-red-600 border-red-600 hover:bg-red-600 hover:text-white active:bg-red-700 active:text-white'
                      }`}
                    >
                      불참석
                    </button>
                    <button
                      onClick={closeStudyDetailPopup}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        isDarkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      } transition-colors`}
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 달력 팝업 */}
      {isCalendarPopupOpen && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-xl shadow-2xl ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border w-80 max-w-[calc(100vw-2rem)]`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 스터디 일정
                </h3>
                <button
                  onClick={closeCalendarPopup}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {getStudiesForDate(selectedDate).length > 0 ? (
                  getStudiesForDate(selectedDate).map((study) => (
                    <div 
                      key={study.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        isDarkMode 
                          ? 'border-gray-700 bg-gray-700/50 hover:bg-gray-700' 
                          : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        closeCalendarPopup();
                        openStudyDetailPopup(study.id);
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${study.color} rounded-lg flex items-center justify-center`}>
                          <span className="text-white font-bold text-sm">{study.icon}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {study.name}
                          </h4>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {study.time} • {study.location}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                          진행중
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    이 날에는 스터디 일정이 없습니다.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 프로젝트 상세 팝업 */}
      {isProjectDetailPopupOpen && popupProjectId && (() => {
        const popupProject = projectData[popupProjectId as keyof typeof projectData];
        if (!popupProject) return null;
        
        return (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-[28rem] max-w-[calc(100vw-2rem)]">
            <div className={`rounded-xl shadow-2xl ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border`}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    프로젝트 상세 정보
                  </h3>
                  <button
                    onClick={closeProjectDetailPopup}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-6">
                  {/* 프로젝트 헤더 */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">PJ</span>
                    </div>
                    <div>
                      <h4 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {popupProject.name}
                      </h4>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {popupProject.description}
                      </p>
                    </div>
                  </div>

                  {/* 프로젝트 정보 그리드 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h5 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>진행률</h5>
                      <div className="mt-2">
                        <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                          <div 
                            className="h-2 bg-blue-500 rounded-full" 
                            style={{width: `${popupProject.progress}%`}}
                          ></div>
                        </div>
                        <p className={`text-lg font-semibold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {popupProject.progress}%
                        </p>
                      </div>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h5 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>상태</h5>
                      <span className={`inline-flex px-2 py-1 text-sm font-medium rounded-full mt-2 ${
                        popupProject.status === 'development' ? 'bg-green-100 text-green-700' :
                        popupProject.status === 'testing' ? 'bg-orange-100 text-orange-700' :
                        popupProject.status === 'planning' ? 'bg-blue-100 text-blue-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {popupProject.status === 'development' ? '개발중' :
                         popupProject.status === 'testing' ? '테스트' :
                         popupProject.status === 'planning' ? '기획' : '배포'}
                      </span>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h5 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>기간</h5>
                      <p className={`text-sm font-semibold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {popupProject.startDate} ~
                      </p>
                      <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {popupProject.endDate}
                      </p>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                      <h5 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>팀원</h5>
                      <p className={`text-lg font-semibold mt-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {popupProject.team.length}명
                      </p>
                    </div>
                  </div>

                  {/* 기술 스택 */}
                  <div>
                    <h5 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      기술 스택
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {popupProject.tech.map((tech: string, index: number) => (
                        <span key={index} className={`px-3 py-1 text-sm rounded-full ${
                          isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 팀원 목록 */}
                  <div>
                    <h5 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      팀원 목록
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {popupProject.team.map((member: string, index: number) => (
                        <span key={index} className={`px-3 py-1 text-sm rounded-full ${
                          isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* GitHub Repository */}
                  <div>
                    <h5 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Repository
                    </h5>
                    <a 
                      href={popupProject.repository} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                        isDarkMode 
                          ? 'border-gray-600 text-blue-400 hover:bg-gray-700' 
                          : 'border-gray-300 text-blue-600 hover:bg-gray-50'
                      }`}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                      </svg>
                      <span>GitHub에서 보기</span>
                    </a>
                  </div>

                  {/* 액션 버튼들 */}
                  <div className="flex justify-end space-x-3 pt-4 border-t">
                    <button
                      onClick={closeProjectDetailPopup}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        isDarkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      } transition-colors`}
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
} 