import React from 'react';
import WorkspaceShell from '../../components/workspace/WorkspaceShell';

export default function WorkspacePage({ onNavigateToPortal }: { onNavigateToPortal?: () => void }) {
  return <WorkspaceShell onNavigateToPortal={onNavigateToPortal} />;
}
