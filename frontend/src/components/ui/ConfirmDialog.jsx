import React from 'react';
import { AlertTriangle, HelpCircle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed with this irreversible banking action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" showClose={false}>
      <div className="text-center">
        <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${variant === 'danger' ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400' : 'bg-brand-100 dark:bg-brand-950/60 text-brand-600 dark:text-cyan-400'} mb-4`}>
          {variant === 'danger' ? (
            <AlertTriangle className="h-7 w-7" />
          ) : (
            <HelpCircle className="h-7 w-7" />
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h3>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {message}
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full"
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
            className="w-full"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
