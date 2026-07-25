import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'main' | 'admin' | null;

export interface RoleUser {
  role: 'main' | 'admin';
  name: string;
  title: string;
  label: string;
  colorScheme: 'cyan' | 'copper';
  canApprove: boolean;
}

export const ROLE_DEFINITIONS: Record<'main' | 'admin', RoleUser> = {
  main: {
    role: 'main',
    name: 'Dr. med. A. Voss',
    title: 'Facharzt für Orthopädie & Forensik',
    label: 'Hauptaccount — Dr. med. A. Voss',
    colorScheme: 'cyan',
    canApprove: false,
  },
  admin: {
    role: 'admin',
    name: 'Prof. Dr. med. E. Bongartz',
    title: 'Chefärztin & Forensische Hauptgutachterin',
    label: 'Admin — Prof. Dr. med. E. Bongartz',
    colorScheme: 'copper',
    canApprove: true,
  },
};

interface RoleContextType {
  role: UserRole;
  user: RoleUser | null;
  selectRole: (role: 'main' | 'admin') => void;
  clearRole: () => void;
  isMain: boolean;
  isAdmin: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const STORAGE_KEY = 'udo_s2k_user_role';

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'main' || saved === 'admin') return saved;
    } catch (e) {
      // fallback
    }
    return null;
  });

  const selectRole = (newRole: 'main' | 'admin') => {
    setRoleState(newRole);
    try {
      localStorage.setItem(STORAGE_KEY, newRole);
    } catch (e) {
      // ignore
    }
  };

  const clearRole = () => {
    setRoleState(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
  };

  const user = role ? ROLE_DEFINITIONS[role] : null;

  return (
    <RoleContext.Provider
      value={{
        role,
        user,
        selectRole,
        clearRole,
        isMain: role === 'main',
        isAdmin: role === 'admin',
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRoleContext = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRoleContext must be used within a RoleProvider');
  }
  return context;
};
