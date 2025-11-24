import { CounterCard } from '@/components/counter-card'
import Layout from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { storage } from '@/lib/api-client'
import { dashboardService } from '@/services/dashboardService'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
  const [totalClients, setTotalClients] = useState(0)
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [todayOrders, setTodayOrders] = useState(0)
  const [todayRevenue, setTodayRevenue] = useState('0.00')
  const [todayCustomers, setTodayCustomers] = useState(0)
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [clients, products, orders, dashboardStats] = await Promise.all([
        storage.getClients(),
        storage.getItems(),
        storage.getOrders(),
        dashboardService.getStats(startDate, endDate),
      ])
      
      setTotalClients(clients.length)
      setTotalProducts(products.length)
      setTotalOrders(orders.length)
      setTodayOrders(dashboardStats.total_orders_today)
      setTodayRevenue(dashboardStats.total_revenue)
      setTodayCustomers(dashboardStats.unique_customers_today)
    } catch (error) {
      console.error('Erro ao carregar dados da dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = () => {
    fetchData()
  }

  const handleClearFilter = () => {
    setStartDate('')
    setEndDate('')
    setTimeout(() => fetchData(), 0)
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do sistema</p>
        </div>

        <div className="border rounded-lg p-4 bg-card">
          <h3 className="font-semibold mb-3">Filtrar por Período</h3>
          <div className="flex flex-wrap items-end gap-4">
            <div className="space-y-2 flex-1 min-w-[200px]">
              <Label htmlFor="startDate">Data Início</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2 flex-1 min-w-[200px]">
              <Label htmlFor="endDate">Data Fim</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleFilter}>
                Filtrar
              </Button>
              <Button variant="outline" onClick={handleClearFilter}>
                Limpar
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-3">
              {startDate || endDate ? 'Estatísticas do Período' : 'Estatísticas de Hoje'}
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              <CounterCard
                title={startDate || endDate ? 'Pedidos do Período' : 'Pedidos de Hoje'}
                description={startDate || endDate ? 'Total de pedidos no período' : 'Total de pedidos vendidos hoje'}
                counter={todayOrders}
                link="/orders"
              />
              <CounterCard
                title={startDate || endDate ? 'Receita do Período' : 'Receita de Hoje'}
                description={startDate || endDate ? 'Valor total arrecadado no período' : 'Valor total arrecadado hoje'}
                counter={`R$ ${todayRevenue}`}
                link="/orders"
              />
              <CounterCard
                title={startDate || endDate ? 'Clientes Únicos do Período' : 'Clientes Únicos Hoje'}
                description={startDate || endDate ? 'Clientes diferentes no período' : 'Clientes diferentes que compraram hoje'}
                counter={todayCustomers}
                link="/clients"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Estatísticas Gerais</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <CounterCard
                title="Clientes"
                description="Total de clientes cadastrados"
                counter={totalClients}
                link="/clients"
              />
              <CounterCard
                title="Produtos"
                description="Total de produtos disponíveis"
                counter={totalProducts}
                link="/products"
              />
              <CounterCard
                title="Pedidos"
                description="Total de pedidos realizados"
                counter={totalOrders}
                link="/orders"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
