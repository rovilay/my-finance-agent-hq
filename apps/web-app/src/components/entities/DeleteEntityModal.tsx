import React, { useState } from 'react';
import { Modal, Button, Input } from '@/components/ui';
import { AlertTriangle, Loader } from 'lucide-react';
import { useDeleteFiscalEntityMutation } from '@/lib/graphql/generated';
import { useRouter } from 'next/navigation';
import { ENTITIES_ROUTE } from '@/lib/constants';

interface DeleteEntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  entity: {
    id: string;
    name: string;
  };
  redirectAfterDelete?: boolean;
}

export function DeleteEntityModal({
  isOpen,
  onClose,
  onSuccess,
  entity,
  redirectAfterDelete = false,
}: DeleteEntityModalProps) {
  const [entityNameConfirmation, setEntityNameConfirmation] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const [deleteEntity, { loading }] = useDeleteFiscalEntityMutation({
    onCompleted: () => {
      setError('');
      onSuccess?.();
      onClose();

      if (redirectAfterDelete) {
        router.push(ENTITIES_ROUTE);
      }
    },
    onError: err => {
      setError(err.message || 'Failed to delete entity. Please try again.');
    },
    refetchQueries: ['GetFiscalEntities'],
  });

  const handleDelete = async () => {
    setError('');

    try {
      await deleteEntity({
        variables: {
          id: entity.id,
        },
      });
    } catch {
      // Error handled by onError callback
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError('');
      onClose();
    }
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (entityNameConfirmation.trim() !== entity.name) {
      setError('Entity name does not match. Please type the exact name to confirm.');
      return;
    }

    await handleDelete();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Delete Entity"
      description="This action cannot be undone"
      size="sm"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Warning */}
        <div className="flex gap-3 p-4 bg-warning-light border border-warning rounded-lg">
          <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-warning-dark font-medium mb-1">
              You are about to delete "{entity.name}"
            </p>
            <p className="text-sm text-warning-dark/80">
              All associated financial entries, documents, and tax data will be permanently removed.
              This action cannot be undone.
            </p>
          </div>
        </div>

        <Input
          type="text"
          value={entityNameConfirmation}
          onChange={e => setEntityNameConfirmation(e.target.value)}
          className="w-full bg-neutral-100 cursor-not-allowed"
          placeholder={`Type "${entity.name}" to confirm`}
        />

        {/* Error Message */}
        {error && (
          <div className="bg-error-light border border-error text-error-dark px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-error hover:bg-error-dark text-white"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete Entity'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
