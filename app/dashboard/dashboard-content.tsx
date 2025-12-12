"use client"

import { useState, useEffect } from "react"
import { MessageCircle, Users, TrendingUp, DollarSign } from "lucide-react"
import { MetricCard } from "@/components/dashboard/metric-card"
import { ProjectSelector } from "@/components/dashboard/project-selector"
import { useProjects } from "@/lib/hooks/use-projects"
import { useDashboardMetrics } from "@/lib/hooks/use-dashboard-metrics"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function DashboardContent() {
  const { projects, loading: projectsLoading } = useProjects()
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const { metrics, loading: metricsLoading } = useDashboardMetrics(selectedProjectId)

  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id)
    }
  }, [projects, selectedProjectId])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">WhatsApp SaaS</h1>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/instances">Instâncias</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <p className="text-muted-foreground">Métricas e estatísticas do dia</p>
            </div>
            <div className="w-full md:w-64">
              {!projectsLoading && (
                <ProjectSelector
                  projects={projects}
                  selectedProjectId={selectedProjectId}
                  onSelectProject={setSelectedProjectId}
                  onProjectCreated={() => window.location.reload()}
                />
              )}
            </div>
          </div>

          {metricsLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 rounded-lg border bg-card animate-pulse" />
              ))}
            </div>
          ) : metrics ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Taxa de Resposta"
                value={formatPercentage(metrics.response_rate_today)}
                icon={TrendingUp}
                description="Contatos respondidos hoje"
              />
              <MetricCard
                title="Mensagens Recebidas"
                value={metrics.messages_received_today}
                icon={MessageCircle}
                description="Total de mensagens hoje"
              />
              <MetricCard
                title="Contatos Únicos"
                value={metrics.unique_contacts_today}
                icon={Users}
                description="Contatos ativos hoje"
              />
              <MetricCard
                title="Vendas do Dia"
                value={formatCurrency(metrics.sales_amount_today)}
                icon={DollarSign}
                description="Total de vendas hoje"
              />
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">Selecione um projeto para ver as métricas</p>
            </div>
          )}

          {!projectsLoading && projects.length === 0 && (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <h3 className="text-lg font-semibold mb-2">Nenhum projeto encontrado</h3>
              <p className="text-muted-foreground mb-4">Crie seu primeiro projeto para começar</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
