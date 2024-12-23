import React, { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";

// Stripe Public Key from environment variables
const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || "";

// Validate the Stripe key
if (!STRIPE_PUB_KEY) {
  console.warn("Stripe public key is missing. Please check your environment variables.");
}

// Initialize Stripe promise
const stripePromise = loadStripe(STRIPE_PUB_KEY);

// Define the context value type
interface AppContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  stripePromise: Promise<Stripe | null>;
}

// Create the context
const AppContext = createContext<AppContextType | null>(null);

// Context provider component
interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Memoize the context value
  const contextValue = useMemo(
    () => ({
      isLoggedIn,
      setIsLoggedIn,
      stripePromise, // Make sure this value is correctly passed in the context
    }),
    [isLoggedIn]
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

// Custom hook for consuming the context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};
