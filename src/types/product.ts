import { ApiRes } from '@/types/api';
import { User, UserInfoType } from '@/types/user';

// 상품
export interface ProductType {
  _id?: number;
  seller_id?: number;
  price?: number;
  name?: string;
  mainImages?: {
    path: string;
    name?: string;
    originalname?: string;
  }[];
  extra?: {
    category?: string[];
    sort?: number;
    details?: string;
    isBest?: boolean;
    info?: string[];
    storage?: string[];
    sellerEmail?: string;
  };
}

// 상품 조회
export interface ProductTypeRes {
  ok: 0 | 1;
  item: ProductType;
}

// 상품 가져오기용 리스트
export interface ProductItemType {
  _id: number;
  product_id?: number;
  price: number;
  name: string;
  image: {
    path: string;
    name?: string;
    originalname?: string;
  };
  quantity: number;
  extra?: {
    category?: string[];
    sort?: number;
    details?: string;
    isBest?: boolean;
    sellerEmail?: string;
  };
  seller_id?: number;
}

// 장바구니 리스트
export interface CartItemType {
  _id: number;
  product_id: number;
  quantity: number;
  product: ProductItemType;
}

// 찜상품 리스트
export interface LikeItemType {
  _id: number;
  target_id: number;
  product: LikeItemProps;
}

// 찜상품 가져오기용 리스트
export interface LikeItemProps {
  _id: number;
  product_id: number;
  price: number;
  name: string;
  mainImages: {
    path: string;
    name?: string;
    originalname?: string;
  }[];
  extra?: {
    category?: string[];
    sort?: number;
    details?: string;
    isBest?: boolean;
  };
}

// 주문내역 리스트
export interface BuyListType {
  _id: number;
  createdAt: string;
  products: ProductItemType[];
}

// 주문상세
export interface OrderInfoType {
  _id: number;
  user_id?: number;
  createdAt: string;
  user: UserInfoType;
  cost: {
    total: number;
  };
  products: ProductItemType[];
  payment: string;
}

// 주문 타입
export interface OrderType {
  products: ProductItemType[];
}

// 주문 상세 아이템
export interface OrderInfoItemType {
  _id: number;
  createdAt: string;
  cost: number;
  products: ProductItemType[];
  user: UserInfoType;
  payment: string;
}

// 주문내역 리스트
export interface BuyItemListType {
  _id: number;
  createdAt: string;
  products: ProductItemType[];
}

// 상품 카드 타입
export interface ProductCard {
  item: ProductType;
  likeRes: ApiRes<LikeItemType[] | null>;
  accessToken: string;
  user?: User | null;
}

// 상품 단일 구매 타입
export interface ShoppingOrderType {
  products: ProductItemType[];
  cost: {
    total?: number;
  };
}

// 메일 타입
export interface EmailType {
  to: string;
  serviceName: string;
  subject: string;
  content: string;
}
