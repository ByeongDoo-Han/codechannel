'use client';

interface Project {
    name: string;
    description: string;
    tech: string[];
    status: 'development' | 'testing' | 'planning';
    team: string[];
    startDate: string;
    endDate: string;
    progress: number;
    repository: string;
}

interface ProjectData {
    [key: string]: Project;
}

interface ProjectSectionProps {
  projectData: ProjectData;
  openProjectDetailPopup: (projectId: string) => void;
  isDarkMode: boolean;
}

export default function ProjectSection({ projectData, openProjectDetailPopup, isDarkMode }: ProjectSectionProps) {
  return (
    <section className={`backdrop-blur-sm rounded-xl shadow-sm border p-4 sm:p-6 hover:shadow-md transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gray-800/70 border-gray-700' 
        : 'bg-white/70 border-gray-200'
    }`}>
      <h2 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>진행 중인 프로젝트</h2>
      <div className="space-y-2 sm:space-y-3">
        {Object.keys(projectData).map((key) => {
            const project = projectData[key];
            let icon, gradient;
            switch (key) {
                case 'dashboard':
                    icon = 'DA';
                    gradient = 'from-pink-500 to-rose-600';
                    break;
                case 'chatapp':
                    icon = 'CH';
                    gradient = 'from-cyan-500 to-blue-600';
                    break;
                case 'ecommerce':
                    icon = 'EC';
                    gradient = 'from-amber-500 to-orange-600';
                    break;
                default:
                    icon = 'P';
                    gradient = 'from-gray-500 to-gray-600';
            }
            return (
                <div 
                  key={key}
                  className={`group flex items-center space-x-3 p-3 sm:p-4 rounded-xl border transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'border-gray-700 hover:border-pink-600 hover:bg-pink-900/20' 
                    : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50/50'
                }`}
                  onClick={() => openProjectDetailPopup(key)}
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-xs sm:text-sm">{icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm sm:text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{project.name}</p>
                    <p className={`text-xs sm:text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{project.tech.slice(0, 2).join(' + ')}</p>
                  </div>
                </div>
            )
        })}
      </div>
    </section>
  );
}