import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { categoryMapping } from '../utils/constants';
import { CDN_URL } from '../utils/constants';


interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export interface ICard {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  price: number | null;
  selected: boolean;
}

export class Card<T> extends Component<ICard> {
  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(
    protected blockName: string,
    container: HTMLElement,
    actions?: ICardActions
  ) {
    super(container);

    this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
    this._image = container.querySelector(`.${blockName}__image`);
    this._button = container.querySelector(`.${blockName}__button`);
    this._category = container.querySelector(`.${blockName}__category`);
    this._price = container.querySelector(`.${blockName}__price`);

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick);
      } else {
        container.addEventListener('click', actions.onClick);
      }
    }
  }

  set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}
	
  set image(value: string) {
    this._image.src = CDN_URL + value;
  }

	set price(value: string) {
		this.setText(this._price, `${value} синапсов`);
		if (value === null) {
			this.setText(this._price, `Бесценно`);
			this.setDisabled(this._button, true);
		}
	}

	get price(): string {
		return this._price.textContent || '';
	}

	set category(value: string) {
		this.setText(this._category, value);
		this._category.classList.remove(...this._category.classList);
		this._category.classList.add('card__category');
		const categoryValue = categoryMapping.categoryClass.get(value);
		this._category.classList.add(`${categoryValue}`);
	}

	get category(): string {
		return this._category.textContent || '';
	}
	
}

interface IProductDetails {
	title: string;
	description?: string | string[];
	image: string;
	category: string;
	price: number | null;
}

export class ProductDetails extends Card<IProductDetails> {
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected _description: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);
		this._category = container.querySelector('.card__category');
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._description = container.querySelector('.card__text');
	}

	set description(value: string) {
    this._description.textContent = value;
  }

	setButtonText(text: string) {
		if (this._button) {
			this._button.textContent = text;
		}
	}		
}
