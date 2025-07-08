'use client';

import { StudyProvider } from '../context/StudyContext';
import { AuthProvider } from '../context/AuthContext';
import AuthModals from './AuthModals';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <StudyProvider>
      <AuthProvider>
        {children}
        <AuthModals />
      </AuthProvider>
    </StudyProvider>
  );
} 