import { useCallback, useEffect, useRef } from 'react';

interface UseInactivityTimerProps {
  user: any;
  onTimeout: () => void;
  timeoutMs?: number;
  delayMs?: number;
}

export const useInactivityTimer = ({ 
  user, 
  onTimeout, 
  timeoutMs = 15 * 60 * 1000, // 15 minutes
  delayMs = 2000 // 2 seconds
}: UseInactivityTimerProps) => {
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const authTimeRef = useRef<number | null>(null);

  const resetInactivityTimer = useCallback(() => {
    // Clear existing timer
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
      inactivityTimeoutRef.current = null;
    }

    // Only set timer if user is authenticated
    if (!user) {
      console.log('[INACTIVITY] Skipping timer - user not authenticated');
      return;
    }

    // Additional check to ensure user has been authenticated for at least 3 seconds
    if (!authTimeRef.current || (Date.now() - authTimeRef.current) < 3000) {
      console.log('[INACTIVITY] Skipping timer - user recently authenticated');
      return;
    }

    console.log('[INACTIVITY] Starting inactivity timer for authenticated user');
    inactivityTimeoutRef.current = setTimeout(() => {
      if (user) {
        console.log('[INACTIVITY] Timeout triggered - logging out user');
        onTimeout();
      }
    }, timeoutMs);
  }, [user, onTimeout, timeoutMs]);

  // Set up authentication timestamp and inactivity timer
  useEffect(() => {
    if (user) {
      authTimeRef.current = Date.now();
      
      // Add a delay before starting inactivity timer to ensure everything is loaded
      const timer = setTimeout(() => {
        if (user) {
          console.log('[INACTIVITY] Starting timer after successful authentication');
          resetInactivityTimer();
        }
      }, delayMs);

      return () => clearTimeout(timer);
    } else {
      authTimeRef.current = null;
      // Clear any existing timer when user logs out
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
        inactivityTimeoutRef.current = null;
      }
    }
  }, [user, resetInactivityTimer, delayMs]);

  // Set up activity listeners
  useEffect(() => {
    const activityEvents = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];
    
    const handleActivity = () => {
      // Only reset timer if user is authenticated and has been authenticated for at least 3 seconds
      if (user && authTimeRef.current && (Date.now() - authTimeRef.current) >= 3000) {
        resetInactivityTimer();
      }
    };

    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [user, resetInactivityTimer]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
        inactivityTimeoutRef.current = null;
      }
    };
  }, []);

  return { resetInactivityTimer };
};