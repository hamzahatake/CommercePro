import { Search, Plus, Minus } from "lucide-react";

export default function RolePermissionManagerControls({ 
    searchTerm, 
    onSearchChange, 
    onSelectAll, 
    onSelectNone 
}) {
    return (
        <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search permissions..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
            <div className="flex gap-2">
                <button
                    onClick={onSelectAll}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Select All
                </button>
                <button
                    onClick={onSelectNone}
                    className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                    <Minus className="w-4 h-4" />
                    Select None
                </button>
            </div>
        </div>
    );
}
