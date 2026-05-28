import { useState } from 'react';
import { X, AlertCircle, Loader } from 'lucide-react';
import { createBooking } from '../../services/bookingService';
import { filterPacksByTrainingType, validatePackForSlot } from '../../services/userPackService';
import Button from '../ui/Button';

export default function BookSlotModal({ slot, userPacks, trainingTypes, onClose, onSuccess }) {
  const [selectedPackId, setSelectedPackId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Filter compatible packs for this slot
  const compatiblePacks = filterPacksByTrainingType(userPacks, slot?.trainingTypeId, trainingTypes);
  const selectedPack = userPacks.find((p) => String(p.id) === selectedPackId);

  const formatDateTime = (isoString) => {
    if (!isoString) return 'TBD';
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const handleBook = async () => {
    setError('');

    if (!selectedPackId) {
      setError('Please select a pack');
      return;
    }

    if (!selectedPack) {
      setError('Selected pack not found');
      return;
    }

    // Validate pack (defensive, backend will also validate)
    const validation = validatePackForSlot(selectedPack, slot?.trainingTypeId, trainingTypes);
    if (!validation.valid) {
      setError(validation.reason || 'Pack is not eligible for this slot');
      return;
    }

    setLoading(true);
    try {
      await createBooking(slot.id, selectedPack.id);
      onSuccess?.();
      onClose?.();
    } catch (err) {
      setError(err.message || 'Failed to book slot. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!slot) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-serif text-2xl text-charcoal">{slot.name}</h2>
            <p className="text-sm text-text-muted mt-1">{formatDateTime(slot.startTime)}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Slot Details */}
        <div className="bg-alabaster rounded-lg p-4 mb-6 border border-border-light">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-text-muted font-medium">Training Type</p>
              <p className="text-charcoal">{slot.trainingTypeName}</p>
            </div>
            <div>
              <p className="text-text-muted font-medium">Capacity</p>
              <p className="text-charcoal">
                {slot.capacity - slot.bookedCount}/{slot.capacity} spots
              </p>
            </div>
          </div>
          {slot.slotType !== 'mixte' && (
            <p className="text-xs font-medium text-oak mt-3">
              {slot.slotType === 'women_only' ? '👩 Women Only' : '👨 Men Only'}
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800 flex gap-2">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Pack Selection */}
        <div className="mb-6">
          <h3 className="font-sans text-sm font-semibold uppercase tracking-[0.12em] text-charcoal mb-3">
            Select Your Pack
          </h3>

          {compatiblePacks.length === 0 ? (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
              <p className="font-medium mb-1">No compatible packs available</p>
              <p className="text-xs">
                You don't have an active pack that includes this training type.{' '}
                <a href="/classes" className="underline font-medium">
                  Browse packages
                </a>
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {userPacks.map((pack) => {
                const isCompatible = compatiblePacks.some((p) => p.id === pack.id);
                const isSelected = String(pack.id) === selectedPackId;

                return (
                  <label
                    key={pack.id}
                    className={`relative flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-oak bg-oak bg-opacity-5'
                        : isCompatible
                          ? 'border-border-light hover:border-oak'
                          : 'border-gray-200 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <input
                      type="radio"
                      name="pack"
                      value={String(pack.id)}
                      checked={isSelected}
                      onChange={(e) => setSelectedPackId(e.target.value)}
                      disabled={!isCompatible}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-charcoal text-sm">{pack.templateName}</div>
                      <p className="text-xs text-text-muted mt-0.5">
                        {pack.remainingSessions} remaining session{pack.remainingSessions !== 1 ? 's' : ''}
                      </p>
                      {!isCompatible && (
                        <p className="text-xs text-red-600 mt-1">
                          {pack.remainingSessions <= 0 ? 'No sessions left' : 'Not available for this class'}
                        </p>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded border border-border-light text-charcoal hover:bg-alabaster transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <Button
            onClick={handleBook}
            disabled={loading || !selectedPackId || compatiblePacks.length === 0}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader size={16} className="animate-spin" />
                Booking...
              </>
            ) : (
              'Book Slot'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
