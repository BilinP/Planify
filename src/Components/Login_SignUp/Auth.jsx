import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../../../backend/supabaseClient.js'; // Adjust the path as necessary

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const session = localStorage.getItem('supabase.auth.token') || sessionStorage.getItem('supabase.auth.token');
    if (session) {
      const parsedSession = JSON.parse(session);
      setAuthData(parsedSession.user);
      fetchProfileData(parsedSession.user.id);
    }
  }, []);

  const fetchProfileData = async (userId) => {
    const { data, error } = await supabase
      .from('profile')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error("Error fetching profile data:", error);
      return;
    }

    setProfileData(data);
  };

  const login = async (email, password, rememberMe) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login Error:", error);
      return false;
    }

    console.log("Login Success:", data);
    setAuthData(data.user);
    fetchProfileData(data.user.id);

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('supabase.auth.token', JSON.stringify(data.session));

    return true;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout Error:", error);
      alert("Logout failed.");
      return;
    }
    setAuthData(null);
    setProfileData(null);
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.removeItem('supabase.auth.token');
  };

  const loginWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error("Google Login Error:", error);
      return false;
    }

    if (data?.user) {
      console.log("Google Login Success:", data);
      setAuthData(data.user);
      fetchProfileData(data.user.id);
      localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
      return true;
    } else {
      console.error("Google Login Error: No user data returned");
      return false;
    }
  };

  const signUp = async (email, password, additionalData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: additionalData,
      },
    });

    if (error) {
      console.error("Sign Up Error:", error);
      return false;
    }

    console.log("Sign Up Success:", data);
    setAuthData(data.user);

    // Insert a new record into the profile table
    const { error: profileError } = await supabase
      .from('profile')
      .insert([{
        user_id: data.user.id,
        email: data.user.email,
        name: `${additionalData.firstName} ${additionalData.last_name}`,
        dob: additionalData.dob,
        country: 'USA',
        language: 'English',
        created_at: new Date().toISOString()
      }]);

    if (profileError) {
      console.error("Profile Insert Error:", profileError);
      return false;
    }

    fetchProfileData(data.user.id);
    localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));

    return true;
  };

  return (
    <AuthContext.Provider value={{ authData, profileData, login, loginWithGoogle, signUp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);