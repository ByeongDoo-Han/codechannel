'use client';

import { useState } from 'react';

export default function My() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // 더미 데이터
  const myData = {
    posts: [
      { id: 1, title: 'React Hook 사용법 질문드립니다', category: 'Q&A', date: '2024-03-15', views: 23, replies: 5 },
      { id: 2, title: 'JavaScript 비동기 처리 팁 공유', category: '커뮤니티', date: '2024-03-12', views: 45, replies: 8 },
      { id: 3, title: 'Algorithm 문제 해결 방법', category: '커뮤니티', date: '2024-03-10', views: 32, replies: 3 }
    ],
    comments: [
      { id: 1, post: 'TypeScript 타입 정의 방법', content: '정말 도움이 되는 글이네요. 감사합니다!', date: '2024-03-14' },
      { id: 2, post: 'CSS Grid vs Flexbox', content: 'Grid는 2차원 레이아웃에 더 적합한 것 같아요.', date: '2024-03-13' },
      { id: 3, post: 'Node.js 성능 최적화', content: '캐싱 전략도 중요한 포인트입니다.', date: '2024-03-11' }
    ],
    studies: {
      upcoming: [
        { id: 1, name: 'JavaScript Deep Dive', date: '2024-03-20', time: '19:00-21:00', location: '스터디룸 A' },
        { id: 2, name: 'Algorithm Study', date: '2024-03-23', time: '14:00-17:00', location: '스터디룸 B' }
      ],
      completed: [
        { id: 3, name: 'React Study', date: '2024-03-08', time: '20:00-22:00', location: '온라인 (Zoom)' },
        { id: 4, name: 'JavaScript Deep Dive', date: '2024-03-05', time: '19:00-21:00', location: '스터디룸 A' },
        { id: 5, name: 'Algorithm Study', date: '2024-03-02', time: '14:00-17:00', location: '스터디룸 B' }
      ]
    },
    codes: [
      { id: 1, title: 'React Custom Hook 예제', language: 'JavaScript', date: '2024-03-14', likes: 12 },
      { id: 2, title: 'Python 크롤링 스크립트', language: 'Python', date: '2024-03-10', likes: 8 },
      { id: 3, title: 'CSS 애니메이션 컴포넌트', language: 'CSS', date: '2024-03-07', likes: 15 }
    ]
  };

  const tabs = [
    { id: 'posts', label: '내 게시물', count: myData.posts.length },
    { id: 'comments', label: '내 댓글', count: myData.comments.length },
    { id: 'studies', label: '참석 스터디', count: myData.studies.upcoming.length + myData.studies.completed.length },
    { id: 'codes', label: '내 코드', count: myData.codes.length }
  ];

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

            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'text-yellow-400 hover:bg-gray-700' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {isDarkMode ? '🌞' : '🌙'}
              </button>
              
              <a href="#login" className={`transition-colors font-medium text-base ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>로그인</a>
              <a href="#signup" className={`transition-colors font-medium text-base ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>회원가입</a>
              <a href="/my" className={`transition-colors font-medium text-base ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              } border-b-2 border-blue-500`}>MY</a>
            </div>

            {/* Mobile Right Side */}
            <div className="flex lg:hidden items-center space-x-2">
              {/* Dark Mode Toggle - Mobile */}
              <button
                onClick={toggleDarkMode}
                className={`p-3 rounded-lg transition-colors touch-manipulation ${
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
                className={`p-3 rounded-lg transition-colors touch-manipulation ${
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
                  <a href="#login" className={`block py-3 px-2 rounded-lg transition-colors touch-manipulation ${
                    isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700 active:bg-gray-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
                  }`}>로그인</a>
                  <a href="#signup" className={`block py-3 px-2 rounded-lg transition-colors touch-manipulation ${
                    isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700 active:bg-gray-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
                  }`}>회원가입</a>
                  <a href="/my" className={`block py-3 px-2 rounded-lg transition-colors touch-manipulation text-center ${
                    isDarkMode ? 'text-white bg-gray-700' : 'text-gray-900 bg-gray-100'
                  }`}>MY</a>
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
            MY
          </h1>
          <p className={`mt-2 text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            내 활동 내역을 한눈에 확인해보세요
          </p>
        </div>

        {/* Tabs */}
        <div className={`backdrop-blur-sm rounded-xl shadow-sm border p-4 sm:p-6 mb-6 ${
          isDarkMode 
            ? 'bg-gray-800/70 border-gray-700' 
            : 'bg-white/70 border-gray-200'
        }`}>
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab: any) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? isDarkMode
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-500 text-white'
                    : isDarkMode
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className={`backdrop-blur-sm rounded-xl shadow-sm border p-4 sm:p-6 ${
          isDarkMode 
            ? 'bg-gray-800/70 border-gray-700' 
            : 'bg-white/70 border-gray-200'
        }`}>
          {/* 내 게시물 */}
          {activeTab === 'posts' && (
            <div className="space-y-4">
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>내 게시물</h2>
              {myData.posts.map((post: any) => (
                <div key={post.id} className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                  isDarkMode 
                    ? 'border-gray-700 hover:border-gray-600' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{post.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      post.category === 'Q&A' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-green-100 text-green-700'
                    }`}>{post.category}</span>
                  </div>
                  <div className={`text-sm flex gap-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>{post.date}</span>
                    <span>조회 {post.views}</span>
                    <span>댓글 {post.replies}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 내 댓글 */}
          {activeTab === 'comments' && (
            <div className="space-y-4">
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>내 댓글</h2>
              {myData.comments.map((comment: any) => (
                <div key={comment.id} className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                  isDarkMode 
                    ? 'border-gray-700 hover:border-gray-600' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="mb-2">
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {comment.post}에 댓글
                    </span>
                  </div>
                  <p className={`mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{comment.content}</p>
                  <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{comment.date}</span>
                </div>
              ))}
            </div>
          )}

          {/* 참석 스터디 */}
          {activeTab === 'studies' && (
            <div className="space-y-6">
              <div>
                <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>예정된 스터디</h2>
                <div className="space-y-3">
                  {myData.studies.upcoming.map((study: any) => (
                    <div key={study.id} className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                      isDarkMode 
                        ? 'border-blue-700 bg-blue-900/20' 
                        : 'border-blue-200 bg-blue-50'
                    }`}>
                      <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{study.name}</h3>
                      <div className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        <div>📅 {study.date} {study.time}</div>
                        <div>📍 {study.location}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>지난 스터디</h2>
                <div className="space-y-3">
                  {myData.studies.completed.map((study: any) => (
                    <div key={study.id} className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                      isDarkMode 
                        ? 'border-gray-700 hover:border-gray-600' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{study.name}</h3>
                      <div className={`text-sm space-y-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <div>📅 {study.date} {study.time}</div>
                        <div>📍 {study.location}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 내 코드 */}
          {activeTab === 'codes' && (
            <div className="space-y-4">
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>내 코드</h2>
              {myData.codes.map((code: any) => (
                <div key={code.id} className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                  isDarkMode 
                    ? 'border-gray-700 hover:border-gray-600' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{code.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      code.language === 'JavaScript' 
                        ? 'bg-yellow-100 text-yellow-700'
                        : code.language === 'Python'
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-purple-100 text-purple-700'
                    }`}>{code.language}</span>
                  </div>
                  <div className={`text-sm flex gap-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <span>{code.date}</span>
                    <span>👍 {code.likes}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 