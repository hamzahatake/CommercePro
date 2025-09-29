export default function AdminLoadingState() {
    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#EDEAE4' }}>
            <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-lg font-medium text-gray-600">Loading...</p>
            </div>
        </div>
    );
}
