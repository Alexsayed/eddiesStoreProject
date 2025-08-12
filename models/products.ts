import mongoose, { Schema, Document, Model } from 'mongoose';
import { ISizes } from './sizes';

export interface Products extends Document {
  _id: string,
  productName: string;
  price: number;
  productImg: { imageURL: string, imagePub_id: string }[];
  category: string,
  brand: string,
  gender: string,
  kids: string,
  colors: { color: string, quantity: number }[],
  sizes: ISizes,
  author: string;
  inStock: boolean;
  created: Date;
}

const productSchema = new mongoose.Schema<Products>({
  productName: String,
  price: Number,
  productImg: [{
    _id: false, // disable automatic _id generation
    imageURL: String,
    imagePub_id: String
  }],
  category: String,
  brand: String,
  gender: String,
  colors: [{
    _id: false, // disable automatic _id generation
    color: String,
    quantity: Number
  }],
  sizes: { type: mongoose.Schema.Types.ObjectId, ref: "Size" },
  author: String,
  inStock: Boolean,
  created: {
    type: Date,
    default: Date.now
  },
});

const Product = mongoose.models.Product || mongoose.model<Products>('Product', productSchema);
export default Product;
