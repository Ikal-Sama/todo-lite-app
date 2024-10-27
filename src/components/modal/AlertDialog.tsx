import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface dialogOptions {
  title: React.ReactNode;
  description: string;
  submitButtonText: string;
  alertButton?: React.ReactNode;
  isOpen?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AlertDialogModal: React.FC<dialogOptions> = ({
  title,
  description,
  submitButtonText,
  alertButton,
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <div>
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        {/* <AlertDialogTrigger>
          <span></span>
        </AlertDialogTrigger> */}
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>
              {submitButtonText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AlertDialogModal;
