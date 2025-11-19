import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { itemService } from '@/services/itemService';
import { orderService } from '@/services/orderService';
import { paymentMethodService } from '@/services/paymentMethodService';
import { userService } from '@/services/userService';
import type { IItem, IPaymentMethod, IUser } from '@/types';
import { Minus, Plus, ShoppingCart, User, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CustomerOrderPage() {
  const [products, setProducts] = useState<IItem[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [cart, setCart] = useState<Array<{ item_id: number; quantity: number }>>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<number>(0);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);

  // User form data
  const [userFormData, setUserFormData] = useState<Omit<IUser, 'id'>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    street: '',
    neighborhood: '',
    number: 0,
  });

  useEffect(() => {
    loadProducts();
    loadPaymentMethods();
    loadCurrentUser();
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
      if (data.length > 0 && data[0].id) {
        setSelectedPaymentMethod(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load payment methods:', error);
    }
  };

  const loadCurrentUser = async () => {
    try {
      // Por enquanto, pegar o primeiro usuário ou criar um novo
      const users = await userService.getAll();
      if (users.length > 0) {
        setCurrentUser(users[0]);
        setUserFormData({
          name: users[0].name,
          email: users[0].email,
          phone: users[0].phone,
          address: users[0].address,
          city: users[0].city,
          state: users[0].state,
          zip_code: users[0].zip_code,
          street: users[0].street,
          neighborhood: users[0].neighborhood,
          number: users[0].number,
        });
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    }
  };

  const addToCart = (productId: number) => {
    const existingItem = cart.find(item => item.item_id === productId);
    if (existingItem) {
      setCart(cart.map(item => 
        item.item_id === productId 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { item_id: productId, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: number) => {
    const existingItem = cart.find(item => item.item_id === productId);
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(item => 
        item.item_id === productId 
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    } else {
      setCart(cart.filter(item => item.item_id !== productId));
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const product = products.find(p => p.id === item.item_id);
      if (product) {
        return total + (product.price_in_cents * item.quantity);
      }
      return total;
    }, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(priceInCents / 100);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentUser?.id) {
        await userService.update(currentUser.id, userFormData);
        setCurrentUser({ ...userFormData, id: currentUser.id });
        alert('Perfil atualizado com sucesso!');
        setIsProfileOpen(false);
      } else {
        const newUser = await userService.create(userFormData);
        setCurrentUser(newUser);
        alert('Perfil criado com sucesso!');
        setIsProfileOpen(false);
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Erro ao salvar perfil. Tente novamente.');
    }
  };

  const handlePlaceOrder = async () => {
    if (!currentUser?.id) {
      alert('Por favor, complete seu perfil antes de fazer um pedido.');
      setIsProfileOpen(true);
      return;
    }

    if (cart.length === 0) {
      alert('Adicione itens ao carrinho antes de finalizar o pedido.');
      return;
    }

    if (!selectedPaymentMethod) {
      alert('Selecione um método de pagamento.');
      return;
    }

    try {
      const orderData = {
        user_id: currentUser.id,
        payment_method_id: selectedPaymentMethod,
        items: cart.map(item => ({
          item_id: item.item_id,
          quantity: item.quantity
        }))
      };

      await orderService.create(orderData);
      setIsOrderSuccess(true);
      setCart([]);
      
      setTimeout(() => {
        setIsOrderSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Erro ao finalizar pedido. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 to-white flex flex-col">
      {/* Header */}
      <header className="bg-orange-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-4xl">🍕</div>
              <h1 className="text-2xl font-bold">Pizzaria Delícia</h1>
            </div>
            <div className="flex items-center gap-4">
              {/* Profile Button */}
              <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="text-white hover:bg-orange-700">
                    <User className="h-5 w-5 mr-2" />
                    {currentUser?.name || 'Meu Perfil'}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Meu Perfil</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome *</Label>
                        <Input
                          id="name"
                          value={userFormData.name}
                          onChange={(e) => setUserFormData(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={userFormData.email}
                          onChange={(e) => setUserFormData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone *</Label>
                        <Input
                          id="phone"
                          value={userFormData.phone}
                          onChange={(e) => setUserFormData(prev => ({ ...prev, phone: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zip_code">CEP *</Label>
                        <Input
                          id="zip_code"
                          value={userFormData.zip_code}
                          onChange={(e) => setUserFormData(prev => ({ ...prev, zip_code: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="street">Rua *</Label>
                        <Input
                          id="street"
                          value={userFormData.street}
                          onChange={(e) => setUserFormData(prev => ({ ...prev, street: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="number">Número *</Label>
                        <Input
                          id="number"
                          type="number"
                          value={userFormData.number}
                          onChange={(e) => setUserFormData(prev => ({ ...prev, number: parseInt(e.target.value) }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="neighborhood">Bairro *</Label>
                        <Input
                          id="neighborhood"
                          value={userFormData.neighborhood}
                          onChange={(e) => setUserFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade *</Label>
                        <Input
                          id="city"
                          value={userFormData.city}
                          onChange={(e) => setUserFormData(prev => ({ ...prev, city: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">Estado *</Label>
                        <Input
                          id="state"
                          value={userFormData.state}
                          onChange={(e) => setUserFormData(prev => ({ ...prev, state: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="address">Complemento</Label>
                        <Input
                          id="address"
                          value={userFormData.address}
                          onChange={(e) => setUserFormData(prev => ({ ...prev, address: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsProfileOpen(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                        Salvar
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Success Message */}
      {isOrderSuccess && (
        <div className="bg-green-500 text-white text-center py-3">
          ✓ Pedido realizado com sucesso! Obrigado pela preferência!
        </div>
      )}

      {/* Main Layout with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Products Grid */}
        <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Nosso Cardápio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange-600">
                    {formatPrice(product.price_in_cents)}
                  </span>
                  <Button
                    className="bg-orange-600 hover:bg-orange-700"
                    onClick={() => addToCart(product.id!)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        </div>
      </main>

      {/* Cart Sidebar - Always Visible */}
      <aside className="w-96 bg-white border-l shadow-lg flex flex-col p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-orange-600" />
            Meu Carrinho
          </h2>
          {getCartItemCount() > 0 && (
            <span className="bg-orange-600 text-white text-sm rounded-full h-6 w-6 flex items-center justify-center">
              {getCartItemCount()}
            </span>
          )}
        </div>
        
        {cart.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-center text-muted-foreground">
              Seu carrinho está vazio
            </p>
          </div>
        ) : (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {cart.map((item) => {
                const product = products.find(p => p.id === item.item_id);
                if (!product) return null;
                return (
                  <div key={item.item_id} className="flex items-center justify-between border-b pb-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(product.price_in_cents)} cada
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => removeFromCart(item.item_id)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => addToCart(item.item_id)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setCart(cart.filter(i => i.item_id !== item.item_id))}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-4 border-t pt-4 mt-4">
              <div className="space-y-2">
                <Label>Forma de Pagamento</Label>
                <Select
                  value={selectedPaymentMethod.toString()}
                  onValueChange={(value) => setSelectedPaymentMethod(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
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

              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span className="text-2xl text-orange-600">
                  {formatPrice(getCartTotal())}
                </span>
              </div>

              <Button
                className="w-full bg-orange-600 hover:bg-orange-700"
                onClick={handlePlaceOrder}
              >
                Finalizar Pedido
              </Button>
            </div>
          </div>
        )}
      </aside>
      </div>
    </div>
  );
}
