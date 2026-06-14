// 1. 商品のデータ構造（商品マスタ）
export interface Product {
  id: string;        // 商品ID (例: "P001")
  name: string;      // 商品名 (例: "ブレンドコーヒー")
  price: number;     // 単価 (例: 400)
  barcode?: string;  // バーコード番号（任意）
}

// 2. カート（レジ画面）の中身
export interface CartItem {
  product: Product;  // 商品情報
  quantity: number;  // 注文個数
}

// 3. データベース（MySQL）に保存する売上記録
export interface SaleRecord {
  id: string;        // 売上伝票ID
  createdAt: Date;   // 会計日時
  items: {
    productId: string;
    quantity: number;
    subtotal: number; // 小計
  }[];
  totalAmount: number; // 合計金額
}