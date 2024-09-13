import { IEvents } from './base/events';
import { Form } from './common/Form';
import { ensureElement } from '../utils/utils';


export interface IContacts {
	phone: string;
	email: string;
}

export class Contacts extends Form<IContacts> {
	protected _phone: HTMLInputElement;
  protected _email: HTMLInputElement;
  protected _button: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this._phone = container.elements.namedItem('phone') as HTMLInputElement;
    this._email = container.elements.namedItem('email') as HTMLInputElement;
    this._button = ensureElement<HTMLButtonElement>('.button', this.container);
    this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
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

  set valid(value: boolean) {
    this._button.disabled = !value;
  }

  set errors(value: string) {
    this._errors.textContent = value;
  }

  toggleButton(isValid: boolean) {
    this._button.disabled = !isValid;
  }
}