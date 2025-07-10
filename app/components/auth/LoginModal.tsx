'use client';

import React from 'react';
import { useAuth } from '../../context/AuthContext';

interface LoginModalProps {
  isLoginModalOpen: boolean;
  closeLoginModal: () => void;
  openSignupModal: () => void;
  openForgotPasswordModal: () => void;
  isDarkMode: boolean;
}

export default function LoginModal({
  isLoginModalOpen,
  closeLoginModal,
  openSignupModal,
  openForgotPasswordModal,
  isDarkMode,
}: LoginModalProps) {
  const [loginForm, setLoginForm] = React.useState({
    email: '',
    password: '',
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('로그인 시도:', loginForm);
    alert('로그인 기능이 구현되었습니다!');
    closeLoginModal();
    setLoginForm({ email: '', password: '' });
  };

  const handleCloseLogin = () => {
    closeLoginModal();
    setLoginForm({ email: '', password: '' });
  };

  if (!isLoginModalOpen) return null;

  return (
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
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
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
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
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
              type="button"
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
  );
}
