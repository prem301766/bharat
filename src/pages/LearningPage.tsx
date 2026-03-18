import { useSearchParams, Link } from 'react-router-dom';
import { MOCK_COURSES } from '../constants';
import { User } from 'firebase/auth';
import { UserProfile } from '../types';
import { Play, ChevronLeft, BookOpen, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface LearningPageProps {
  user: User | null;
  profile: UserProfile | null;
}

export default function LearningPage({ user, profile }: LearningPageProps) {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('id');

  const selectedCourse = MOCK_COURSES.find(c => c.id === courseId);

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-stone-900">Please login to start learning.</h2>
      </div>
    );
  }

  if (!selectedCourse) {
    return (
      <div className="space-y-12">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-stone-900">My Learning Journey</h1>
          <Link to="/courses" className="text-emerald-600 font-semibold hover:underline">Browse More</Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_COURSES.slice(0, 2).map(course => (
            <Link 
              key={course.id} 
              to={`/learning?id=${course.id}`}
              className="group bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="aspect-video relative">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play size={40} className="text-white" fill="currentColor" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-stone-900 mb-2">{course.title}</h3>
                <div className="flex items-center gap-4 text-xs text-stone-400 font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                  <span className="flex items-center gap-1 text-emerald-600"><CheckCircle size={12} /> 40% Complete</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <Link to="/courses" className="flex items-center gap-2 text-stone-500 hover:text-emerald-600 font-semibold transition-colors">
        <ChevronLeft size={20} /> Back to Courses
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Video Player */}
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video bg-black rounded-[32px] overflow-hidden shadow-2xl border-4 border-white">
            <iframe
              width="100%"
              height="100%"
              src={selectedCourse.videoUrl}
              title={selectedCourse.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-widest">
                {selectedCourse.category}
              </span>
              <span className="text-stone-400 text-xs font-bold uppercase tracking-widest">
                {selectedCourse.language}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-stone-900 mb-4">{selectedCourse.title}</h1>
            <p className="text-stone-600 leading-relaxed">{selectedCourse.description}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm">
            <h2 className="text-xl font-bold text-stone-900 mb-6 flex items-center gap-2">
              <BookOpen size={20} className="text-emerald-600" /> Course Content
            </h2>
            <div className="space-y-4">
              {[
                { title: "Introduction to the Skill", duration: "10:00", active: true },
                { title: "Tools and Materials Needed", duration: "15:00", active: false },
                { title: "Step-by-Step Practical Guide", duration: "45:00", active: false },
                { title: "Common Mistakes to Avoid", duration: "20:00", active: false },
                { title: "Final Project & Summary", duration: "30:00", active: false },
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "p-4 rounded-2xl flex items-center justify-between cursor-pointer transition-all",
                    item.active ? "bg-emerald-50 border border-emerald-100" : "hover:bg-stone-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                      item.active ? "bg-emerald-600 text-white" : "bg-stone-100 text-stone-500"
                    )}>
                      {idx + 1}
                    </div>
                    <span className={cn("text-sm font-semibold", item.active ? "text-emerald-900" : "text-stone-700")}>
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-stone-400">{item.duration}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-emerald-900 p-8 rounded-[32px] text-white shadow-xl">
            <h3 className="text-lg font-bold mb-2">Need Help?</h3>
            <p className="text-emerald-100/70 text-sm leading-relaxed mb-6">Our AI assistant is here to help you with any questions about this course.</p>
            <button className="w-full py-3 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-400 transition-all">
              Ask Assistant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
