'use client';

import React from 'react';
import axios from 'axios';
import { Phetsarath } from 'next/font/google';

interface SignupModalProps {
  isSignupModalOpen: boolean;
  closeSignupModal: () => void;
  openLoginModal: () => void;
  isDarkMode: boolean;
}

export default function SignupModal({
  isSignupModalOpen,
  closeSignupModal,
  openLoginModal,
  isDarkMode,
}: SignupModalProps) {
  const [signupForm, setSignupForm] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupForm.password !== signupForm.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:8080/api/v1/auth/register',
        {
          name: signupForm.name,
          email: signupForm.email,
          password: signupForm.password,
          phoneNumber: signupForm.phoneNumber,
        },
        {
          withCredentials: true, // 👉 refreshToken을 HttpOnly 쿠키로 받을 때 필요
        }
      );

      const { accessToken } = response.data;

      // accessToken 저장
      localStorage.setItem('accessToken', accessToken);

    } catch (err) {
      console.error('회원가입 실패:', err);
    }

    console.log('회원가입 시도:', signupForm);
    closeSignupModal();
    setSignupForm({ name: '', email: '', password: '', confirmPassword: '', phoneNumber: '' });
  };

  const handleCloseSignup = () => {
    closeSignupModal();
    setSignupForm({ name: '', email: '', password: '', confirmPassword: '', phoneNumber: '' });
  };

  if (!isSignupModalOpen) return null;

  return (
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
              onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
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
              onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
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
              onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
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
              onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
              className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="비밀번호를 다시 입력하세요"
            />
          </div>

          {/* <div className="flex items-center">
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
              {' '}
              및{' '}
              <a href="#" className={`font-medium transition-colors ${
                isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
              }`}>
                개인정보처리방침
              </a>
              에 동의합니다.
            </span>
          </div> */}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
            onClick={handleSignupSubmit}
          >
            회원가입
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            이미 계정이 있으신가요?{' '}
            <button
              type="button"
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
  );
}
