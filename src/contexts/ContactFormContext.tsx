"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ContactFormContextType {
  isOpen: boolean;
  isBookingOpen: boolean;
  openForm: () => void;
  closeForm: () => void;
  openBooking: () => void;
  closeBooking: () => void;
}

const ContactFormContext = createContext<ContactFormContextType | undefined>(undefined);

export function ContactFormProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const openForm = () => setIsOpen(true);
  const closeForm = () => setIsOpen(false);
  const openBooking = () => setIsBookingOpen(true);
  const closeBooking = () => setIsBookingOpen(false);

  return (
    <ContactFormContext.Provider
      value={{
        isOpen,
        isBookingOpen,
        openForm,
        closeForm,
        openBooking,
        closeBooking,
      }}
    >
      {children}
    </ContactFormContext.Provider>
  );
}

export function useContactForm() {
  const context = useContext(ContactFormContext);
  if (!context) {
    throw new Error("useContactForm must be used within ContactFormProvider");
  }
  return context;
}
