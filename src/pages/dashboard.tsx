import { CounterCard } from '@/components/counter-card'
import Layout from '@/components/layout'
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clients, products, orders, dashboardStats] = await Promise.all([
          storage.getClients(),
          storage.getItems(),
          storage.getOrders(),
          dashboardService.getStats(),
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

    fetchData()
  }, [])

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
        
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-3">Estatísticas de Hoje</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <CounterCard
                title="Pedidos de Hoje"
                description="Total de pedidos vendidos hoje"
                counter={todayOrders}
              />
              <CounterCard
                title="Receita de Hoje"
                description="Valor total arrecadado hoje"
                counter={`R$ ${todayRevenue}`}
              />
              <CounterCard
                title="Clientes Únicos Hoje"
                description="Clientes diferentes que compraram hoje"
                counter={todayCustomers}
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
              />
              <CounterCard
                title="Produtos"
                description="Total de produtos disponíveis"
                counter={totalProducts}
              />
              <CounterCard
                title="Pedidos"
                description="Total de pedidos realizados"
                counter={totalOrders}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
