'use client';

import { useState, useEffect } from 'react';
import { useStudy } from '../context/StudyContext';
import { useAuth } from '../context/AuthContext';

export default function Study() {
  // Hydration-safe 상태 관리
  const [isClient, setIsClient] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAddStudyModalOpen, setIsAddStudyModalOpen] = useState(false);
  const [isStudyDetailPopupOpen, setIsStudyDetailPopupOpen] = useState(false);
  const [popupStudyId, setPopupStudyId] = useState<string | null>(null);
  const [userSelections, setUserSelections] = useState<{ [studyId: string]: 'attend' | 'skip' | null }>({});
  
  // 클라이언트에서만 실행되도록 보장
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // 스터디 Context 사용
  const { studies, selectedStudy, setSelectedStudy, updateStudy, addStudy } = useStudy();
  
  // Auth Context 사용
  const { openLoginModal, openSignupModal } = useAuth();
  
  // URL 쿼리 파라미터 확인
  useEffect(() => {
    if (!isClient) return;
    const urlParams = new URLSearchParams(window.location.search);
    const popup = urlParams.get('popup');
    if (popup && studies.find(s => s.id === popup)) {
      setPopupStudyId(popup);
      setIsStudyDetailPopupOpen(true);
      setSelectedStudy(popup);
    }
  }, [isClient, studies, setSelectedStudy]);
  
  // 스터디 추가 폼 상태
  const [newStudyForm, setNewStudyForm] = useState({
    studyName: '',
    description: '',
    time: '',
    location: '',
    icon: 'JS',
    color: 'from-blue-500 to-blue-600',
    status: 'recruiting' as 'recruiting' | 'active' | 'closed'
  });
  
  // 현재 선택된 스터디 데이터
  const currentStudy = studies.find(study => study.id === selectedStudy) || studies[0];

  // 다크모드 토글
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // 참석/불참석 처리
  const handleAttendance = (studyId: string, action: 'attend' | 'skip') => {
    const study = studies.find(s => s.id === studyId);
    if (!study) return;

    // 사용자 선택 상태 업데이트
    setUserSelections(prev => ({
      ...prev,
      [studyId]: action
    }));

    const newCount = action === 'attend' 
      ? Math.min(study.participants.length + 1, study.maxParticipants || 50)
      : Math.max(study.participants.length - 1, 0);

    updateStudy(studyId, { participants: study.participants });
  };

  // 스터디 추가 처리
  const handleAddStudy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudyForm.studyName.trim() || !newStudyForm.description.trim()) return;

    const newStudy = {
      studyName: newStudyForm.studyName,
      description: newStudyForm.description,
      time: newStudyForm.time,
      location: newStudyForm.location,
      icon: newStudyForm.icon,
      color: newStudyForm.color,
      status: newStudyForm.status,
      participantCount: 1,
      maxParticipants: 10,
      participants: ['운영자']
    };

    // addStudy(newStudy);
    setNewStudyForm({
      studyName: '',
      description: '',
      time: '',
      location: '',
      icon: 'JS',
      color: 'from-blue-500 to-blue-600',
      status: 'recruiting'
    });
    setIsAddStudyModalOpen(false);
  };

  // 스터디 상세 팝업 닫기
  const closeStudyDetailPopup = () => {
    setIsStudyDetailPopupOpen(false);
    setPopupStudyId(null);
    // URL에서 쿼리 파라미터 제거
    if (isClient) {
      const url = new URL(window.location.href);
      url.searchParams.delete('popup');
      window.history.replaceState({}, '', url.toString());
    }
  };

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
              <a href="/main" className="text-xl sm:text-2xl font-bold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  Code Channel
                </span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              <a href="/study" className={`transition-colors font-medium text-base ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              } border-b-2 border-blue-500`}>스터디</a>
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
                  isDarkMode ? 'text-white bg-gray-700' : 'text-gray-900 bg-gray-100'
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
        {/* Page Title */}
        <div className="mb-6 sm:mb-8">
          <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            스터디
          </h1>
          <p className={`mt-2 text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            함께 성장하는 개발 스터디에 참여해보세요
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Study List */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* 진행 중인 스터디 */}
            <section className={`backdrop-blur-sm rounded-xl shadow-sm border p-4 sm:p-6 hover:shadow-md transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/70 border-gray-700' 
                : 'bg-white/70 border-gray-200'
            }`}>
              <h2 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>이번 주 스터디</h2>
              <div className="space-y-3 sm:space-y-4">
                {studies.map((study) => (
                  <div 
                    key={study.id}
                    onClick={() => {
                      setSelectedStudy(study.id);
                      setPopupStudyId(study.id);
                      setIsStudyDetailPopupOpen(true);
                    }}
                    className={`group p-3 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedStudy === study.id
                        ? isDarkMode 
                          ? 'border-blue-500 bg-blue-900/30' 
                          : 'border-blue-400 bg-blue-50'
                        : isDarkMode 
                          ? 'border-gray-700 hover:border-blue-600 hover:bg-blue-900/20' 
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}>
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
                            {study.time} • {study.participants.length}명 참여
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">진행중</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAttendance(study.id, 'attend');
                          }}
                          className={`px-3 py-2 text-xs sm:px-2 sm:py-1 rounded-full border transition-colors touch-manipulation ${
                            userSelections[study.id] === 'attend'
                              ? (isDarkMode 
                                  ? 'border-green-600 text-white bg-green-600 hover:bg-green-700 active:bg-green-800' 
                                  : 'border-green-500 text-white bg-green-500 hover:bg-green-600 active:bg-green-700')
                              : (isDarkMode 
                                  ? 'border-green-600 text-green-600 bg-transparent hover:bg-green-600 hover:text-white active:bg-green-700 active:text-white' 
                                  : 'border-green-500 text-green-500 bg-transparent hover:bg-green-500 hover:text-white active:bg-green-600 active:text-white')
                          }`}>참석</button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAttendance(study.id, 'skip');
                          }}
                          className={`px-3 py-2 text-xs sm:px-2 sm:py-1 rounded-full border transition-colors touch-manipulation ${
                            userSelections[study.id] === 'skip'
                              ? (isDarkMode 
                                  ? 'border-red-600 text-white bg-red-600 hover:bg-red-700 active:bg-red-800' 
                                  : 'border-red-500 text-white bg-red-500 hover:bg-red-600 active:bg-red-700')
                              : (isDarkMode 
                                  ? 'border-red-600 text-red-600 bg-transparent hover:bg-red-600 hover:text-white active:bg-red-700 active:text-white' 
                                  : 'border-red-500 text-red-500 bg-transparent hover:bg-red-500 hover:text-white active:bg-red-600 active:text-white')
                          }`}>불참석</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 스터디 생성하기 */}
            <section className={`backdrop-blur-sm rounded-xl shadow-sm border p-4 sm:p-6 hover:shadow-md transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/70 border-gray-700' 
                : 'bg-white/70 border-gray-200'
            }`}>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <h2 className={`text-lg sm:text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>스터디 만들기</h2>
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>(운영진 권한)</span>
              </div>
              <div 
                onClick={() => setIsAddStudyModalOpen(true)}
                className={`p-6 border-2 border-dashed rounded-xl text-center ${
                isDarkMode 
                  ? 'border-gray-600 hover:border-blue-500' 
                  : 'border-gray-300 hover:border-blue-400'
              } transition-colors cursor-pointer group`}>
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  isDarkMode 
                    ? 'bg-gray-700 group-hover:bg-blue-900/30' 
                    : 'bg-gray-100 group-hover:bg-blue-50'
                } transition-colors`}>
                  <svg className={`w-6 h-6 ${isDarkMode ? 'text-gray-400 group-hover:text-blue-400' : 'text-gray-500 group-hover:text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white group-hover:text-blue-400' : 'text-gray-900 group-hover:text-blue-600'} transition-colors`}>
                  스터디 일정 추가
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                  새로운 스터디 일정을 추가하고<br />
                  팀원을 모집해보세요
                </p>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">
            {/* 스터디 통계 */}
            <section className={`backdrop-blur-sm rounded-xl shadow-sm border p-4 sm:p-6 hover:shadow-md transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/70 border-gray-700' 
                : 'bg-white/70 border-gray-200'
            }`}>
              <h2 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>스터디 정보</h2>
              <div className="space-y-4">
                <div>
                  <h3 className={`font-semibold text-base mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{currentStudy.name}</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{currentStudy.description}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>시간</span>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{currentStudy.time}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>장소</span>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{currentStudy.location}</span>
                </div>
                
                <div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>참석자 ({currentStudy.participants.length}명)</span>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {currentStudy.participants.map((participant: string, index: number) => (
                      <span key={index} className={`text-xs px-2 py-1 rounded-full ${
                        isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {participant}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>


          </div>
        </div>
      </main>

      {/* 스터디 추가 모달 */}
      {isAddStudyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border`}>
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className={`text-lg sm:text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  새 스터디 추가
                </h3>
                <button
                  onClick={() => setIsAddStudyModalOpen(false)}
                  className={`p-2 sm:p-3 rounded-lg transition-colors touch-manipulation ${
                    isDarkMode ? 'text-gray-400 hover:bg-gray-700 active:bg-gray-600' : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
                  }`}
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleAddStudy} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      스터디 이름
                    </label>
                    <input
                      type="text"
                      value={newStudyForm.studyName}
                      onChange={(e) => setNewStudyForm(prev => ({ ...prev, studyName: e.target.value }))}
                      className={`w-full px-4 py-3 sm:px-3 sm:py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="예: React 심화 스터디"
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      시간
                    </label>
                    <input
                      type="text"
                      value={newStudyForm.time}
                      onChange={(e) => setNewStudyForm(prev => ({ ...prev, time: e.target.value }))}
                      className={`w-full px-4 py-3 sm:px-3 sm:py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="예: 월/수 19:00-21:00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    장소
                  </label>
                  <input
                    type="text"
                    value={newStudyForm.location}
                    onChange={(e) => setNewStudyForm(prev => ({ ...prev, location: e.target.value }))}
                    className={`w-full px-4 py-3 sm:px-3 sm:py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="예: 스터디룸 A 또는 온라인 (Zoom)"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    설명
                  </label>
                  <textarea
                    value={newStudyForm.description}
                    onChange={(e) => setNewStudyForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className={`w-full px-4 py-3 sm:px-3 sm:py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="스터디에 대한 자세한 설명을 적어주세요"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      아이콘
                    </label>
                    <select
                      value={newStudyForm.icon}
                      onChange={(e) => setNewStudyForm(prev => ({ ...prev, icon: e.target.value }))}
                      className={`w-full px-4 py-3 sm:px-3 sm:py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    >
                      <option value="JS">JS</option>
                      <option value="RE">React</option>
                      <option value="VU">Vue</option>
                      <option value="NG">Angular</option>
                      <option value="PY">Python</option>
                      <option value="JA">Java</option>
                      <option value="AL">Algorithm</option>
                      <option value="DS">Data Science</option>
                      <option value="AI">AI/ML</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      색상
                    </label>
                    <select
                      value={newStudyForm.color}
                      onChange={(e) => setNewStudyForm(prev => ({ ...prev, color: e.target.value }))}
                      className={`w-full px-4 py-3 sm:px-3 sm:py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    >
                      <option value="from-blue-500 to-blue-600">파랑</option>
                      <option value="from-green-500 to-emerald-600">초록</option>
                      <option value="from-purple-500 to-indigo-600">보라</option>
                      <option value="from-yellow-400 to-orange-500">주황</option>
                      <option value="from-red-500 to-pink-600">빨강</option>
                      <option value="from-gray-500 to-gray-600">회색</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      상태
                    </label>
                    <select
                      value={newStudyForm.status}
                      onChange={(e) => setNewStudyForm(prev => ({ ...prev, status: e.target.value as 'recruiting' | 'active' | 'closed' }))}
                      className={`w-full px-4 py-3 sm:px-3 sm:py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    >
                      <option value="recruiting">모집중</option>
                      <option value="active">진행중</option>
                      <option value="closed">마감</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddStudyModalOpen(false)}
                    className={`w-full sm:w-auto px-6 py-3 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors touch-manipulation ${
                      isDarkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 active:bg-gray-500' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400'
                    }`}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 active:from-blue-800 active:to-blue-900 transition-all touch-manipulation"
                  >
                    스터디 추가
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 스터디 상세 팝업 */}
      {isStudyDetailPopupOpen && popupStudyId && (() => {
        const popupStudy = studies.find(s => s.id === popupStudyId);
        if (!popupStudy) return null;
        
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border`}>
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h3 className={`text-lg sm:text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    스터디 상세 정보
                  </h3>
                  <button
                    onClick={closeStudyDetailPopup}
                    className={`p-2 sm:p-3 rounded-lg transition-colors touch-manipulation ${
                      isDarkMode ? 'text-gray-400 hover:bg-gray-700 active:bg-gray-600' : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
                    }`}
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAttendance(popupStudy.id, 'attend');
                      }}
                      className={`w-full sm:w-auto px-6 py-3 sm:px-4 sm:py-2 rounded-lg font-medium border transition-colors touch-manipulation ${
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
                        handleAttendance(popupStudy.id, 'skip');
                      }}
                      className={`w-full sm:w-auto px-6 py-3 sm:px-4 sm:py-2 rounded-lg font-medium border transition-colors touch-manipulation ${
                        userSelections[popupStudy.id] === 'skip'
                          ? 'bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700 active:bg-red-800 active:border-red-800'
                          : 'bg-transparent text-red-600 border-red-600 hover:bg-red-600 hover:text-white active:bg-red-700 active:text-white'
                      }`}
                    >
                      불참석
                    </button>
                    <button
                      onClick={closeStudyDetailPopup}
                      className={`w-full sm:w-auto px-6 py-3 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors touch-manipulation ${
                        isDarkMode 
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 active:bg-gray-500' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400'
                      }`}
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