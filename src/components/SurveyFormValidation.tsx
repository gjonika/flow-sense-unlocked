
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ClientContact } from "@/types/survey";

interface ValidationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  missingContacts: string[];
}

export const ContactValidationModal = ({ isOpen, onConfirm, onCancel, missingContacts }: ValidationModalProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Incomplete Contact Information</AlertDialogTitle>
          <AlertDialogDescription>
            Some contact details are missing:
            <ul className="mt-2 list-disc list-inside">
              {missingContacts.map((missing, index) => (
                <li key={index} className="text-sm text-gray-600">{missing}</li>
              ))}
            </ul>
            Are you sure you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Go Back</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Continue Anyway</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const validateContacts = (contacts: ClientContact[]): string[] => {
  const missing: string[] = [];
  
  if (contacts.length === 0) {
    missing.push("No contacts added");
    return missing;
  }
  
  contacts.forEach((contact, index) => {
    if (!contact.email && !contact.phone) {
      missing.push(`Contact ${index + 1} (${contact.name}) - missing email and phone`);
    } else if (!contact.email) {
      missing.push(`Contact ${index + 1} (${contact.name}) - missing email`);
    } else if (!contact.phone) {
      missing.push(`Contact ${index + 1} (${contact.name}) - missing phone`);
    }
  });
  
  return missing;
};
