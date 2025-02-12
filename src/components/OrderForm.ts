import { Form } from './common/Form';
import { IEvents } from './base/events';

interface IOrderFormData {
    payment: string;
    address: string;
}

export class OrderForm extends Form<IOrderFormData> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        // Добавляем обработчики для кнопок оплаты
        const buttons = container.querySelectorAll('.button_alt');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                events.emit('payment:change', button);
            });
        });
    }
} 