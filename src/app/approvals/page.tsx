import React from 'react';
import { ApprovalsPage } from '../../pages/ApprovalsPage';

export default function ApprovalsRoute({ onRedirectHome }: { onRedirectHome?: (tab: any) => void }) {
  return <ApprovalsPage onRedirectHome={onRedirectHome || (() => {})} />;
}
