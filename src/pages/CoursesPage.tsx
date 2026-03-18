import { useState, useEffect } from 'react';
import { Search, Filter, Play, Clock, Globe, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { User } from 'firebase/auth';
import { UserProfile, Course } from '../types';
import { MOCK_COURSES } from '../constants';
import { getCourseRecommendations } from '../services/geminiService';
import { Link } from 'react-router-dom';

interface CoursesPageProps {
  user: User | null;
  profile: UserProfile | null;
}

export default function CoursesPage({ user, profile }: CoursesPageProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [recommendations, setRecommendations] = useState<{category: string, reason: string}[]>([]);
  const [isRecLoading, setIsRecLoading] = useState(false);

  const categories = ['All', ...Array.from(new Set(MOCK_COURSES.map(c => c.category)))];

  const filteredCourses = MOCK_COURSES.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) || 
                         course.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    if (profile && profile.interests && profile.interests.length > 0) {
      const fetchRecs = async () => {
        setIsRecLoading(true);
        const recs = await getCourseRecommendations(profile.interests!, profile.language || 'English');
        setRecommendations(recs);
        setIsRecLoading(false);
      };
      fetchRecs();
    }
  }, [profile]);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-stone-900">Skill Library</h1>
        <p className="text-stone-500 mt-4">Discover practical skills that can change your life. Filter by category or search for specific topics.</p>
      </div>

      {/* AI Recommendations */}
      {profile && profile.interests && profile.interests.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100"
        >
          <div className="flex items-center gap-2 text-emerald-700 mb-6">
            <Sparkles size={20} />
            <h2 className="text-xl font-bold">Smart Recommendations for You</h2>
          </div>
          
          {isRecLoading ? (
            <div className="flex gap-4 animate-pulse">
              {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white/50 rounded-2xl flex-1" />)}
            </div>
          ) : (
            <div className="grid sm:grid-cols-3 gap-6">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-emerald-100">
                  <h3 className="font-bold text-emerald-900 mb-1">{rec.category}</h3>
                  <p className="text-sm text-emerald-700/70 leading-relaxed">{rec.reason}</p>
                </div>
              ))}
            </div>
          )}
        </motion.section>
      )}

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          <input
            type="text"
            placeholder="Search skills (e.g. farming, stitching)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all",
                selectedCategory === cat 
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" 
                  : "bg-white text-stone-600 border border-stone-200 hover:border-emerald-300"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredCourses.map((course) => (
          <motion.div
            key={course.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="group bg-white rounded-[32px] overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={course.thumbnail} 
                alt={course.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-lg">
                  <Play size={24} fill="currentColor" />
                </div>
              </div>
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black text-emerald-700 uppercase tracking-widest">
                {course.language}
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest px-2 py-0.5 bg-emerald-50 rounded-md">
                  {course.category}
                </span>
                <div className="flex items-center gap-1 text-stone-400 text-[10px] font-bold uppercase tracking-widest">
                  <Clock size={12} />
                  {course.duration}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-emerald-700 transition-colors">{course.title}</h3>
              <p className="text-stone-500 text-sm line-clamp-2 mb-6 flex-1 leading-relaxed">{course.description}</p>
              
              <Link
                to={`/learning?id=${course.id}`}
                className="w-full py-3 bg-emerald-600 text-white rounded-2xl text-center font-bold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100"
              >
                Start Learning
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="text-center py-20 bg-stone-100 rounded-[40px] border-2 border-dashed border-stone-200">
          <p className="text-stone-400 font-medium">No courses found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
