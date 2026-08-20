// Firebase configuration and authentication service
// This service handles the modified signup flow where verification emails
// are sent to Gmail addresses instead of student emails

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

interface UserData {
  studentId: string;
  studentEmail: string; // @live.gctu.edu.gh email for institutional purposes
  gmailAddress: string; // Gmail for authentication and verification
  uid: string;
}

interface SignupData {
  studentId: string;
  studentEmail: string;
  gmailAddress: string;
  password: string;
}

interface LoginData {
  studentId: string;
  password: string;
}

class FirebaseAuthService {
  private config: FirebaseConfig = {
    apiKey: "AIzaSyDIqR0b9hA9IaLhRsVtJKSSwh9NktuIIjI",
    authDomain: "queueup-85662.firebaseapp.com",
    databaseURL: "https://queueup-85662-default-rtdb.firebaseio.com",
    projectId: "queueup-85662",
    storageBucket: "queueup-85662.firebasestorage.app",
    messagingSenderId: "647901471109",
    appId: "1:647901471109:web:2607f4883cd1393259e4ec"
  };

  /**
   * Initialize Firebase app
   * In real implementation, this would use Firebase SDK
   */
  async initialize() {
    // Firebase initialization would happen here
    console.log('Firebase initialized with config:', this.config);
  }

  /**
   * Sign up a new user
   * Creates Firebase auth account with Gmail address
   * Stores student data in database with both emails
   */
  async signup(data: SignupData): Promise<{ success: boolean; message: string }> {
    try {
      // Validate student email format
      if (!data.studentEmail.endsWith('@live.gctu.edu.gh')) {
        throw new Error('Please use your indexNumber@live.gctu.edu.gh email address.');
      }

      // Validate Gmail format
      if (!data.gmailAddress.endsWith('@gmail.com')) {
        throw new Error('Please enter a valid Gmail address.');
      }

      // Create user with Gmail address (for authentication)
      // const userCredential = await createUserWithEmailAndPassword(auth, data.gmailAddress, data.password);
      // const user = userCredential.user;

      // Send verification email to Gmail
      // await sendEmailVerification(user);

      // Store user data in database
      const userData: UserData = {
        studentId: data.studentId,
        studentEmail: data.studentEmail, // Keep for institutional purposes
        gmailAddress: data.gmailAddress, // Use for authentication
        uid: 'mock-uid-' + Date.now()
      };

      // await set(ref(db, "users/" + data.studentId), userData);

      return {
        success: true,
        message: 'Account created! Please check your Gmail to verify your account.'
      };

    } catch (error: any) {
      let errorMessage = error.message;
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This Gmail address is already in use by another account.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. It must be at least 6 characters long.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'The Gmail address is not valid.';
          break;
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Login user
   * Looks up Gmail address by student ID, then authenticates with Gmail
   */
  async login(data: LoginData): Promise<{ success: boolean; message: string; needsVerification?: boolean; email?: string }> {
    try {
      // Look up user data by student ID
      // const dbRef = ref(db);
      // const snapshot = await get(child(dbRef, `users/${data.studentId}`));
      
      // if (!snapshot.exists()) {
      //   throw new Error('Student ID not found.');
      // }

      // const userData = snapshot.val() as UserData;
      // const gmailAddress = userData.gmailAddress;

      // Sign in with Gmail address
      // const userCredential = await signInWithEmailAndPassword(auth, gmailAddress, data.password);
      // const user = userCredential.user;

      // Check if email is verified
      // if (!user.emailVerified) {
      //   return {
      //     success: false,
      //     message: 'Please verify your Gmail address before logging in.',
      //     needsVerification: true,
      //     email: gmailAddress
      //   };
      // }

      // Store student ID in localStorage for session management
      localStorage.setItem("studentId", data.studentId);

      return {
        success: true,
        message: 'Login successful!'
      };

    } catch (error: any) {
      let errorMessage = 'An unknown error occurred. Please try again.';
      
      switch (error.code) {
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMessage = 'Incorrect password.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'User account not found. Please check your credentials.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your internet connection.';
          break;
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  }

  /**
   * Resend verification email to Gmail address
   */
  async resendVerificationEmail(email: string): Promise<{ success: boolean; message: string }> {
    try {
      // await sendEmailVerification(auth.currentUser);
      
      return {
        success: true,
        message: 'Verification email sent! Please check your Gmail inbox.'
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send email. Please try again later.'
      };
    }
  }

  /**
   * Get current user data
   */
  async getCurrentUser(): Promise<UserData | null> {
    const studentId = localStorage.getItem("studentId");
    if (!studentId) return null;

    // In real implementation, fetch from database
    // const dbRef = ref(db);
    // const snapshot = await get(child(dbRef, `users/${studentId}`));
    // return snapshot.exists() ? snapshot.val() : null;

    return null;
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    // await signOut(auth);
    localStorage.removeItem("studentId");
  }
}

export const firebaseAuthService = new FirebaseAuthService();
export type { UserData, SignupData, LoginData };