import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: any;
  token: string | null;
  signIn: (token: string, user: any) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load stored token on mount
    const loadStorage = async () => {
      const storedToken = await AsyncStorage.getItem('@weride_token');
      const storedUser = await AsyncStorage.getItem('@weride_user');
      if (storedToken) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser || '{}'));
      }
      setLoading(false);
    };
    loadStorage();
  }, []);

  const signIn = async (newToken: string, newUser: any) => {
    setToken(newToken);
    setUser(newUser);
    await AsyncStorage.setItem('@weride_token', newToken);
    await AsyncStorage.setItem('@weride_user', JSON.stringify(newUser));
  };

  const signOut = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem('@weride_token');
    await AsyncStorage.removeItem('@weride_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
