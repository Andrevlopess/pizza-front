export interface IUser {
	id?: number;
	name: string;
	email: string;
	phone: string;
	address: string;
	city: string;
	state: string;
	zip_code: string;
	street: string;
	neighborhood: string;
	number: number;
}

export interface IItemSize {
	id?: number;
	name: string;
	description: string;
}

export interface IPaymentMethod {
	id?: number;
	name: string;
}

export interface IItem {
	id?: number;
	name: string;
	description: string;
	size_id: number;
	price_in_cents: number;
	item_type?: string;
}

export interface IOrder {
	id?: number;
	user_id: number;
	payment_method_id: number;
	items?: Array<{
		id?: number;
		item_id: number;
		quantity: number;
		item?: IItem;
	}>;
	total_amount?: number;
}

export interface IOrderItem {
	id?: number;
	order_id: number;
	item_id: number;
	quantity?: number;
}
