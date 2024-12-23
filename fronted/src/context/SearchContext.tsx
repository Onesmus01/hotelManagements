import React, { useState, useContext } from "react";

type SearchContextType = {
  destination: string;
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
  hotelId: string | null;  // Defaulting to null if no hotelId is set
  saveSearchValues: (
    destination: string,
    checkIn: Date,
    checkOut: Date,
    adultCount: number,
    childCount: number,
    hotelId?: string
  ) => void;
};

type SearchContextProviderProps = {
  children: React.ReactNode;
};

const SearchContext = React.createContext<SearchContextType | undefined>(undefined);

export const SearchContextProvider: React.FC<SearchContextProviderProps> = ({ children }) => {
  // Initialize state with default values instead of sessionStorage
  const [destination, setDestination] = useState<string>("");
  const [checkIn, setCheckIn] = useState<Date>(new Date());
  const [checkOut, setCheckOut] = useState<Date>(new Date());
  const [adultCount, setAdultCount] = useState<number>(1);
  const [childCount, setChildCount] = useState<number>(1);
  const [hotelId, setHotelId] = useState<string | null>(null);

  const saveSearchValues = (
    destination: string,
    checkIn: Date,
    checkOut: Date,
    adultCount: number,
    childCount: number,
    hotelId?: string
  ) => {
    setDestination(destination);
    setCheckIn(checkIn);
    setCheckOut(checkOut);
    setAdultCount(adultCount);
    setChildCount(childCount);
    if (hotelId !== undefined) {
      setHotelId(hotelId);
    } else {
      setHotelId(null);  // Remove hotelId if not provided
    }
  };

  const value = {
    destination,
    checkIn,
    checkOut,
    adultCount,
    childCount,
    hotelId,
    saveSearchValues,
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

export const useSearchContext = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchContextProvider");
  }
  return context;
};


// import React, { useState, useContext } from "react";

// type SearchContextType = {
//   destination: string;
//   checkIn: Date;
//   checkOut: Date;
//   adultCount: number;
//   childCount: number;
//   hotelId: string | null;  // Defaulting to null if no hotelId is set
//   saveSearchValues: (
//     destination: string,
//     checkIn: Date,
//     checkOut: Date,
//     adultCount: number,
//     childCount: number,
//     hotelId?: string
//   ) => void;
// };

// type SearchContextProviderProps = {
//   children: React.ReactNode;
// };

// const SearchContext = React.createContext<SearchContextType | undefined>(undefined);

// export const SearchContextProvider: React.FC<SearchContextProviderProps> = ({ children }) => {
//   // Initialize state with default values instead of sessionStorage
//   const [destination, setDestination] = useState<string>("");
//   const [checkIn, setCheckIn] = useState<Date>(new Date());
//   const [checkOut, setCheckOut] = useState<Date>(new Date());
//   const [adultCount, setAdultCount] = useState<number>(1);
//   const [childCount, setChildCount] = useState<number>(1);
//   const [hotelId, setHotelId] = useState<string | null>(null);

//   const saveSearchValues = (
//     destination: string,
//     checkIn: Date,
//     checkOut: Date,
//     adultCount: number,
//     childCount: number,
//     hotelId?: string
//   ) => {
//     setDestination(destination);
//     setCheckIn(checkIn);
//     setCheckOut(checkOut);
//     setAdultCount(adultCount);
//     setChildCount(childCount);
//     if (hotelId !== undefined) {
//       setHotelId(hotelId);
//     } else {
//       setHotelId(null);  // Remove hotelId if not provided
//     }
//   };

//   const value = {
//     destination,
//     checkIn,
//     checkOut,
//     adultCount,
//     childCount,
//     hotelId,
//     saveSearchValues,
//   };

//   return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
// };

// export const useSearchContext = (): SearchContextType => {
//   const context = useContext(SearchContext);
//   if (!context) {
//     throw new Error("useSearchContext must be used within a SearchContextProvider");
//   }
//   return context;
// };
