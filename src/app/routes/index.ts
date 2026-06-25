import express from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { ProductRoutes } from "../modules/product/product.route";
import { ShadeRoutes } from "../modules/shade/shade.route";
import { BrandRoutes } from "../modules/brand/brand.route";
import { OrderRoutes } from "../modules/order/order.route";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { ReviewRoutes } from "../modules/review/review.route";
import { FaqRoutes } from "../modules/faq/faq.route";
import { WishlistRoutes } from "../modules/wishlist/wishlist.route";
import { CouponRoutes } from "../modules/coupon/coupon.route";
import { DeliveryChargeRoutes } from "../modules/deliveryCharge/deliveryCharge.route";
import { ShopSettingsRoutes } from "../modules/shopSettings/shopSettings.route";


const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  { path: "/categories",
    route: CategoryRoutes,
  },
  { path: "/products", 
    route: ProductRoutes, 
  },
  {
    path: "/shades",
    route: ShadeRoutes,
  },
  {
    path: '/brands',
    route: BrandRoutes,
  },
  {
    path: "/orders",
    route: OrderRoutes,
  },
  {
    path: "/payments",
    route: PaymentRoutes,
  },
  {
    path: "/reviews",
    route: ReviewRoutes,
  },
  {
    path: "/faqs",
    route: FaqRoutes,
  },
  {
    path: "/wishlist",
    route: WishlistRoutes,
  },
  {
    path: "/coupons",
    route: CouponRoutes,
  },
  
  {
    path: "/delivery-charge",
    route: DeliveryChargeRoutes,
  },
   {
    path: "/shop-settings",
    route: ShopSettingsRoutes,
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
