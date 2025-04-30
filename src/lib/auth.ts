
import { User, UserRole } from "@/types";
import { toast } from "@/components/ui/use-toast";

// Auth state
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

// Function to get auth state from localStorage
export const getAuthState = (): AuthState => {
  try {
    const userJson = localStorage.getItem("subscribepro_user");
    if (userJson) {
      const user = JSON.parse(userJson);
      return {
        isAuthenticated: true,
        user,
        loading: false,
      };
    }
  } catch (error) {
    console.error("Error getting auth state:", error);
  }
  
  return {
    isAuthenticated: false,
    user: null,
    loading: false,
  };
};

// Function to check if user is an admin or corporate
export const checkIsAdmin = (): boolean => {
  const { user } = getAuthState();
  return user?.role === "admin" || user?.role === "corporate";
};

// Function to register a new user
export const register = async (
  name: string, 
  email: string, 
  password: string, 
  role: UserRole
): Promise<boolean> => {
  try {
    // Check if email already exists
    const users = JSON.parse(localStorage.getItem("subscribepro_users") || "[]");
    const existingUser = users.find((u: User) => u.email === email);
    
    if (existingUser) {
      toast({
        title: "Registration Failed",
        description: "An account with this email already exists.",
        variant: "destructive"
      });
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      password, // Store password for demo purposes
      role,
      verified: false, // Default to unverified
    };
    
    // Add user to users array
    users.push(newUser);
    localStorage.setItem("subscribepro_users", JSON.stringify(users));
    
    toast({
      title: "Registration Successful",
      description: "Please check your email for verification link.",
    });
    
    return true;
  } catch (error) {
    console.error("Registration error:", error);
    toast({
      title: "Registration Failed",
      description: "An unexpected error occurred.",
      variant: "destructive"
    });
    return false;
  }
};

// Function to log in
export const login = async (email: string, password: string): Promise<boolean> => {
  try {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("subscribepro_users") || "[]");
    
    // Find user with matching email
    const user = users.find((u: User) => u.email === email);
    
    if (!user) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        variant: "destructive"
      });
      return false;
    }
    
    // Check password
    if (user.password !== password) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        variant: "destructive"
      });
      return false;
    }
    
    // Check if user is verified
    if (!user.verified) {
      toast({
        title: "Email Not Verified",
        description: "Please verify your email before logging in.",
        variant: "destructive"
      });
      return false;
    }
    
    // Store user in localStorage (without password)
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem("subscribepro_user", JSON.stringify(userWithoutPassword));
    
    toast({
      title: "Login Successful",
      description: "Welcome back!",
    });
    
    return true;
  } catch (error) {
    console.error("Login error:", error);
    toast({
      title: "Login Failed",
      description: "An unexpected error occurred.",
      variant: "destructive"
    });
    return false;
  }
};

// Function to verify email
export const verifyEmail = async (token: string): Promise<boolean> => {
  try {
    // In a real app, this would make an API call to verify the token
    // For demo purposes, we'll just update the user's verification status
    
    // Extract user ID from token (in a real app, this would be done differently)
    const userId = token;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem("subscribepro_users") || "[]");
    
    // Find user with matching ID
    const userIndex = users.findIndex((u: User) => u.id === userId);
    
    if (userIndex === -1) {
      return false;
    }
    
    // Update user's verification status
    users[userIndex].verified = true;
    
    // Save updated users array
    localStorage.setItem("subscribepro_users", JSON.stringify(users));
    
    return true;
  } catch (error) {
    console.error("Email verification error:", error);
    return false;
  }
};

// Function to log out
export const logout = (): void => {
  try {
    localStorage.removeItem("subscribepro_user");
    toast({
      title: "Logout Successful",
      description: "You have been logged out.",
    });
  } catch (error) {
    console.error("Logout error:", error);
    toast({
      title: "Logout Failed",
      description: "An unexpected error occurred.",
      variant: "destructive"
    });
  }
};

// Function to set up default admin user if needed
export const setupDefaultAdmin = (): void => {
  try {
    const users = JSON.parse(localStorage.getItem("subscribepro_users") || "[]");
    
    // Check if admin user already exists
    const adminExists = users.some((u: User) => u.role === "admin");
    
    if (!adminExists) {
      // Create default admin user
      const adminUser: User = {
        id: "admin_default",
        name: "Admin User",
        email: "admin@example.com",
        password: "admin123", // For demo only
        role: "admin",
        verified: true, // Admin is verified by default
      };
      
      users.push(adminUser);
      localStorage.setItem("subscribepro_users", JSON.stringify(users));
    }
  } catch (error) {
    console.error("Setup default admin error:", error);
  }
};
