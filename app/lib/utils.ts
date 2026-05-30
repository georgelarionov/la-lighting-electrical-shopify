import {clsx, type ClassValue} from 'clsx';
import {twMerge} from 'tailwind-merge';

/**
 * Merge conditional class names and de-duplicate conflicting Tailwind
 * utilities. Used by every shadcn primitive and section component.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
