import { User, UserRole } from "@/types";
import { users } from "@/data/mockData";
import { toast } from "@/components/ui/use-toast";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

interface LoginAttempt {
  email: string;
  attempts: number;
  lockedUntil: Date | null;
}

let authState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false
};

// Track login attempts for account lockout
const loginAttempts: LoginAttempt[] = [];
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

// Add dummy users
users.push({
  id: "user_dummy",
  name: "Test User",
  email: "n72@gmail.com",
  role: "individual",
  verified: true
});

users.push({
  id: "admin_dummy",
  name: "Admin User",
  email: "admin@gmail.com",
  role: "admin",
  verified: true
});

export const getAuthState = (): AuthState => {
  // In a real app, we would check for a token in localStorage or cookies
  // and validate it with the server
  return authState;
};

export const login = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    authState.loading = true;
    
    // Check if account is locked
    const attemptRecord = loginAttempts.find(a => a.email === email);
    if (attemptRecord && attemptRecord.lockedUntil) {
      if (new Date() < attemptRecord.lockedUntil) {
        authState.loading = false;
        const minutesLeft = Math.ceil((attemptRecord.lockedUntil.getTime() - new Date().getTime()) / (1000 * 60));
        
        toast({
          title: "Account temporarily locked",
          description: `Too many failed attempts. Try again in ${minutesLeft} minutes.`,
          variant: "destructive"
        });
        
        reject(new Error(`Account locked. Try again in ${minutesLeft} minutes`));
        return;
      } else {
        // Reset lockout if time has passed
        attemptRecord.lockedUntil = null;
        attemptRecord.attempts = 0;
      }
    }
    
    // Simulate API call
    setTimeout(() => {
      const user = users.find(u => u.email === email);
      
      if (user && password === "12345678N") { // For demo purposes, accept "password" as valid
        // Reset login attempts on successful login
        const index = loginAttempts.findIndex(a => a.email === email);
        if (index !== -1) {
          loginAttempts[index].attempts = 0;
        }
        
        authState = {
          isAuthenticated: true,
          user,
          loading: false
        };
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.name}!`,
        });
        
        resolve(user);
      } else {
        authState.loading = false;
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive"
        });
        
        // Track failed attempts and implement lockout
        const existingAttempt = loginAttempts.find(a => a.email === email);
        if (existingAttempt) {
          existingAttempt.attempts += 1;
          
          // Lock account after max attempts
          if (existingAttempt.attempts >= MAX_LOGIN_ATTEMPTS) {
            const lockoutTime = new Date();
            lockoutTime.setMinutes(lockoutTime.getMinutes() + LOCKOUT_DURATION_MINUTES);
            existingAttempt.lockedUntil = lockoutTime;
            
            toast({
              title: "Account temporarily locked",
              description: `Too many failed attempts. Try again in ${LOCKOUT_DURATION_MINUTES} minutes.`,
              variant: "destructive"
            });
          }
        } else {
          // First failed attempt
          loginAttempts.push({
            email,
            attempts: 1,
            lockedUntil: null
          });
        }
        
        reject(new Error("Invalid email or password"));
      }
    }, 500);
  });
};

export const register = (name: string, email: string, password: string, role: UserRole): Promise<User> => {
  return new Promise((resolve, reject) => {
    authState.loading = true;
    
    // Simulate API call
    setTimeout(() => {
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        authState.loading = false;
        toast({
          title: "Registration failed",
          description: "Email already exists",
          variant: "destructive"
        });
        
        reject(new Error("Email already exists"));
        return;
      }
      
      // Create new user
      const newUser: User = {
        id: `user_${users.length + 1}`,
        name,
        email,
        role,
        verified: true // Always verified now
      };
      
      // In a real app, we would send this to the server
      users.push(newUser);
      
      // Auto-login after registration
      authState = {
        isAuthenticated: true,
        user: newUser,
        loading: false
      };
      
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      });
      
      resolve(newUser);
    }, 500);
  });
};

// New function to verify email
export const verifyEmail = (verificationToken: string): Promise<boolean> => {
  return new Promise((resolve) => {
    // In a real app, we would validate the token with the server
    setTimeout(() => {
      // For demo purposes, always succeed
      toast({
        title: "Email verified",
        description: "Your email has been verified successfully. You can now log in.",
      });
      
      resolve(true);
    }, 500);
  });
};

export const logout = (): void => {
  authState = {
    isAuthenticated: false,
    user: null,
    loading: false
  };
  
  toast({
    title: "Logged out",
    description: "You have been successfully logged out",
  });
};

export const checkIsAdmin = (): boolean => {
  return authState.user?.role === "admin";
};
