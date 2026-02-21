"use client"; // This directive tells Next.js that this component runs in the browser (client-side), allowing us to use React hooks like useState and useEffect.

import { createContext, useContext, useEffect, useState } from "react"; // Import necessary React hooks for managing state, side effects, and context.
import { User, Session } from "@supabase/supabase-js"; // Import types for User and Session from the Supabase client library.
import { createClient } from "@/lib/supabase/client"; // Import our helper function to create a Supabase client instance.
import { useRouter } from "next/navigation"; // Import the Next.js router hook to programmatic navigation (like redirecting).

// Define the shape of our authentication context data. This tells TypeScript what kind of data we are sharing across the app.
interface AuthContextType {
  user: User | null; // The current user object, or null if not logged in.
  session: Session | null; // The current active session, or null if no session exists.
  isLoading: boolean; // A flag to indicate if we are currently checking authentication status (true = loading).
  signOut: () => Promise<void>; // A function we can call to log the user out. It returns a Promise (async).
}

// Create the context object with default/initial values.
// These default values are used if a component tries to use this context outside of an <AuthProvider>.
const AuthContext = createContext<AuthContextType>({
  user: null, // Default: no user.
  session: null, // Default: no session.
  isLoading: true, // Default: we assume we are loading initially.
  signOut: async () => {}, // Default: an empty function that does nothing.
});

// The main Provider component. This will wrap our entire application (or parts of it) to provide auth data to all children.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null); // State variable to hold the current user. Starts as null.
  const [session, setSession] = useState<Session | null>(null); // State variable to hold the current session. Starts as null.
  const [isLoading, setIsLoading] = useState(true); // State variable for loading status. Starts as true (loading).
  const router = useRouter(); // Initialize the Next.js router so we can redirect users.
  const supabase = createClient(); // Initialize the Supabase client to interact with our backend.

  // useEffect runs specific code when the component mounts (loads) or when its dependencies change.
  useEffect(() => {
    // 1. Check for an identifiable active session correctly when the app initially loads.
    const checkUser = async () => {
      // Get the current session from Supabase.
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Update our local state with the session data found.
      setSession(session);
      // Update the user state. If session exists, use its user; otherwise null.
      setUser(session?.user ?? null);
      // We are done checking, so set loading to false.
      setIsLoading(false);
    };

    checkUser(); // Call the function we just defined.

    // 2. Set up a listener to react to real-time changes in authentication state (e.g., user signs in or out).
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Update session state with the new session.
      setSession(session);
      // Update user state with the new user.
      setUser(session?.user ?? null);
      // Ensure loading is false (we know the state now).
      setIsLoading(false);
      // Refresh the Next.js router. This re-runs server components to ensure they reflect the new auth state (like updating protected routes).
      router.refresh();
    });

    // implementation of the cleanup function.
    // This runs when the component unmounts (rare for a root provider) to stop listening for changes.
    return () => subscription.unsubscribe();
  }, [router, supabase]); // Dependencies: if 'router' or 'supabase' changes, re-run this effect (unlikely to change often).

  // Define a function to sign the user out.
  const signOut = async () => {
    // Call Supabase's signOut method to clear the session on the server/backend.
    await supabase.auth.signOut();
    // Redirect the user to the login page immediately after signing out.
    router.push("/login");
    // Note: router.refresh() happens in the onAuthStateChange listener above, so we don't need it here.
  };

  // Render the Context Provider.
  // We pass the current state (user, session, isLoading) and the signOut function into the 'value' prop.
  // {children} represents all the components inside this Provider (your whole app).
  return (
    <AuthContext.Provider value={{ user, session, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// A custom hook to easily access this context from any component in the app.
// Instead of importing useContext and AuthContext every time, you just import useAuth().
export const useAuth = () => useContext(AuthContext);
