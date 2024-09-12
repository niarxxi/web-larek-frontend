# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/sсss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

# Архитектура проекта "Веб-ларёк"

## Паттерн проектирования
Проект реализован с использованием паттерна MVP (Model-View-Presenter) и событийно-ориентированного подхода.

## Описание архитектуры

### Базовые классы
```
1. EventEmitter
   - Назначение: Обеспечивает работу с событиями
   - Конструктор: Не принимает параметров
   - Поля:
     - _events: Map<EventName, Set<Subscriber>> - хранит подписчиков на события
   - Методы:
     - on(eventName: string, callback: Function): void - подписка на событие
     - off(eventName: string, callback: Function): void - отписка от события
     - emit(eventName: string, data?: any): void - генерация события
     - onAll(callback: Function): void - подписка на все события
     - offAll(): void - отписка от всех событий
     - trigger(eventName: string, context?: object): Function - создание триггера события

2. Api
   - Назначение: Отвечает за взаимодействие с сервером
   - Конструктор: constructor(baseUrl: string, options: RequestInit = {})
   - Поля:
     - baseUrl: string - базовый URL для запросов
     - options: RequestInit - опции для запросов
   - Методы:
     - get(uri: string): Promise<object> - выполнение GET-запроса
     - post(uri: string, data: object, method: string = 'POST'): Promise<object> - выполнение POST-запроса
```

### СЛОЙ МОДЕЛИ
```
1. Model<T>: Абстрактный класс для моделей данных. Обеспечивает работу с данными и их валидацию.

2. AppState
   - Назначение: Хранит состояние приложения
   - Конструктор: Не принимает параметров
   - Поля:
     - catalog: IProduct[] - список товаров
     - basket: IProduct[] = [] - товары в корзине
     - order: IOrder = {
          items: [],
          payment: '',
          total: null,
          address: '',
          email: '',
          phone: '',
        };  - информация о текущем заказе
   - Методы:
     - setCatalog(items: IProduct[]): void - установка каталога товаров
     - addToBasket(value: IProduct): void - добавление товара в корзину
     - removeFromBasket(id: string): void - удаление товара из корзины
     - setOrderField(field: keyof IOrderForm, value: string): void - установка информации о заказе
     - clearBasket(): void - очистка корзины
     - getBasketAmount(): number - получения количества товаров в корзине
     - setItems(): void - добавление ID товаров
     - getTotalBasketPrice(): number - получения суммы цены всех товаров в корзине
     - validateContacts(): boolean - валидация форм для контактов
     - validateOrder(): boolean - валидация форм для заказов
     - refreshOrder(): boolean - очистка order после покупки товаров
     - resetSelected(): void - обновление поля selected во всех товарах после совершения покупки
```
### СЛОЙ ПРЕДСТАВЛЕНИЯ
```
1. Component<T>: Абстрактный класс для всех компонентов. Содержит методы для рендеринга и обновления состояния компонента.

2. Page
   - Назначение: Отображает каталог товаров
   - Конструктор: constructor(container: HTMLElement, protected events: IEvents)
   - Поля: 
      - _counter: HTMLElement - ссылка на DOM-элемент, отображающий количество товаров в корзине
      - _catalog: HTMLElement - ссылка на DOM-элемент, содержащий список всех товаров магазина
      - _wrapper: HTMLElement - ссылка на обертку всего содержимого страницы
      - _basket: HTMLElement - ссылка на DOM-элемент корзины
   - Сеттеры:
     - set counter(value: number) - счётчик товаров в корзине
     - set catalog(items: HTMLElement[]) - заменяет содержимое каталога новым списком элементов.
     - set locked(value: boolean) - блокировка или разблокировка страницы в зависимости от значения value

3. Card
   - Назначение: Отображает карточку товара
   - Конструктор: constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions)
   - Поля:
      - _title: HTMLElement - ссылка на DOM-элемент с названием товара
      - _image: HTMLImageElement - ссылка на изображение товара
      - _category: HTMLelement - ссылка на DOM-элемент с категорией товара
      - _price: HTMLElement - ссылка на DOM-элемент с ценой товара
      - _button: HTMLButtonElement - ссылка на кнопку "В корзину"
   - Сеттеры и геттеры:
     - set id(value: string) - устанавливает идентификатор карточки
     - get id() - получает идентификатор карточки. 
     - set title(value: string) - устанавливает заголовок карточки
     - get title() - получает заголовок карточки
     - set image(value: string) - устанавливает изображение карточки
     - set price(value: number | null) - устанавливает цену карточки
     - set category(value: string) - устанавливает категорию карточки
     - get category(): string - получает категорию карточки.

4. ProductDetails extends Card
   - Дополнительный метод:
     - setButtonText(text: string): void - установка текста кнопки
   - Сеттер: 
      - set description(value: string) - установка описания продукта

5. Basket
   - Назначение: Отображает корзину
   - Конструктор: constructor(protected blockName: string, container: HTMLElement, protected events: IEvents)
   - Поля:
      - _list: HTMLElement - ссылка на DOM-элемент, содержащий список товаров в корзине
      - _price: HTMLElement - ссылка на DOM-элемент, отображающий общую стоимость товаров в корзине
      - _button: HTMLButtonElement - ссылка на кнопку оформления заказа
   - Сеттеры:
      - set price(price: number) - установка общей цены
      - set list(items: HTMLElement[]) - установка списка товаров
   - Методы:
      - disableButton(): void - блокирует кнопку оформления
      - refreshIndices(): void - обновление индексов при удалении товара из корзины
    
6. Order
   - Назначение: Отображает форму заказа
   - Конструктор: constructor(protected blockName: string, container: HTMLElement, protected events: IEvents)
   - Поля:
      - _card: HTMLButtonElement - ссылка на кнопку выбора оплаты картой
      - _cash: HTMLButtonElement - ссылка на кнопку выбора оплаты наличными
      - _address: HTMLInputElement - поле ввода адреса
   - Методы:
     - disableButtons(): void - отключение подсвечивания кнопки
     - clearForm() - сбрасывает все поля формы и состояние кнопок.

7. Contacts
   - Назначение: Управляет формой контактных данных
   - Поля:
      - _email: HTMLInputElement - поле ввода email
      - _phone: HTMLInputElement - поле ввода телефона
   - Сеттеры:
      - set phone(value: string) - установка номера телефона
      - set email(value: string) - установка email адреса
   - Методы:
      - clearForm() - сбрасывает все поля формы и состояние кнопок.
    
8. Modal
   - Назначение: Базовый класс для модальных окон
   - Конструктор: constructor(container: HTMLElement, protected events: IEvents)
   - Поля:
      - _closeButton: HTMLButtonElement - кнопка закрытия модального окна
      - _content:HTMLElement - контейнер для содержимого модального окна
   - Сеттеры:
      - set content(content: HTMLElement): void - отрисовка содержимого модального окна
   - Методы:
     - open(): void - открытие модального окна
     - close(): void - закрытие модального окна
     - render(data.IModalData):HTMLElement - рендеринг модального окна

9. SuccessModal 
   - Назначение: Отображает модальное окно успешного оформления заказа
   - Поля:
      - _button: HTMLButtonElement - кнопка закрытия модального окна
      - _total: HTMLElement - элемент для отображения итоговой суммы заказа
   - Методы:
     - setTotal(value: number): void - установка итоговой суммы заказа

```

### СЛОЙ ПРЕЗЕНТЕРА

Презентер не выделен в отдельный класс, а реализован в основном скрипте приложения. Он отвечает за обработку событий, координацию взаимодействия между моделью и представлением.

### Описание событий
```
1. 'catalog:updated': Обновление списка товаров на странице.
2. 'card:details': Открытие модального окна с детальной информацией о товаре.
3. 'basket:add': Добавление товара в корзину и обновление UI.
4. 'basket:show': Открытие модального окна корзины.
5. 'basket:remove': Удаление товара из корзины и обновление соответствующих данных.
6. 'order:start': Открытие формы оформления заказа.
7. 'order:submit': Переход к следующему этапу оформления заказа (контактные данные).
8. 'contacts:submit': Отправка заказа на оплату.
9. 'orderInput:change': Инициация процесса валидации при вводе данных в формы заказа.
10. 'order:validate': Обновление ошибок валидации формы заказа.
11. 'contacts:validate': Обновление ошибок валидации формы контактов.
12. 'payment:success': Отображение сообщения об успешной оплате.
13. 'modal:close': Закрытие любого открытого модального окна.
```