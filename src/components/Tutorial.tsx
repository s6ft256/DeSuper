import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, ChevronLeft, Code, Trophy, Target, Zap, BookOpen, Award, Star } from 'lucide-react';
import { sound } from '../utils/audio';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action?: string;
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to DeSuper',
    description: 'Learn Python programming through an epic cyberpunk adventure! Complete missions, earn XP, and rise through the ranks.',
    icon: <Star className="w-8 h-8 text-cyan-400" />,
  },
  {
    id: 'missions',
    title: 'Complete Missions',
    description: 'Each mission teaches a Python concept. Read the story, write code, and validate your solution to earn rewards.',
    icon: <Target className="w-8 h-8 text-emerald-400" />,
    action: 'missions',
  },
  {
    id: 'code',
    title: 'Write Code',
    description: 'Use the code editor to solve challenges. Press Ctrl+R or click Run to execute your Python code.',
    icon: <Code className="w-8 h-8 text-violet-400" />,
  },
  {
    id: 'xp',
    title: 'Earn XP & Coins',
    description: 'Complete missions to earn XP and coins. Level up to unlock new ranks and content.',
    icon: <Trophy className="w-8 h-8 text-amber-400" />,
  },
  {
    id: 'skills',
    title: 'Skill Tree',
    description: 'Unlock skills as you progress. Each skill represents a Python concept you\'ve mastered.',
    icon: <Zap className="w-8 h-8 text-rose-400" />,
    action: 'skills',
  },
  {
    id: 'ai',
    title: 'AI Companion',
    description: 'Chat with Eli-v0.1, your AI coding assistant. Get hints, explanations, and personalized help.',
    icon: <BookOpen className="w-8 h-8 text-cyan-400" />,
  },
  {
    id: 'complete',
    title: 'Ready to Start',
    description: 'You\'re ready to begin your journey! Start with Mission 1 and awaken the terminal.',
    icon: <Award className="w-8 h-8 text-emerald-400" />,
    action: 'start',
  },
];

interface TutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function Tutorial({ onComplete, onSkip }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const { player } = useGame();

  const step = TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (isLastStep) {
      sound.playSuccess();
      onComplete();
    } else {
      sound.playKeyClick();
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      sound.playKeyClick();
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev - 1);
        setIsAnimating(false);
      }, 150);
    }
  };

  const handleSkip = () => {
    sound.playKeyClick();
    onSkip();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
        {/* Progress bar */}
        <div className="h-1 bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
            style={{ width: `${((currentStep + 1) / TUTORIAL_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          {/* Step indicator */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500">
              Step {currentStep + 1} of {TUTORIAL_STEPS.length}
            </span>
            <button
              onClick={handleSkip}
              className="text-xs font-mono text-slate-500 hover:text-slate-300 cursor-pointer"
            >
              Skip Tutorial
            </button>
          </div>

          {/* Icon and text */}
          <div
            className={`space-y-4 transition-all duration-150 ${
              isAnimating ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              {step.icon}
            </div>
            <h2 className="text-2xl font-black font-mono text-white">{step.title}</h2>
            <p className="text-slate-400 font-mono text-sm leading-relaxed">{step.description}</p>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={handlePrev}
              disabled={isFirstStep}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm cursor-pointer transition-all ${
                isFirstStep
                  ? 'text-slate-600 cursor-not-allowed'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>

            <div className="flex items-center gap-2">
              {TUTORIAL_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentStep
                      ? 'bg-cyan-400 w-6'
                      : i < currentStep
                      ? 'bg-cyan-400/50'
                      : 'bg-slate-700'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 rounded-xl text-cyan-300 font-mono text-sm font-bold cursor-pointer transition-all"
            >
              {isLastStep ? 'Start' : 'Next'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
