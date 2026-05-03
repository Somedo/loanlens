export default function DashboardHeader({ user }: { user: any }) {
  return (
    <div className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold">LoanLens Dashboard</h2>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">{user?.email || 'User'}</span>
      </div>
    </div>
  )
}