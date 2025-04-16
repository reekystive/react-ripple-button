import { FC } from 'react';
import { clamp } from '../utils/math.ts';

export const RippleCircle: FC<{
  ringWidth: number;
  width?: number | string;
  height?: number | string;
  className?: string;
}> = ({ ringWidth: rawRingWidth, ...props }) => {
  const GRADIENT_WIDTH = 30;
  const ringWidth = clamp(rawRingWidth, 0, 100 - GRADIENT_WIDTH * 2);

  return (
    <svg width="100" height="100" viewBox="0 0 100 100" {...props}>
      <defs>
        <radialGradient id="ring-feather-mask" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset={`${100 - GRADIENT_WIDTH * 2 - ringWidth}%`} stopColor="white" stopOpacity="0" />
          <stop offset={`${100 - GRADIENT_WIDTH - ringWidth}%`} stopColor="white" stopOpacity="1" />
          <stop offset={`${100 - GRADIENT_WIDTH}%`} stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>

        <mask id="ring-mask">
          <rect width="100" height="100" fill="url(#ring-feather-mask)" />
        </mask>
      </defs>

      <circle cx="50" cy="50" r="50" fill="currentColor" mask="url(#ring-mask)" />
    </svg>
  );
};

export const DebugRippleCircle: FC<{
  ringWidth: number;
  width?: number | string;
  height?: number | string;
  className?: string;
}> = ({ ringWidth: rawRingWidth, ...props }) => {
  const GRADIENT_WIDTH = 30;
  const ringWidth = clamp(rawRingWidth, 0, 100 - GRADIENT_WIDTH * 2);

  return (
    <svg width="100" height="100" viewBox="0 0 100 100" {...props}>
      <defs>
        <radialGradient id="ring-feather-mask-debug" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset={`${100 - GRADIENT_WIDTH * 2 - ringWidth}%`} stopColor="white" stopOpacity="0" />
          <stop offset={`${100 - GRADIENT_WIDTH * 2 - ringWidth}%`} stopColor="white" stopOpacity="0.2" />
          <stop offset={`${100 - GRADIENT_WIDTH - ringWidth}%`} stopColor="white" stopOpacity="0.2" />
          <stop offset={`${100 - GRADIENT_WIDTH - ringWidth}%`} stopColor="white" stopOpacity="1" />
          <stop offset={`${100 - GRADIENT_WIDTH}%`} stopColor="white" stopOpacity="1" />
          <stop offset={`${100 - GRADIENT_WIDTH}%`} stopColor="white" stopOpacity="0.2" />
          <stop offset="100%" stopColor="white" stopOpacity="0.2" />
        </radialGradient>

        <mask id="ring-mask-debug">
          <rect width="100" height="100" fill="url(#ring-feather-mask-debug)" />
        </mask>
      </defs>

      <circle cx="50" cy="50" r="50" fill="currentColor" mask="url(#ring-mask-debug)" />
    </svg>
  );
};
