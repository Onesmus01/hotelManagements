import React, { createContext, useContext, useState } from "react";

type ToastMessage = {
  message: string;
  type: "SUCCESS" | "ERROR";
};

type AppContextType = {
  showToast: (toastMessage: ToastMessage) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const showToast = (toastMessage: ToastMessage) => {
    console.log(`Toast Type: ${toastMessage.type}, Message: ${toastMessage.message}`);
  };

  return (
    <AppContext.Provider value={{ showToast }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};
