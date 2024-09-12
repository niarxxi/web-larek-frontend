import { createElement, ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { EventEmitter } from './base/events';


interface IBasket {
	list: HTMLElement[];
	price: number;
}

export class Basket extends Component<IBasket> {
	protected _list: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(protected blockName: string, container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>(`.${blockName}__list`, this.container);
		this._price = this.container.querySelector(`.${blockName}__price`);
		this._button = this.container.querySelector(`.${blockName}__button`);

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:start');
			});
		}

		this.list = [];
	}

	set list(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
			this._button.toggleAttribute('disabled', false);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
			this._button.toggleAttribute('disabled', true);
		}
	}
	
	set price(total: number) {
		this.setText(this._price, total + ' синапсов');
	}

	disableButton() {
    this._button.disabled = true
  }
  
  refreshIndices() {
    Array.from(this._list.children).forEach((item, index) => {
      const indexElement = item.querySelector('.basket__item-index');
      if (indexElement) {
        indexElement.textContent = (index + 1).toString();
      }
    });
  }
}