/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile } from './types';
import { BookOpen, User as UserIcon, LogOut, MessageSquare, Home as HomeIcon, Layout, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Pages (to be implemented)
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import RegistrationPage from './pages/RegistrationPage';
import LearningPage from './pages/LearningPage';
import Chatbot from './components/Chatbot';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        const newProfile: UserProfile = {
          uid: user.uid,
          displayName: user.displayName || 'Learner',
          email: user.email || '',
          createdAt: new Date().toISOString(),
          enrolledCourses: [],
          interests: [],
          language: 'English'
        };
        await setDoc(docRef, newProfile);
        setProfile(newProfile);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = () => signOut(auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                  <BookOpen size={24} />
                </div>
                <span className="text-xl font-bold tracking-tight text-emerald-900">BharatSkillConnect</span>
              </Link>

              <div className="hidden md:flex items-center gap-8">
                <Link to="/" className="text-stone-600 hover:text-emerald-600 font-medium transition-colors">Home</Link>
                <Link to="/courses" className="text-stone-600 hover:text-emerald-600 font-medium transition-colors">Courses</Link>
                {user && (
                  <Link to="/learning" className="text-stone-600 hover:text-emerald-600 font-medium transition-colors">My Learning</Link>
                )}
              </div>

              <div className="flex items-center gap-4">
                {user ? (
                  <div className="flex items-center gap-4">
                    <Link to="/registration" className="hidden sm:block text-stone-600 hover:text-emerald-600 transition-colors">
                      <UserIcon size={20} />
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 text-stone-700 hover:bg-stone-200 transition-all text-sm font-medium"
                    >
                      <LogOut size={16} />
                      <span className="hidden sm:inline">Logout</span>
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={handleLogin}
                    className="px-6 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-all font-medium shadow-md shadow-emerald-200"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage user={user} profile={profile} />} />
            <Route path="/courses" element={<CoursesPage user={user} profile={profile} />} />
            <Route path="/registration" element={<RegistrationPage user={user} profile={profile} setProfile={setProfile} />} />
            <Route path="/learning" element={<LearningPage user={user} profile={profile} />} />
          </Routes>
        </main>

        <Chatbot />
        
        <footer className="bg-stone-100 border-t border-stone-200 py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-stone-500 text-sm">© 2026 BharatSkillConnect. Empowering Communities Through Skills.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

