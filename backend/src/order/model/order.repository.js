import OrderModel from "./order.schema.js";

export const createNewOrderRepo = async (data) => {
  // Write your code here for placing a new order
  return await new OrderModel(data).save();
};

export const getSingleOrderRepo = async (id) => {
  return await OrderModel.findById(id);
};

export const myOrdersRepo = async (user) => {
  return await OrderModel.find({ user })
    .sort({ createdAt: -1 })
    .populate("orderedItems.product", "name price image");
};

export const allPlacedOrdersRepo = async () => {
  return OrderModel.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });
};
