import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../../../backend/supabaseClient.js'; // Adjust the path as necessary

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState(null);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login Error:", error);
      alert("Login failed. Please check your credentials.");
      return false;
    }

    console.log("Login Success:", data);
    setAuthData(data.user);
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
  };

  return (
    <AuthContext.Provider value={{ authData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);