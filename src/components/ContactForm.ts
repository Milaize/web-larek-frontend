import { Form } from './common/Form';
import { IEvents } from './base/events';
import { ContactFormView } from '../types';
import { debounce } from '../utils/utils';
import { formatPhoneNumber } from '../utils/utils';

interface IContactFormData {
    email: string;
    phone: string;
}

export class ContactForm extends Form<IContactFormData> implements ContactFormView {
    protected _email: HTMLInputElement;
    protected _phone: HTMLInputElement;
    protected _submit: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._email = container.querySelector('input[name="email"]');
        this._phone = container.querySelector('input[name="phone"]');
        this._submit = container.querySelector('button[type="submit"]');

        // Изначально деактивируем кнопку
        if (this._submit) {
            this._submit.disabled = true;
        }

        // Создаем один общий debounced обработчик для всех изменений
        const debouncedHandler = debounce((field: string, value: string) => {
            events.emit('contacts:field:change', { field, value });
            this.validateForm();
        }, 300);

        this._email.addEventListener('input', () => {
            debouncedHandler('email', this._email.value);
        });

        this._phone.addEventListener('input', (e: Event) => {
            const input = e.target as HTMLInputElement;
            const formattedValue = formatPhoneNumber(input.value);
            input.value = formattedValue;
            debouncedHandler('phone', formattedValue);
        });

        container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            if (this.validateForm()) {
                events.emit('contacts:submit');
            }
        });

        this.validateForm();
    }

    public validateForm(): boolean {
        const errors: string[] = [];
        
        if (!this._email.value.trim() || !this._email.validity.valid) {
            errors.push('Введите корректный email');
        }
        
        if (!this._phone.value.trim() || !this._phone.validity.valid) {
            errors.push('Введите телефон в формате +7 (999) 999-99-99');
        }

        this.valid = errors.length === 0;
        this.errors = errors.join('; ');
        
        // Обновляем состояние кнопки в зависимости от валидности
        if (this._submit) {
            this._submit.disabled = !this.valid; // Кнопка активна только если нет ошибок
        }

        return this.valid;
    }

    get email(): string {
        return this._email.value;
    }

    set email(value: string) {
        this._email.value = value;
    }

    get phone(): string {
        return this._phone.value;
    }

    set phone(value: string) {
        this._phone.value = value;
    }
} 