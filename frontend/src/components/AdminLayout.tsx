import { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import Footer from "./Footer";

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const AdminLayout = ({ children, title, description }: AdminLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <AdminSidebar />

      {/* Main content with proper mobile spacing */}
      <div className="lg:ml-64">
        <div className="px-4 py-8 lg:px-8 pt-20 lg:pt-8">
          {(title || description) && (
            <div className="mb-8">
              {title && (
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  {title}
                </h1>
              )}
              {description && (
                <p className="mt-2 text-slate-600">{description}</p>
              )}
            </div>
          )}
          {children}
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;