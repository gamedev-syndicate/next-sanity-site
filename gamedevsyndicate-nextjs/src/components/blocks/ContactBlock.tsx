'use client'

import { useState } from 'react';
import { PortableText } from '@portabletext/react';
import { ContactBlock as ContactBlockType } from '../../types/sanity';
import { useDesignSystem } from '../../hooks/useDesignSystem';
import { resolveColor } from '../../lib/colorUtils';
import { designSystemColorToCSS } from '../../lib/background-utils';

interface ContactBlockProps {
  value: ContactBlockType;
}

export function ContactBlock({ value }: ContactBlockProps) {
  console.log('ContactBlock rendering with value:', value);
  
  const { designSystem } = useDesignSystem();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Convert Sanity color to ColorReference format
  const convertToColorReference = (sanityColor: any) => {
    if (!sanityColor) return undefined;
    const r = parseInt(sanityColor.hex.slice(1, 3), 16);
    const g = parseInt(sanityColor.hex.slice(3, 5), 16);
    const b = parseInt(sanityColor.hex.slice(5, 7), 16);
    return {
      hex: sanityColor.hex,
      alpha: sanityColor.alpha,
      rgb: { r, g, b, a: sanityColor.alpha || 1 }
    };
  };

  // Resolve button colors using design system
  const buttonBgColor = resolveColor(
    {
      colorSelection: value.buttonBackgroundColorSelection,
      customColor: convertToColorReference(value.customButtonBackgroundColor),
    },
    designSystem,
    'var(--color-button-primary)' // fallback
  );

  const buttonTextColor = resolveColor(
    {
      colorSelection: value.buttonTextColorSelection,
      customColor: convertToColorReference(value.customButtonTextColor),
    },
    designSystem,
    '#ffffff' // fallback
  );

  // Get accent color from design system for focus states
  const accentColor = designSystem?.colors?.primary 
    ? designSystemColorToCSS(designSystem.colors.primary)
    : buttonBgColor;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value: inputValue } = e.target;
    setFormData(prev => ({ ...prev, [name]: inputValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // Here you would typically send the form data to an API endpoint
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Example API call (uncomment and modify as needed):
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...formData,
      //     recipientEmail: value.recipientEmail,
      //   }),
      // });
      // 
      // if (!response.ok) throw new Error('Failed to send message');

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('error');
      
      // Reset error message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const buttonSizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl',
  };

  const buttonSize = value.buttonSize || 'large';
  const sizeClass = buttonSizeClasses[buttonSize as keyof typeof buttonSizeClasses] || buttonSizeClasses.large;

  return (
    <div className="w-full mx-auto my-12 px-4">
      {/* Header Section */}
      {value.title && (
        <div className="text-center mb-12">
          <h2 
            className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            style={{
              textShadow: '0 0 30px rgba(255,255,255,0.1)',
            }}
          >
            {value.title}
          </h2>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
        
        {/* Left Column - Text Area (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {value.description && (
            <div className="prose prose-invert prose-lg max-w-none text-gray-300">
              <PortableText value={value.description} />
            </div>
          )}
          
          {/* Decorative Element */}
          <div 
            className="hidden lg:block relative h-64 rounded-lg overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${accentColor}20 0%, ${buttonBgColor}20 100%)`,
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-30 blur-3xl"
              style={{
                background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
              }}
            />
          </div>
        </div>

        {/* Right Column - Form Container with Glass Morphism (3 cols) */}
        <div 
          className="lg:col-span-3 relative backdrop-blur-xl rounded-lg p-8 md:p-10 shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: `0 8px 32px 0 rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)`,
          }}
        >
          {/* Decorative Elements */}
          <div 
            className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
            }}
          />
          <div 
            className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${buttonBgColor} 0%, transparent 70%)`,
            }}
          />

          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {/* Name Field */}
            <div className="relative group">
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full px-5 py-4 bg-black/20 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all duration-300"
                  style={{
                    borderColor: focusedField === 'name' ? accentColor : undefined,
                    boxShadow: focusedField === 'name' ? `0 0 0 3px ${accentColor}20` : undefined,
                  }}
                  placeholder={value.nameLabel || 'Name'}
                />
                {focusedField === 'name' && (
                  <div 
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    style={{
                      boxShadow: `0 0 20px ${accentColor}40`,
                    }}
                  />
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="relative group">
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full px-5 py-4 bg-black/20 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all duration-300"
                  style={{
                    borderColor: focusedField === 'email' ? accentColor : undefined,
                    boxShadow: focusedField === 'email' ? `0 0 0 3px ${accentColor}20` : undefined,
                  }}
                  placeholder={value.emailLabel || 'Email'}
                />
                {focusedField === 'email' && (
                  <div 
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    style={{
                      boxShadow: `0 0 20px ${accentColor}40`,
                    }}
                  />
                )}
              </div>
            </div>

            {/* Message Field */}
            <div className="relative group">
              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  required
                  rows={6}
                  className="w-full px-5 py-4 bg-black/20 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none transition-all duration-300 resize-y min-h-[150px]"
                  style={{
                    borderColor: focusedField === 'message' ? accentColor : undefined,
                    boxShadow: focusedField === 'message' ? `0 0 0 3px ${accentColor}20` : undefined,
                  }}
                  placeholder={value.messageLabel || 'Message'}
                />
                {focusedField === 'message' && (
                  <div 
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    style={{
                      boxShadow: `0 0 20px ${accentColor}40`,
                    }}
                  />
                )}
              </div>
            </div>

          {/* Success/Error Messages */}
          {status === 'success' && (
            <div 
              className="p-5 rounded-lg border flex items-center gap-3 animate-fadeIn"
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                borderColor: '#10b981',
              }}
            >
              <svg className="w-6 h-6 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-100 font-medium">
                {value.successMessage || 'Thank you! Your message has been sent.'}
              </p>
            </div>
          )}

          {status === 'error' && (
            <div 
              className="p-5 rounded-lg border flex items-center gap-3 animate-fadeIn"
              style={{
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
                borderColor: '#ef4444',
              }}
            >
              <svg className="w-6 h-6 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <p className="text-red-100 font-medium">
                {value.errorMessage || 'Something went wrong. Please try again.'}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={status === 'loading'}
              className={`${sizeClass} font-bold rounded-lg transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl`}
              style={{
                backgroundColor: buttonBgColor,
                color: buttonTextColor,
                boxShadow: `0 4px 20px ${buttonBgColor}40`,
              }}
            >
              {/* Button Shimmer Effect */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              
              {/* Button Content */}
              <span className="relative flex items-center gap-2">
                {status === 'loading' ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    {value.buttonText || 'Send Message'}
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </span>
            </button>
          </div>
        </form>
      </div>
      
      </div>
    </div>
  );
}
