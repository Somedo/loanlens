// app/(dashboard)/dashboard/page.tsx
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Users, Building2, DollarSign } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const stats = [
    {
      name: 'Active Loans',
      value: '0',
      icon: FileText,
      description: 'Currently active',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Borrowers',
      value: '0',
      icon: Users,
      description: 'Total borrowers',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Properties',
      value: '0',
      icon: Building2,
      description: 'Properties financed',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Total Value',
      value: '£0',
      icon: DollarSign,
      description: 'Active loan value',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back! Here's an overview of your lending portfolio.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
                  <p className="mt-1 text-xs text-gray-500">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Follow these steps to set up your lending portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-medium">
                  1
                </div>
                <div>
                  <p className="font-medium text-gray-900">Import existing loans</p>
                  <p className="text-sm text-gray-600">
                    Add your current loan portfolio to the system
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-300 text-white text-xs font-medium">
                  2
                </div>
                <div>
                  <p className="font-medium text-gray-500">Set up cashflow tracking</p>
                  <p className="text-sm text-gray-600">
                    Configure your fund and track deployments
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-300 text-white text-xs font-medium">
                  3
                </div>
                <div>
                  <p className="font-medium text-gray-500">Enable interest tracking</p>
                  <p className="text-sm text-gray-600">
                    Automatically calculate daily interest accrual
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates across your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">No recent activity yet</p>
              <p className="mt-1 text-xs text-gray-500">
                Activity will appear here once you add loans
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}