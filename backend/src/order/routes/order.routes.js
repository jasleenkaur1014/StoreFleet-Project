import express from "express";
import {
  allPlacedOrders,
  createNewOrder,
  getSingleOrder,
  myOrders,
  updateOrderDetails,
} from "../controllers/order.controller.js";
import { auth, authByUserRole } from "../../../middlewares/auth.js";

const router = express.Router();

router.route("/new").post(auth, createNewOrder);
router.route("/:id").get(auth, authByUserRole("admin"), getSingleOrder);
router.route("/my/orders").get(auth, myOrders);
router
  .route("/orders/placed")
  .get(auth, authByUserRole("admin"), allPlacedOrders);
router
  .route("/update/:id")
  .put(auth, authByUserRole("admin"), updateOrderDetails);

export default router;
