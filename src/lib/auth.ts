
import { User, UserRole } from "@/types";
import { toast } from "@/components/ui/use-toast";

const LOCAL_STORAGE_AUTH_KEY = "subscribepro_auth";
const LOCAL_STORAGE_USERS_KEY = "subscribepro_users";

// Initialize users from localStorage or create empty array
const getUsers = (): User[] => {
  const storedUsers = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
  if (storedUsers) {
    try {
      return JSON.parse(storedUsers);
    } catch (e) {
      console.error("Error parsing users from localStorage:", e);
      return [];
    }
  }
  return [];
};

// Save users to localStorage
const saveUsers = (users: User[]) => {
  localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));
};

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
    // Get users from localStorage
    const users = getUsers();
    
    // Simulate API call
    setTimeout(() => {
      const user = users.find(u => u.email === email);
      
      // Check if user exists and password matches (passwords would be hashed in a real app)
      if (user && user.password === password) {
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
    // Get current users from localStorage
    const users = getUsers();
    
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
        id: `user_${Date.now()}`,
        name,
        email,
        password, // Store the password (in a real app, this would be hashed)
        role,
        verified: true // Auto verified
      };
      
      // Add to users array
      users.push(newUser);
      
      // Save updated users to localStorage
      saveUsers(users);
      
      toast({
        title: "Registration successful",
        description: "Your account has been created. Please login with your credentials.",
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

// Add the verifyEmail function
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
