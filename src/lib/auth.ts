
// Function to check if user is an admin or corporate
export const checkIsAdmin = (): boolean => {
  const { user } = getAuthState();
  return user?.role === "admin" || user?.role === "corporate";
};
