'use client';

import { useState, useEffect } from 'react';

export default function Schedule() {
  // Hydration-safe 상태 관리
  const [isClient, setIsClient] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>('ecommerce');
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isProjectDetailPopupOpen, setIsProjectDetailPopupOpen] = useState(false);
  const [popupProjectId, setPopupProjectId] = useState<string | null>(null);
  
  // 클라이언트에서만 실행되도록 보장
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 프로젝트 추가 폼 상태
  const [newProjectForm, setNewProjectForm] = useState({
    name: '',
    description: '',
    tech: '',
    status: 'planning' as 'planning' | 'development' | 'testing' | 'deployed',
    startDate: '',
    endDate: '',
    repository: ''
  });

  // 프로젝트 데이터
  const [projectData, setProjectData] = useState<Record<string, {
    name: string;
    description: string;
    tech: string[];
    status: 'planning' | 'development' | 'testing' | 'deployed';
    team: string[];
    startDate: string;
    endDate: string;
    progress: number;
    repository: string;
  }>>({
    ecommerce: {
      name: 'E-Commerce Platform',
      description: 'React와 Node.js를 사용한 전자상거래 플랫폼 개발',
      tech: ['React', 'Node.js', 'MongoDB', 'Express'],
      status: 'development',
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
      status: 'testing',
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
      status: 'planning',
      team: ['정수아', '최민준', '윤하늘', '한지민'],
      startDate: '2024-03-15',
      endDate: '2024-06-15',
      progress: 20,
      repository: 'https://github.com/team/analytics-dashboard'
    }
      });

  // URL 쿼리 파라미터 확인
  useEffect(() => {
    if (!isClient) return;
    const urlParams = new URLSearchParams(window.location.search);
    const popup = urlParams.get('popup');
    if (popup && projectData[popup]) {
      setPopupProjectId(popup);
      setIsProjectDetailPopupOpen(true);
      setSelectedProject(popup);
    }
  }, [isClient, projectData]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // 프로젝트 상세 팝업 닫기
  const closeProjectDetailPopup = () => {
    setIsProjectDetailPopupOpen(false);
    setPopupProjectId(null);
    // URL에서 쿼리 파라미터 제거
    if (isClient) {
      const url = new URL(window.location.href);
      url.searchParams.delete('popup');
      window.history.replaceState({}, '', url.toString());
    }
  };

  // 프로젝트 추가 처리
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectForm.name.trim() || !newProjectForm.description.trim()) return;

    const projectId = Date.now().toString();
    const newProject = {
      name: newProjectForm.name,
      description: newProjectForm.description,
      tech: newProjectForm.tech.split(',').map(t => t.trim()).filter(t => t),
      status: newProjectForm.status,
      team: ['프로젝트 매니저'],
      startDate: newProjectForm.startDate || new Date().toISOString().split('T')[0],
      endDate: newProjectForm.endDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      progress: 0,
      repository: newProjectForm.repository || `https://github.com/team/${newProjectForm.name.toLowerCase().replace(/\s+/g, '-')}`
    };

    setProjectData(prev => ({
      ...prev,
      [projectId]: newProject
    }));

    setNewProjectForm({
      name: '',
      description: '',
      tech: '',
      status: 'planning',
      startDate: '',
      endDate: '',
      repository: ''
    });
    setIsAddProjectModalOpen(false);
    setSelectedProject(projectId);
  };

  // 현재 선택된 프로젝트 데이터
  const currentProject = projectData[selectedProject];

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
      <header className={`backdrop-blur-md shadow-sm border-b sticky top-0 z-50 transition-colors duration-300 ${
        isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <nav className="flex justify-between items-center">
            <div className="flex items-center">
              <a href="/main" className="text-xl sm:text-2xl font-bold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                  Code Channel
                </span>
              </a>
            </div>

            <div className="hidden lg:flex items-center space-x-6">
              <a href="/study" className={`transition-colors font-medium text-base ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>스터디</a>
              <a href="/schedule" className={`transition-colors font-medium text-base ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              } border-b-2 border-blue-500`}>프로젝트</a>
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

            <div className="hidden lg:flex items-center space-x-4">
              <button onClick={toggleDarkMode} className={`p-2 rounded-lg transition-colors ${
                isDarkMode ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
              }`}>
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
              <a href="#login" className={`transition-colors font-medium text-base ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>로그인</a>
              <a href="#signup" className={`transition-colors font-medium text-base ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>회원가입</a>
              <a href="/my" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-medium text-base hover:from-blue-700 hover:to-blue-800 transition-all shadow-md">
                MY
              </a>
            </div>

            {/* Mobile Right Side */}
            <div className="flex lg:hidden items-center space-x-2">
              <button onClick={toggleDarkMode} className={`p-3 rounded-lg transition-colors touch-manipulation ${
                isDarkMode ? 'text-yellow-400 hover:bg-gray-700 active:bg-gray-600' : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
              }`}>
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

              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`p-3 rounded-lg transition-colors touch-manipulation ${
                isDarkMode ? 'text-gray-300 hover:bg-gray-700 active:bg-gray-600' : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
              }`}>
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
                  isDarkMode ? 'text-white bg-gray-700' : 'text-gray-900 bg-gray-100'
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
                  <a href="#login" className={`block py-3 px-2 rounded-lg transition-colors touch-manipulation ${
                    isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700 active:bg-gray-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
                  }`}>로그인</a>
                  <a href="#signup" className={`block py-3 px-2 rounded-lg transition-colors touch-manipulation ${
                    isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700 active:bg-gray-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
                  }`}>회원가입</a>
                  <a href="/my" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium text-base hover:from-blue-700 hover:to-blue-800 transition-all shadow-md touch-manipulation text-center block">
                    MY
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
        {/* Page Title */}
        <div className="mb-6 sm:mb-8">
          <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            프로젝트
          </h1>
          <p className={`mt-2 text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            개발 프로젝트와 팀 프로젝트를 관리하세요
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Project List */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* 진행 중인 프로젝트 */}
            <section className={`backdrop-blur-sm rounded-xl shadow-sm border p-4 sm:p-6 hover:shadow-md transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/70 border-gray-700' 
                : 'bg-white/70 border-gray-200'
            }`}>
              <h2 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>진행 중인 프로젝트</h2>
              <div className="space-y-3 sm:space-y-4">
                {Object.entries(projectData).map(([projectId, project]) => {
                  // 프로젝트 이름의 첫 글자들로 아이콘 생성
                  const getProjectIcon = (name: string) => {
                    const words = name.split(' ');
                    return words.length > 1 
                      ? words.slice(0, 2).map(word => word[0]).join('').toUpperCase()
                      : name.slice(0, 2).toUpperCase();
                  };

                  // 프로젝트별 색상 배치
                  const getProjectColor = (index: number) => {
                    const colors = [
                      'from-blue-500 to-purple-600',
                      'from-purple-500 to-pink-600', 
                      'from-yellow-500 to-orange-600',
                      'from-green-500 to-blue-600',
                      'from-red-500 to-purple-600',
                      'from-indigo-500 to-blue-600'
                    ];
                    return colors[index % colors.length];
                  };

                  // 상태별 스타일
                  const getStatusStyle = (status: string) => {
                    switch (status) {
                      case 'development': return 'bg-green-100 text-green-700';
                      case 'testing': return 'bg-orange-100 text-orange-700';
                      case 'planning': return 'bg-blue-100 text-blue-700';
                      case 'deployed': return 'bg-purple-100 text-purple-700';
                      default: return 'bg-gray-100 text-gray-700';
                    }
                  };

                  // 상태별 텍스트
                  const getStatusText = (status: string) => {
                    switch (status) {
                      case 'development': return '개발중';
                      case 'testing': return '테스트';
                      case 'planning': return '기획';
                      case 'deployed': return '배포';
                      default: return status;
                    }
                  };

                  const projectIndex = Object.keys(projectData).indexOf(projectId);

                  return (
                    <div 
                      key={projectId}
                      onClick={() => {
                        setSelectedProject(projectId);
                        setPopupProjectId(projectId);
                        setIsProjectDetailPopupOpen(true);
                      }}
                      className={`group p-3 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                        selectedProject === projectId
                          ? isDarkMode 
                            ? 'border-blue-500 bg-blue-900/30' 
                            : 'border-blue-400 bg-blue-50'
                          : isDarkMode 
                            ? 'border-gray-700 hover:border-blue-600 hover:bg-blue-900/20' 
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                      }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${getProjectColor(projectIndex)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <span className="text-white font-bold text-xs sm:text-sm">{getProjectIcon(project.name)}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className={`font-semibold group-hover:text-blue-700 text-sm sm:text-base ${
                              isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>{project.name}</h3>
                            <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {project.startDate} - {project.endDate} • {project.team.length}명
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(project.status)}`}>
                            {getStatusText(project.status)}
                          </span>
                          <div className={`w-16 h-2 bg-gray-200 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                            <div className={`h-2 rounded-full ${
                              project.status === 'development' ? 'bg-green-500' :
                              project.status === 'testing' ? 'bg-orange-500' :
                              project.status === 'planning' ? 'bg-blue-500' :
                              'bg-purple-500'
                            }`} style={{width: `${project.progress}%`}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 프로젝트 생성하기 */}
            <section className={`backdrop-blur-sm rounded-xl shadow-sm border p-4 sm:p-6 hover:shadow-md transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/70 border-gray-700' 
                : 'bg-white/70 border-gray-200'
            }`}>
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <h2 className={`text-lg sm:text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>프로젝트 만들기</h2>
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>(팀장 권한)</span>
              </div>
              <div 
                onClick={() => setIsAddProjectModalOpen(true)}
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
                  새 프로젝트 시작
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
                  새로운 개발 프로젝트를 시작하고<br />
                  팀원을 모집해보세요
                </p>
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">
            {/* 프로젝트 정보 */}
            <section className={`backdrop-blur-sm rounded-xl shadow-sm border p-4 sm:p-6 hover:shadow-md transition-all duration-300 ${
              isDarkMode 
                ? 'bg-gray-800/70 border-gray-700' 
                : 'bg-white/70 border-gray-200'
            }`}>
              <h2 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>프로젝트 정보</h2>
              <div className="space-y-4">
                <div>
                  <h3 className={`font-semibold text-base mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{currentProject.name}</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{currentProject.description}</p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>진행률</span>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{currentProject.progress}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>상태</span>
                  <span className={`font-semibold capitalize ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {currentProject.status === 'development' ? '개발중' : 
                     currentProject.status === 'testing' ? '테스트' : 
                     currentProject.status === 'planning' ? '기획' : '배포'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>기간</span>
                  <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {currentProject.startDate} ~ {currentProject.endDate}
                  </span>
                </div>
                
                <div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>기술 스택</span>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {currentProject.tech.map((tech: string, index: number) => (
                      <span key={index} className={`text-xs px-2 py-1 rounded-full ${
                        isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>팀원 ({currentProject.team.length}명)</span>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {currentProject.team.map((member: string, index: number) => (
                      <span key={index} className={`text-xs px-2 py-1 rounded-full ${
                        isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {member}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <a 
                    href={currentProject.repository} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`inline-flex items-center space-x-2 text-sm font-medium transition-colors ${
                      isDarkMode 
                        ? 'text-blue-400 hover:text-blue-300' 
                        : 'text-blue-600 hover:text-blue-500'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                    <span>Repository</span>
                  </a>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* 프로젝트 추가 모달 */}
      {isAddProjectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } border`}>
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className={`text-lg sm:text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  새 프로젝트 추가
                </h3>
                <button
                  onClick={() => setIsAddProjectModalOpen(false)}
                  className={`p-2 sm:p-3 rounded-lg transition-colors touch-manipulation ${
                    isDarkMode ? 'text-gray-400 hover:bg-gray-700 active:bg-gray-600' : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
                  }`}
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleAddProject} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      프로젝트 이름
                    </label>
                    <input
                      type="text"
                      value={newProjectForm.name}
                      onChange={(e) => setNewProjectForm(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-4 py-3 sm:px-3 sm:py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                      placeholder="예: Todo App"
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      상태
                    </label>
                    <select
                      value={newProjectForm.status}
                      onChange={(e) => setNewProjectForm(prev => ({ ...prev, status: e.target.value as 'planning' | 'development' | 'testing' | 'deployed' }))}
                      className={`w-full px-4 py-3 sm:px-3 sm:py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    >
                      <option value="planning">기획</option>
                      <option value="development">개발중</option>
                      <option value="testing">테스트</option>
                      <option value="deployed">배포</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    설명
                  </label>
                  <textarea
                    value={newProjectForm.description}
                    onChange={(e) => setNewProjectForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className={`w-full px-4 py-3 sm:px-3 sm:py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="프로젝트에 대한 자세한 설명을 적어주세요"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    기술 스택
                  </label>
                  <input
                    type="text"
                    value={newProjectForm.tech}
                    onChange={(e) => setNewProjectForm(prev => ({ ...prev, tech: e.target.value }))}
                    className={`w-full px-4 py-3 sm:px-3 sm:py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="예: React, Node.js, MongoDB (쉼표로 구분)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      시작일
                    </label>
                    <input
                      type="date"
                      value={newProjectForm.startDate}
                      onChange={(e) => setNewProjectForm(prev => ({ ...prev, startDate: e.target.value }))}
                      className={`w-full px-4 py-3 sm:px-3 sm:py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      종료일
                    </label>
                    <input
                      type="date"
                      value={newProjectForm.endDate}
                      onChange={(e) => setNewProjectForm(prev => ({ ...prev, endDate: e.target.value }))}
                      className={`w-full px-4 py-3 sm:px-3 sm:py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    GitHub Repository
                  </label>
                  <input
                    type="url"
                    value={newProjectForm.repository}
                    onChange={(e) => setNewProjectForm(prev => ({ ...prev, repository: e.target.value }))}
                    className={`w-full px-4 py-3 sm:px-3 sm:py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="https://github.com/username/repository (선택사항)"
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddProjectModalOpen(false)}
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
                    프로젝트 추가
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 프로젝트 상세 팝업 */}
      {isProjectDetailPopupOpen && popupProjectId && (() => {
        const popupProject = projectData[popupProjectId];
        if (!popupProject) return null;
        
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border`}>
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h3 className={`text-lg sm:text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    프로젝트 상세 정보
                  </h3>
                  <button
                    onClick={closeProjectDetailPopup}
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