import { IOrder, IProduct, FormErrors, IOrderForm } from '../types';
import { Model } from './base/Model';
import { IAppState } from '../types';


export class AppState extends Model<IAppState> {
  basket: IProduct[] = [];
  catalog: IProduct[];
  order: IOrder = {
    items: [],
    payment: '',
    total: null,
    address: '',
    email: '',
    phone: '',
  };

  formErrors: FormErrors = {};

  setCatalog(items: IProduct[]) {
    this.catalog = items;
    this.emitChanges('catalog:updated', { catalog: this.catalog });
  }

  addToBasket(value: IProduct) {
    this.basket.push(value);
  }

  removeFromBasket(id: string) {
    this.basket = this.basket.filter(item => item.id !== id)
    this.emitChanges('basket:show');
  }

  setOrderField(field: keyof IOrderForm, value: string) {
    this.order[field] = value;
    
    if (this.validateContacts()) {
      this.events.emit('contacts:ready', this.order)
    }
    if (this.validateOrder()) {
      this.events.emit('order:ready', this.order);
    }
  }

  clearBasket() {
    this.basket = [];
  }

  getBasketAmount() {
    return this.basket.length;
  }

  updateOrderItemsFromBasket() {
    this.order.items = this.basket.map(item => item.id)
  }

  getTotalBasketPrice() {
    return this.basket.reduce((sum, next) => sum + next.price, 0);
  }
 
  validateContacts() {
    const errors: typeof this.formErrors = {};
    if (!this.order.email) {
      errors.email = 'Необходимо указать email';
    } else if (!/\S+@\S+\.\S+/.test(this.order.email)) {
      errors.email = 'Неверный формат email: example@mail.com';
    }
    if (!this.order.phone) {
      errors.phone = 'Необходимо указать телефон';
    } else if (!/^\+?[0-9()]{10,14}$/.test(this.order.phone)) {
      errors.phone = 'Неверный формат телефона';
    }
    this.formErrors = errors;
    this.events.emit('contacts:validate', { errors, valid: Object.keys(errors).length === 0 });
    return Object.keys(errors).length === 0;
  }

  validateOrder() {
    const errors: typeof this.formErrors = {};
    if (!this.order.address) {
      errors.address = 'Необходимо указать адрес';
    }
    if (!this.order.payment) {
      errors.payment = 'Необходимо указать способ оплаты';
    }
    this.formErrors = errors;
    this.events.emit('order:validate', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  refreshOrder() {
    this.order = {
      items: [],
      total: null,
      address: '',
      email: '',
      phone: '',
      payment: ''
    };
  }  

  resetSelected() {
    this.catalog.forEach(item => item.selected = false)
  }
}