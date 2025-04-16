import * as Switch from '@radix-ui/react-switch';
import { AnimatePresence, motion } from 'framer-motion';
import { FC, useRef, useState } from 'react';
import { GitHubIcon } from './icons/github.tsx';
import { cn } from './utils/cn';

interface ButtonWithRippleProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  debug: boolean;
}

const ButtonWithRipple: FC<ButtonWithRippleProps> = ({ active, onClick, children, debug }) => {
  const [ripples, setRipples] = useState<{ id: number }[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const idCounter = useRef(0);

  // Sky blue colors in RGB for the ripple effect - hardcoded
  const skyBlueRGB = {
    primary: '14, 165, 233', // sky-500
    light: '56, 189, 248', // sky-400
    dark: '3, 105, 161', // sky-700
  };

  const createRipple = () => {
    if (!buttonRef.current) return;

    // Create new ripple - always from center
    const newRipple = { id: idCounter.current };
    idCounter.current += 1;

    // Add ripple
    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 800);
  };

  const handleClick = () => {
    onClick();

    // Only create ripple effect when activating (going from inactive to active)
    if (!active) {
      createRipple();
    }
  };

  const getNormalGradient = (color: string, opacity: number) => `
    radial-gradient(
      circle,
      rgba(${color}, 0) 30%,
      rgba(${color}, ${opacity}) 40%,
      rgba(${color}, ${opacity}) 60%,
      rgba(${color}, 0) 70%
    )
  `;

  const getDebugGradient = (color: string, opacity: number) => `
    radial-gradient(
      circle,
      transparent 30%,
      red 30%,
      red 40%,
      rgba(${color}, ${opacity}) 40%,
      rgba(${color}, ${opacity}) 60%,
      blue 60%,
      blue 70%,
      transparent 70%
    )
  `;

  return (
    <div className="relative isolate">
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{
              width: 0,
              height: 0,
              opacity: debug ? 1 : 0.9,
              borderRadius: '100%',
              position: 'absolute',
              top: '50%',
              left: '50%',
              pointerEvents: 'none',
              background: debug
                ? getDebugGradient(skyBlueRGB.primary, 0.7)
                : getNormalGradient(skyBlueRGB.primary, 0.7),
              zIndex: 0,
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              width: 400,
              height: 400,
              opacity: debug ? 1 : 0,
              background: debug
                ? [
                    getDebugGradient(skyBlueRGB.primary, 0.7),
                    getDebugGradient(skyBlueRGB.light, 0.7),
                    getDebugGradient(skyBlueRGB.dark, 0.5),
                  ]
                : [
                    getNormalGradient(skyBlueRGB.primary, 0.7),
                    getNormalGradient(skyBlueRGB.light, 0.7),
                    getNormalGradient(skyBlueRGB.dark, 0.5),
                  ],
            }}
            transition={{
              duration: 0.7,
              ease: [0.25, 0.1, 0.25, 1],
              background: {
                duration: 0.7,
                times: [0, 0.5, 1],
                ease: [0.25, 0.1, 0.25, 1],
              },
              opacity: {
                delay: 0,
                duration: debug ? 0 : 0.7,
                ease: 'linear',
              },
            }}
          />
        ))}
      </AnimatePresence>
      <button
        ref={buttonRef}
        className={cn(
          'z-1 cursor-pointer rounded-xl px-4 py-2 text-sm font-medium transition-all',
          active
            ? 'border-[1.5px] border-sky-300 bg-sky-100 text-sky-600 hover:border-sky-400'
            : 'border-[1.5px] border-gray-300 bg-transparent text-gray-900 hover:border-gray-400'
        )}
        onClick={handleClick}
      >
        {children}
      </button>
    </div>
  );
};

export const App: FC = () => {
  const [superpowerActive, setSuperpowerActive] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  const handleToggleSuperpower = () => {
    setSuperpowerActive((prev) => !prev);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100">
      <ButtonWithRipple active={superpowerActive} onClick={handleToggleSuperpower} debug={debugMode}>
        Superpower mode
      </ButtonWithRipple>

      <div className="absolute bottom-3 left-3">
        <a
          href="https://github.com/reekystive/react-ripple-button"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center rounded-full bg-transparent p-3 transition-colors hover:bg-gray-200"
          aria-label="GitHub Repository"
        >
          <GitHubIcon width={24} height={24} className="text-black" />
        </a>
      </div>

      <div className="absolute right-5 bottom-5 flex items-center gap-2">
        <label htmlFor="debug-mode" className="text-sm font-medium text-gray-700">
          Debug Mode
        </label>
        <Switch.Root
          id="debug-mode"
          checked={debugMode}
          onCheckedChange={setDebugMode}
          className={cn(
            'relative h-[25px] w-[42px] cursor-pointer rounded-full bg-gray-200 outline-none',
            'data-[state=checked]:bg-sky-500'
          )}
        >
          <Switch.Thumb
            className={cn(
              'block h-[21px] w-[21px] translate-x-[2px] rounded-full bg-white transition-transform',
              'data-[state=checked]:translate-x-[19px]'
            )}
          />
        </Switch.Root>
      </div>
    </div>
  );
};
