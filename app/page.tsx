'use client';

import { useState, useEffect } from 'react';
import { StudyData, useStudy } from './context/StudyContext';
import { useAuth } from './context/AuthContext';
import axios from 'axios';
import AddStudyModal from './components/AddStudyModal';

export default function Main() {
  // Hydration-safe 상태 관리
  const [isClient, setIsClient] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isStudyDetailPopupOpen, setIsStudyDetailPopupOpen] = useState(false);
  const [isProjectDetailPopupOpen, setIsProjectDetailPopupOpen] = useState(false);
  const [popupStudyId, setPopupStudyId] = useState<number | null>(null);
  const [popupProjectId, setPopupProjectId] = useState<string | null>(null);
  const [isCalendarPopupOpen, setIsCalendarPopupOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [userSelections, setUserSelections] = useState<{ [studyId: string]: 'attend' | 'skip' | null }>({});
  const [isAddStudyModalOpen, setIsAddStudyModalOpen] = useState(false);
  
  // Auth Context 사용
  const {openLoginModal, openSignupModal, isLoggedIn, logout, joinedStudies } = useAuth();
  
  // 클라이언트에서만 실행되도록 보장
  useEffect(() => {
    setIsClient(true);
    // 클라이언트에서만 실행되도록 보장
    // joinedStudies가 로드되면 userSelections 초기화
    if (isLoggedIn && joinedStudies.length > 0) {
      const initialSelections: { [studyId: string]: 'attend' | 'skip' | null } = {};
      console.log('joinedStudies', joinedStudies);
      joinedStudies.forEach(studyId => {
        initialSelections[studyId] = 'attend';
      });
      console.log('initialSelections', initialSelections);
      setUserSelections(initialSelections);
    }
  }, [isLoggedIn, joinedStudies]);

  useEffect(() => {
    if (isLoggedIn && joinedStudies.length > 0) {
      const newSelections: { [studyId: string]: 'attend' | 'skip' | null } = {};
      joinedStudies.forEach(studyId => {
        newSelections[studyId] = 'attend';
      });
      setUserSelections(newSelections);
    }
  }, []);
  
  // 스터디 Context 사용
  const { studies, updateStudy } = useStudy();
  
  const handleAddStudy = () => {
    setIsAddStudyModalOpen(true);
  };
  
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

  // 참석/불참석 처리 (on/off 방식)
  const handleAttendance = (studyId: string, action: 'attend' | 'skip') => {
    const study = studies.find(s => s.id === Number(studyId));
    if (!study) return;

    const currentSelection = userSelections[studyId];
    let newSelection: 'attend' | 'skip' | null = null;
    let newCount = study.participantCount;

    if (currentSelection === action) {
      // 같은 버튼을 다시 누르면 선택 해제 (off)
      newSelection = null;
      if (action === 'attend') {
        newCount = Math.max(study.participantCount - 1, 0);
        handleUnjoin(Number(study.id));
      }
    } else {
      // 다른 버튼을 누르거나 처음 누르는 경우 (on)
      newSelection = action;
      if (action === 'attend') {
        if (currentSelection !== 'skip') {
          newCount = Math.min(study.participantCount + 1, study.maxParticipants || 50);
        }
        handleJoin(Number(study.id));
      } else { // action === 'skip'
        if (currentSelection === 'attend') {
          newCount = Math.max(study.participantCount - 1, 0);
        }
        handleUnjoin(Number(study.id));
      }
    }

    // 사용자 선택 상태 업데이트
    setUserSelections(prev => ({
      ...prev,
      [studyId]: newSelection
    }));

    updateStudy(Number(studyId), { participantCount: newCount });
  };


  // 스터디 상세 팝업 열기/닫기
  const openStudyDetailPopup = (studyId: number) => {
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

  const openAddStudyModal = () => {
    setIsAddStudyModalOpen(true);
  };

  const closeAddStudyModal = () => {
    setIsAddStudyModalOpen(false);
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
  
  const handleUnjoin = async(id: number) => {
    const accessToken = localStorage.getItem('accessToken');
    console.log('요청 id:', id);
    await axios.post(`http://localhost:8080/api/v1/unjoin/studies/${id}`,
      {
        
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true
      }
    )
    .then(response => {
      console.log('불참석 성공:', response.data);
      window.location.reload();
    })
    .catch(error => {
      console.error(error);
    });
  }

  const handleJoin = async(id: number) => {
    const accessToken = localStorage.getItem('accessToken');
    console.log('요청 id:', id);
    await axios.post(`http://localhost:8080/api/v1/join/studies/${id}`,
      {
        
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true
      }
    )
    .then(response => {
      console.log('참석 성공:', response.data);
      window.location.reload();
    })
    .catch(error => {
      console.error(error);
    });
  }

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
  // if (!isClient) {
  //   return (
  //     <div className="min-h-screen bg-gray-50">
  //       <header className="bg-white/80 shadow-sm border-b border-gray-200">
  //         <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
  //           <nav className="flex justify-between items-center">
  //             <div className="flex items-center">
  //               <a href="/main" className="text-xl sm:text-2xl font-bold">
  //                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
  //                   Code Channel
  //                 </span>
  //               </a>
  //             </div>
  //           </nav>
  //         </div>
  //       </header>
  //       <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
  //         <div className="text-center py-8">
  //           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
  //           <p className="mt-2 text-gray-600">로딩 중...</p>
  //         </div>
  //       </main>
  //     </div>
  //   );
  // }

  const popupStudy = popupStudyId ? studies.find(s => s.id === Number(popupStudyId)) : null;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header Navigation */}
      <header className={`backdrop-blur-md shadow-sm border-b sticky top-0 z-50 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-800/80 border-gray-700' 
          : 'bg-white/80 border-gray-200'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <nav className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="text-xl sm:text-2xl font-bold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  Code Channel
                </span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <a href="/study" className={`transition-colors font-medium text-base ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>스터디</a>
              <a href="/schedule" className={`transition-colors font-medium text-base ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>프로젝트</a>
              <a href="/code-share" className={`transition-colors font-medium text-base ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>코드 공유</a>
              <a href="/qa" className={`transition-colors font-medium text-base ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>Q&A</a>
              <a href="/community" className={`transition-colors font-medium text-base ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>커뮤니티</a>
              <a href="/info-share" className={`transition-colors font-medium text-base ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>정보 공유</a>
              <a href="/patch-history" className={`transition-colors font-medium text-base ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>패치 이력</a>
            </div>

            {/* Desktop Right Side */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'text-yellow-400 hover:bg-gray-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              
              {isLoggedIn ? (
                <button 
                  onClick={logout}
                  className={`transition-colors font-medium text-base ${
                    isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  로그아웃
                </button>
              ) : (
                <>
                  <button 
                    onClick={openLoginModal}
                    className={`transition-colors font-medium text-base ${
                      isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    로그인
                  </button>
                  <button 
                    onClick={openSignupModal}
                    className={`transition-colors font-medium text-base ${
                      isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    회원가입
                  </button>
                </>
              )}
              <a href="/my" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-medium text-base hover:from-blue-700 hover:to-blue-800 transition-all shadow-md">
                MY
              </a>
            </div>

            {/* Mobile Right Side */}
            <div className="flex lg:hidden items-center space-x-2">
              {/* Dark Mode Toggle - Mobile */}
              <button
                onClick={toggleDarkMode}
                className={`p-3 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'text-yellow-400 hover:bg-gray-700 active:bg-gray-600' 
                    : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
                }`}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-3 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'text-gray-300 hover:bg-gray-700 active:bg-gray-600' 
                    : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
                }`}
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </nav>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className={`lg:hidden mt-4 pb-4 border-t transition-all ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <div className="pt-4 space-y-3">
                <a href="/study" className={`block py-3 px-2 rounded-lg transition-colors touch-manipulation ${
                  isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700 active:bg-gray-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
                }`}>스터디</a>
                <a href="/schedule" className={`block py-3 px-2 rounded-lg transition-colors touch-manipulation ${
                  isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700 active:bg-gray-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
                }`}>프로젝트</a>
                <a href="/code-share" className={`block py-3 px-2 rounded-lg transition-colors touch-manipulation ${
                  isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700 active:bg-gray-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
                }`}>코드 공유</a>
                <a href="/qa" className={`block py-3 px-2 rounded-lg transition-colors touch-manipulation ${
                  isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700 active:bg-gray-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
                }`}>Q&A</a>
                <a href="/community" className={`block py-3 px-2 rounded-lg transition-colors touch-manipulation ${
                  isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700 active:bg-gray-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
                }`}>커뮤니티</a>
                <a href="/info-share" className={`block py-3 px-2 rounded-lg transition-colors touch-manipulation ${
                  isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700 active:bg-gray-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
                }`}>정보 공유</a>
                
                <div className="border-t pt-3 mt-3 space-y-3">
                  {isLoggedIn ? (
                    <button 
                      onClick={logout}
                      className={`block py-3 px-2 rounded-lg transition-colors touch-manipulation w-full text-left ${
                        isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700 active:bg-gray-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
                      }`}
                    >
                      로그아웃
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={openLoginModal}
                        className={`block py-3 px-2 rounded-lg transition-colors touch-manipulation w-full text-left ${
                          isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700 active:bg-gray-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
                        }`}
                      >
                        로그인
                      </button>
                      <button 
                        onClick={openSignupModal}
                        className={`block py-3 px-2 rounded-lg transition-colors touch-manipulation w-full text-left ${
                          isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700 active:bg-gray-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
                        }`}
                      >
                        회원가입
                      </button>
                    </>
                  )}
                  <a href="/my" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium text-base hover:from-blue-700 hover:to-blue-800 transition-all shadow-md touch-manipulation text-center block">
                    MY
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">


            {/* 진행 중인 스터디 */}
            <section className={`backdrop-blur-sm rounded-xl shadow-sm border p-4 sm:p-6 hover:shadow-md transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/70 border-gray-700' 
                : 'bg-white/70 border-gray-200'
            }`}>
              <div className="flex justify-between items-center">
              <h2 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>진행 중인 스터디</h2>
              <button 
                    onClick={() => openAddStudyModal()}
                    className={`transition-colors font-medium text-base ${
                      isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    스터디 추가
                  </button>
              </div>
              
              <div className="space-y-3 sm:space-y-4">
                {studies.map((study: StudyData) => (
                  <div 
                    key={study.id}
                    className={`group p-3 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                      isDarkMode 
                        ? 'border-gray-700 hover:border-blue-600 hover:bg-blue-900/20' 
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}
                    onClick={() => openStudyDetailPopup(study.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${study.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <span className="text-white font-bold text-xs sm:text-sm">{study.icon}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className={`font-semibold group-hover:text-blue-700 text-sm sm:text-base ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                          }`}>{study.name}</h3>
                          <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {study.date.toString()} • {study.memberCount}명 참여
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">진행중</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAttendance(study.id.toString(), 'attend');
                          }}
                          className={`px-4 py-2 text-xs sm:px-3 sm:py-1 rounded-full border transition-colors ${
                            userSelections[study.id] === 'attend'
                              ? (isDarkMode 
                                  ? 'border-green-600 text-white bg-green-600 hover:bg-green-700 active:bg-green-800' 
                                  : 'border-green-500 text-white bg-green-500 hover:bg-green-600 active:bg-green-700')
                              : (isDarkMode 
                                  ? 'border-green-600 text-green-600 bg-transparent hover:bg-green-600 hover:text-white active:bg-green-700 active:text-white' 
                                  : 'border-green-500 text-green-500 bg-transparent hover:bg-green-500 hover:text-white active:bg-green-600 active:text-white')
                          }`}>{userSelections[study.id] === 'attend' ? '참석' : '참석'}</button>
                      
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects */}
            <section className={`backdrop-blur-sm rounded-xl shadow-sm border p-4 sm:p-6 hover:shadow-md transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/70 border-gray-700' 
                : 'bg-white/70 border-gray-200'
            }`}>
              <h2 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>코드 공유</h2>
              <div className="space-y-3 sm:space-y-4">
                <a href="/code-share" className={`flex items-start space-x-3 p-3 sm:p-4 rounded-lg border transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'border-gray-700 hover:border-gray-600 hover:bg-gray-700/50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                }`}>
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mt-0.5 flex-shrink-0">
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Repository Management</p>
                    <p className={`text-xs sm:text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>GitHub integration for code sharing</p>
                  </div>
                </a>
              </div>
            </section>

            {/* Code Questions */}
            <section className={`backdrop-blur-sm rounded-xl shadow-sm border p-4 sm:p-6 hover:shadow-md transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/70 border-gray-700' 
                : 'bg-white/70 border-gray-200'
            }`}>
              <h2 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Q&A</h2>
              <div className="space-y-3 sm:space-y-4">
                <a href="/qa" className={`flex items-start space-x-3 p-3 sm:p-4 rounded-lg border transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'border-gray-700 hover:border-gray-600 hover:bg-gray-700/50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                }`}>
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 sm:mt-3 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>React useState best practices</p>
                    <p className={`text-xs sm:text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>1시간 전 • 답변 3개</p>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex-shrink-0">Open</span>
                </a>
                <a href="/qa" className={`flex items-start space-x-3 p-3 sm:p-4 rounded-lg border transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'border-gray-700 hover:border-gray-600 hover:bg-gray-700/50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                }`}>
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 sm:mt-3 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>JavaScript async/await patterns</p>
                    <p className={`text-xs sm:text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>3시간 전 • 답변 5개</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex-shrink-0">Solved</span>
                </a>
                <a href="/qa" className={`flex items-start space-x-3 p-3 sm:p-4 rounded-lg border transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'border-gray-700 hover:border-gray-600 hover:bg-gray-700/50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                }`}>
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 sm:mt-3 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>CSS Flexbox alignment guide</p>
                    <p className={`text-xs sm:text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>1일 전 • 답변 2개</p>
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full flex-shrink-0">Closed</span>
                </a>
                <a href="/qa" className={`flex items-start space-x-3 p-3 sm:p-4 rounded-lg border transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'border-gray-700 hover:border-gray-600 hover:bg-gray-700/50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                }`}>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 sm:mt-3 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Python list comprehension syntax</p>
                    <p className={`text-xs sm:text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>2일 전 • 답변 1개</p>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full flex-shrink-0">Pending</span>
                </a>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">
            {/* Active Projects */}
            <section className={`backdrop-blur-sm rounded-xl shadow-sm border p-4 sm:p-6 hover:shadow-md transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/70 border-gray-700' 
                : 'bg-white/70 border-gray-200'
            }`}>
              <h2 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>진행 중인 프로젝트</h2>
              <div className="space-y-2 sm:space-y-3">
                <div 
                  className={`group flex items-center space-x-3 p-3 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'border-gray-700 hover:border-pink-600 hover:bg-pink-900/20' 
                    : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/50'
                }`}
                  onClick={() => openProjectDetailPopup('dashboard')}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs sm:text-sm">DA</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Analytics Dashboard</p>
                    <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Vue.js + D3.js</p>
                  </div>
                </div>
                
                <div 
                  className={`group flex items-center space-x-3 p-3 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'border-gray-700 hover:border-cyan-600 hover:bg-cyan-900/20' 
                    : 'border-gray-200 hover:border-cyan-300 hover:bg-cyan-50/50'
                }`}
                  onClick={() => openProjectDetailPopup('chatapp')}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs sm:text-sm">CH</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Real-time Chat App</p>
                    <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Next.js + Socket.io</p>
                  </div>
                </div>
                
                <div 
                  className={`group flex items-center space-x-3 p-3 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'border-gray-700 hover:border-amber-600 hover:bg-amber-900/20' 
                    : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50/50'
                }`}
                  onClick={() => openProjectDetailPopup('ecommerce')}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-xs sm:text-sm">EC</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>E-Commerce Platform</p>
                    <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>React + Node.js</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Calendar */}
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

            {/* Quick Actions */}
            <section className={`backdrop-blur-sm rounded-xl shadow-sm border p-4 sm:p-6 hover:shadow-md transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/70 border-gray-700' 
                : 'bg-white/70 border-gray-200'
            }`}>
              <h2 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>정보 공유</h2>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <a href="/info-share?filter=스터디 카페" className={`p-3 sm:p-4 rounded-lg border transition-colors group ${
                  isDarkMode 
                    ? 'border-blue-800 bg-blue-900/30 hover:bg-blue-900/50 active:bg-blue-900/70' 
                    : 'border-blue-200 bg-blue-50/50 hover:bg-blue-100/50 active:bg-blue-200/50'
                }`}>
                  <div className="text-blue-600 mb-2">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <p className={`text-xs sm:text-sm font-medium group-hover:text-blue-700 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>스터디 카페</p>
                </a>
                <a href="/info-share?filter=부트 캠프" className={`p-3 sm:p-4 rounded-lg border transition-colors group ${
                  isDarkMode 
                    ? 'border-green-800 bg-green-900/30 hover:bg-green-900/50 active:bg-green-900/70' 
                    : 'border-green-200 bg-green-50/50 hover:bg-green-100/50 active:bg-green-200/50'
                }`}>
                  <div className="text-green-600 mb-2">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className={`text-xs sm:text-sm font-medium group-hover:text-green-700 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>부트 캠프</p>
                </a>
                <a href="/info-share?filter=강의 추천" className={`p-3 sm:p-4 rounded-lg border transition-colors group ${
                  isDarkMode 
                    ? 'border-purple-800 bg-purple-900/30 hover:bg-purple-900/50 active:bg-purple-900/70' 
                    : 'border-purple-200 bg-purple-50/50 hover:bg-purple-100/50 active:bg-purple-200/50'
                }`}>
                  <div className="text-purple-600 mb-2">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className={`text-xs sm:text-sm font-medium group-hover:text-purple-700 text-center ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>강의 추천</p>
                </a>
                <a href="/info-share?filter=취업 정보" className={`p-3 sm:p-4 rounded-lg border transition-colors group ${
                  isDarkMode 
                    ? 'border-gray-600 bg-gray-700/50 hover:bg-gray-700 active:bg-gray-600' 
                    : 'border-gray-300 bg-gray-50/50 hover:bg-gray-100/50 active:bg-gray-200/50'
                }`}>
                  <div className={`mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className={`text-xs sm:text-sm font-medium text-center ${isDarkMode ? 'text-gray-300 group-hover:text-gray-200' : 'text-gray-900 group-hover:text-gray-700'}`}>취업 정보</p>
                </a>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* 스터디 상세 팝업 */}
      
      {isStudyDetailPopupOpen && popupStudyId && (
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
                <div className={`w-16 h-16 bg-gradient-to-br ${popupStudy?.color} rounded-xl flex items-center justify-center`}>
                  <span className="text-white font-bold text-lg">{popupStudy?.icon}</span>
                </div>
                <div>
                  <h4 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {popupStudy?.name}
                  </h4>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {popupStudy?.description}
                  </p>
                </div>
              </div>

              {/* 스터디 정보 그리드 */}
              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h5 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>시간</h5>
                  <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {popupStudy?.date}
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <h5 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>장소</h5>
                  <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {popupStudy?.location}
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
                    {popupStudy?.participantCount}명
                  </p>
                </div>
              </div>

              {/* 참여자 목록 */}
              <div>
                <h5 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  참여자 목록
                </h5>
                <div className="flex flex-wrap gap-2">
                  {popupStudy?.participants?.map((participant: string, index: number) => (
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
                    handleAttendance(popupStudy?.id?.toString() || '', 'attend');
                  }}
                  className={`px-6 py-3 sm:px-4 sm:py-2 rounded-lg font-medium border transition-colors ${
                    userSelections[popupStudy?.id || ''] === 'attend'
                      ? 'bg-green-600 text-white border-green-600 hover:bg-green-700 hover:border-green-700 active:bg-green-800 active:border-green-800'
                      : 'bg-transparent text-green-600 border-green-600 hover:bg-green-600 hover:text-white active:bg-green-700 active:text-white'
                  }`}
                >
                  {userSelections[popupStudy?.id || ''] === 'attend' ? 'join' : '참석'}
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
      )}

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
                        openStudyDetailPopup(Number(study.id));
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
                            {study.date.toString()} • {study.memberCount}명 참여
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
      {isAddStudyModalOpen && (
        <AddStudyModal
          isStudyModalOpen={isAddStudyModalOpen}
          closeAddStudyModal={closeAddStudyModal}
          isDarkMode={isDarkMode}
          handleAddStudy={handleAddStudy}
        />
      )}
    </div>
  );
} 