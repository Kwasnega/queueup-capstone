interface AuthUser {
  uid: string;
  email: string;
  displayName?: string;
}

interface AuthService {
  currentUser: AuthUser | null;
  onAuthStateChanged: (callback: (user: AuthUser | null) => void) => () => void;
  signOut: () => Promise<void>;
}

class MockAuthService implements AuthService {
  private user: AuthUser | null = null;
  private listeners: ((user: AuthUser | null) => void)[] = [];

  constructor() {
    // Simulate authentication state
    this.user = {
      uid: 'mock-uid-123',
      email: 'john.doe@student.gctu.edu.gh',
      displayName: 'John Doe'
    };
  }

  get currentUser(): AuthUser | null {
    return this.user;
  }

  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    this.listeners.push(callback);
    
    // Immediately call with current state
    setTimeout(() => callback(this.user), 100);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  async signOut(): Promise<void> {
    this.user = null;
    this.listeners.forEach(listener => listener(null));
  }

  // Simulate login (for testing)
  async signIn(email: string, password: string): Promise<void> {
    this.user = {
      uid: 'mock-uid-123',
      email,
      displayName: email.split('@')[0]
    };
    this.listeners.forEach(listener => listener(this.user));
  }
}

export const authService = new MockAuthService();
export type { AuthUser };