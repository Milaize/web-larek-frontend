import { Component } from './base/Component';
import { ensureElement } from '../utils/utils';
import { SuccessView } from '../types';

interface ISuccess {
    total: string;
}

interface ISuccessActions {
    onClick: () => void;
}

export class Success extends Component<ISuccess> implements SuccessView {
    protected _close: HTMLElement;
    protected _total: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this._total = ensureElement<HTMLElement>('.order-success__description', container);
        this._close = ensureElement<HTMLElement>('.order-success__close', container);
        
        this._close.addEventListener('click', actions.onClick);
    }

    set total(value: string) {
        this.setText(this._total, `Списано ${value} синапсов`);
    }
} 