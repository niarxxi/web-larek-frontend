import { IEvents } from './base/events';
import { Form } from './common/Form';


export interface IOrder {
  address: string;
  payment: string;
}

export class Order extends Form<IOrder> {
  protected _card: HTMLButtonElement;
  protected _cash: HTMLButtonElement;
  protected _address: HTMLInputElement;

  constructor(
    protected blockName: string,
    container: HTMLFormElement,
    protected events: IEvents
  ) {
    super(container, events);

    this._card = container.elements.namedItem('card') as HTMLButtonElement;
    this._cash = container.elements.namedItem('cash') as HTMLButtonElement;
    this._address = container.elements.namedItem('address') as HTMLInputElement;
    if (this._cash) {
      this._cash.addEventListener('click', () => {
        this._cash.classList.add('button_alt-active')
        this._card.classList.remove('button_alt-active')
        this.onInputChange('payment', 'cash')
      })
    }
    if (this._card) {
      this._card.addEventListener('click', () => {
        this._card.classList.add('button_alt-active')
        this._cash.classList.remove('button_alt-active')
        this.onInputChange('payment', 'card')
      })
    }
  }

  disableButtons() {
    this._cash.classList.remove('button_alt-active')
    this._card.classList.remove('button_alt-active')
  }

  clearForm() {
    this._address.value = '';
    this.disableButtons();
    this.onInputChange('address', '');
    this.onInputChange('payment', '');
    this.valid = false;
    this.errors = '';
  }
}