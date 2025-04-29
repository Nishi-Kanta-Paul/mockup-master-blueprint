import { User, UserRole } from "@/types";
import { users } from "@/data/mockData";
import { toast } from "@/components/ui/use-toast";

const LOCAL_STORAGE_AUTH_KEY = "subscribepro_auth";

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

export const getAuthState = () => {
  // Get auth state from localStorage
  const authData = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
  
  if (authData) {
    try {
      return JSON.parse(authData);
    } catch (e) {
      // Invalid data in localStorage
      localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
    }
  }
  
  return {
    isAuthenticated: false,
    user: null,
    loading: false
  };
};

export const login = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      const user = users.find(u => u.email === email);
      
      // For demo purposes, simple password check
      if (user && password === "12345678N") {
        const authState = {
          isAuthenticated: true,
          user,
          loading: false
        };
        
        // Save to localStorage
        localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(authState));
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.name}!`,
        });
        
        resolve(user);
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive"
        });
        
        reject(new Error("Invalid email or password"));
      }
    }, 500);
  });
};

export const register = (name: string, email: string, password: string, role: UserRole): Promise<User> => {
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
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
        verified: true // Auto verified
      };
      
      users.push(newUser);
      
      // Auto-login after registration
      const authState = {
        isAuthenticated: true,
        user: newUser,
        loading: false
      };
      
      // Save to localStorage
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(authState));
      
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      });
      
      resolve(newUser);
    }, 500);
  });
};

export const logout = (): void => {
  // Remove from localStorage
  localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
  
  toast({
    title: "Logged out",
    description: "You have been successfully logged out",
  });
};

export const checkIsAdmin = (): boolean => {
  const { user } = getAuthState();
  return user?.role === "admin";
};

// Add the missing verifyEmail function
export const verifyEmail = (token: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // Simulate API call
    setTimeout(() => {
      try {
        // In a real app, we would validate the token and update the user record
        // For this demo, we'll simply simulate a successful verification if the token exists
        if (token && token.length > 0) {
          toast({
            title: "Email verified",
            description: "Your email has been verified successfully",
          });
          
          resolve(true);
        } else {
          toast({
            title: "Verification failed",
            description: "Invalid verification token",
            variant: "destructive"
          });
          
          reject(new Error("Invalid verification token"));
        }
      } catch (error) {
        reject(error);
      }
    }, 500);
  });
};
