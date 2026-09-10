import React from 'react';

// --- DISPLAY TYPOGRAPHY ---
interface DisplayProps extends React.HTMLAttributes<HTMLHeadingElement> {
  size?: 'hero' | 'xl' | 'lg' | 'md';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span' | 'p';
  italic?: boolean;
  children: React.ReactNode;
}

export const Display: React.FC<DisplayProps> = ({
  size = 'lg',
  as: Component = 'h1',
  italic = true,
  className = '',
  children,
  ...props
}) => {
  const sizeClasses = {
    hero: 'text-display-hero',
    xl: 'text-display-xl',
    lg: 'text-display-lg',
    md: 'text-display-md',
  }[size];

  return (
    <Component
      className={`font-display text-[#f5f1e8] font-normal ${italic ? 'italic' : ''} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

// --- EYEBROW / CHAPTER LABEL ---
interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  accent?: boolean;
}

export const Eyebrow: React.FC<EyebrowProps> = ({
  children,
  accent = false,
  className = '',
  ...props
}) => {
  return (
    <span
      className={`font-body text-eyebrow font-semibold tracking-[0.18em] uppercase inline-flex items-center gap-2 ${
        accent ? 'text-pink-400' : 'text-white/50'
      } ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

// --- EDITORIAL BODY PARAGRAPH ---
interface BodyProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: 'lg' | 'md' | 'sm';
  variant?: 'emotional' | 'editorial' | 'full';
  children: React.ReactNode;
}

export const Body: React.FC<BodyProps> = ({
  size = 'md',
  variant = 'editorial',
  className = '',
  children,
  ...props
}) => {
  const sizeClass = {
    lg: 'text-lg md:text-xl leading-relaxed',
    md: 'text-base md:text-lg leading-relaxed',
    sm: 'text-sm md:text-base leading-normal',
  }[size];

  const variantClass = {
    emotional: 'max-w-[480px]',
    editorial: 'max-w-[580px]',
    full: 'w-full',
  }[variant];

  return (
    <p
      className={`font-body text-[#d5cfc3] font-normal ${sizeClass} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </p>
  );
};

// --- QUOTE ---
interface QuoteProps extends React.HTMLAttributes<HTMLQuoteElement> {
  children: React.ReactNode;
  author?: string;
}

export const Quote: React.FC<QuoteProps> = ({
  children,
  author,
  className = '',
  ...props
}) => {
  return (
    <blockquote className={`font-display italic text-quote text-[#f5f1e8] max-w-xl mx-auto my-6 ${className}`} {...props}>
      <span className="opacity-40 text-2xl md:text-4xl select-none mr-1">“</span>
      {children}
      <span className="opacity-40 text-2xl md:text-4xl select-none ml-1">”</span>
      {author && (
        <cite className="block not-italic font-body text-metadata text-white/50 mt-4 tracking-widest uppercase">
          — {author}
        </cite>
      )}
    </blockquote>
  );
};

// --- HANDWRITTEN ACCENT ---
interface HandwrittenProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  color?: string;
}

export const Handwritten: React.FC<HandwrittenProps> = ({
  children,
  color,
  className = '',
  ...props
}) => {
  return (
    <span
      className={`font-handwriting text-handwritten-note font-medium ${className}`}
      style={color ? { color } : undefined}
      {...props}
    >
      {children}
    </span>
  );
};

// --- GIANT ATMOSPHERIC BACKGROUND WORD ---
interface DisplayBackgroundProps {
  text: string;
  className?: string;
  font?: 'serif' | 'sans';
}

export const DisplayBackground: React.FC<DisplayBackgroundProps> = ({
  text,
  className = '',
  font = 'serif',
}) => {
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-x-0 pointer-events-none select-none overflow-hidden flex items-center justify-center z-0 ${className}`}
    >
      <span
        className={`${
          font === 'serif' ? 'font-display italic' : 'font-body font-black uppercase'
        } text-[18vw] leading-[0.78] tracking-tighter text-white/[0.035] whitespace-nowrap drop-shadow-sm`}
      >
        {text}
      </span>
    </div>
  );
};
