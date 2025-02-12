import { Api, ApiListResponse} from "./base/api";
import { CDN_URL } from '../utils/constants';
import { 
  ProductApi,
  ProductUI,
  OrderApi,
  OrderUI,
} from "../types/index";

export class ProjectApi extends Api {

  constructor(baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
  }

  public transformProduct(product: ProductApi): ProductUI {
    return {
      id: product.id,
      title: product.title,
      category: product.category,
      price: product.price ? `${product.price} синапсов` : 'Бесплатно',
      image: `${CDN_URL}${product.image}`,
      description: product.description,
    };
  }

  async getProducts(): Promise<ProductApi[]> {
    return this.get('/product').then((data:ApiListResponse<ProductApi>) => {
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