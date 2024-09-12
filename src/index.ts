import './scss/styles.scss';
import { Page } from './components/Page';
import { EventEmitter } from './components/base/events';
import { ensureElement, cloneTemplate } from './utils/utils';
import { IOrderForm, IProduct, ApiResponse } from './types';
import { Api, ApiListResponse } from './components/base/api';
import { API_URL } from './utils/constants';
import { Modal } from './components/common/Modal';
import { ProductDetails } from './components/Card';
import { AppState } from './components/AppState';
import { Basket } from './components/Basket';
import { Order } from './components/Order';
import { Contacts } from './components/Contacts'
import { SuccessModal } from './components/SuccessModal';


const api = new Api(API_URL);
const events = new EventEmitter();


const catalogProductTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');


const appData = new AppState({}, events);


const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);


const basket = new Basket('basket', cloneTemplate(basketTemplate), events);
const order = new Order('order', cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);
const successModal = new SuccessModal(
	'order-success',
	cloneTemplate(successTemplate),
	{
		onClick: () => {
			events.emit('modal:close');
			modal.close();
		},
	}
);


api
	.get('/product')
	.then((res: ApiResponse) => {
		appData.setCatalog(res.items as IProduct[]);
	})
	.catch((err) => {
		console.error(err);
	});


events.on('catalog:updated', () => {
	page.catalog = appData.catalog.map((item) => {
		const product = new ProductDetails(cloneTemplate(catalogProductTemplate), {
			onClick: () => events.emit('card:details', item),
		});
		return product.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});


events.on('card:details', (item: IProduct) => {
	page.locked = true;
	const product = new ProductDetails(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (item.selected) {
				events.emit('basket:remove', item);
				modal.close();
			} else {
				events.emit('basket:add', item);
				modal.close();
			}
		},
	});
	product.setButtonText(item.selected ? 'Убрать из корзины' : 'Купить');
	modal.render({
		content: product.render({
			id: item.id,
			title: item.title,
			image: item.image,
			category: item.category,
			description: item.description,
			price: item.price,
		}),
	});
});


events.on('basket:add', (item: IProduct) => {
	item.selected = true;
	appData.addToBasket(item);
	page.counter = appData.getBasketAmount();
	events.emit('product:details', item);
});


events.on('basket:show', () => {
	page.locked = true;
	const basketItems = appData.basket.map((item, index) => {
		const storeItem = new ProductDetails(cloneTemplate(cardBasketTemplate), {
			onClick: () => events.emit('basket:remove', item),
		});
		return storeItem.render({
			title: item.title,
			price: item.price,
		});
	});
	modal.render({
		content: basket.render({
			list: basketItems,
			price: appData.getTotalBasketPrice(),
		}),
	});
});


events.on('basket:remove', (item: IProduct) => {
	appData.removeFromBasket(item.id);
	item.selected = false;
	basket.price = appData.getTotalBasketPrice();
	page.counter = appData.getBasketAmount();
	basket.refreshIndices();
	if (!appData.basket.length) {
		basket.disableButton();
	}
});


events.on('order:start', () => {
	modal.render({
		content: order.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});


events.on('order:validate', (errors: Partial<IOrderForm>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
});


events.on('contacts:validate', (errors: Partial<IOrderForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});


events.on(
	'orderInput:change',
	(data: { field: keyof IOrderForm; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);


events.on('order:submit', () => {
	appData.order.total = appData.getTotalBasketPrice();
	appData.setItems();
	modal.render({
		content: contacts.render({
			valid: false,
			errors: [],
		}),
	});
});


events.on('contacts:submit', () => {
	api.post('/order', appData.order)
		.then((res) => {
			events.emit('payment:success', res);
			appData.clearBasket();
			appData.refreshOrder();
			order.disableButtons();
			page.counter = 0;
			appData.resetSelected();
		})
		.catch((err) => {
			console.log(err);
		});
});


events.on('payment:success', (res: ApiListResponse<string>) => {
	modal.render({
		content: successModal.render(),
	});
	successModal.setTotal(res.total);
});


events.on('modal:close', () => {
	page.locked = false;
	appData.refreshOrder();
	order.clearForm();
	contacts.clearForm();
});
