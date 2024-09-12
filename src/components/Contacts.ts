import { IEvents } from './base/events';
import { Form } from './common/Form';

export interface IContacts {
	phone: string;
	email: string;
}

export class Contacts extends Form<IContacts> {
	protected _phone: HTMLInputElement;
  protected _email: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this._phone = container.elements.namedItem('phone') as HTMLInputElement;
    this._email = container.elements.namedItem('email') as HTMLInputElement;
  }

  set phone(value: string) {
    this._phone.value = value;
  }

  set email(value: string) {
    this._email.value = value;
  }

  clearForm() {
    this._phone.value = '';
    this._email.value = '';
    this.onInputChange('phone', '');
    this.onInputChange('email', '');
    this.valid = false;
    this.errors = '';
  }
}