import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(price: number): string {
  return price.toLocaleString('vi-VN');
}

export function extractAllTags(courses: any[]): string[] {
  const tagsSet = new Set<string>();
  
  courses.forEach(course => {
    if (course.tags) {
      const courseTags = course.tags.split(',').map((tag: string) => tag.trim());
      courseTags.forEach((tag: string) => {
        if (tag) tagsSet.add(tag);
      });
    }
  });
  
  return Array.from(tagsSet);
}

export function getCourseDuration(timeString: string | undefined): 'short' | 'medium' | 'long' | null {
  if (!timeString) return null;
  
  // Try to extract a number from the time string
  const timeMatch = timeString.match(/(\d+)/);
  if (!timeMatch) return null;
  
  const hours = parseInt(timeMatch[0], 10);
  
  if (hours < 5) return 'short';
  if (hours <= 10) return 'medium';
  return 'long';
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
}
