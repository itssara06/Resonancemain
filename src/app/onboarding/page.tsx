"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Check, Camera, BellRing, Sparkles } from "lucide-react";

// --- Types & Data ---
type ProfileData = { name: string; username: string; bio: string; website: string; location: string; image: string | null };

const DISCIPLINES = [
  "UI/UX Design", "Product Design", "Architecture", "Industrial Design", 
  "Graphic Design", "Branding", "Typography", "Motion Design", 
  "Interior Design", "Fashion Design", "Design Systems", "Design Research", 
  "Design Student", "Other"
];

const INTERESTS = [
  "UX Research", "Accessibility", "Micro Interactions", "Design Systems", "Figma", 
  "AI Design", "Visual Design", "Typography", "Color Theory", "Architecture", 
  "Urban Design", "Industrial Design", "Furniture", "Packaging", "Brand Identity", 
  "Motion Design", "3D Design", "Creative Coding", "Generative Design", "Product Strategy", 
  "User Psychology", "Startups", "Creative Process", "Portfolio Reviews", "Design Critiques", 
  "Case Studies", "Prototyping", "No-code", "Glassmorphism", "Minimalism", 
  "Brutalism", "Editorial Design", "Illustration", "Gaming UI", "AR/VR", 
  "Design Leadership", "Interaction Design", "Service Design"
];

const CREATORS = {
  "Product Design": [
    { id: "1", name: "Julie Zhuo", username: "julie" },
    { id: "2", name: "Pablo Stanley", username: "pablostanley" },
    { id: "3", name: "Ryan Hoover", username: "rrhoover" }
  ],
  "Architecture": [
    { id: "4", name: "BIG", username: "big_builds" },
    { id: "5", name: "MVRDV", username: "mvrdv" },
    { id: "6", name: "Zaha Hadid Architects", username: "zaha_hadid" }
  ],
  "Branding": [
    { id: "7", name: "Pentagram", username: "pentagram" },
    { id: "8", name: "Collins", username: "wearecollins" },
    { id: "9", name: "Porto Rocha", username: "portorocha" }
  ]
};

// --- Animations ---
const pageVariants = {
  initial: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  in: {
    x: 0,
    opacity: 1,
  },
  out: (direction: number) => ({
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

export default function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  // Onboarding State
  const [disciplines, setDisciplines] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [follows, setFollows] = useState<string[]>([]);
  const [profile, setProfile] = useState<ProfileData>({
    name: "", username: "", bio: "", website: "", location: "", image: null
  });

  // Navigation Handlers
  const nextStep = () => { setDirection(1); setStep((s) => Math.min(s + 1, 8)); };
  const prevStep = () => { setDirection(-1); setStep((s) => Math.max(s - 1, 1)); };
  const skipStep = () => nextStep();

  // Step 8 Redirect Simulation
  useEffect(() => {
    if (step === 8) {
      const timer = setTimeout(() => router.push("/"), 3000);
      return () => clearTimeout(timer);
    }
  }, [step, router]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1Welcome onNext={nextStep} onSkip={() => router.push("/")} />;
      case 2:
        return <Step2Discipline disciplines={disciplines} setDisciplines={setDisciplines} onNext={nextStep} />;
      case 3:
        return <Step3Interests interests={interests} setInterests={setInterests} onNext={nextStep} />;
      case 4:
        return <Step4Follows follows={follows} setFollows={setFollows} onNext={nextStep} />;
      case 5:
        return <Step5Avatar profile={profile} setProfile={setProfile} onNext={nextStep} onSkip={skipStep} />;
      case 6:
        return <Step6Profile profile={profile} setProfile={setProfile} onNext={nextStep} />;
      case 7:
        return <Step7Notifications onNext={nextStep} onSkip={skipStep} />;
      case 8:
        return <Step8Success />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden relative">
      {/* Progress Bar (Visible steps 2-7) */}
      {step > 1 && step < 8 && (
        <div className="absolute top-0 left-0 w-full h-1 bg-secondary z-50">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: `${((step - 1) / 7) * 100}%` }}
            animate={{ width: `${((step) / 7) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Top Nav for Steps 2-7 */}
      {step > 1 && step < 8 && (
        <header className="absolute top-0 w-full p-6 z-40 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={prevStep} className="rounded-full">
            <ChevronLeft size={24} />
          </Button>
          <span className="text-sm font-medium text-muted-foreground tracking-widest uppercase">
            Step {step} of 7
          </span>
        </header>
      )}

      {/* Main Content Area with AnimatePresence */}
      <div className="flex-1 flex relative">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.main
            key={step}
            custom={direction}
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            transition={{ type: "tween", ease: "anticipate", duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-12"
          >
            {renderStep()}
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}

// --- Step Components ---

function Step1Welcome({ onNext, onSkip }: { onNext: () => void, onSkip: () => void }) {
  return (
    <div className="max-w-md w-full text-center flex flex-col items-center">
      <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-8 shadow-2xl shadow-primary/20">
        <span className="text-primary-foreground font-bold text-4xl leading-none">R</span>
      </div>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Welcome to Resonance</h1>
      <p className="text-lg text-muted-foreground mb-12">Discover how designers think, not just what they create.</p>
      
      <div className="flex flex-col w-full gap-4">
        <Button size="lg" className="h-14 text-lg rounded-xl" onClick={onNext}>
          Continue
        </Button>
        <Button variant="ghost" size="lg" className="h-14 text-lg rounded-xl text-muted-foreground hover:text-foreground" onClick={onSkip}>
          Skip for now
        </Button>
      </div>
    </div>
  );
}

function Step2Discipline({ disciplines, setDisciplines, onNext }: { disciplines: string[], setDisciplines: (d: string[]) => void, onNext: () => void }) {
  const toggle = (d: string) => {
    if (disciplines.includes(d)) setDisciplines(disciplines.filter(x => x !== d));
    else setDisciplines([...disciplines, d]);
  };

  return (
    <div className="max-w-2xl w-full flex flex-col h-full pt-16">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">What best describes you?</h1>
      <p className="text-lg text-muted-foreground mb-10">We'll personalize your experience.</p>
      
      <div className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {DISCIPLINES.map(d => (
            <button
              key={d}
              onClick={() => toggle(d)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                disciplines.includes(d)
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border/50 bg-secondary/30 text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm sm:text-base">{d}</span>
                {disciplines.includes(d) && <Check size={18} className="text-primary" />}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background via-background to-transparent flex justify-center">
        <Button 
          size="lg" 
          className="w-full max-w-sm h-14 text-lg rounded-xl shadow-2xl" 
          disabled={disciplines.length === 0} 
          onClick={onNext}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

function Step3Interests({ interests, setInterests, onNext }: { interests: string[], setInterests: (i: string[]) => void, onNext: () => void }) {
  const toggle = (i: string) => {
    if (interests.includes(i)) setInterests(interests.filter(x => x !== i));
    else setInterests([...interests, i]);
  };

  return (
    <div className="max-w-3xl w-full flex flex-col h-full pt-16">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">What do you love exploring?</h1>
      <p className="text-lg text-muted-foreground mb-10">Select at least 5 topics. ({interests.length}/5)</p>
      
      <div className="flex-1 overflow-y-auto pb-32 no-scrollbar">
        <div className="flex flex-wrap gap-2.5">
          {INTERESTS.map(i => (
            <button
              key={i}
              onClick={() => toggle(i)}
              className={`px-5 py-3 rounded-full border text-sm sm:text-base font-medium transition-all ${
                interests.includes(i)
                  ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-105'
                  : 'border-border/50 bg-secondary/30 text-muted-foreground hover:border-border hover:text-foreground hover:bg-secondary'
              }`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background via-background to-transparent flex justify-center z-10">
        <Button 
          size="lg" 
          className="w-full max-w-sm h-14 text-lg rounded-xl shadow-2xl transition-all" 
          disabled={interests.length < 5} 
          onClick={onNext}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

function Step4Follows({ follows, setFollows, onNext }: { follows: string[], setFollows: (f: string[]) => void, onNext: () => void }) {
  const toggle = (id: string) => {
    if (follows.includes(id)) setFollows(follows.filter(x => x !== id));
    else setFollows([...follows, id]);
  };

  const followGroup = (ids: string[]) => {
    const allFollowing = ids.every(id => follows.includes(id));
    if (allFollowing) {
      setFollows(follows.filter(x => !ids.includes(x)));
    } else {
      const newFollows = new Set([...follows, ...ids]);
      setFollows(Array.from(newFollows));
    }
  };

  return (
    <div className="max-w-2xl w-full flex flex-col h-full pt-16">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Follow inspiring creators</h1>
      <p className="text-lg text-muted-foreground mb-8">Follow at least 5 people to build your feed. ({follows.length}/5)</p>
      
      <div className="flex-1 overflow-y-auto pb-32 no-scrollbar pr-2">
        {Object.entries(CREATORS).map(([category, creators]) => (
          <div key={category} className="mb-10">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/40">
              <h2 className="text-xl font-semibold text-foreground/90">{category}</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => followGroup(creators.map(c => c.id))}
                className="text-xs font-medium"
              >
                {creators.every(c => follows.includes(c.id)) ? 'Unfollow All' : 'Follow All'}
              </Button>
            </div>
            
            <div className="flex flex-col gap-4">
              {creators.map(c => (
                <div key={c.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center">
                      <span className="font-bold text-muted-foreground">{c.name.charAt(0)}</span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{c.name}</div>
                      <div className="text-sm text-muted-foreground">@{c.username}</div>
                    </div>
                  </div>
                  <Button 
                    variant={follows.includes(c.id) ? "outline" : "default"}
                    className={`rounded-full px-6 transition-all ${follows.includes(c.id) ? 'bg-transparent text-foreground border-border' : ''}`}
                    onClick={() => toggle(c.id)}
                  >
                    {follows.includes(c.id) ? 'Following' : 'Follow'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-background via-background to-transparent flex justify-center z-10">
        <Button 
          size="lg" 
          className="w-full max-w-sm h-14 text-lg rounded-xl shadow-2xl" 
          disabled={follows.length < 5} 
          onClick={onNext}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

function Step5Avatar({ profile, setProfile, onNext, onSkip }: any) {
  // Mock upload interaction
  const [isHover, setIsHover] = useState(false);

  return (
    <div className="max-w-md w-full flex flex-col items-center h-full justify-center pb-20">
      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2 text-center">Make your profile yours</h1>
      <p className="text-lg text-muted-foreground mb-12 text-center">Add a profile picture so people recognize you.</p>
      
      <div 
        className={`relative w-48 h-48 rounded-full border-4 border-dashed flex items-center justify-center transition-all cursor-pointer overflow-hidden
          ${isHover ? 'border-primary bg-primary/5 scale-105' : 'border-border bg-secondary/30'}
        `}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onClick={() => {
          // Mocking upload
          setProfile({ ...profile, image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200" });
        }}
      >
        {profile.image ? (
          <img src={profile.image} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center text-muted-foreground gap-2">
            <Camera size={32} />
            <span className="text-sm font-medium">Upload Photo</span>
          </div>
        )}
      </div>

      <div className="flex flex-col w-full gap-4 mt-16 max-w-sm">
        <Button size="lg" className="h-14 text-lg rounded-xl" onClick={onNext}>
          {profile.image ? 'Looks good' : 'Skip for now'}
        </Button>
      </div>
    </div>
  );
}

function Step6Profile({ profile, setProfile, onNext }: any) {
  return (
    <div className="max-w-5xl w-full flex flex-col lg:flex-row h-full pt-16 gap-12 lg:gap-24 items-center lg:items-start overflow-y-auto no-scrollbar pb-32">
      
      {/* Form Area */}
      <div className="flex-1 w-full max-w-md flex flex-col gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Complete your profile</h1>
          <p className="text-lg text-muted-foreground">Tell the community about yourself.</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Name</label>
            <Input 
              value={profile.name} 
              onChange={e => setProfile({...profile, name: e.target.value})}
              placeholder="Jane Doe" 
              className="h-14 bg-secondary/30 text-lg rounded-xl"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Username</label>
            <Input 
              value={profile.username} 
              onChange={e => setProfile({...profile, username: e.target.value.replace(/[^a-zA-Z0-9_]/g, '')})}
              placeholder="@janedoe" 
              className="h-14 bg-secondary/30 text-lg rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1 flex justify-between">
              Bio <span className="font-normal normal-case">{profile.bio.length} / 160</span>
            </label>
            <Textarea 
              value={profile.bio} 
              onChange={e => setProfile({...profile, bio: e.target.value})}
              placeholder="I'm a designer focusing on..." 
              className="min-h-[120px] bg-secondary/30 text-lg rounded-xl resize-none"
              maxLength={160}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-1">Website <span className="font-normal normal-case text-muted-foreground/60">(Optional)</span></label>
            <Input 
              value={profile.website} 
              onChange={e => setProfile({...profile, website: e.target.value})}
              placeholder="janedoe.com" 
              className="h-14 bg-secondary/30 text-lg rounded-xl"
            />
          </div>
        </div>

        <div className="pt-4">
          <Button 
            size="lg" 
            className="w-full h-14 text-lg rounded-xl shadow-xl" 
            disabled={!profile.name || !profile.username} 
            onClick={onNext}
          >
            Continue
          </Button>
        </div>
      </div>

      {/* Live Preview Area (Hidden on small mobile if needed, but flex-col keeps it below) */}
      <div className="flex-1 w-full max-w-md lg:sticky lg:top-24 hidden sm:flex justify-center">
        <div className="w-full surface rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <div className="flex flex-col gap-6 relative z-10">
            <div className="flex justify-between items-start">
              <div className="w-24 h-24 rounded-full bg-secondary border-4 border-background overflow-hidden flex items-center justify-center shadow-lg">
                 {profile.image ? (
                   <img src={profile.image} alt="Avatar" className="w-full h-full object-cover" />
                 ) : (
                   <span className="font-bold text-3xl text-muted-foreground">{profile.name.charAt(0) || '?'}</span>
                 )}
              </div>
              <Button variant="outline" className="rounded-full px-6 opacity-50 cursor-default">Follow</Button>
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-bold">{profile.name || 'Your Name'}</h2>
              <p className="text-muted-foreground">@{profile.username || 'username'}</p>
            </div>

            <p className="text-foreground leading-relaxed">
              {profile.bio || 'Your bio will appear here. Share your creative process and what you are building.'}
            </p>

            {profile.website && (
              <p className="text-primary text-sm font-medium hover:underline cursor-pointer">
                {profile.website}
              </p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

function Step7Notifications({ onNext, onSkip }: any) {
  return (
    <div className="max-w-md w-full flex flex-col items-center h-full justify-center pb-20 text-center">
      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-10 relative">
        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-rose-500 animate-pulse border-2 border-background" />
        <BellRing size={40} className="text-primary" />
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">Stay in the conversation</h1>
      <p className="text-lg text-muted-foreground mb-12">
        Get notified when someone replies, follows you, or gives feedback on your work.
      </p>
      
      <div className="flex flex-col w-full gap-4 max-w-sm">
        <Button size="lg" className="h-14 text-lg rounded-xl shadow-xl shadow-primary/20" onClick={onNext}>
          Enable Notifications
        </Button>
        <Button variant="ghost" size="lg" className="h-14 text-lg rounded-xl text-muted-foreground hover:text-foreground" onClick={onSkip}>
          Maybe Later
        </Button>
      </div>
    </div>
  );
}

function Step8Success() {
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="max-w-md w-full flex flex-col items-center h-full justify-center pb-20 text-center"
    >
      <motion.div 
        initial={{ rotate: -10 }}
        animate={{ rotate: [10, -5, 0] }}
        transition={{ duration: 1, delay: 0.2 }}
        className="mb-8 text-primary"
      >
        <Sparkles size={64} className="fill-primary animate-pulse" />
      </motion.div>

      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">You're all set.</h1>
      <p className="text-lg text-muted-foreground mb-12">
        Your personalized design feed is ready.
      </p>
      
      <div className="flex flex-col w-full gap-4 max-w-sm relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-rose-500 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        <Button size="lg" className="relative h-14 text-lg rounded-xl" disabled>
          Entering Resonance...
        </Button>
      </div>
    </motion.div>
  );
}
