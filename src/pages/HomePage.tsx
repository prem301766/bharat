import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Users, Award, Play } from 'lucide-react';
import { User } from 'firebase/auth';
import { UserProfile } from '../types';
import { MOCK_COURSES } from '../constants';

interface HomePageProps {
  user: User | null;
  profile: UserProfile | null;
}

export default function HomePage({ user, profile }: HomePageProps) {
  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative py-12 lg:py-20 overflow-hidden">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl lg:text-7xl font-bold text-emerald-950 leading-tight tracking-tight">
              Empowering <span className="text-emerald-600 italic font-serif">Communities</span> Through Skills.
            </h1>
            <p className="mt-6 text-lg text-stone-600 max-w-lg leading-relaxed">
              BharatSkillConnect provides practical, skill-based learning in your regional language. Start your journey to self-reliance today.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/courses"
                className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-semibold hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-100"
              >
                Explore Courses <ArrowRight size={20} />
              </Link>
              {!user && (
                <button className="px-8 py-4 bg-white border border-stone-200 text-stone-700 rounded-2xl font-semibold hover:bg-stone-50 transition-all">
                  Join for Free
                </button>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-[40px] overflow-hidden shadow-2xl rotate-3">
              <img 
                src="https://images.unsplash.com/photo-1544650030-3c698fe24d99?auto=format&fit=crop&q=80&w=1000" 
                alt="Learning" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-3xl shadow-xl border border-stone-100 flex items-center gap-4 -rotate-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                <Users size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-stone-900">10k+</p>
                <p className="text-sm text-stone-500">Active Learners</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        {[
          { icon: <Globe size={24} />, title: "Regional Languages", desc: "Learn in Hindi, Marathi, Bengali, and more." },
          { icon: <Play size={24} />, title: "Video Tutorials", desc: "Step-by-step practical guides for every skill." },
          { icon: <Award size={24} />, title: "Certification", desc: "Get recognized for your skills and hard work." },
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -5 }}
            className="p-8 bg-white rounded-3xl border border-stone-100 shadow-sm hover:shadow-md transition-all"
          >
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-stone-900 mb-2">{feature.title}</h3>
            <p className="text-stone-500 leading-relaxed">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Featured Courses */}
      <section>
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-stone-900">Featured Courses</h2>
            <p className="text-stone-500 mt-2">Handpicked skills for your growth.</p>
          </div>
          <Link to="/courses" className="text-emerald-600 font-semibold hover:underline flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_COURSES.slice(0, 4).map((course) => (
            <motion.div
              key={course.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm flex flex-col"
            >
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-emerald-700 uppercase tracking-wider">
                  {course.language}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-2">{course.category}</span>
                <h3 className="font-bold text-stone-900 mb-2 line-clamp-1">{course.title}</h3>
                <p className="text-stone-500 text-sm line-clamp-2 mb-4 flex-1">{course.description}</p>
                <Link 
                  to="/courses" 
                  className="w-full py-2 bg-stone-50 text-stone-700 rounded-xl text-center text-sm font-semibold hover:bg-stone-100 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
