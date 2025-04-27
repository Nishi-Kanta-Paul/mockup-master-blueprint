
import { User, UserRole } from "@/types";
import { users } from "@/data/mockData";
import { toast } from "@/components/ui/use-toast";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

let authState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false
};

export const getAuthState = (): AuthState => {
  // In a real app, we would check for a token in localStorage or cookies
  // and validate it with the server
  return authState;
};

export const login = (email: string, password: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    authState.loading = true;
    
    // Simulate API call
    setTimeout(() => {
      const user = users.find(u => u.email === email);
      
      if (user && password === "password") { // For demo purposes, accept "password" as valid
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
        role
      };
      
      // In a real app, we would send this to the server
      users.push(newUser);
      
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
