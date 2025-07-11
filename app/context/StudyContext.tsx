'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface StudyData {
  id: string;
  name: string;
  date: Date;
  location: string;
  memberCount: number;
  participants: string[];
  description: string;
  createdBy: string;
  status: 'active' | 'closed' | 'recruiting';
  participantCount: number;
  maxParticipants?: number;
  color: string;
  icon: string;
}

interface StudyContextType {
  studies: StudyData[];
  selectedStudy: number;
  setSelectedStudy: (id: number) => void;
  updateStudy: (id: string, data: Partial<StudyData>) => void;
  addStudy: (data: StudyData) => void;
  removeStudy: (id: string) => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export function StudyProvider({ children }: { children: ReactNode }) {
  const [studies, setStudies] = useState<StudyData[]>([]);
  const [selectedStudy, setSelectedStudy] = useState<number>(0);

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/studies');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: StudyData[] = await response.json();
        setStudies(data.map(study => ({
          ...study
        })));
        if (data.length > 0) {
          setSelectedStudy(Number(data[0].id));
        }
      } catch (error) {
        console.error("Failed to fetch studies:", error);
        // Fallback to some default or empty state if API fails
        setStudies([]); 
        setSelectedStudy(0);
      }
    };

    fetchStudies();
  }, []);

  const updateStudy = (id: string, data: Partial<StudyData>) => {
    setStudies(prev => prev.map(study => 
      study.id === id ? { ...study, ...data } : study
    ));
  };

  const addStudy = (data: StudyData) => {
    setStudies(prev => [...prev, data]);
  };

  const removeStudy = (id: string) => {
    setStudies(prev => prev.filter(study => study.id !== id));
  };

  return (
    <StudyContext.Provider value={{
      studies,
      selectedStudy,
      setSelectedStudy,
      updateStudy,
      addStudy,
      removeStudy
    }}>
      {children}
    </StudyContext.Provider>
  );
}

export function useStudy() {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
} 