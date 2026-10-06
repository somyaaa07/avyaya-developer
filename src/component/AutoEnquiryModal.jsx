"use client";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import EnquiryModal from "./EnquiryModal";

export default function AutoEnquiryModal() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  // open 2 seconds after the page loads or reloads (website pages only)
  useEffect(() => {
    console.log("AutoEnquiryModal mounted on:", pathname);
    if (isAdmin) return;
    const t = setTimeout(() => setOpen(true), 2000);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isAdmin) return null;

  return <EnquiryModal open={open} onClose={close} />;
}