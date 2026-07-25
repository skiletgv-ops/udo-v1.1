import React, { useEffect } from 'react';
import { useRoleContext } from '../context/RoleContext';
import { usePrescriptionContext } from '../context/PrescriptionContext';
import { ApprovalQueue } from '../components/ApprovalQueue';
import { ActiveTab } from '../types';

interface ApprovalsPageProps {
  onRedirectHome: (tab: ActiveTab) => void;
}

export const ApprovalsPage: React.FC<ApprovalsPageProps> = ({ onRedirectHome }) => {
  const { isAdmin } = useRoleContext();
  const { addToast } = usePrescriptionContext();

  useEffect(() => {
    if (!isAdmin) {
      addToast('Zugriff verweigert — Admin-Bereich', 'rose');
      onRedirectHome('upload');
    }
  }, [isAdmin, addToast, onRedirectHome]);

  if (!isAdmin) {
    return null;
  }

  return <ApprovalQueue />;
};
