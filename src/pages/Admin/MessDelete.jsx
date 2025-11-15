import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";
import { useState } from "react";

export const DeleteModal = ({ mess, isOpen, onClose, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(mess._id);
      onClose();
    } catch (error) {
      console.error('Error deleting mess:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !mess) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Delete Mess Listing</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Deletion</h3>
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete <strong>"{mess.title}"</strong>? This action cannot be undone and all related data will be permanently removed.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-700">
              <strong>Warning:</strong> This will delete all bookings, images, and other data associated with this mess listing.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 p-6 border-t">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete} 
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete Mess'}
          </Button>
        </div>
      </div>
    </div>
  );
};