'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import LoginModal from './auth/LoginModal';
import SignupModal from './auth/SignupModal';

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

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [forgotPasswordForm, setForgotPasswordForm] = useState({
    email: ''
  });
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);

  // Dark mode detection (simplified for this component)
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    };
    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // URL hash detection (simplified for this component) - only for initial load
  useEffect(() => {
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
  }, [openLoginModal, openSignupModal, openForgotPasswordModal]);

  const handleCloseForgotPassword = () => {
    closeForgotPasswordModal();
    setForgotPasswordForm({ email: '' });
    setForgotPasswordStep(1);
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotPasswordStep === 1) {
      if (!forgotPasswordForm.email.trim()) {
        alert('이메일을 입력해주세요.');
        return;
      }
      console.log('비밀번호 찾기 이메일 발송:', forgotPasswordForm.email);
      alert(`${forgotPasswordForm.email}로 비밀번호 재설정 링크를 발송했습니다.`);
      setForgotPasswordStep(2);
    }
  };

  return (
    <>
      <LoginModal
        isLoginModalOpen={isLoginModalOpen}
        closeLoginModal={closeLoginModal}
        openSignupModal={openSignupModal}
        openForgotPasswordModal={openForgotPasswordModal}
        isDarkMode={isDarkMode}
      />

      <SignupModal
        isSignupModalOpen={isSignupModalOpen}
        closeSignupModal={closeSignupModal}
        openLoginModal={openLoginModal}
        isDarkMode={isDarkMode}
      />

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