import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const ADMIN_EMAIL = 'fsowah001@gmail.com';

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email);
      }
      setLoading(false);
    };

    getSession();

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.email);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId, email) => {
    try {
      // Add a small timeout to avoid hanging if RLS policies are misconfigured (recursion)
      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
      );

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }

      // Hardcoded admin check as fallback/priority
      const isAdmin = email === ADMIN_EMAIL || data?.role === 'admin';
      
      setProfile({
        ...data,
        role: isAdmin ? 'admin' : (data?.role || 'user')
      });
    } catch (err) {
      console.error('Profile fetch failed or timed out:', err);
      // Fallback for identified admin email even if fetch fails
      const isAdmin = email === ADMIN_EMAIL;
      setProfile({
        role: isAdmin ? 'admin' : 'user'
      });
    }
  };

  const signOut = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
