'use client'

import { useState } from 'react';
import { ContactBlock as ContactBlockType } from '../../types/sanity';
import { useDesignSystem } from '../../hooks/useDesignSystem';
import { resolveColor } from '../../lib/colorUtils';
import { designSystemColorToCSS } from '../../lib/background-utils';

interface ContactBlockProps {
  value: ContactBlockType;
}

export function ContactBlock({ value }: ContactBlockProps) {
  const { designSystem } = useDesignSystem();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Convert Sanity color to ColorReference format
  const convertToColorReference = (sanityColor: { hex: string; alpha?: number } | undefined) => {
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

  // Resolve form container colors using design system
  const containerBgColor = resolveColor(
    {
      colorSelection: value.containerBackgroundColorSelection,
      customColor: convertToColorReference(value.customContainerBackgroundColor),
    },
    designSystem,
    'rgba(31, 41, 55, 0.4)' // fallback: gray-800/40
  );

  const containerBorderColor = resolveColor(
    {
      colorSelection: value.containerBorderColorSelection,
      customColor: convertToColorReference(value.customContainerBorderColor),
    },
    designSystem,
    'rgba(55, 65, 81, 0.5)' // fallback: gray-700/50
  );

  // Resolve input field colors using design system
  const inputBgColor = resolveColor(
    {
      colorSelection: value.inputBackgroundColorSelection,
      customColor: convertToColorReference(value.customInputBackgroundColor),
    },
    designSystem,
    'rgba(0, 0, 0, 0.2)' // fallback: black/20
  );

  const inputBorderColor = resolveColor(
    {
      colorSelection: value.inputBorderColorSelection,
      customColor: convertToColorReference(value.customInputBorderColor),
    },
    designSystem,
    'rgba(55, 65, 81, 0.5)' // fallback: gray-700/50
  );

  const inputTextColor = resolveColor(
    {
      colorSelection: value.inputTextColorSelection,
      customColor: convertToColorReference(value.customInputTextColor),
    },
    designSystem,
    '#ffffff' // fallback: white
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
    <div className="w-full py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header Section */}
        {value.title && (
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              {value.title}
            </h2>
          </div>
        )}

        {/* Form Container - Simplified */}
        <div 
          className="rounded-lg p-8 shadow-lg"
          style={{
            backgroundColor: containerBgColor,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: containerBorderColor,
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                required
                className="w-full px-5 py-4 rounded-lg placeholder-gray-400 focus:outline-none transition-all duration-300"
                style={{
                  backgroundColor: inputBgColor,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: focusedField === 'name' ? accentColor : inputBorderColor,
                  color: inputTextColor,
                }}
                placeholder={value.nameLabel || 'Name'}
              />
            </div>

            {/* Email Field */}
            <div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                required
                className="w-full px-5 py-4 rounded-lg placeholder-gray-400 focus:outline-none transition-all duration-300"
                style={{
                  backgroundColor: inputBgColor,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: focusedField === 'email' ? accentColor : inputBorderColor,
                  color: inputTextColor,
                }}
                placeholder={value.emailLabel || 'Email'}
              />
            </div>

            {/* Message Field */}
            <div>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                onFocus={() => setFocusedField('message')}
                onBlur={() => setFocusedField(null)}
                required
                rows={6}
                className="w-full px-5 py-4 rounded-lg placeholder-gray-400 focus:outline-none transition-all duration-300 resize-y min-h-[150px]"
                style={{
                  backgroundColor: inputBgColor,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: focusedField === 'message' ? accentColor : inputBorderColor,
                  color: inputTextColor,
                }}
                placeholder={value.messageLabel || 'Message'}
              />
            </div>

            {/* Success/Error Messages */}
            {status === 'success' && (
              <div className="p-4 rounded-lg bg-green-900/30 border border-green-700/50 flex items-center gap-3">
                <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-green-100 text-sm">
                  {value.successMessage || 'Thank you! Your message has been sent.'}
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="p-4 rounded-lg bg-red-900/30 border border-red-700/50 flex items-center gap-3">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <p className="text-red-100 text-sm">
                  {value.errorMessage || 'Something went wrong. Please try again.'}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={status === 'loading'}
                className={`${sizeClass} w-full font-semibold rounded-lg transition-all duration-300 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl`}
                style={{
                  backgroundColor: buttonBgColor,
                  color: buttonTextColor,
                }}
              >
                {status === 'loading' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  value.buttonText || 'Send Message'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
