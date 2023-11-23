// import mongoose from "mongoose";

// const { Schema } = mongoose;
// const { ObjectId } = mongoose.Schema;

// const orderSchema = new Schema(
//   {
//     product: [{ type: ObjectId, ref: "Product" }],

//     payment: {},

//     buyer: [{ type: ObjectId, ref: "User" }],

//     status: {
//       type: "String",
//       default: "Not Processed",
//       enum: [
//         "Not Processed",
//         "Processing",
//         "shipped",
//         "Delivered",
//         "Cancelled",
//       ],
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Order", orderSchema);

import mongoose from "mongoose";

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const orderSchema = new Schema(
  {
    product: [{ type: ObjectId, ref: "Product" }],
    payment: {},
    buyer: { type: ObjectId, ref: "User" },
    status: {
      type: String,
      default: "Not_processed",
      enum: [
        "Not_processed",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
