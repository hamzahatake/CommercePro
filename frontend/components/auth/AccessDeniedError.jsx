"use client";

export default function AccessDeniedError({ role, loginPath, backgroundColor = '#EDEAE4' }) {
    const roleColors = {
        customer: 'bg-blue-600 hover:bg-blue-700',
        vendor: 'bg-green-600 hover:bg-green-700', 
        manager: 'bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700',
        admin: 'bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700'
    };

    const roleDisplayName = role.charAt(0).toUpperCase() + role.slice(1);
    
    // Use unified login for all roles
    const getLoginPath = () => {
        return '/login';
    };

    const getButtonText = () => {
        return 'Go to Login';
    };

    return (
        <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor }}>
            <div className="text-center">
                <p className="text-lg font-medium text-gray-600 mb-4">
                    Access denied. {roleDisplayName} privileges required.
                </p>
                <a 
                    href={getLoginPath()} 
                    className={`px-6 py-2 text-white rounded-full transition-colors ${roleColors[role]}`}>
                    {getButtonText()}
                </a>
            </div>
        </div>
    );
}
