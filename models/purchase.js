import mongoose, { Schema } from "mongoose";

//  the schema for the Purchase model
const purchaseSchema = new Schema(
  {
    userId: String,
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  },
  {
    timestamps: true,
  }
);

// the schema for the StripeCustomer model
const stripeCustomerSchema = new Schema(
  {
    userId: String,
    stripeCustomerId: String,
  },
  {
    timestamps: true,
  }
);

//  models from the schemas
const Purchase =
  mongoose.models.Purchase || mongoose.model("Purchase", purchaseSchema);
const StripeCustomer =
  mongoose.models.StripeCustomer ||
  mongoose.model("StripeCustomer", stripeCustomerSchema);

export default { Purchase, StripeCustomer };
