"use client";

import { useState, type RefObject } from "react";
import { Button } from "@mongkolka/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@mongkolka/ui/dialog";
import { AssetLibrary, ARIA_DISABLED } from "./asset-library";
import { togglePhoto } from "./asset-library-logic";

interface AssetPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  /** Multi-select keeps click order; single closes on the first pick. */
  multiple?: boolean;
  /** Called with the chosen URLs, exactly as the API returned them. */
  onConfirm: (urls: string[]) => void;
  /** Element to focus when the picker closes (Dialog has no trigger here to return to). */
  returnFocusRef?: RefObject<HTMLElement | null>;
}

/** Modal picker over the image library. Body remounts per open so selection starts empty. */
export function AssetPicker({ open, onOpenChange, title = "Choose images", multiple = true, onConfirm, returnFocusRef }: AssetPickerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"
        onCloseAutoFocus={(e) => {
          if (!returnFocusRef?.current) return;
          e.preventDefault();
          returnFocusRef.current.focus();
        }}
      >
        {open && <PickerBody title={title} multiple={multiple} onConfirm={onConfirm} onClose={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

function PickerBody({
  title,
  multiple,
  onConfirm,
  onClose,
}: {
  title: string;
  multiple: boolean;
  onConfirm: (urls: string[]) => void;
  onClose: () => void;
}) {
  const [chosen, setChosen] = useState<string[]>([]);
  return (
    <>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          {multiple ? "Select one or more images. Numbers show the order they will be added." : "Select an image."}
        </DialogDescription>
      </DialogHeader>
      <AssetLibrary
        selected={chosen}
        numbered={multiple}
        pickLabel={multiple ? "Toggle" : "Choose"}
        allowDelete={false}
        onPick={(asset) => {
          if (multiple) setChosen((prev) => togglePhoto(prev, asset.url));
          else {
            onConfirm([asset.url]);
            onClose();
          }
        }}
      />
      {multiple && (
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            aria-disabled={chosen.length === 0}
            className={ARIA_DISABLED}
            onClick={() => {
              if (chosen.length === 0) return;
              onConfirm(chosen);
              onClose();
            }}
          >
            {chosen.length === 0 ? "Add images" : `Add ${chosen.length} image${chosen.length === 1 ? "" : "s"}`}
          </Button>
        </DialogFooter>
      )}
    </>
  );
}
