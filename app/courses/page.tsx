import type { Metadata } from 'next';
import { Check } from 'lucide-react';
import Badge from '@/components/ui/badge';
import Button from '@/components/ui/button';
import SectionLabel from '@/components/ui/section-label';

export const metadata: Metadata = {
  title: 'Courses',
  description: 'Trade courses for sheet metal workers — CofQ preparation, jobsite basics, duct layout, and leadership.',
};

type CourseStatus = 'sold_out' | 'coming_soon' | 'available';

interface Course {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  status: CourseStatus;
}

const COURSES: Course[] = [
  {
    id: 'cofq',
    title: 'CofQ Preparation',
    description: 'Comprehensive preparation for your Certificate of Qualification exam.',
    bullets: ['Code requirements', 'Safety protocols', 'Practice tests', 'Exam strategies'],
    status: 'sold_out',
  },
  {
    id: 'jobsite-basics',
    title: 'Jobsite Basics',
    description: 'Essential skills for new sheet metal workers.',
    bullets: ['Tool identification', 'Basic measurements', 'Safety fundamentals', 'Reading blueprints'],
    status: 'sold_out',
  },
  {
    id: 'duct-layout',
    title: 'Duct Layout & Design',
    description: 'Advanced techniques for duct system layout.',
    bullets: ['System design principles', 'CAD basics', 'Pressure calculations', 'Optimization techniques'],
    status: 'sold_out',
  },
  {
    id: 'leadership',
    title: 'Leadership & Management',
    description: 'Take your career to the next level.',
    bullets: ['Team management', 'Project planning', 'Material ordering', 'Quality control'],
    status: 'sold_out',
  },
];

const badgeVariant = (status: CourseStatus) => {
  if (status === 'sold_out') return 'sold-out' as const;
  if (status === 'coming_soon') return 'coming-soon' as const;
  return 'available' as const;
};

const ctaLabel = (status: CourseStatus) => {
  if (status === 'available') return 'Enroll Now';
  if (status === 'sold_out') return 'Sold Out';
  return 'Coming Soon';
};

export default function CoursesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div className="mb-16">
        <SectionLabel className="mb-3 block">Education</SectionLabel>
        <h1 className="font-display text-4xl sm:text-5xl font-black text-neutral-100 uppercase leading-none mb-4">
          Courses
        </h1>
        <p className="text-neutral-500 max-w-xl">
          Trade courses built by sheet metal workers, for sheet metal workers. Real content, no filler.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-800">
        {COURSES.map((course) => (
          <div key={course.id} className="bg-[#0a0a0a] p-8 flex flex-col">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h2 className="font-display text-xl font-black text-neutral-100 uppercase leading-tight">
                {course.title}
              </h2>
              <Badge variant={badgeVariant(course.status)} />
            </div>
            <p className="text-sm text-neutral-500 mb-6 leading-relaxed">{course.description}</p>
            <ul className="flex-1 flex flex-col gap-2 mb-8">
              {course.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3 text-sm text-neutral-400">
                  <Check size={14} className="text-orange-500 mt-0.5 shrink-0" />
                  {bullet}
                </li>
              ))}
            </ul>
            <Button
              variant={course.status === 'available' ? 'primary' : 'secondary'}
              disabled={course.status !== 'available'}
              className="w-full"
            >
              {ctaLabel(course.status)}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
