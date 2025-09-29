import DashboardNavItem from "./DashboardNavItem";
import UsersNavSection from "./UsersNavSection";
import SystemNavSection from "./SystemNavSection";
import SettingsNavItem from "./SettingsNavItem";

export default function AdminSidebar({ 
    sidebarOpen, 
    expandedMenus, 
    pathname, 
    isActive, 
    onToggleMenu 
}) {
    return (
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-white shadow-lg`}>
            <div className="p-6 mt-14">
                {/* Navigation */}
                <nav className="space-y-2">
                    {/* Dashboard */}
                    <DashboardNavItem 
                        isActive={isActive('/admin/dashboard')} 
                        sidebarOpen={sidebarOpen} 
                    />

                    {/* Users Management Dropdown */}
                    <UsersNavSection 
                        expandedMenus={expandedMenus}
                        sidebarOpen={sidebarOpen}
                        pathname={pathname}
                        isActive={isActive}
                        onToggleMenu={onToggleMenu}
                    />

                    {/* System Management Dropdown */}
                    <SystemNavSection 
                        expandedMenus={expandedMenus}
                        sidebarOpen={sidebarOpen}
                        pathname={pathname}
                        isActive={isActive}
                        onToggleMenu={onToggleMenu}
                    />

                    {/* Settings */}
                    <SettingsNavItem 
                        isActive={isActive('/admin/settings')} 
                        sidebarOpen={sidebarOpen} 
                    />
                </nav>
            </div>
        </div>
    );
}
