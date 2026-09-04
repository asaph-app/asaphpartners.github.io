"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const TOKEN_KEY = "asaph-partner-token";
const DEVICE_KEY = "asaph-partner-device-code";

type PartnerCredentialsContextValue = {
  token: string;
  deviceCode: string;
  setToken: (value: string) => void;
  setDeviceCode: (value: string) => void;
  validated: boolean;
  setValidated: (value: boolean) => void;
};

const PartnerCredentialsContext =
  createContext<PartnerCredentialsContextValue | null>(null);

export function PartnerCredentialsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setTokenState] = useState("");
  const [deviceCode, setDeviceCodeState] = useState("");
  const [validated, setValidated] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      setTokenState(sessionStorage.getItem(TOKEN_KEY) ?? "");
      setDeviceCodeState(sessionStorage.getItem(DEVICE_KEY) ?? "");
    } catch {
      // sessionStorage unavailable
    }
    setHydrated(true);
  }, []);

  const setToken = useCallback((value: string) => {
    setTokenState(value);
    setValidated(false);
    try {
      if (value) sessionStorage.setItem(TOKEN_KEY, value);
      else sessionStorage.removeItem(TOKEN_KEY);
    } catch {
      // ignore
    }
  }, []);

  const setDeviceCode = useCallback((value: string) => {
    setDeviceCodeState(value);
    try {
      if (value) sessionStorage.setItem(DEVICE_KEY, value);
      else sessionStorage.removeItem(DEVICE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(
    () => ({
      token: hydrated ? token : "",
      deviceCode: hydrated ? deviceCode : "",
      setToken,
      setDeviceCode,
      validated,
      setValidated,
    }),
    [
      hydrated,
      token,
      deviceCode,
      setToken,
      setDeviceCode,
      validated,
    ],
  );

  return (
    <PartnerCredentialsContext.Provider value={value}>
      {children}
    </PartnerCredentialsContext.Provider>
  );
}

export function usePartnerCredentials() {
  const ctx = useContext(PartnerCredentialsContext);
  if (!ctx) {
    throw new Error(
      "usePartnerCredentials must be used within PartnerCredentialsProvider",
    );
  }
  return ctx;
}
