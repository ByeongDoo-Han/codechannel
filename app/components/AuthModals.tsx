'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModals() {
  const { 
    isLoginModalOpen, 
    isSignupModalOpen, 
    isForgotPasswordModalOpen,
    openLoginModal, 
    closeLoginModal, 
    openSignupModal, 
    closeSignupModal,
    openForgotPasswordModal,
    closeForgotPasswordModal
  } = useAuth();

  // Hydration-safe 상태 관리
  const [isClient, setIsClient] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // 클라이언트에서만 실행되도록 보장
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 로그인 폼 상태 관리
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  // 회원가입 폼 상태 관리
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // 비밀번호 찾기 폼 상태 관리
  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    email: ''
  });

  // 비밀번호 찾기 단계 관리 (1: 이메일 입력, 2: 인증 완료)
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);

  // 다크모드 감지
  useEffect(() => {
    if (!isClient) return;
    
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    
    checkDarkMode();
    
    // 옵저버로 다크모드 변경 감지
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, [isClient]);

  // URL 해시 감지
  useEffect(() => {
    if (!isClient) return;
    
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#login') {
        openLoginModal();
      } else if (hash === '#signup') {
        openSignupModal();
      } else if (hash === '#forgot-password') {
        openForgotPasswordModal();
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]);

  // 로그인 폼 핸들러
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 로그인 처리 로직 (임시로 콘솔에 출력)
    console.log('로그인 시도:', loginForm);
    // 실제 로그인 처리 후 모달 닫기
    alert('로그인 기능이 구현되었습니다!');
    closeLoginModal();
    setLoginForm({ email: '', password: '' });
  };

  // 회원가입 폼 핸들러
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 비밀번호 확인 검증
    if (signupForm.password !== signupForm.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    // 회원가입 처리 로직 (임시로 콘솔에 출력)
    console.log('회원가입 시도:', signupForm);
    // 실제 회원가입 처리 후 모달 닫기
    alert('회원가입이 완료되었습니다!');
    closeSignupModal();
    setSignupForm({ name: '', email: '', password: '', confirmPassword: '' });
  };

  // 모달 닫기 핸들러
  const handleCloseLogin = () => {
    closeLoginModal();
    setLoginForm({ email: '', password: '' });
  };

  const handleCloseSignup = () => {
    closeSignupModal();
    setSignupForm({ name: '', email: '', password: '', confirmPassword: '' });
  };

  const handleCloseForgotPassword = () => {
    closeForgotPasswordModal();
    setForgotPasswordForm({ email: '' });
    setForgotPasswordStep(1);
  };

  // 비밀번호 찾기 폼 핸들러
  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (forgotPasswordStep === 1) {
      // 이메일 검증 및 인증 메일 발송
      if (!forgotPasswordForm.email.trim()) {
        alert('이메일을 입력해주세요.');
        return;
      }
      
      // 실제로는 서버에 이메일 발송 요청
      console.log('비밀번호 찾기 이메일 발송:', forgotPasswordForm.email);
      alert(`${forgotPasswordForm.email}로 비밀번호 재설정 링크를 발송했습니다.`);
      setForgotPasswordStep(2);
    }
  };

  return (
    <>
      {/* 로그인 모달 */}
      {isLoginModalOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          onClick={handleCloseLogin}
        >
          <div 
            className={`rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                로그인
              </h2>
              <button
                onClick={handleCloseLogin}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  이메일
                </label>
                <input
                  type="email"
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="example@email.com"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  비밀번호
                </label>
                <input
                  type="password"
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    로그인 상태 유지
                  </span>
                </label>
                <button
                  type="button"
                  onClick={openForgotPasswordModal}
                  className={`text-sm font-medium transition-colors ${
                    isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                  }`}
                >
                  비밀번호 찾기
                </button>
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
              >
                로그인
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                아직 계정이 없으신가요?{' '}
                <button
                  onClick={openSignupModal}
                  className={`font-medium transition-colors ${
                    isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                  }`}
                >
                  회원가입
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 회원가입 모달 */}
      {isSignupModalOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          onClick={handleCloseSignup}
        >
          <div 
            className={`rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                회원가입
              </h2>
              <button
                onClick={handleCloseSignup}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  이름
                </label>
                <input
                  type="text"
                  required
                  value={signupForm.name}
                  onChange={(e) => setSignupForm({...signupForm, name: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="이름을 입력하세요"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  이메일
                </label>
                <input
                  type="email"
                  required
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="example@email.com"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  비밀번호
                </label>
                <input
                  type="password"
                  required
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
              
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  required
                  value={signupForm.confirmPassword}
                  onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="비밀번호를 다시 입력하세요"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  <a href="#" className={`font-medium transition-colors ${
                    isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                  }`}>
                    이용약관
                  </a>
                  {' '}및{' '}
                  <a href="#" className={`font-medium transition-colors ${
                    isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                  }`}>
                    개인정보처리방침
                  </a>
                  에 동의합니다.
                </span>
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
              >
                회원가입
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                이미 계정이 있으신가요?{' '}
                <button
                  onClick={openLoginModal}
                  className={`font-medium transition-colors ${
                    isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                  }`}
                >
                  로그인
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 비밀번호 찾기 모달 */}
      {isForgotPasswordModalOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          onClick={handleCloseForgotPassword}
        >
          <div 
            className={`rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 border ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                비밀번호 찾기
              </h2>
              <button
                onClick={handleCloseForgotPassword}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {forgotPasswordStep === 1 ? (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div className="text-center mb-6">
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    가입하신 이메일 주소를 입력해주세요.<br />
                    비밀번호 재설정 링크를 보내드리겠습니다.
                  </p>
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    이메일
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotPasswordForm.email}
                    onChange={(e) => setForgotPasswordForm({...forgotPasswordForm, email: e.target.value})}
                    className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="example@email.com"
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
                >
                  재설정 링크 발송
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  이메일을 확인해주세요
                </h3>
                
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <span className="font-medium">{forgotPasswordForm.email}</span>로<br />
                  비밀번호 재설정 링크를 발송했습니다.<br />
                  메일을 확인하고 링크를 클릭해주세요.
                </p>
                
                <div className="space-y-3 pt-4">
                  <button
                    onClick={() => setForgotPasswordStep(1)}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                      isDarkMode 
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    다른 이메일로 재발송
                  </button>
                  
                  <button
                    onClick={handleCloseForgotPassword}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
                  >
                    확인
                  </button>
                </div>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                기억이 나셨나요?{' '}
                <button
                  onClick={openLoginModal}
                  className={`font-medium transition-colors ${
                    isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                  }`}
                >
                  로그인
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 