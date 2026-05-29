import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function PageHeader({ children }: { children: React.ReactNode }) {
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.getElementById('header-portal-target'));
  }, []);

  if (!portalTarget) return null;

  return createPortal(children, portalTarget);
}
