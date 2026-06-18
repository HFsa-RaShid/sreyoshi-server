import express from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { ProductRoutes } from "../modules/product/product.route";
import { ShadeRoutes } from "../modules/shade/shade.route";
import { BrandRoutes } from "../modules/brand/brand.route";

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
  { path: "/categories", route: CategoryRoutes },
  { path: "/products", route: ProductRoutes },
  {
    path: "/shades",
    route: ShadeRoutes,
  },
  {
    path: '/brands',
    route: BrandRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
