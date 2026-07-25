import React from 'react';
import { useRoleContext } from '../context/RoleContext';
import { WelcomePage } from './welcome/page';
import MainAppContent from '../App';

export default function Page() {
  const { role } = useRoleContext();

  if (!role) {
    return <WelcomePage />;
  }

  return <MainAppContent />;
}
