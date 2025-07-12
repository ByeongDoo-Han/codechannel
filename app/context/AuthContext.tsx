'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
  joinedStudies: number[];
  isLoginModalOpen: boolean;
  isSignupModalOpen: boolean;
  isForgotPasswordModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openSignupModal: () => void;
  closeSignupModal: () => void;
  openForgotPasswordModal: () => void;
  closeForgotPasswordModal: () => void;
  openAddStudyModal: () => void;
  closeAddStudyModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [joinedStudies, setJoinedStudies] = useState<number[]>([]);
  const [isAddStudyModalOpen, setIsAddStudyModalOpen] = useState(false);
  const fetchJoinedStudies = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      const response = await axios.get('http://localhost:8080/api/v1/join/studies', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setJoinedStudies(response.data.map((study: any) => study.groupId));
    } catch (error) {
      console.error('Failed to fetch joined studies:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
      fetchJoinedStudies();
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('accessToken', token);
    setIsLoggedIn(true);
    fetchJoinedStudies();
    window.location.reload();
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    setJoinedStudies([]);
    setIsLoginModalOpen(false);
    window.location.reload();
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsSignupModalOpen(false);
    setIsForgotPasswordModalOpen(false);
  };

  const openAddStudyModal = () => {
    setIsAddStudyModalOpen(true);
  };

  const closeAddStudyModal = () => {
    setIsAddStudyModalOpen(false);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  const openSignupModal = () => {
    setIsSignupModalOpen(true);
    setIsLoginModalOpen(false);
    setIsForgotPasswordModalOpen(false);
  };

  const closeSignupModal = () => {
    setIsSignupModalOpen(false);
  };

  const openForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(true);
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(false);
  };

  const closeForgotPasswordModal = () => {
    setIsForgotPasswordModalOpen(false);
  };

  const value = {
    isLoggedIn,
    login,
    logout,
    isLoginModalOpen,
    isSignupModalOpen,
    isForgotPasswordModalOpen,
    joinedStudies,
    openLoginModal,
    closeLoginModal,
    openSignupModal,
    closeSignupModal,
    openForgotPasswordModal,
    closeForgotPasswordModal,
    openAddStudyModal,
    closeAddStudyModal,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 