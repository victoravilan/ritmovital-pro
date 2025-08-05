import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto p-4 space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <Skeleton className="h-8 w-32" />
        </div>
        {/* ... el resto del código del esqueleto que ya tenías ... */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-800/50 border-slate-700/50"><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent className="space-y-2"><Skeleton className="h-8 w-20" /><Skeleton className="h-2 w-full" /><Skeleton className="h-4 w-full" /></CardContent></Card>
              <Card className="bg-slate-800/50 border-slate-700/50"><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent className="space-y-2"><Skeleton className="h-8 w-20" /><Skeleton className="h-2 w-full" /><Skeleton className="h-4 w-full" /></CardContent></Card>
              <Card className="bg-slate-800/50 border-slate-700/50"><CardHeader><Skeleton className="h-5 w-24" /></CardHeader><CardContent className="space-y-2"><Skeleton className="h-8 w-20" /><Skeleton className="h-2 w-full" /><Skeleton className="h-4 w-full" /></CardContent></Card>
            </div>
            <Card className="bg-slate-800/50 border-slate-700/50"><CardHeader><Skeleton className="h-6 w-48" /><Skeleton className="h-4 w-full mt-2" /></CardHeader><CardContent><Skeleton className="h-80 w-full" /></CardContent></Card>
          </div>
          <div className="space-y-4"><Card className="bg-slate-800/50 border-slate-700/50"><CardHeader><Skeleton className="h-6 w-40" /><Skeleton className="h-4 w-full mt-2" /></CardHeader><CardContent className="space-y-3"><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /><Skeleton className="h-16 w-full" /></CardContent></Card></div>
        </div>
      </div>
    </div>
  )
}