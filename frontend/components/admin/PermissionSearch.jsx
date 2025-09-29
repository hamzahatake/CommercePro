import { Search, AlertCircle } from "lucide-react";

export default function PermissionSearch({ searchTerm, onSearchChange, hasResults }) {
    return (
        <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
                type="text"
                placeholder="Search permissions..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            
            {!hasResults && searchTerm && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div className="flex-1">
                            <h3 className="font-semibold text-blue-900 mb-1">No Permissions Found</h3>
                            <p className="text-blue-700 text-sm mb-3">
                                No permissions match your search criteria. Try adjusting your search terms.
                            </p>
                            <div className="text-xs text-blue-600">
                                Click "Create Permission" above to get started.
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
