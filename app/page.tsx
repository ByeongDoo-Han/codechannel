'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Landing() {
  const [isClient, setIsClient] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  
  // 클라이언트에서만 실행되도록 보장
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleGetStarted = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'code1001') {
      // 성공! 메인 페이지로 이동
      router.push('/main');
    } else {
      // 틀렸을 때 에러 메시지
      setError('비밀번호가 틀렸습니다. 다시 시도해주세요.');
      setPassword('');
    }
  };

  const closeModal = () => {
    setShowPasswordModal(false);
    setPassword('');
    setError('');
  };

  // 클라이언트가 준비되지 않았을 때는 기본 배경만 표시
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="mt-2 text-white">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
        className="min-h-screen flex items-center justify-center bg-animate"
        style={{
          backgroundImage: "url('/p4.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          filter: 'blur(3px)'
        }}
      >
        {/* Background overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/60"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center text-white px-6 max-w-4xl content-animate">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
            Code Channel
          </span>
        </h1>
        <p className="text-sm md:text-lg mb-4 opacity-90 leading-relaxed">
          현직 개발자들과 함께하는 코딩 스터디 모임
          <br />
          <code className="bg-black bg-opacity-20 px-3 py-1 rounded font-mono text-white text-xs md:text-sm">
            npm install friendship --save
            </code>
        </p>
        
                  {/* Single CTA Button */}
          <div className="mt-12 button-animate">
            <button 
              onClick={handleGetStarted}
              className="bg-black bg-opacity-20 px-6 py-3 rounded font-mono text-white text-sm md:text-base hover:bg-opacity-30 transform hover:scale-105 transition-all duration-300 shadow-lg border border-white border-opacity-20 cursor-pointer"
            >
              Get Started
            </button>
          </div>
              </div>

        {/* Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 max-w-md w-full mx-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-mono text-white mb-2">Enter Password</h2>
                <p className="text-gray-400 text-sm font-mono">Access Channel</p>
        </div>
              
              <form onSubmit={handlePasswordSubmit}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password..."
                  className="w-full bg-black bg-opacity-20 border border-gray-600 rounded px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-gray-400 transition-colors"
                  autoFocus
                />
                
                {error && (
                  <p className="text-red-400 text-sm font-mono mt-2">{error}</p>
                )}
                
                <div className="flex space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-red-500 bg-opacity-20 hover:bg-opacity-30 text-white font-mono text-sm py-3 rounded border border-red-500 hover:border-red-400 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 bg-opacity-20 hover:bg-opacity-30 text-black font-mono text-sm py-3 rounded border border-green-500 hover:border-green-400 transition-all"
                  >
                    Enter
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

    </div>
  );
}
