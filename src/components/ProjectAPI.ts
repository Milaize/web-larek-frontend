import { Api, ApiListResponse} from "./base/api";
import { CDN_URL } from '../utils/constants';
import { 
  ProductApi,
  ProductUI,
  OrderApi,
  OrderUI,
} from "../types/index";
import { ApiClient } from '../types';

export class ProjectApi extends Api implements ApiClient {

  constructor(baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
  }

  public transformProduct(product: ProductApi): ProductUI {
    return {
      id: product.id,
      title: product.title,
      category: product.category,
      price: product.price ? String(product.price) : 'Бесплатно',
      image: `${CDN_URL}${product.image}`,
      description: product.description,
    };
  }

  async getProducts(): Promise<ProductUI[]> {
    return this.get('/product').then((data: ApiListResponse<ProductApi>) => {
        return data.items.map(this.transformProduct.bind(this));
    });
  }
  
  async getProductById(id: string): Promise<ProductUI> {
    return this.get(`/product/${id}`).then(this.transformProduct.bind(this));
  }

  async orderCard(order: OrderApi): Promise<OrderUI> {
    return this.post('/order', order, 'POST').then((data: OrderApi) => ({
        id: data.id,
        total: `${data.total} синапсов`,
        items: data.items.map(item => ({
            id: item.productId,
            title: "Товар",
            price: "0 синапсов",
            quantity: item.quantity,
        })),
        status: data.status,
    }));
  }
}