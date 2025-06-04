import { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from 'cloudinary';
import formidable from 'formidable';
import dbConnect from "../../../lib/dbConnect";
import Pet from "../../../models/Pet";
import User from "../../../models/Users";
import Product from "../../../models/products";
import Size, { ISizes } from "../../../models/sizes";
// keep on working on cloudinary.the BIG problem for now is { bodyParser: false, } this thing some how not letting POST to happen
// Disable Next.js default body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};
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
        // Get/find all products and populate sizes 
        const productResult = await Product.find({}).populate({ path: 'sizes', model: Size }).exec();
        res.status(200).json({ success: true, data: productResult });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
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
          // parse sizes and colors
          let sizes: any = {};
          let colors = [];
          try {
            colors = JSON.parse(flatFields.colors || '[]');
            sizes = JSON.parse(flatFields.sizes || '{}');
          } catch (e) {
            return res.status(400).json({ error: 'Invalid JSON in colors or sizes' });
          }
          let urls: string[] = [];
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
            const results = await Promise.all(uploadPromises);
            // get URL/s of the uploaded images so we can send them to mongoDB.
            urls = results.map((r) => {
              if (!r) return
              console.log('==============r:', r);

              return r.secure_url
              // filter((url): It removes any undefined or non-string values from the array.
            }).filter((url): url is string => typeof url === 'string');

            // urls = results
            //   .map(r => r?.url)
            //   .filter((url): url is string => typeof url === 'string');
            console.log('urls:', urls);
          } catch (error) {
            console.error('Cloudinary upload error:', error);
            res.status(500).json({ error: 'Upload failed' });
          }



          let createdSizeID;
          try {
            switch (flatFields.gender) {
              // if Men is selected
              case 'Men':
                // When one of the Categories is selected
                switch (flatFields.category) {
                  case 'mJackets':
                    // First create size model                
                    const createdMenJacketSize = new Size({
                      menSizes: { jackets: { XS: sizes.XS, S: sizes.S, M: sizes.M, L: sizes.L, XL: sizes.XL, XXL: sizes.XXL, } }
                    });
                    // // Assign size ID to the (createdSizeID) variable
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
          // next up: save the sizes to product schema and after work on cloudinary
          // Create a Product
          try {
            const createProduct = await Product.create({
              productName: flatFields.productName,
              price: flatFields.price,
              productImg: urls,
              category: flatFields.category,
              brand: flatFields.brand,
              gender: flatFields.gender,
              // kids: req.body.kids,
              // colors: JSON.parse(flatFields.colors),
              colors: colors,
              // size: req.body.size,
              sizes: createdSizeID,
              author: flatFields.author,
              inStock: flatFields.inStock,
            });
            console.log('======createProduct', createProduct)

            return res.status(200).json({ success: true, productID: createProduct._id });
            // return res.status(200).json({ success: true, productID: 'da334someBSID' });
          } catch (dbError) {
            console.error('❌ DB Error:', dbError);
            return res.status(500).json({ error: 'Failed to save product to DB' });
          }
        })();
      });
      // const form = formidable({ multiples: true });
      // form.parse(req, async (err, fields, files) => {
      //   if (err) return res.status(500).json({ error: 'Form parsing error' });
      //   console.log('======files', files)

      //   const file = files.file;
      //   try {
      //     // const result = await cloudinary.uploader.upload(file.filepath, {
      //     //   folder: 'uploads',
      //     // });
      //     // res.status(200).json({ url: result.secure_url });
      //   } catch (error) {
      //     console.error(error);
      //     res.status(500).json({ error: 'Upload failed' });
      //   }
      // });
      // try {
      //   console.log('======api/pets/index HIT method POST', method)

      // const pet = await Pet.create(
      //   req.body,
      // ); /* create a new model in the database */
      // res.status(201).json({ success: true, data: pet });
      // if (req.body.gender === 'Men') {


      // } else if (req.body.gender === 'Women') {
      //   console.log('====== req.body.gender Women,', req.body)
      //   if (req.body.category === 'wDresses') {
      //     console.log('====== req.body.category wDresses,', req.body.category)

      //   } else {
      //     console.log('====== not matched wDresses,', req.body.category)

      //   }

      // }

      // Product.create({
      //   productName: req.body.productName,
      //   price: req.body.price,
      //   productImg: req.body.productImg,
      //   category: req.body.category,
      //   brand: req.body.brand,
      //   gender: req.body.gender,
      //   kids: req.body.kids,
      //   color: req.body.color,
      //   // size: req.body.size,
      //   // sizes: createdSize._id,
      //   author: req.body.author,
      //   inStock: req.body.inStock,
      // }).then((createdProduct) => {
      //   console.log('=======createdProductt from index POST request', createdProduct)

      // }).catch((err) => {
      //   console.log('=======err from index', err);
      // })

      // const createProduct = await new Product({
      //   productName: req.body.productName,
      //   price: req.body.price,
      //   productImg: req.body.productImg,
      //   category: req.body.category,
      //   brand: req.body.brand,
      //   gender: req.body.gender,
      //   color: req.body.color,
      //   author: req.body.author,
      //   inStock: req.body.inStock,
      // });
      // next up: create all the sizes.maybe i should create data var and add size based on condition and then at the create the size model
      // const sizeData = { itemGender: { itemSize: {} } }
      // function collectData(option) {
      // Variable for all size's ID.
      // let createdSizeID;
      // // =========================ONHOLD original =========================== 8********************
      // When Gender men or women selected
      // switch (req.body.gender) {
      //   // if Men is selected
      //   case 'Men':
      //     // When one of the Categories is selected
      //     switch (req.body.category) {
      //       case 'mJackets':
      //         // First create size model                
      //         const createdMenJacketSize = new Size({
      //           menSizes: { jackets: { XS: req.body.XS, S: req.body.S, M: req.body.M, L: req.body.L, XL: req.body.XL, XXL: req.body.XXL, } }
      //         });
      //         // Assign size ID to the (createdSizeID) variable
      //         createdSizeID = createdMenJacketSize._id;
      //         // Save the size model
      //         await createdMenJacketSize.save();
      //         // Size.create({
      //         // size: { menSizes: { jackets: { XS: req.body.XS, S: req.body.S, M: req.body.M, L: req.body.L, XL: req.body.XL, XXL: req.body.XXL, } } }
      //         // menSizes: { jackets: { XS: req.body.XS, S: req.body.S, M: req.body.M, L: req.body.L, XL: req.body.XL, XXL: req.body.XXL, } }
      //         // }).then((createdSize) => {
      //         // createdSizeID = createdSize._id;
      //         //   const createProduct = new Product({
      //         //     productName: req.body.productName,
      //         //     price: req.body.price,
      //         //     productImg: req.body.productImg,
      //         //     category: req.body.category,
      //         //     brand: req.body.brand,
      //         //     gender: req.body.gender,
      //         //     color: req.body.color,
      //         //     author: req.body.author,
      //         //     inStock: req.body.inStock,
      //         //   });
      //         // console.log('=======createdSize', createdSize)
      //         //   // createProduct.sizes.push(createdSize._id);
      //         //   createProduct.sizes = createdSize._id;
      //         //   createProduct.save();
      //         //   console.log('======createProduct', createProduct)

      //         // }).catch((err) => {
      //         //   console.log('=======err from index', err);
      //         // })
      //         // sizeData.itemGender.itemSize = { XS: req.body.XS, S: req.body.S, M: req.body.M, L: req.body.L, XL: req.body.XL, XXL: req.body.XXL, }
      //         break;
      //       case 'mJeans':
      //       case 'mPants':
      //         const createdMenJeansOrPantsSize = new Size({
      //           // req.body['NUMBER'] explanation: 
      //           // In NextJS numeric property names are not allowed therefore we use bracket notation to allow any string or number to be used as the property key.
      //           menSizes: { pantsOrJeans: { 28: req.body['28'], 30: req.body['30'], 32: req.body['32'], 34: req.body['34'], 36: req.body['36'], 38: req.body['38'], } }
      //         });
      //         createdSizeID = createdMenJeansOrPantsSize._id;
      //         await createdMenJeansOrPantsSize.save();
      //         break;
      //       case 'mShoes':
      //         const createdMenShoesSize = new Size({
      //           menSizes: { shoes: { 8: req.body['8'], 9: req.body['9'], '9_5': req.body['9_5'], 10: req.body['10'], '10_5': req.body['10_5'], 11: req.body['11'], 12: req.body['12'], } }
      //         });
      //         createdSizeID = createdMenShoesSize._id;
      //         await createdMenShoesSize.save();
      //         break;
      //       case 'mSweaters':
      //         const createdMenSweatersSize = new Size({
      //           menSizes: { sweaters: { XS: req.body.XS, S: req.body.S, M: req.body.M, L: req.body.L, XL: req.body.XL, XXL: req.body.XXL, } }
      //         });
      //         createdSizeID = createdMenSweatersSize._id;
      //         await createdMenSweatersSize.save();
      //         break;
      //       case 'mTees':
      //         const createdMenTeesSize = new Size({
      //           menSizes: { tees: { XS: req.body.XS, S: req.body.S, M: req.body.M, L: req.body.L, XL: req.body.XL, XXL: req.body.XXL, } }
      //         });
      //         createdSizeID = createdMenTeesSize._id;
      //         await createdMenTeesSize.save();
      //         break;
      //     }
      //     break;
      //   case 'Women':
      //     switch (req.body.category) {
      //       case 'wDresses':
      //         const createdWomenDressSize = new Size({
      //           womenSizes: { dresses: { XS: req.body.XS, S: req.body.S, M: req.body.M, L: req.body.L, XL: req.body.XL, XXL: req.body.XXL, } }
      //         });
      //         createdSizeID = createdWomenDressSize._id;
      //         await createdWomenDressSize.save();
      //         break;
      //       case 'wJackets':
      //         const createdWomenJacketsSize = new Size({
      //           womenSizes: { jackets: { XS: req.body.XS, S: req.body.S, M: req.body.M, L: req.body.L, XL: req.body.XL, XXL: req.body.XXL, } }
      //         });
      //         createdSizeID = createdWomenJacketsSize._id;
      //         await createdWomenJacketsSize.save();
      //         break;
      //       case 'wJeans':
      //       case 'wPants':
      //         const createdWomenJeansOrPantsSize = new Size({
      //           // req.body['NUMBER'] explanation: 
      //           // In NextJS numeric property names are not allowed therefore we use bracket notation to allow any string or number to be used as the property key.
      //           womenSizes: { pantsOrJeans: { 24: req.body['24'], 25: req.body['25'], 26: req.body['26'], 27: req.body['27'], 28: req.body['28'], 29: req.body['29'], 30: req.body['30'], 31: req.body['31'], 32: req.body['32'], 33: req.body['33'], 34: req.body['34'], } }
      //         });
      //         createdSizeID = createdWomenJeansOrPantsSize._id;
      //         await createdWomenJeansOrPantsSize.save();
      //         break;
      //       case 'wShoes':
      //         const createdWomenShoesSize = new Size({
      //           womenSizes: { shoes: { 6: req.body['6'], 7: req.body['7'], 8: req.body['8'], 9: req.body['9'], 10: req.body['10'], } }
      //         });
      //         createdSizeID = createdWomenShoesSize._id;
      //         await createdWomenShoesSize.save();
      //         break;
      //       case 'wSkirts':
      //         const createdWomenSkirtsSize = new Size({
      //           womenSizes: { skirts: { XS: req.body.XS, S: req.body.S, M: req.body.M, L: req.body.L, XL: req.body.XL, XXL: req.body.XXL, } }
      //         });
      //         createdSizeID = createdWomenSkirtsSize._id;
      //         await createdWomenSkirtsSize.save();
      //         break;
      //       case 'wSweaters':
      //         const createdWomenSweatersSize = new Size({
      //           womenSizes: { sweaters: { XS: req.body.XS, S: req.body.S, M: req.body.M, L: req.body.L, XL: req.body.XL, XXL: req.body.XXL, } }
      //         });
      //         createdSizeID = createdWomenSweatersSize._id;
      //         await createdWomenSweatersSize.save();
      //         break;
      //       case 'wTops':
      //         const createdWomenTopsSize = new Size({
      //           womenSizes: { tops: { XS: req.body.XS, S: req.body.S, M: req.body.M, L: req.body.L, XL: req.body.XL, XXL: req.body.XXL, } }
      //         });
      //         createdSizeID = createdWomenTopsSize._id;
      //         await createdWomenTopsSize.save();
      //         break;
      //     }
      //     break;
      //   default:
      //     alert('no gender is picked')
      //     res.status(400).json({ success: false });
      //     break;
      // }
      // // =========================ONHOLD original =========================== 8********************

      //=============================working =========================
      // Product.create({
      //   productName: req.body.productName,
      //   price: req.body.price,
      //   productImg: req.body.productImg,
      //   category: req.body.category,
      //   brand: req.body.brand,
      //   gender: req.body.gender,
      //   kids: req.body.kids,
      //   color: req.body.color,
      //   // size: req.body.size,
      //   sizes: createdSizeID,
      //   author: req.body.author,
      //   inStock: req.body.inStock,
      // }).then((createdProduct) => {
      //   console.log('=======createdProductt from index POST request', createdProduct)

      // }).catch((err) => {
      //   console.log('=======err from index', err);
      // })
      //=============================working =========================
      // console.log('=========req.body', req.body)
      // console.log('=========createdSizeID', createdSizeID);


      // // =========================ONHOLD original=========================== 8********************
      // const createProduct = await Product.create({
      //   productName: req.body.productName,
      //   price: req.body.price,
      //   productImg: req.body.productImg,
      //   category: req.body.category,
      //   brand: req.body.brand,
      //   gender: req.body.gender,
      //   kids: req.body.kids,
      //   colors: req.body.colors,
      //   // size: req.body.size,
      //   sizes: createdSizeID,
      //   author: req.body.author,
      //   inStock: req.body.inStock,
      // });
      // return res.status(200).json({ success: true, productID: createProduct._id });
      // // =========================ONHOLD original=========================== 8********************
      // return res.status(200).json({ success: true, productID: 'da334someBSID' });


      // } catch (error) {
      //   res.status(400).json({ success: false });
      // }
      break;
    default: res.status(400).json({ success: false });
      break;
  }
  // res.status(405).end(); // Method Not Allowed
}
