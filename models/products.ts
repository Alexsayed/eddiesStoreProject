// import mongoose from "mongoose";
// import mongoose, { Document } from 'mongoose';
import mongoose, { Schema, Document, Model } from 'mongoose';
import { ISizes } from './sizes';
// export interface Products extends mongoose.Document {
//   productName: string;
//   price: number;
//   productImg: string;
//   author: string;
//   inStock: boolean;
//   created: Date;
// }



export interface Products extends Document {
  _id: string,
  // quantity: number
  productName: string;
  price: number;
  productImg: string;
  category: string,
  brand: string,
  gender: string,
  kids: string,
  // colors: string[],
  colors: { color: string, quantity: number }[],
  // sizes: string[],
  sizes: ISizes,
  author: string;
  inStock: boolean;
  created: Date;

}
// interface Products {
//   _id: string,
//   productName: string;
//   price: number;
//   productImg: string;
//   category: string,
//   brand: string,
//   gender: string,
//   kids: string,
//   color: string,
//   // sizes: string[],
//   sizes: ISizes,
//   // size: {
//   //   menSizes: { pantsOrJeans: boolean, shoe: boolean, tees: boolean, },
//   //   womenSizes: { dresses: boolean, pantsOrJeans: boolean, skirts: boolean, shoes: boolean, tops: boolean, }
//   // },
//   author: string;
//   inStock: boolean;
//   created: Date;
// }
// interface ProductsDocument extends mongoose.Document, Products {}


const productSchema = new mongoose.Schema<Products>({
  // const productSchema = new Schema<Products>({
  // quantity: Number,
  // _id: String,
  productName: String,
  price: Number,
  productImg: String,
  category: String,
  brand: String,
  gender: String,
  // kids: String,  
  // colors: {
  //   type: [String],
  // },
  colors: [{
    _id: false, // disable automatic _id generation
    color: String,
    quantity: Number
    // type: [String],
  }],
  // size: String,
  // sizes: [
  //   {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "Size"
  //   },
  // ],
  sizes: { type: mongoose.Schema.Types.ObjectId, ref: "Size" },
  author: String,
  inStock: Boolean,
  created: {
    type: Date,
    default: Date.now
  },
});
// var User = mongoose.model("Users", userSchema);
// export default Users;
// export default mongoose.models.User || mongoose.model("User", userSchema); 
// mongoose.models = {};
// export default mongoose.models.Product || mongoose.model<Products>("Product", productSchema);
const Product = mongoose.models.Product || mongoose.model<Products>('Product', productSchema);
// const Product = mongoose.model<Products>('Product', productSchema);
export default Product;
// const ProductModel = mongoose.model<ProductsDocument>('Product', productSchema);
// export default mongoose.model<Products>("Product", productSchema);

// var Product = mongoose.model('Product', productSchema);

// export default Product;