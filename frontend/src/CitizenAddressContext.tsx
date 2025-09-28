// CitizenAddressContext.tsx
import React, { createContext, useContext } from "react";

const CitizenAddressContext = createContext<string>("");

export const CitizenAddressProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const raw = process.env.REACT_APP_CITIZEN_ADDRESS ?? "";
  if (!/^0x[0-9a-fA-F]{40}$/.test(raw)) {
    throw new Error("Invalid address in env");
  }
  const address = raw as `0x${string}`;
  return (
    <CitizenAddressContext.Provider value={address}>
      {children}
    </CitizenAddressContext.Provider>
  );
};

export const useCitizenAddress = () =>
  useContext(CitizenAddressContext) as `0x${string}`;
