import { Form } from './common/Form';
import { IEvents } from './base/events';
import { OrderFormView } from '../types';

interface IOrderFormData {
    payment: string;
    address: string;
}

export class OrderForm extends Form<IOrderFormData> implements OrderFormView {
    protected _buttons: HTMLButtonElement[];
    protected _address: HTMLInputElement;
    protected _paymentButtons: HTMLButtonElement[];

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        // Получаем все кнопки оплаты и поле адреса
        this._buttons = Array.from(container.querySelectorAll('.button_alt'));
        this._address = container.querySelector('input[name="address"]');
        this._paymentButtons = Array.from(container.querySelectorAll('.button_alt'));
        
        // Добавляем обработчики для кнопок оплаты
        this._paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Убираем активный класс у всех кнопок
                this._paymentButtons.forEach(btn => 
                    btn.classList.remove('button_alt-active')
                );
                // Добавляем активный класс выбранной кнопке
                button.classList.add('button_alt-active');
                events.emit('payment:change', button);
                this.validateForm();
            });
        });

        // Добавляем обработчик изменения адреса
        this._address.addEventListener('input', () => {
            events.emit('order:field:change', {
                field: 'address',
                value: this._address.value
            });
            this.validateForm();
        });
    }

    public validateForm() {
        const address = this._address.value;
        const payment = this._buttons.find(btn => btn.classList.contains('button_alt-active'))?.name;
        
        const errors: string[] = [];
        if (!address.trim()) {
            errors.push('Необходимо указать адрес');
        }
        if (!payment) {
            errors.push('Необходимо выбрать способ оплаты');
        }

        this.valid = errors.length === 0;
        this.errors = errors.join('; ');

        if (this.valid) {
            this._submit.disabled = false;
        }
    }

    get payment(): string {
        return this._buttons.find(btn => btn.classList.contains('button_alt-active'))?.name || '';
    }

    set payment(value: string) {
        this._buttons.forEach(btn => {
            btn.classList.toggle('button_alt-active', btn.name === value);
        });
    }

    get address(): string {
        return this._address.value;
    }

    set address(value: string) {
        this._address.value = value;
    }
} 