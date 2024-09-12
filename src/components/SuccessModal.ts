import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';


interface ISuccessActions {
  onClick: (event: MouseEvent) => void;
}

export interface ISuccessModal {
  setTotal(value: number): void;
}

export class SuccessModal extends Component<ISuccessModal> {
  protected _button: HTMLButtonElement;
  protected _total: HTMLElement;

  constructor(
    protected blockName: string,
    container: HTMLElement,
    actions?: ISuccessActions
  ) {
    super(container);

    this._button = ensureElement<HTMLButtonElement>(`.${blockName}__close`, container);
    this._total = ensureElement<HTMLElement>(`.${blockName}__description`, container);

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener('click', actions.onClick)
      }
    }
  }

  setTotal(value: number): void {
    this.setText(this._total, `Списано ${value} синапсов`);
  }
}