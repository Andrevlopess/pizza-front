import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Combobox, type ComboboxItem } from "../ui/combobox";
import { Input } from "../ui/input";
import { storage } from "@/lib/api-client";
import type { IItem, IUser } from "@/types";

type OrderItemForm = {
	id: string
	itemValue: string
	quantity: number
}

export function OrdersForm() {
	const [items, setItems] = useState<OrderItemForm[]>([
		{ id: String(Date.now()), itemValue: "", quantity: 1 },
	])

	const [clients, setClients] = useState<IUser[]>([])
	const [products, setProducts] = useState<IItem[]>([])

	useEffect(() => {

		const fetchClients = async () => {
			const clients = await storage.getClients()
			setClients(clients)
		}
		const fetchProducts = async () => {
			const products = await storage.getItems()
			setProducts(products)
		}

		fetchClients()
		fetchProducts()
	}, [])



	const paymentMethods: ComboboxItem[] = [
		{ label: "Dinheiro", value: "cash" },
		{ label: "Cartão", value: "card" },
		{ label: "PIX", value: "pix" },
	];

	const addItem = () => {
		setItems((prev) => [
			...prev,
			{ id: String(Date.now() + Math.random()), itemValue: "", quantity: 1 },
		])
	}

	const removeItem = (id: string) => {
		setItems((prev) => prev.filter((i) => i.id !== id))
	}

	const updateItemValue = (id: string, value: string) => {
		setItems((prev) => prev.map((it) => (it.id === id ? { ...it, itemValue: value } : it)))
	}

	const updateQuantity = (id: string, quantity: number) => {
		setItems((prev) => prev.map((it) => (it.id === id ? { ...it, quantity } : it)))
	}

	const [selectedClient, setSelectedClient] = useState<string>("")
	const [selectedPayment, setSelectedPayment] = useState<string>("")

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()

		if (!selectedClient) {
			alert("Selecione um cliente")
			return
		}
		if (!selectedPayment) {
			alert("Selecione um método de pagamento")
			return
		}
		if (items.length === 0) {
			alert("Adicione ao menos um item")
			return
		}
		for (const it of items) {
			if (!it.itemValue) {
				alert("Selecione o produto em todos os itens")
				return
			}
			if (!it.quantity || it.quantity < 1) {
				alert("Informe a quantidade correta para todos os itens")
				return
			}
		}

		// Build payload
		const payload = {
			client: selectedClient,
			payment_method: selectedPayment,
			items: items.map((it) => ({ item_id: it.itemValue, quantity: it.quantity })),
		}

		// TODO: replace with actual API call
		console.log("Submit order", payload)
		alert("Pedido enviado (veja console)")
	}

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Novo pedido</CardTitle>
				<CardDescription>
					Preencha os dados abaixo para criar um novo pedido
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit}>
					<div className="flex flex-col gap-6">
						<div className="grid gap-2">
							<Label htmlFor="client">Cliente</Label>
							<Combobox
								items={clients.map(client => ({ label: client.name, value: String(client.id) }))}
								placeholder="Selecione um cliente"
								label={selectedClient ? undefined : "Cliente"}
								onValueChange={(v) => setSelectedClient(v)}
							/>
						</div>

						<div className="grid gap-2">
							<Label className="">Itens</Label>
							<div className="flex flex-col gap-3">
								{items.map((it) => (
									<div key={it.id} className="grid grid-cols-12 gap-2 items-center">
										<div className="col-span-6 gap-2 flex flex-col">
											<Combobox
												items={products.map(product => ({ label: product.name, value: String(product.id) }))}
												placeholder="Selecione um item"
												label={it.itemValue ? undefined : "Item"}
												onValueChange={(v) => updateItemValue(it.id, v)}
											/>

										</div>
										<div className="col-span-3 gap-2 flex flex-col">
											<Input
												id={`qty-${it.id}`}
												type="number"
												min={1}
												value={it.quantity}
												onChange={(e) => updateQuantity(it.id, Number(e.target.value))}
											/>
										</div>
										<div className="col-span-3 flex items-end">
											<Button variant="destructive" type="button" onClick={() => removeItem(it.id)}>
												Remover
											</Button>
										</div>
									</div>
								))}

								<Button variant="outline" type="button" onClick={addItem}>
									Adicionar item
								</Button>
							</div>
						</div>

						<div className="grid gap-2">
							<Label>Pagamento</Label>
							<Combobox
								items={paymentMethods}
								placeholder="Selecione o método de pagamento"
								label={selectedPayment ? undefined : "Método de pagamento"}
								onValueChange={(v) => setSelectedPayment(v)}
							/>
						</div>
					</div>
				</form>
			</CardContent>
			<CardFooter className="flex-col gap-2">
				<Button type="submit" className="w-full" onClick={handleSubmit}>
					Criar pedido
				</Button>
				<Button variant="outline" className="w-full">
					Cancelar
				</Button>
			</CardFooter>
		</Card>
	)
}
