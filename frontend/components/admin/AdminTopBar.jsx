export default function AdminTopBar({ onToggleSidebar }) {
    return (
        <div className="bg-white shadow-sm p-4">
            <div className="flex items-center justify-between">
                <button
                    onClick={onToggleSidebar}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
