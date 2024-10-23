import React, { createContext, useEffect, useState, ReactNode } from "react";

// Define the shape of the user object
interface User {
  name: string; // Example property, adjust as needed
  email: string; // Example property, adjust as needed
}

// Define the context type
interface AuthContextType {
  currentUser: User | null; // The current user can be either User or null
  updateUser: (data: User | null) => void; // Function to update the current user
}

// Create the AuthContext with a default value
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Define the provider's props type
interface AuthContextProviderProps {
  children: ReactNode; // The children prop can be any valid React node
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  // Adjust this line to access the correct structure
  const userData = JSON.parse(localStorage.getItem("user") || "null");
  const [currentUser, setCurrentUser] = useState<User | null>(
    userData ? userData.user : null // Adjust here to get the nested user object
  );

  const updateUser = (data: User | null) => {
    setCurrentUser(data);
  };

  useEffect(() => {
    // Update the localStorage with the current user state
    localStorage.setItem("user", JSON.stringify({ user: currentUser })); // Save in the expected format
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
