import * as Switch from '@radix-ui/react-switch';
import { AnimatePresence, motion, Transition, Variants } from 'framer-motion';
import { FC, useRef, useState } from 'react';
import { GitHubIcon } from './icons/github.tsx';
import { cn } from './utils/cn';

interface ButtonWithRippleProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  debug: boolean;
  initialRingWidth?: number;
  targetRingWidth?: number;
}

const ButtonWithRipple: FC<ButtonWithRippleProps> = ({ active, onClick, children, debug }) => {
  const [ripples, setRipples] = useState<{ id: number }[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const idCounter = useRef(0);

  // Sky blue colors in RGB for the ripple effect - hardcoded
  const ringColor = '56, 189, 248';

  const createRipple = () => {
    if (!buttonRef.current) return;

    // Create new ripple - always from center
    const newRipple = { id: idCounter.current };
    idCounter.current += 1;

    // Add ripple
    setRipples((prev) => [...prev, newRipple]);
  };

  const handleClick = () => {
    onClick();

    // Only create ripple effect when activating (going from inactive to active)
    if (!active) {
      createRipple();
    }
  };

  const handleAnimationComplete = (id: number) => {
    setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
  };

  const getGradient = (config: { color: string; opacity: number; debug: boolean; ringWidth: number }) => {
    const { color, opacity, debug, ringWidth } = config;
    const TRANSITION_LENGTH = 25;
    const innerEdge = 35 - ringWidth / 2;
    const outerEdge = 35 + ringWidth / 2;

    if (debug) {
      return `
        radial-gradient(
          circle,
          transparent ${Math.max(0, innerEdge - TRANSITION_LENGTH)}%,
          #8b5cf620 ${Math.max(0, innerEdge - TRANSITION_LENGTH) + 0.5}%,
          #8b5cf620 ${innerEdge}%,
          #8b5cf6 ${innerEdge + 0.5}%,
          #8b5cf6 ${outerEdge}%,
          #8b5cf620 ${outerEdge + 0.5}%,
          #8b5cf620 ${Math.min(70, outerEdge + TRANSITION_LENGTH)}%,
          transparent ${Math.min(70, outerEdge + TRANSITION_LENGTH) + 0.5}%
        )
      `;
    }

    return `
      radial-gradient(
        circle,
        rgba(${color}, 0) ${Math.max(0, innerEdge - TRANSITION_LENGTH)}%,
        rgba(${color}, ${opacity}) ${innerEdge}%,
        rgba(${color}, ${opacity}) ${outerEdge}%,
        rgba(${color}, 0) ${Math.min(70, outerEdge + TRANSITION_LENGTH)}%
      )
    `;
  };

  const rippleVariants: Variants = {
    initial: {
      width: 0,
      opacity: debug ? 1 : 0.9,
      background: getGradient({ color: ringColor, opacity: 0.7, debug, ringWidth: 5 }),
    },
    animate: {
      width: 800,
      opacity: debug ? 1 : 0,
      background: getGradient({ color: ringColor, opacity: 0.5, debug, ringWidth: 25 }),
      transition: {
        width: {
          type: 'spring',
          stiffness: 600,
          damping: 100,
          mass: 1,
        },
        opacity: {
          type: 'spring',
          stiffness: 600,
          damping: 100,
          mass: 0.5,
        },
        background: {
          type: 'spring',
          stiffness: 400,
          damping: 100,
          mass: 1,
        },
      } satisfies Record<string, Transition>,
    },
  };

  return (
    <div className="relative isolate">
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className={cn(
              'pointer-events-none absolute top-1/2 left-1/2 z-0 aspect-square -translate-x-1/2 -translate-y-1/2 scale-y-70 rounded-full',
              debug && 'border-2 border-amber-500'
            )}
            variants={rippleVariants}
            initial="initial"
            animate="animate"
            onAnimationComplete={() => {
              handleAnimationComplete(ripple.id);
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
