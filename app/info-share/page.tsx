'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function InfoShare() {
  // Hydration-safe 상태 관리
  const [isClient, setIsClient] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  
  // Auth Context 사용
  const { openLoginModal, openSignupModal } = useAuth();
  
  // 클라이언트에서만 실행되도록 보장
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // URL에서 필터링할 카테고리 확인
  useEffect(() => {
    if (!isClient) return;
    const urlParams = new URLSearchParams(window.location.search);
    const filterCategory = urlParams.get('filter');
    if (filterCategory) {
      setSelectedCategory(filterCategory);
    }
  }, [isClient]);

  const [posts, setPosts] = useState([
    {
      id: 1,
      title: '강남역 근처 스터디 카페 추천',
      content: '24시간 운영하는 스터디 카페 몇 곳 추천드립니다. 조용하고 wifi도 빠르고...',
      author: '김스터디',
      tags: ['스터디카페', '강남', '추천'],
      comments: 15,
      likes: 32,
      createdAt: '1시간 전',
      images: [] as string[],
      category: '스터디 카페'
    },
    {
      id: 2,
      title: '네이버 부트 캠프 후기',
      content: '6개월간의 부트 캠프 과정을 마쳤습니다. 솔직한 후기 남겨봅니다.',
      author: '이개발자',
      tags: ['부트캠프', '네이버', '후기'],
      comments: 28,
      likes: 45,
      createdAt: '3시간 전',
      images: [] as string[],
      category: '부트 캠프'
    },
    {
      id: 3,
      title: '인프런 React 강의 추천',
      content: 'React 입문자에게 정말 도움이 되는 강의들을 정리해봤습니다.',
      author: '박리액트',
      tags: ['인프런', 'React', '강의'],
      comments: 12,
      likes: 24,
      createdAt: '5시간 전',
      images: [] as string[],
      category: '강의 추천'
    },
    {
      id: 4,
      title: '카카오 신입 개발자 채용 정보',
      content: '카카오에서 신입 개발자를 채용한다는 소식입니다. 자세한 내용은...',
      author: '최정보',
      tags: ['카카오', '채용', '신입'],
      comments: 35,
      likes: 67,
      createdAt: '1일 전',
      images: [] as string[],
      category: '취업 정보'
    }
  ]);

  // 글쓰기 폼 상태
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: '',
    images: [] as File[],
    category: '스터디 카페' // 기본값
  });

  // 카테고리 옵션
  const categories = [
    '전체',
    '스터디 카페',
    '부트 캠프',
    '강의 추천',
    '취업 정보'
  ];

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
    if (!formData.title.trim() || !formData.content.trim()) return;

    const newPost = {
      id: Date.now(),
      title: formData.title,
      content: formData.content,
      author: '사용자',
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      comments: 0,
      likes: 0,
      createdAt: '방금 전',
      images: formData.images.map(file => URL.createObjectURL(file)),
      category: formData.category
    };

    setPosts([newPost, ...posts]);
    setFormData({ title: '', content: '', tags: '', images: [], category: '스터디 카페' });
    setIsWriteOpen(false);
  };

  // 필터링된 글 목록
  const filteredPosts = selectedCategory === '전체' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

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
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>코드 공유</a>
              <a href="/qa" className={`transition-colors font-medium text-base ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>Q&A</a>
              <a href="/community" className={`transition-colors font-medium text-base ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}>커뮤니티</a>
              <a href="/info-share" className={`transition-colors font-medium text-base ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              } border-b-2 border-blue-500`}>정보 공유</a>
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
                  isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700 active:bg-gray-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
                }`}>코드 공유</a>
                <a href="/qa" className={`block py-3 px-2 rounded-lg transition-colors touch-manipulation ${
                  isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700 active:bg-gray-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
                }`}>Q&A</a>
                <a href="/community" className={`block py-3 px-2 rounded-lg transition-colors touch-manipulation ${
                  isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700 active:bg-gray-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-200'
                }`}>커뮤니티</a>
                <a href="/info-share" className={`block py-3 px-2 rounded-lg transition-colors touch-manipulation ${
                  isDarkMode ? 'text-white bg-gray-700' : 'text-gray-900 bg-gray-100'
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
            정보 공유
          </h1>
          <p className={`mt-2 text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            개발 관련 정보를 공유하고 소통하세요
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                    : isDarkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Write Button */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => setIsWriteOpen(!isWriteOpen)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all shadow-lg ${
              isWriteOpen
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-red-200'
                : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-orange-200'
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
                정보 공유하기
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
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
                    placeholder="제목을 입력하세요"
                    required
                  />
                </div>
                <div className="w-full sm:w-48">
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    카테고리
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  >
                    {categories.filter(cat => cat !== '전체').map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  내용
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={6}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="정보를 자세히 설명해주세요..."
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
                  placeholder="추천, 후기, 정보"
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
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  정보 공유하기
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Result Info */}
        {selectedCategory !== '전체' && (
          <div className="mb-4">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <span className="font-medium text-orange-500">{selectedCategory}</span> 카테고리 글 {filteredPosts.length}개
            </p>
          </div>
        )}

        {/* Post List */}
        <div className="space-y-4 sm:space-y-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className={`backdrop-blur-sm rounded-xl shadow-sm border p-4 sm:p-6 hover:shadow-md transition-all duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800/70 border-gray-700' 
                  : 'bg-white/70 border-gray-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {post.author} • {post.createdAt}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      isDarkMode ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {post.category}
                    </span>
                  </div>
                  <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {post.title}
                  </h3>
                  <p className={`text-sm sm:text-base mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {post.content}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span key={index} className={`text-xs px-2 py-1 rounded-full ${
                        isDarkMode ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
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
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  <button className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span className="text-sm">{post.comments}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-medium mb-2">
              {selectedCategory === '전체' ? '아직 게시글이 없습니다' : `${selectedCategory} 카테고리에 글이 없습니다`}
            </p>
            <p className="text-sm">
              첫 번째 글을 작성해보세요!
            </p>
          </div>
        )}
      </main>
    </div>
  );
} 