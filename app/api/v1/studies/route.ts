import { NextResponse } from 'next/server';

const studies = [
  {
    id: 'javascript',
    name: 'JavaScript Deep Dive',
    time: '화/목 19:00-21:00',
    location: '스터디룸 A',
    participants: ['김민수', '이지은', '박준호', '최수진', '정대용', '윤서영', '한지민', '오성현'],
    description: '자바스크립트 심화 학습과 실습',
    status: 'active',
    participantCount: 8,
    color: 'from-yellow-400 to-orange-500',
    icon: 'JS'
  },
  {
    id: 'algorithm',
    name: 'Algorithm Study',
    time: '토 14:00-17:00',
    location: '스터디룸 B',
    participants: ['이민호', '김서연', '박지훈', '정수아', '최민준', '윤하늘'],
    description: '알고리즘 문제 해결과 코딩테스트 대비',
    status: 'recruiting',
    participantCount: 6,
    color: 'from-green-500 to-emerald-600',
    icon: 'AL'
  },
  {
    id: 'react',
    name: 'React Study',
    time: '월/수/금 20:00-22:00',
    location: '온라인 (Zoom)',
    participants: ['김태현', '이소영', '박민석', '정은비', '최준영', '윤서진', '한민우', '오지혜', '임수정', '배현우'],
    description: 'React 프레임워크 심화 학습',
    status: 'closed',
    participantCount: 10,
    maxParticipants: 10,
    color: 'from-purple-500 to-indigo-600',
    icon: 'RE'
  }
];

export async function GET() {
  return NextResponse.json(studies);
}
