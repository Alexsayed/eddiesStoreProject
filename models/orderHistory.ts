import mongoose, { Schema, Document, Model } from 'mongoose';
import { ISizes } from './sizes';
import { Products } from './products';
export interface OrderHistoryInterface extends Document {
  _id: string,
  product: Products[],
  totalAmount: Number,
  viewed: boolean,
  shippingInfo: {
    shippingFirstname: string,
    shippingLastname: string,
    shippingEmail: string,
    shippingAddress: string,
    shippingApt: string,
    shippingCity: string,
    shippingState: string,
    shippingCountry: string,
    shippingZipCode: string,
    shippingPhoneNumber: string,
  },
  billingInfo: {
    billingFirstname: string,
    billingLastname: string,
    billingEmail: string,
    billingAddress: string,
    billingApt: string,
    billingCity: string,
    billingState: string,
    billingCountry: string,
    // billingZipCode: string,
  },
  created: Date,
}
const orderHistorySchema = new mongoose.Schema<OrderHistoryInterface>({
  product: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  totalAmount: Number,
  // viewed: { type: Boolean, default: false },
  viewed: Boolean,
  shippingInfo: {
    shippingFirstname: String,
    shippingLastname: String,
    shippingEmail: String,
    shippingAddress: String,
    shippingApt: String,
    shippingCity: String,
    shippingState: String,
    shippingCountry: String,
    shippingZipCode: String,
    shippingPhoneNumber: String,
  },
  billingInfo: {
    billingFirstname: String,
    billingLastname: String,
    billingEmail: String,
    billingAddress: String,
    billingApt: String,
    billingCity: String,
    billingState: String,
    billingCountry: String,
    // billingZipCode: String,
  },
  created: {
    type: Date,
    default: Date.now
  },
});
const Orders = mongoose.models.Orders || mongoose.model<OrderHistoryInterface>('Orders', orderHistorySchema);
// const Product = mongoose.model<Products>('Product', productSchema);
export default Orders;