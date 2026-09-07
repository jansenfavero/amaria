"use client";

import { createContext, useContext } from "react";
import type { AccountRole } from "@/lib/auth/policy";

export type PublicAccount = {
  email: string;
  displayName: string;
  role: AccountRole | null;
  active: boolean;
};

const AccountContext = createContext<PublicAccount | null>(null);

export function AccountProvider({ account, children }: {
  account: PublicAccount | null;
  children: React.ReactNode;
}) {
  return <AccountContext.Provider value={account}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  return useContext(AccountContext);
}
