import React, { useState } from 'react';
import { Modal, Button, Input } from '@/components/ui';
import { Loader } from 'lucide-react';
import { useCreateFiscalEntityMutation, FiscalEntityType } from '@/lib/graphql/generated';
import { entityTypes } from './constants';

interface NewEntityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function NewEntityModal({ isOpen, onClose, onSuccess }: NewEntityModalProps) {
  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState<FiscalEntityType | null>(null);
  const [error, setError] = useState('');

  const [createEntity, { loading }] = useCreateFiscalEntityMutation({
    onCompleted: () => {
      setName('');
      setSelectedType(null);
      setError('');
      onSuccess?.();
      onClose();
    },
    onError: err => {
      setError(err.message || 'Failed to create entity. Please try again.');
    },
    refetchQueries: ['GetFiscalEntities'],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter an entity name');
      return;
    }

    if (!selectedType) {
      setError('Please select an entity type');
      return;
    }

    try {
      await createEntity({
        variables: {
          input: {
            name: name.trim(),
            type: selectedType,
          },
        },
      });
    } catch {
      // Error handled by onError callback
    }
  };

  const handleClose = () => {
    if (!loading) {
      setName('');
      setSelectedType(null);
      setError('');
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Entity"
      description="Add a new tax entity to manage your finances"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Entity Name */}
        <div>
          <label htmlFor="entity-name" className="block text-sm font-medium text-neutral-700 mb-2">
            Entity Name
          </label>
          <Input
            id="entity-name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g., John Doe, Acme Corp"
            required
            disabled={loading}
            className="w-full"
          />
        </div>

        {/* Entity Type Selection */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-3">Entity Type</label>
          <div className="grid gap-3">
            {entityTypes.map(({ type, label, description, icon: Icon, color, activeColor }) => (
              <Button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                disabled={loading}
                className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all text-left ${
                  selectedType === type
                    ? activeColor
                    : `${color} border-transparent hover:border-current`
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold mb-1">{label}</div>
                  <div
                    className={`text-sm ${selectedType === type ? 'text-white/90' : 'opacity-75'}`}
                  >
                    {description}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-error-light border border-error text-error-dark px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={loading} className="flex-1">
            {loading ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Entity'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
