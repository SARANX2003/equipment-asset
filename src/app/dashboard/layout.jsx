export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      
      {/* Sidebar */}
      <aside className="w-64 bg-green-700 text-white flex flex-col">
        <div className="px-6 py-4 text-xl font-bold border-b border-green-600">
          Equipment Asset
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <a
            href="/dashboard"
            className="block px-3 py-2 rounded hover:bg-green-600"
          >
            📋 รายการครุภัณฑ์
          </a>
          <a
            href="/reports"
            className="block px-3 py-2 rounded hover:bg-green-600"
          >
            📊 รายงาน
          </a>
          <a
            href="/scan"
            className="block px-3 py-2 rounded hover:bg-green-600"
          >
            🔍 สแกน
          </a>
        </nav>

        <div className="px-4 py-4 border-t border-green-600">
          <a
            href="/login"
            className="block text-sm hover:underline"
          >
            ออกจากระบบ
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-800">
            ระบบจัดการครุภัณฑ์
          </h1>
          <span className="text-sm text-gray-500">
            คณะวิทยาศาสตร์
          </span>
        </header>

        {/* Content */}
        <section className="flex-1 p-6">
          {children}
        </section>
      </main>
    </div>
  );
}
