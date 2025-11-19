import Layout from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { itemService } from '@/services/itemService';
import { orderService } from '@/services/orderService';
import { paymentMethodService } from '@/services/paymentMethodService';
import { userService } from '@/services/userService';
import type { IItem, IOrder, IPaymentMethod, IUser } from '@/types';
import { Pencil, Plus, Settings, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);
  const [products, setProducts] = useState<IItem[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPaymentMethodDialogOpen, setIsPaymentMethodDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<IOrder | null>(null);
  const [editingPaymentMethod, setEditingPaymentMethod] = useState<IPaymentMethod | null>(null);
  const [formData, setFormData] = useState<Omit<IOrder, 'id'>>({
    user_id: 0,
    payment_method_id: 1,
  });
  const [paymentMethodFormData, setPaymentMethodFormData] = useState<Omit<IPaymentMethod, 'id'>>({
    name: '',
  });
  const [orderItems, setOrderItems] = useState<Array<{ item_id: number; quantity: number }>>([]);

  useEffect(() => {
    loadOrders();
    loadUsers();
    loadProducts();
    loadPaymentMethods();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await itemService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const loadPaymentMethods = async () => {
    try {
      const data = await paymentMethodService.getAll();
      setPaymentMethods(data);
    } catch (error) {
      console.error('Failed to load payment methods:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const data = await orderService.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Failed to load orders:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar se há pelo menos um produto
    if (orderItems.length === 0) {
      alert('Adicione pelo menos um produto ao pedido!');
      return;
    }

    // Validar se todos os produtos foram selecionados
    const hasInvalidItems = orderItems.some(item => item.item_id === 0);
    if (hasInvalidItems) {
      alert('Selecione um produto para todos os itens!');
      return;
    }

    try {
      // Criar objeto no formato esperado pelo backend
      const orderData = {
        user_id: formData.user_id,
        payment_method_id: formData.payment_method_id,
        items: orderItems.map(item => ({
          item_id: item.item_id,
          quantity: item.quantity
        }))
      };
      
      if (editingOrder) {
        await orderService.update(editingOrder.id!, orderData);
      } else {
        await orderService.create(orderData);
      }
      await loadOrders();
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to save order:', error);
      alert('Erro ao salvar pedido. Verifique os dados e tente novamente.');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este pedido?')) {
      try {
        await orderService.delete(id);
        await loadOrders();
      } catch (error) {
        console.error('Failed to delete order:', error);
      }
    }
  };

  const handleEdit = (order: IOrder) => {
    setEditingOrder(order);
    setFormData({
      user_id: order.user_id,
      payment_method_id: order.payment_method_id,
    });
    
    // Carregar os itens do pedido para edição
    if (order.items && order.items.length > 0) {
      setOrderItems(order.items.map(item => ({
        item_id: item.item_id,
        quantity: item.quantity || 1
      })));
    } else {
      setOrderItems([]);
    }
    
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingOrder(null);
    setFormData({
      user_id: 0,
      payment_method_id: 1,
    });
    setOrderItems([]);
  };

  const addOrderItem = () => {
    setOrderItems([...orderItems, { item_id: 0, quantity: 1 }]);
  };

  const removeOrderItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };

  const updateOrderItem = (index: number, field: 'item_id' | 'quantity', value: number) => {
    const updated = [...orderItems];
    updated[index][field] = value;
    setOrderItems(updated);
  };

  const calculateTotal = () => {
    return orderItems.reduce((total, item) => {
      const product = products.find(p => p.id === item.item_id);
      if (product) {
        return total + (product.price_in_cents * item.quantity);
      }
      return total;
    }, 0);
  };

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(priceInCents / 100);
  };

  const getUserName = (userId: number) => {
    const user = users.find(u => u.id === userId);
    return user?.name || 'Desconhecido';
  };

  const getPaymentMethodName = (methodId: number) => {
    const method = paymentMethods.find(m => m.id === methodId);
    return method?.name || 'Desconhecido';
  };

  const getOrderTotalItems = (order: IOrder) => {
    if (!order.items || order.items.length === 0) return 0;
    return order.items.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const getOrderTotalAmount = (order: IOrder) => {
    if (!order.items || order.items.length === 0) return 0;
    
    return order.items.reduce((total, orderItem) => {
      const product = products.find(p => p.id === orderItem.item_id);
      if (product && orderItem.quantity) {
        return total + (product.price_in_cents * orderItem.quantity);
      }
      return total;
    }, 0);
  };

  const handlePaymentMethodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPaymentMethod) {
        await paymentMethodService.update(editingPaymentMethod.id!, paymentMethodFormData);
      } else {
        await paymentMethodService.create(paymentMethodFormData);
      }
      await loadPaymentMethods();
      handleClosePaymentMethodDialog();
    } catch (error) {
      console.error('Failed to save payment method:', error);
    }
  };

  const handleDeletePaymentMethod = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este método de pagamento?')) {
      try {
        await paymentMethodService.delete(id);
        await loadPaymentMethods();
      } catch (error) {
        console.error('Failed to delete payment method:', error);
      }
    }
  };

  const handleEditPaymentMethod = (method: IPaymentMethod) => {
    setEditingPaymentMethod(method);
    setPaymentMethodFormData({
      name: method.name,
    });
    setIsPaymentMethodDialogOpen(true);
  };

  const handleClosePaymentMethodDialog = () => {
    setIsPaymentMethodDialogOpen(false);
    setEditingPaymentMethod(null);
    setPaymentMethodFormData({
      name: '',
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Pedidos</h1>
          <div className="flex gap-2">
            <Dialog open={isPaymentMethodDialogOpen} onOpenChange={setIsPaymentMethodDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Gerenciar Métodos de Pagamento</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <form onSubmit={handlePaymentMethodSubmit} className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-semibold">
                      {editingPaymentMethod ? 'Editar Método de Pagamento' : 'Adicionar Novo Método de Pagamento'}
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="payment_method_name">Nome</Label>
                      <Input
                        id="payment_method_name"
                        value={paymentMethodFormData.name}
                        onChange={(e) => setPaymentMethodFormData({ name: e.target.value })}
                        placeholder="Ex: Cartão de Crédito, PIX, Dinheiro"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      {editingPaymentMethod && (
                        <Button type="button" variant="outline" onClick={handleClosePaymentMethodDialog}>
                          Cancelar
                        </Button>
                      )}
                      <Button type="submit">
                        {editingPaymentMethod ? 'Atualizar' : 'Adicionar'}
                      </Button>
                    </div>
                  </form>

                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Nome</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paymentMethods.map((method) => (
                          <TableRow key={method.id}>
                            <TableCell>{method.id}</TableCell>
                            <TableCell className="font-medium">{method.name}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditPaymentMethod(method)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeletePaymentMethod(method.id!)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Pedido
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingOrder ? 'Editar Pedido' : 'Adicionar Novo Pedido'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="user_id">Cliente</Label>
                    <Select
                      value={formData.user_id.toString()}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, user_id: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id!.toString()}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="payment_method_id">Método de Pagamento</Label>
                    <Select
                      value={formData.payment_method_id.toString()}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method_id: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o método de pagamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method.id} value={method.id!.toString()}>
                            {method.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Produtos</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addOrderItem}>
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Produto
                    </Button>
                  </div>
                  
                  {orderItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4 border rounded-lg">
                      Nenhum produto adicionado. Clique em "Adicionar Produto" para começar.
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-2">
                      {orderItems.map((item, index) => (
                        <div key={index} className="flex gap-2 items-end">
                          <div className="flex-1">
                            <Label className="text-xs">Produto</Label>
                            <Select
                              value={item.item_id.toString()}
                              onValueChange={(value) => updateOrderItem(index, 'item_id', parseInt(value))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione o produto" />
                              </SelectTrigger>
                              <SelectContent>
                                {products.map((product) => (
                                  <SelectItem key={product.id} value={product.id!.toString()}>
                                    {product.name} - {formatPrice(product.price_in_cents)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="w-24">
                            <Label className="text-xs">Qtd.</Label>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 1)}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeOrderItem(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {orderItems.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-semibold">
                      <span>Total do Pedido:</span>
                      <span className="text-2xl">{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingOrder ? 'Atualizar' : 'Criar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID do Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Método de Pagamento</TableHead>
                <TableHead className="text-center">Total de Itens</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{getUserName(order.user_id)}</TableCell>
                  <TableCell>{getPaymentMethodName(order.payment_method_id)}</TableCell>
                  <TableCell className="text-center">{getOrderTotalItems(order)}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatPrice(getOrderTotalAmount(order))}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(order)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(order.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
}
