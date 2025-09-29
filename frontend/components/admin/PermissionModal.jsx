import { X, Save, AlertCircle } from "lucide-react";

export default function PermissionModal({ 
    showModal, 
    editingPermission, 
    formData, 
    isLoading,
    onClose, 
    onSubmit, 
    onInputChange 
}) {
    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {editingPermission ? 'Edit Permission' : 'Create Permission'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Permission Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={onInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="e.g., View Products"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Codename
                        </label>
                        <input
                            type="text"
                            name="codename"
                            value={formData.codename}
                            onChange={onInputChange}
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="e.g., view_products"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Used internally by the system. Must be lowercase with underscores.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={onInputChange}
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                            placeholder="Describe what this permission allows..."
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Saving...' : (editingPermission ? 'Update Permission' : 'Create Permission')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
