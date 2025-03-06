import { createContext, useContext, useState } from 'react';

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthContextObject {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  _initialized?: boolean;
}

// placeholder object passed in for IDE autocomplete suggestions; can be set to null otherwise
const AuthContext = createContext<AuthContextObject>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  _initialized: false,
});

// Context provider component to wrap <App> so all its descendant components hvae access to the context state
export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setCurrentUser(userData);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const contextValue: AuthContextObject = {
    user: currentUser,
    isAuthenticated: !!currentUser,
    login,
    logout,
    _initialized: true,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// custom hook that reduces boilerplate and simplfies access to context data within components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context._initialized) {
    throw new Error('Tried to access context from outside the provider');
  }

  return context;
};
