export type FormErrors = Partial<Record<keyof IOrderForm, string>>;

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  selected: boolean;
}

export interface ApiResponse {
  items: IProduct[];
}

export interface IAppState {
  basket: IProduct[];
  catalog: IProduct[];
  order: IOrder;
  formErrors: FormErrors;
  setCatalog(items: IProduct[]): void;
  addToBasket(value: IProduct): void;
  removeFromBasket(id: string): void;
  setOrderField(field: keyof IOrderForm, value: string): void;
  clearBasket(): void;
  getBasketAmount(): number;
  setItems(): void;
  getTotalBasketPrice(): number;
  validateContacts(): boolean;
  validateOrder(): boolean;
  refreshOrder(): boolean;
  resetSelected(): void;
}

export interface IOrder {
  items: string[];
  payment: string;
  total: number;
  address: string;
  email: string;
  phone: string;
}

export interface IOrderForm {
  payment: string;
  address: string;
  email: string;
  phone: string;
}