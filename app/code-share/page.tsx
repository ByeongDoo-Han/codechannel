'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function CodeShare() {
  // Hydration-safe 상태 관리
  const [isClient, setIsClient] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  
  // Auth Context 사용
  const { openLoginModal, openSignupModal } = useAuth();
  
  // 클라이언트에서만 실행되도록 보장
  useEffect(() => {
    setIsClient(true);
  }, []);
  const [codes, setCodes] = useState([
    {
      id: 1,
      title: 'React Custom Hook 모음',
      description: '자주 사용하는 React Custom Hook들을 정리했습니다.',
      code: 'const useLocalStorage = (key, initialValue) => {\n  // Hook implementation...\n}',
      language: 'javascript',
      author: '김리액트',
      tags: ['React', 'Hook'],
      likes: 24,
      downloads: 89,
      createdAt: '2시간 전',
      images: [] as string[]
    },
    {
      id: 2,
      title: 'CSS 애니메이션 컬렉션',
      description: '다양한 CSS 애니메이션 효과들을 모아놨습니다.',
      code: '@keyframes fadeIn {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}',
      language: 'css',
      author: '이디자인',
      tags: ['CSS', '애니메이션'],
      likes: 18,
      downloads: 45,
      createdAt: '4시간 전',
      images: [] as string[]
    }
  ]);

  // 코드 공유 폼 상태
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    language: 'javascript',
    tags: '',
    images: [] as File[]
  });

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.code.trim()) return;

    const newCode = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      code: formData.code,
      language: formData.language,
      author: '사용자',
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      likes: 0,
      downloads: 0,
      createdAt: '방금 전',
      images: formData.images.map(file => URL.createObjectURL(file))
    };

    setCodes([newCode, ...codes]);
    setFormData({ title: '', description: '', code: '', language: 'javascript', tags: '', images: [] });
    setIsWriteOpen(false);
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
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>프로젝트</a>
              <a href="/code-share" className={`transition-colors font-medium text-base ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              } border-b-2 border-blue-500`}>코드 공유</a>
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
                    <path d="M17.293 13.293A8 8 0 716.707 2.707a8.001 8.001 0 1010.586 10.586z" />
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
              <button onClick={toggleDarkMode} className={`p-3 rounded-lg transition-colors touch-manipulation ${
                isDarkMode ? 'text-yellow-400 hover:bg-gray-700 active:bg-gray-600' : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
              }`}>
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 716.707 2.707a8.001 8.001 0 1010.586 10.586z" />
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
                  isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700 active:bg-gray-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
                }`}>프로젝트</a>
                <a href="/code-share" className={`block py-3 px-2 rounded-lg transition-colors touch-manipulation ${
                  isDarkMode ? 'text-white bg-gray-700' : 'text-gray-900 bg-gray-100'
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
                    className={`block w-full py-3 px-2 rounded-lg transition-colors touch-manipulation text-left ${
                      isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700 active:bg-gray-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
                    }`}
                  >
                    로그인
                  </button>
                  <button 
                    onClick={openSignupModal}
                    className={`block w-full py-3 px-2 rounded-lg transition-colors touch-manipulation text-left ${
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

      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
        {/* Page Title */}
        <div className="mb-6 sm:mb-8">
          <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            코드 공유
          </h1>
          <p className={`mt-2 text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            유용한 코드를 공유하고 다운로드하세요
          </p>
        </div>

        {/* Write Button */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => setIsWriteOpen(!isWriteOpen)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all shadow-lg ${
              isWriteOpen
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-red-200'
                : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700 shadow-purple-200'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isWriteOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              )}
            </svg>
            <span>{isWriteOpen ? '취소' : '글쓰기'}</span>
          </button>
        </div>

        {/* Write Section */}
        {isWriteOpen && (
          <div className={`backdrop-blur-sm rounded-xl shadow-sm border p-4 sm:p-6 mb-6 sm:mb-8 transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-800/70 border-gray-700' 
              : 'bg-white/70 border-gray-200'
          }`}>
            <div className="mb-4">
              <h2 className={`text-lg sm:text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                코드 공유하기
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    제목
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    placeholder="코드 제목을 입력하세요"
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    언어
                  </label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="css">CSS</option>
                    <option value="html">HTML</option>
                    <option value="react">React</option>
                    <option value="vue">Vue</option>
                    <option value="angular">Angular</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  설명
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="코드에 대한 설명을 입력하세요"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  코드
                </label>
                <textarea
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  rows={8}
                  className={`w-full px-3 py-2 rounded-lg border font-mono text-sm ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="코드를 입력하세요..."
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  태그 (쉼표로 구분)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="React, Hook, 유틸리티"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  이미지 첨부
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {formData.images.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.images.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index}`}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsWriteOpen(false)}
                  className={`px-4 py-2 rounded-lg border transition-colors ${
                    isDarkMode 
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  코드 공유하기
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Code List */}
        <div className="space-y-4 sm:space-y-6">
          {codes.map((code) => (
            <div
              key={code.id}
              className={`backdrop-blur-sm rounded-xl shadow-sm border p-4 sm:p-6 hover:shadow-md transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800/70 border-gray-700' 
                  : 'bg-white/70 border-gray-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {code.language}
                    </span>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {code.author} • {code.createdAt}
                    </span>
                  </div>
                  <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {code.title}
                  </h3>
                  <p className={`text-sm sm:text-base mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {code.description}
                  </p>
                  <div className={`bg-gray-900 rounded-lg p-3 mb-3 overflow-x-auto`}>
                    <pre className="text-green-400 text-sm">
                      <code>{code.code}</code>
                    </pre>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {code.tags.map((tag, index) => (
                      <span key={index} className={`text-xs px-2 py-1 rounded-full ${
                        isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <button className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span className="text-sm">{code.likes}</span>
                  </button>
                  <button className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span className="text-sm">{code.downloads}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 