import { useEffect } from 'react';

// Keep keyboard focus within the classic project's detail dialog and restore it on close.
export function useDialogFocus(open) {
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement;
    const dialog = document.querySelector('.project-dialog');
    if (!dialog) return undefined;
    const focusable = () => [...dialog.querySelectorAll('button, a[href], [tabindex="0"]')];
    focusable()[0]?.focus();
    const trap = event => {
      if (event.key !== 'Tab') return;
      const elements = focusable();
      const first = elements[0], last = elements.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', trap);
    return () => { document.removeEventListener('keydown', trap); previous?.focus(); };
  }, [open]);
}
