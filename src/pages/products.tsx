import Layout from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { itemService } from '@/services/itemService';
import { itemSizeService } from '@/services/itemSizeService';
import type { IItem, IItemSize } from '@/types';
import { Pencil, Plus, Settings, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

const ProductsPage = () => {
  const [products, setProducts] = useState<IItem[]>([]);
  const [sizes, setSizes] = useState<IItemSize[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSizeDialogOpen, setIsSizeDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IItem | null>(null);
  const [editingSize, setEditingSize] = useState<IItemSize | null>(null);
  const [formData, setFormData] = useState<Omit<IItem, 'id'>>({
    name: '',
    description: '',
    size_id: 1,
    price_in_cents: 0,
    item_type: '',
  });
  const [sizeFormData, setSizeFormData] = useState<Omit<IItemSize, 'id'>>({
    name: '',
    description: '',
  });

  useEffect(() => {
    loadProducts();
    loadSizes();
  }, []);

  const loadSizes = async () => {
    try {
      const data = await itemSizeService.getAll();
      setSizes(data);
    } catch (error) {
      console.error('Failed to load sizes:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await itemService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await itemService.update(editingProduct.id!, formData);
      } else {
        await itemService.create(formData);
      }
      await loadProducts();
      handleCloseDialog();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await itemService.delete(id);
        await loadProducts();
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const handleEdit = (product: IItem) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      size_id: product.size_id,
      price_in_cents: product.price_in_cents,
      item_type: product.item_type || '',
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      size_id: 1,
      price_in_cents: 0,
      item_type: '',
    });
  };

  const handleInputChange = (field: keyof Omit<IItem, 'id'>, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSizeInputChange = (field: keyof Omit<IItemSize, 'id'>, value: string) => {
    setSizeFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSizeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSize) {
        await itemSizeService.update(editingSize.id!, sizeFormData);
      } else {
        await itemSizeService.create(sizeFormData);
      }
      await loadSizes();
      handleCloseSizeDialog();
    } catch (error) {
      console.error('Failed to save size:', error);
    }
  };

  const handleDeleteSize = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este tamanho?')) {
      try {
        await itemSizeService.delete(id);
        await loadSizes();
      } catch (error: any) {
        console.error('Failed to delete size:', error);
        alert(
          'Não foi possível excluir este tamanho.\n\n' +
          'Este tamanho está sendo usado em produtos existentes. \n' +
          'Para excluí-lo, primeiro remova ou altere os produtos que o utilizam.'
        );
      }
    }
  };

  const handleEditSize = (size: IItemSize) => {
    setEditingSize(size);
    setSizeFormData({
      name: size.name,
      description: size.description,
    });
    setIsSizeDialogOpen(true);
  };

  const handleCloseSizeDialog = () => {
    setIsSizeDialogOpen(false);
    setEditingSize(null);
    setSizeFormData({
      name: '',
      description: '',
    });
  };

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(priceInCents / 100);
  };

  const getSizeName = (sizeId: number) => {
    const size = sizes.find(s => s.id === sizeId);
    return size ? size.name : `ID: ${sizeId}`;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Produtos</h1>
          <div className="flex gap-2">
            <Dialog open={isSizeDialogOpen} onOpenChange={setIsSizeDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Gerenciar Tamanhos</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <form onSubmit={handleSizeSubmit} className="space-y-4 p-4 border rounded-lg">
                    <h3 className="font-semibold">
                      {editingSize ? 'Editar Tamanho' : 'Adicionar Novo Tamanho'}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="size_name">Nome</Label>
                        <Input
                          id="size_name"
                          value={sizeFormData.name}
                          onChange={(e) => handleSizeInputChange('name', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="size_description">Descrição</Label>
                        <Input
                          id="size_description"
                          value={sizeFormData.description}
                          onChange={(e) => handleSizeInputChange('description', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      {editingSize && (
                        <Button type="button" variant="outline" onClick={handleCloseSizeDialog}>
                          Cancelar
                        </Button>
                      )}
                      <Button type="submit">
                        {editingSize ? 'Atualizar' : 'Adicionar'}
                      </Button>
                    </div>
                  </form>

                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Nome</TableHead>
                          <TableHead>Descrição</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sizes.map((size) => (
                          <TableRow key={size.id}>
                            <TableCell>{size.id}</TableCell>
                            <TableCell className="font-medium">{size.name}</TableCell>
                            <TableCell>{size.description}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditSize(size)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteSize(size.id!)}
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
                  Adicionar Produto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="item_type">Tipo de Item</Label>
                  <Select
                    value={formData.item_type}
                    onValueChange={(value) => handleInputChange('item_type', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pizza">Pizza</SelectItem>
                      <SelectItem value="Bebida">Bebida</SelectItem>
                      <SelectItem value="Sobremesa">Sobremesa</SelectItem>
                      <SelectItem value="Outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="size_id">Tamanho</Label>
                  <Select
                    value={String(formData.size_id)}
                    onValueChange={(value) => handleInputChange('size_id', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um tamanho" />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.id} value={String(size.id)}>
                          {size.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price_in_cents">Preço (em centavos)</Label>
                  <Input
                    id="price_in_cents"
                    type="number"
                    value={formData.price_in_cents}
                    onChange={(e) => handleInputChange('price_in_cents', parseInt(e.target.value))}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Preço atual: {formatPrice(formData.price_in_cents)}
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={handleCloseDialog}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingProduct ? 'Atualizar' : 'Criar'}
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
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Tamanho</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.description}</TableCell>
                  <TableCell className="capitalize">{product.item_type || '-'}</TableCell>
                  <TableCell>{getSizeName(product.size_id)}</TableCell>
                  <TableCell>{formatPrice(product.price_in_cents)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(product.id!)}
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
};

export default ProductsPage;
