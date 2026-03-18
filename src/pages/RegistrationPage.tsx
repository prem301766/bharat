import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { User } from 'firebase/auth';
import { UserProfile } from '../types';
import { Check, User as UserIcon, Globe, Heart, Save } from 'lucide-react';
import { motion } from 'motion/react';

interface RegistrationPageProps {
  user: User | null;
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
}

export default function RegistrationPage({ user, profile, setProfile }: RegistrationPageProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    displayName: profile?.displayName || '',
    language: profile?.language || 'English',
    interests: profile?.interests || []
  });
  const [isSaving, setIsSaving] = useState(false);

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-stone-900">Please login to access your profile.</h2>
      </div>
    );
  }

  const languages = ['English', 'Hindi', 'Marathi', 'Bengali', 'Tamil', 'Telugu', 'Gujarati', 'Punjabi'];
  const interestOptions = ['Agriculture', 'Tailoring', 'Carpentry', 'Digital Literacy', 'Basic Coding', 'Cooking', 'Small Business', 'Health & Hygiene'];

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        displayName: formData.displayName,
        language: formData.language,
        interests: formData.interests
      });
      if (profile) {
        setProfile({
          ...profile,
          ...formData
        });
      }
      navigate('/');
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[40px] shadow-xl border border-stone-100 overflow-hidden"
      >
        <div className="bg-emerald-600 p-8 text-white">
          <h1 className="text-3xl font-bold">Learner Profile</h1>
          <p className="text-emerald-100 mt-2">Personalize your learning experience on BharatSkillConnect.</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-stone-700 uppercase tracking-wider">
              <UserIcon size={16} /> Full Name
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full px-6 py-4 bg-stone-50 border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              placeholder="Enter your name"
            />
          </div>

          {/* Language */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-stone-700 uppercase tracking-wider">
              <Globe size={16} /> Preferred Language
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {languages.map(lang => (
                <button
                  key={lang}
                  onClick={() => setFormData({ ...formData, language: lang })}
                  className={cn(
                    "px-4 py-3 rounded-xl text-sm font-semibold transition-all border",
                    formData.language === lang
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md"
                      : "bg-white text-stone-600 border-stone-200 hover:border-emerald-300"
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-bold text-stone-700 uppercase tracking-wider">
              <Heart size={16} /> Skills You Want to Learn
            </label>
            <div className="flex flex-wrap gap-3">
              {interestOptions.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-sm font-semibold transition-all border flex items-center gap-2",
                    formData.interests.includes(interest)
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-white text-stone-500 border-stone-200 hover:border-emerald-200"
                  )}
                >
                  {formData.interests.includes(interest) && <Check size={14} />}
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-bold text-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-100 disabled:opacity-50"
          >
            {isSaving ? "Saving..." : <><Save size={20} /> Save Profile</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
