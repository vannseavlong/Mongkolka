import { useState } from "react";

/**
 * Stateful "which dialog is open" value shared by a feature's provider + table +
 * dialogs components. Clicking the same trigger twice closes it (toggle behavior).
 *
 * @example const [open, setOpen] = useDialogState<'add' | 'edit' | 'delete'>()
 */
export function useDialogState<T extends string | boolean>(initialState: T | null = null) {
  const [open, setOpenState] = useState<T | null>(initialState);

  const setOpen = (value: T | null) => setOpenState((prev) => (prev === value ? null : value));

  return [open, setOpen] as const;
}
