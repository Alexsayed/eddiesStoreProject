import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import Product, { Products } from "../../../models/products";
import Size from "../../../models/sizes";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { v2 as cloudinary } from 'cloudinary';

// handle GET, PUT and Delete requests
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query: { id }, method } = req;
  // Connect DB
  await dbConnect();
  switch (method) {
    case "GET"/* Get a model by its ID */:
      try {
        // *********************ORIGINAL *********************************
        // const productFromAPI = await Product.findById(id).populate({ path: 'sizes', model: Size }).exec();
        // if (!productFromAPI) {
        //   return res.status(400).json({ success: false });
        // }
        // console.log('========== productFromAPI', productFromAPI);
        // res.status(200).json({ success: true, data: productFromAPI });
        // *********************ORIGINAL *********************************        


      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "PUT" /* Edit a model by its ID */:
      if (req.body.imagePubID) {  // If deleting and Image     
        try {
          // Deleting image from Cloudinary
          await cloudinary.uploader.destroy(req.body.imagePubID, { invalidate: true }, function (error, result) {
            console.log('result error', result, error)
          });
          // removing image URL from product document.  
          const pullImage = await Product.findOneAndUpdate(
            { _id: id },
            { $pull: { productImg: { imagePub_id: req.body.imagePubID } } },
            { new: true }
          );
          return res.status(200).json({ success: true, data: pullImage });
        } catch (error) {
          res.status(400).json({ success: false });
        }
      } else { // If editing a Product        
        try {
          // update a product.
          const updateProduct = await Product.findByIdAndUpdate(
            { _id: id },
            {
              productName: req.body.productName,
              price: req.body.price,
              // productImg: req.body.productImg,
              category: req.body.category,
              brand: req.body.brand,
              gender: req.body.gender,
              kids: req.body.kids,
              colors: req.body.colors,
              // size: req.body.size,
              author: req.body.author,
              inStock: req.body.inStock,
            },
            { new: true }
          );

          // Updating product sizes model by it's ID. req.body.sizes: has all the info of the size interface which is coming from editForm.tsx
          await Size.findByIdAndUpdate(
            { _id: req.body.sizes._id },
            req.body.sizes,
            { new: true }
          );
          if (!updateProduct) {
            return res.status(400).json({ success: false });
          }
          return res.status(200).json({ success: true, data: updateProduct });
        } catch (error) {
          res.status(400).json({ success: false });
        }
      }
      break;
    case "DELETE" /* Delete a model by its ID */:
      try {
        const publicIds: string[] = [];
        // handle delete a product
        const deletedProduct = await Product.findByIdAndDelete({ _id: req.body.id });
        if (!deletedProduct) {
          return res.status(404).json({ success: false, message: 'Product not found' });
        }
        // Delete products related sizes
        const deleteSize = await Size.findByIdAndDelete({ _id: deletedProduct.sizes });
        if (!deleteSize) {
          return res.status(404).json({ success: false, message: 'Related sizes not found' });
        }
        // Collect all imagePub_id to delete from Cloudinary
        deletedProduct.productImg.forEach((img: any) => {
          if (img.imagePub_id) publicIds.push(img.imagePub_id);
        });
        if (publicIds.length > 0) {
          // Delete Cloudinary resources or array of images
          const cloudinaryResult = await cloudinary.api.delete_resources(publicIds);
        }
        // Respond
        res.status(200).json({ success: true, });

      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    default:
      res.status(400).json({ success: false });
      break;
  }
}
