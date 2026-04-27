"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ContactFormContextType {
  isOpen: boolean;
  openForm: () => void;
  closeForm: () => void;
}

const ContactFormContext = createContext<ContactFormContextType | undefined>(undefined);

export function ContactFormProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openForm = () => setIsOpen(true);
  const closeForm = () => setIsOpen(false);

  return (
    <ContactFormContext.Provider value={{ isOpen, openForm, closeForm }}>
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
