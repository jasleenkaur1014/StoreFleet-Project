// Please don't change the pre-written code
// Import the necessary modules here

import {
  allPlacedOrdersRepo,
  createNewOrderRepo,
  getSingleOrderRepo,
  myOrdersRepo,
} from "../model/order.repository.js";
import {
  findProductRepo,
  updateProductRepo,
} from "../../product/model/product.repository.js";
import { ErrorHandler } from "../../../utils/errorHandler.js";

export const createNewOrder = async (req, res, next) => {
  // Write your code here for placing a new order
  try {
    const {
      shippingInfo,
      orderedItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    const user = req.user._id;

    if (!shippingInfo || !orderedItems || orderedItems.length === 0) {
      return next(new ErrorHandler(400, "Invalid order data"));
    }

    if (!paymentInfo || !paymentInfo.id) {
      return next(new ErrorHandler(400, "Payment information is required"));
    }

    for (const item of orderedItems) {
      const product = await findProductRepo(item.product);

      if (!product) {
        return next(new ErrorHandler(404, "Product not found"));
      }

      if (product.stock < item.quantity) {
        return next(
          new ErrorHandler(
            400,
            `Not enough stock for product: ${product.name}`,
          ),
        );
      }
    }

    for (const item of orderedItems) {
      const product = await findProductRepo(item.product);

      product.stock -= item.quantity;
      await updateProductRepo(product._id, { stock: product.stock });
    }

    const newOrder = {
      user,
      shippingInfo,
      orderedItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: paymentInfo.status ? Date.now() : null,
    };

    const orderDetail = await createNewOrderRepo(newOrder);
    res.status(201).json({ success: true, order: orderDetail });
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const getSingleOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await getSingleOrderRepo(id);
    return res.status(200).json({
      success: true,
      order: order,
    });
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const myOrders = async (req, res, next) => {
  try {
    const user = req.user._id;
    const order = await myOrdersRepo(user);
    return res.status(200).json({
      success: true,
      order: order,
    });
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const allPlacedOrders = async (req, res, next) => {
  try {
    const order = await allPlacedOrdersRepo();
    return res.status(200).json({
      success: true,
      order: order,
    });
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};

export const updateOrderDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await getSingleOrderRepo(id);
    if (!order) {
      return next(new ErrorHandler(400, "No order found to update"));
    }

    if (orderStatus == "Delivered") {
      order.deliveredAt = Date.now();
    }
    order.orderStatus = orderStatus;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: order,
    });
  } catch (error) {
    return next(new ErrorHandler(400, error));
  }
};
