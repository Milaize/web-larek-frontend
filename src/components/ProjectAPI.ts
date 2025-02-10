import { Api } from "./base/api";
import { 
  ProductAPI,
  ProductUI,
  OrderAPI,
  OrderUI,} from "../types/index";

  export class ProjectApi extends Api {
    readonly cdn: string;
  
    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
      super(baseUrl, options);
      this.cdn = cdn;
    }
  
    private transformProduct(product: ProductAPI): ProductUI {
      return {
        id: product.id,
        title: product.title,
        category: product.category,
        price: product.price ? `${product.price} синапсов` : "Бесплатно",
        image: this.cdn + product.image,
        description: product.description,
      };
    }
  
    async getProducts(): Promise<ProductUI[]> {
      return this.get("/product").then((data: { items: ProductAPI[] }) =>
        data.items.map(this.transformProduct.bind(this))
      );
    }
  
    async getProductById(id: string): Promise<ProductUI> {
      return this.get(`/product/${id}`).then(this.transformProduct.bind(this));
    }
  
    async orderCard(order: OrderAPI): Promise<OrderUI> {
      return this.post("/order", order, "POST").then((data: OrderAPI) => ({
        id: data.id,
        total: `${data.total} синапсов`,
        items: data.items.map(item => ({
          id: item.productId,
          title: "Товар", // Можно улучшить, получив название из БД
          price: "0 синапсов", // Аналогично с ценой
          quantity: item.quantity,
        })),
        status: data.status,
      }));
    }
  }
  