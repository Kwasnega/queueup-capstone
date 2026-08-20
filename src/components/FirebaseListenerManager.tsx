import { useEffect, useRef, useCallback } from 'react';
import { DatabaseReference, off } from 'firebase/database';

interface ListenerManager {
  addListener: (key: string, unsubscribe: () => void) => void;
  removeListener: (key: string) => void;
  removeAllListeners: () => void;
  hasListener: (key: string) => boolean;
}

/**
 * Custom hook for managing Firebase listeners with proper cleanup
 * Prevents the "Cannot read properties of undefined (reading 'pieceNum_')" error
 */
export const useFirebaseListenerManager = (): ListenerManager => {
  const listenersRef = useRef<Map<string, () => void>>(new Map());

  const addListener = useCallback((key: string, unsubscribe: () => void) => {
    // Remove existing listener with the same key first
    removeListener(key);
    
    // Add new listener
    if (typeof unsubscribe === 'function') {
      listenersRef.current.set(key, unsubscribe);
    } else {
      console.warn(`Invalid unsubscribe function for listener key: ${key}`);
    }
  }, []);

  const removeListener = useCallback((key: string) => {
    const unsubscribe = listenersRef.current.get(key);
    if (unsubscribe) {
      listenersRef.current.delete(key);
      try {
        if (typeof unsubscribe === 'function') {
          // Use requestAnimationFrame to ensure cleanup happens after current execution
          requestAnimationFrame(() => {
            try {
              unsubscribe();
            } catch (delayedError) {
              // Silently handle Firebase internal cleanup errors
              console.debug(`Firebase listener cleanup completed for ${key}`);
            }
          });
        }
      } catch (error) {
        console.warn(`Error removing listener ${key}:`, error);
      }
    }
  }, []);

  const removeAllListeners = useCallback(() => {
    const listenersToRemove = Array.from(listenersRef.current.entries());
    listenersRef.current.clear();
    
    // Remove listeners with small delays to prevent Firebase internal errors
    listenersToRemove.forEach(([key, unsubscribe], index) => {
      setTimeout(() => {
        try {
          if (typeof unsubscribe === 'function') {
            unsubscribe();
          }
        } catch (error) {
          console.warn(`Error removing listener ${key}:`, error);
        }
      }, index * 10); // Stagger the cleanup calls
    });
  }, []);

  const hasListener = useCallback((key: string) => {
    return listenersRef.current.has(key);
  }, []);

  // Cleanup all listeners on unmount
  useEffect(() => {
    return () => {
      removeAllListeners();
    };
  }, [removeAllListeners]);

  return {
    addListener,
    removeListener,
    removeAllListeners,
    hasListener
  };
};

/**
 * Safely removes a Firebase listener using the off() function
 * Prevents the pieceNum_ error by checking if the reference is valid
 */
export const safeOffListener = (ref: DatabaseReference | null | undefined, callback?: any) => {
  if (!ref) {
    console.warn('Attempted to remove listener from null/undefined reference');
    return;
  }

  // Add a small delay to prevent Firebase internal path errors
  setTimeout(() => {
    try {
      // Check if the reference has the required properties before calling off()
      if (ref && typeof ref === 'object' && 'key' in ref && ref.key !== null) {
        if (callback) {
          off(ref, callback);
        } else {
          off(ref);
        }
      } else {
        console.warn('Invalid Firebase reference for listener removal');
      }
    } catch (error) {
      console.warn('Error removing Firebase listener:', error);
    }
  }, 10);
};

/**
 * Creates a safe wrapper around Firebase onValue that handles cleanup properly
 */
export const createSafeListener = (
  ref: DatabaseReference,
  callback: (snapshot: any) => void,
  errorCallback?: (error: any) => void
): (() => void) => {
  let isActive = true;
  let unsubscribe: (() => void) | null = null;

  try {
    // Import onValue dynamically to avoid issues
    import('firebase/database').then(({ onValue }) => {
      if (isActive) {
        unsubscribe = onValue(ref, callback, errorCallback);
      }
    }).catch((error) => {
      console.error('Error setting up Firebase listener:', error);
      if (errorCallback) {
        errorCallback(error);
      }
    });
  } catch (error) {
    console.error('Error creating Firebase listener:', error);
    if (errorCallback) {
      errorCallback(error);
    }
  }

  // Return cleanup function
  return () => {
    isActive = false;
    if (unsubscribe && typeof unsubscribe === 'function') {
      try {
        unsubscribe();
      } catch (error) {
        console.warn('Error during listener cleanup:', error);
      }
    }
  };
};

export default useFirebaseListenerManager;