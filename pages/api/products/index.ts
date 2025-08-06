import { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import dbConnect from "../../../lib/dbConnect";
import User from "../../../models/Users";
import Product from "../../../models/products";
import Size, { ISizes } from "../../../models/sizes";

// Disable Next.js default body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};
interface ImageUpload {
  secure_url: string;
  public_id: string;
}
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  // connect mongoDB
  await dbConnect();
  switch (method) {
    case "GET":
      try {
        // Get/find all products and populate it's sizes 
        const productResult = await Product.find({}).populate({ path: 'sizes', model: Size }).exec();
        res.status(200).json({ success: true, data: productResult });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      let productImages: { imageURL: string; imagePub_id: string }[] = [];
      // Formidable is a Node.js library used to parse multipart/form-data, which is the content type used when you upload files via HTML forms.
      const form = formidable({ multiples: true, keepExtensions: true });
      // Parses an incoming Node.js request containing form data. If callback is provided, all fields and files are collected and passed to the callback.
      return form.parse(req, (err, fields, files) => {
        if (err) {
          console.error("Form parse error:", err);
          return res.status(500).json({ error: 'Form parsing failed' });
        }
        // async all below functions so we can use await
        (async () => {
          // the below function will flatten fields from  productName: [ 'Alex' ]; to productName: 'Alex';
          function flattenFields<T extends Record<string, any>>(reqBodyfields: T) {
            return Object.fromEntries(
              Object.entries(reqBodyfields).map(([key, val]) => [key, Array.isArray(val) ? val[0] : val])
            );
          };
          // Flaten all fields but NOT file.          
          const flatFields = flattenFields(fields);
          // parse sizes and colors. 
          let sizes: any = {};
          let colors = [];
          try {
            colors = JSON.parse(flatFields.colors || '[]'); // // To Array of Objects
            sizes = JSON.parse(flatFields.sizes || '{}'); // to Objects
          } catch (e) {
            return res.status(400).json({ error: 'Invalid JSON in colors or sizes' });
          }
          let urls: string[] = [];
          let pub_IDs: string[] = [];
          try {
            // Make sure the file is an array. 
            const fileArray = Array.isArray(files.productImg)
              ? files.productImg            // If already an array, use as-is
              : [files.productImg];         // Else, wrap the single file in an array   
            // Loop through fileArray and upload them
            const uploadPromises = fileArray.map(file => {
              if (!file) return; // Skip undefined files
              // Upload image file to Cloudinary and adjust the size of the image. 
              return cloudinary.uploader.upload(file.filepath, { width: 600, height: 800, crop: "limit", folder: 'testFolder' })
            });
            // Promise.all(...) is a way to run all promises in parallel and wait for all of them to finish.
            const results = await Promise.all(uploadPromises); //                         
            // Assign Cloudinary upload results to productImages variable/let
            productImages = results.filter((r) => r && typeof r.secure_url === 'string' && typeof r.public_id === 'string')
              .map((r: any) => ({
                imageURL: r.secure_url,
                imagePub_id: r.public_id,
              }));
          } catch (error) {
            console.error('Cloudinary upload error:', error);
            res.status(500).json({ error: 'Upload failed' });
          }
          // We will store size doc ID to this let/variable
          let createdSizeID;
          // Create an sizes document.
          try {
            switch (flatFields.gender) {
              // if Men is selected
              case 'Men':
                // When one of the Categories is selected
                switch (flatFields.category) {
                  case 'mJackets':
                    // create size model                
                    const createdMenJacketSize = new Size({
                      menSizes: { jackets: { XS: sizes.XS, S: sizes.S, M: sizes.M, L: sizes.L, XL: sizes.XL, XXL: sizes.XXL, } }
                    });
                    // Assign size ID to the (createdSizeID) variable
                    createdSizeID = createdMenJacketSize._id;
                    // // Save the size model
                    await createdMenJacketSize.save();
                    break;
                  case 'mJeans':
                  case 'mPants':
                    const createdMenJeansOrPantsSize = new Size({
                      // req.body['NUMBER'] explanation: 
                      // In NextJS numeric property names are not allowed therefore we use bracket notation to allow any string or number to be used as the property key.
                      menSizes: { pantsOrJeans: { 28: sizes['28'], 30: sizes['30'], 32: sizes['32'], 34: sizes['34'], 36: sizes['36'], 38: sizes['38'], } }
                    });
                    createdSizeID = createdMenJeansOrPantsSize._id;
                    await createdMenJeansOrPantsSize.save();
                    break;
                  case 'mShoes':
                    const createdMenShoesSize = new Size({
                      menSizes: { shoes: { 8: sizes['8'], 9: sizes['9'], '9_5': sizes['9_5'], 10: sizes['10'], '10_5': sizes['10_5'], 11: sizes['11'], 12: sizes['12'], } }
                    });
                    createdSizeID = createdMenShoesSize._id;
                    await createdMenShoesSize.save();
                    break;
                  case 'mSweaters':
                    const createdMenSweatersSize = new Size({
                      menSizes: { sweaters: { XS: sizes.XS, S: sizes.S, M: sizes.M, L: sizes.L, XL: sizes.XL, XXL: sizes.XXL, } }
                    });
                    createdSizeID = createdMenSweatersSize._id;
                    await createdMenSweatersSize.save();
                    break;
                  case 'mTees':
                    const createdMenTeesSize = new Size({
                      menSizes: { tees: { XS: sizes.XS, S: sizes.S, M: sizes.M, L: sizes.L, XL: sizes.XL, XXL: sizes.XXL, } }
                    });
                    createdSizeID = createdMenTeesSize._id;
                    await createdMenTeesSize.save();
                    break;
                }
                break;
              case 'Women':
                switch (flatFields.category) {
                  case 'wDresses':
                    const createdWomenDressSize = new Size({
                      womenSizes: { dresses: { XS: sizes.XS, S: sizes.S, M: sizes.M, L: sizes.L, XL: sizes.XL, XXL: sizes.XXL, } }
                    });
                    createdSizeID = createdWomenDressSize._id;
                    await createdWomenDressSize.save();
                    break;
                  case 'wJackets':
                    const createdWomenJacketsSize = new Size({
                      womenSizes: { jackets: { XS: sizes.XS, S: sizes.S, M: sizes.M, L: sizes.L, XL: sizes.XL, XXL: sizes.XXL, } }
                    });
                    createdSizeID = createdWomenJacketsSize._id;
                    await createdWomenJacketsSize.save();
                    break;
                  case 'wJeans':
                  case 'wPants':
                    const createdWomenJeansOrPantsSize = new Size({
                      // req.body['NUMBER'] explanation: 
                      // In NextJS numeric property names are not allowed therefore we use bracket notation to allow any string or number to be used as the property key.
                      womenSizes: { pantsOrJeans: { 24: sizes['24'], 25: sizes['25'], 26: sizes['26'], 27: sizes['27'], 28: sizes['28'], 29: sizes['29'], 30: sizes['30'], 31: sizes['31'], 32: sizes['32'], 33: sizes['33'], 34: sizes['34'], } }
                    });
                    createdSizeID = createdWomenJeansOrPantsSize._id;
                    await createdWomenJeansOrPantsSize.save();
                    break;
                  case 'wShoes':
                    const createdWomenShoesSize = new Size({
                      womenSizes: { shoes: { 6: sizes['6'], 7: sizes['7'], 8: sizes['8'], 9: sizes['9'], 10: sizes['10'], } }
                    });
                    createdSizeID = createdWomenShoesSize._id;
                    await createdWomenShoesSize.save();
                    break;
                  case 'wSkirts':
                    const createdWomenSkirtsSize = new Size({
                      womenSizes: { skirts: { XS: sizes.XS, S: sizes.S, M: sizes.M, L: sizes.L, XL: sizes.XL, XXL: sizes.XXL, } }
                    });
                    createdSizeID = createdWomenSkirtsSize._id;
                    await createdWomenSkirtsSize.save();
                    break;
                  case 'wSweaters':
                    const createdWomenSweatersSize = new Size({
                      womenSizes: { sweaters: { XS: sizes.XS, S: sizes.S, M: sizes.M, L: sizes.L, XL: sizes.XL, XXL: sizes.XXL, } }
                    });
                    createdSizeID = createdWomenSweatersSize._id;
                    await createdWomenSweatersSize.save();
                    break;
                  case 'wTops':
                    const createdWomenTopsSize = new Size({
                      womenSizes: { tops: { XS: sizes.XS, S: sizes.S, M: sizes.M, L: sizes.L, XL: sizes.XL, XXL: sizes.XXL, } }
                    });
                    createdSizeID = createdWomenTopsSize._id;
                    await createdWomenTopsSize.save();
                    break;
                }
                break;
              default:
                res.status(400).json({ success: false });
                break;
            }
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Sizes failed' });
          }
          try {
            // Create a Product 
            const createProduct = await Product.create({
              productName: flatFields.productName,
              price: flatFields.price,
              productImg: productImages,
              category: flatFields.category,
              brand: flatFields.brand,
              gender: flatFields.gender,
              colors: colors,
              sizes: createdSizeID,
              author: flatFields.author,
              inStock: flatFields.inStock,
            });
            // Return the data.
            return res.status(200).json({ success: true, productID: createProduct._id });
          } catch (dbError) {
            console.error('❌ DB Error:', dbError);
            return res.status(500).json({ error: 'Failed to save product to DB' });
          }
        })();
      });
  }
  // Default method fallback:
  return res.status(405).json({ success: false, error: `Method ${method} Not Allowed` });
}
