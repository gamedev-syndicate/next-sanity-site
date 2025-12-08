'use client'

import React, { useEffect, useRef, useState } from 'react';

interface AnimatedHomepageSectionProps {
  children: React.ReactNode;
  enableAnimation?: boolean;
  animateOnLoad?: boolean; // If true, animate immediately on mount instead of on scroll
  animationType?: 'fade' | 'slide-left' | 'slide-right'; // Type of animation
  className?: string;
  style?: React.CSSProperties;
}

export function AnimatedHomepageSection({ 
  children, 
  enableAnimation = false,
  animateOnLoad = false,
  animationType = 'fade',
  className = '',
  style = {}
}: AnimatedHomepageSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enableAnimation) {
      // If animation is disabled, show immediately
      setIsVisible(true);
      return;
    }

    if (animateOnLoad) {
      // For immediate animation (like banner), trigger after a brief delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 150); // Delay to ensure opacity-0 is rendered first
      
      return () => clearTimeout(timer);
    }

    // For scroll-triggered animation
    if (!sectionRef.current) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, [enableAnimation, animateOnLoad]);

  const getAnimationClass = () => {
    if (!enableAnimation) return '';
    
    if (isVisible) {
      switch (animationType) {
        case 'slide-left':
          return 'animate-slide-in-left';
        case 'slide-right':
          return 'animate-slide-in-right';
        case 'fade':
        default:
          return 'animate-fadeIn';
      }
    }
    return 'opacity-0';
  };

  const animationClass = getAnimationClass();

  return (
    <div 
      ref={sectionRef}
      className={`${className} ${animationClass}`.trim()}
      style={style}
    >
      {children}
    </div>
  );
}
