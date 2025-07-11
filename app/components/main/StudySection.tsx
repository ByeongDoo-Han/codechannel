'use client';

import axios from "axios";

// Define types for study and user selections
interface Study {
  id: number;
  name: string;
  date: string;
  location: string;
  memberCount: number;
  createdBy: string;
  participants: string[];
  color: string;
  icon: string;
}

interface UserSelections {
  [studyId: string]: 'attend' | 'unattend' | null;
}

interface StudySectionProps {
  openStudyDetailPopup: (studyId: number) => void;
  handleAttendance: (studyId: string, action: 'attend' | 'unattend') => void;
  userSelections: UserSelections;
  isDarkMode: boolean;
}

const handleJoin = (id: number) => {
  axios.post(`http://localhost:8080/api/v1/join/studies/${id}`)
  .then(response => {
    console.log('참석 성공:', response.data);
  })
  .catch(error => {
    console.error(error);
  });
}

// const getAllStudies = async () => {
//   const response = await axios.get('http://localhost:8080/api/v1/studies');
//   return response.data;
// }

export default function StudySection({openStudyDetailPopup, handleAttendance, userSelections, isDarkMode }: StudySectionProps) {
  // const studies = getAllStudies();
  const studies: Study[] = [];
  return (
    <section className={`backdrop-blur-sm rounded-xl shadow-sm border p-4 sm:p-6 hover:shadow-md transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-800/70 border-gray-700' 
        : 'bg-white/70 border-gray-200'
    }`}>
      <h2 className={`text-lg sm:text-xl font-semibold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>진행 중인 스터디</h2>
      <div className="space-y-3 sm:space-y-4">
        {studies.map((study: Study) => (
          <div 
            key={study.id}
            className={`group p-3 sm:p-4 rounded-xl border transition-all cursor-pointer ${
              isDarkMode 
                ? 'border-gray-700 hover:border-blue-600 hover:bg-blue-900/20' 
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
            }`}
            onClick={() => openStudyDetailPopup(study.id)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${study.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <span className="text-white font-bold text-xs sm:text-sm">{study.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className={`font-semibold group-hover:text-blue-700 text-sm sm:text-base ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{study.name}</h3>
                  <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {study.date} • {study.memberCount}명 참여
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">진행중</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAttendance(study.id.toString(), 'attend');
                    handleJoin(study.id);
                  }}
                  className={`px-4 py-2 text-xs sm:px-3 sm:py-1 rounded-full border transition-colors ${
                    userSelections[study.id.toString()] === 'attend'
                      ? (isDarkMode 
                          ? 'border-green-600 text-white bg-green-600 hover:bg-green-700 active:bg-green-800' 
                          : 'border-green-500 text-white bg-green-500 hover:bg-green-600 active:bg-green-700')
                      : (isDarkMode 
                          ? 'border-green-600 text-green-600 bg-transparent hover:bg-green-600 hover:text-white active:bg-green-700 active:text-white' 
                          : 'border-green-500 text-green-500 bg-transparent hover:bg-green-500 hover:text-white active:bg-green-600 active:text-white')
                  }`}>참석</button>
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
