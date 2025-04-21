import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import Pet from "../../../models/Pet";
import User from "../../../models/Users";
import Product from "../../../models/products";
import Size from "../../../models/sizes";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  // console.log('======req from api/product/index', req)
  // const { query: { id }, method } = req;
  // console.log('==========iddddd from products', id);
  // console.log('======api/pets/index HIT method', method)
  await dbConnect();

  switch (method) {
    case "GET":
      try {
        console.log('======api/pets/index HIT method GET', method)

        // const pets = await Pet.find({}); /* find all the data in our database */
        // res.status(200).json({ success: true, data: pets });

        // // ************************ ORIGINAL *****************
        // const result = await User.find({});
        // res.status(200).json({ success: true, data: result });
        // // ************************ ORIGINAL *****************



        const productResult = await Product.find({}).populate({ path: 'sizes', model: Size }).exec();
        res.status(200).json({ success: true, data: productResult });
        // console.log('=======result from index', productResult)
        // // ************************ ON HOLD *****************
        // Product.create({
        //   productName: 'Milk',
        //   price: 20,
        //   inStock: true,
        //   productImg: 'https://img.freepik.com/free-photo/photorealistic-view-tree-nature-with-branches-trunk_23-2151478028.jpg',
        //   author: 'AlexSayed'
        // }).then((createdProduct) => {
        //   console.log('=======createdProductt from index', createdProduct)

        // }).catch((err) => {
        //   console.log('=======err from index', err)
        // })
        // // ************************ ON HOLD *****************

      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        console.log('======api/pets/index HIT method POST', method)

        // const pet = await Pet.create(
        //   req.body,
        // ); /* create a new model in the database */
        // res.status(201).json({ success: true, data: pet });
        // if (req.body.gender === 'Men') {
        //   console.log('======req.body.gender Men', req.body)

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
        let createdSizeID;
        // When Gender men or women selected
        switch (req.body.gender) {
          // if Men is selected
          case 'Men':
            // When one of the Categories is selected
            switch (req.body.category) {
              case 'mJackets':
                // First create size model                
                const createdMenJacketSize = new Size({
                  menSizes: { jackets: { XS: req.body.XS, S: req.body.S, M: req.body.M, L: req.body.L, XL: req.body.XL, XXL: req.body.XXL, } }
                });
                // Assign size ID to the (createdSizeID) variable
                createdSizeID = createdMenJacketSize._id;
                // Save the size model
                await createdMenJacketSize.save();
                // Size.create({
                // size: { menSizes: { jackets: { XS: req.body.XS, S: req.body.S, M: req.body.M, L: req.body.L, XL: req.body.XL, XXL: req.body.XXL, } } }
                // menSizes: { jackets: { XS: req.body.XS, S: req.body.S, M: req.body.M, L: req.body.L, XL: req.body.XL, XXL: req.body.XXL, } }
                // }).then((createdSize) => {
                // createdSizeID = createdSize._id;
                //   const createProduct = new Product({
                //     productName: req.body.productName,
                //     price: req.body.price,
                //     productImg: req.body.productImg,
                //     category: req.body.category,
                //     brand: req.body.brand,
                //     gender: req.body.gender,
                //     color: req.body.color,
                //     author: req.body.author,
                //     inStock: req.body.inStock,
                //   });
                // console.log('=======createdSize', createdSize)
                //   // createProduct.sizes.push(createdSize._id);
                //   createProduct.sizes = createdSize._id;
                //   createProduct.save();
                //   console.log('======createProduct', createProduct)

                // }).catch((err) => {
                //   console.log('=======err from index', err);
                // })
                // sizeData.itemGender.itemSize = { XS: req.body.XS, S: req.body.S, M: req.body.M, L: req.body.L, XL: req.body.XL, XXL: req.body.XXL, }
                break;
              case 'mJeans':
              case 'mPants':
                const createdMenJeansOrPantsSize = new Size({
                  // req.body['NUMBER'] explanation: 
                  // In NextJS numeric property names are not allowed therefore we use bracket notation to allow any string or number to be used as the property key.
                  menSizes: { pantsOrJeans: { 28: req.body['28'], 30: req.body['30'], 32: req.body['32'], 34: req.body['34'], 36: req.body['36'], 38: req.body['38'], } }
                });
                createdSizeID = createdMenJeansOrPantsSize._id;
                await createdMenJeansOrPantsSize.save();
                break;
              case 'mShoes':
                const createdMenShoesSize = new Size({
                  menSizes: { shoes: { 8: req.body['8'], 9: req.body['9'], '9_5': req.body['9_5'], 10: req.body['10'], '10_5': req.body['10_5'], 11: req.body['11'], 12: req.body['12'], } }
                });
                createdSizeID = createdMenShoesSize._id;
                await createdMenShoesSize.save();
                break;
              case 'mSweaters':
                const createdMenSweatersSize = new Size({
                  menSizes: { sweaters: { XS: req.body.XS, S: req.body.S, M: req.body.M, L: req.body.L, XL: req.body.XL, XXL: req.body.XXL, } }
                });
                createdSizeID = createdMenSweatersSize._id;
                await createdMenSweatersSize.save();
                break;
              case 'mTees':
                const createdMenTeesSize = new Size({
                  menSizes: { tees: { XS: req.body.XS, S: req.body.S, M: req.body.M, L: req.body.L, XL: req.body.XL, XXL: req.body.XXL, } }
                });
                createdSizeID = createdMenTeesSize._id;
                await createdMenTeesSize.save();
                break;
            }
            break;
          case 'Women':
            switch (req.body.category) {
              case 'wDresses':
                const createdWomenDressSize = new Size({
                  womenSizes: { dresses: { XS: req.body.XS, S: req.body.S, M: req.body.M, L: req.body.L, XL: req.body.XL, XXL: req.body.XXL, } }
                });
                createdSizeID = createdWomenDressSize._id;
                await createdWomenDressSize.save();
                break;
              case 'wJackets':
                const createdWomenJacketsSize = new Size({
                  womenSizes: { jackets: { XS: req.body.XS, S: req.body.S, M: req.body.M, L: req.body.L, XL: req.body.XL, XXL: req.body.XXL, } }
                });
                createdSizeID = createdWomenJacketsSize._id;
                await createdWomenJacketsSize.save();
                break;
              case 'wJeans':
              case 'wPants':
                const createdWomenJeansOrPantsSize = new Size({
                  // req.body['NUMBER'] explanation: 
                  // In NextJS numeric property names are not allowed therefore we use bracket notation to allow any string or number to be used as the property key.
                  womenSizes: { pantsOrJeans: { 24: req.body['24'], 25: req.body['25'], 26: req.body['26'], 27: req.body['27'], 28: req.body['28'], 29: req.body['29'], 30: req.body['30'], 31: req.body['31'], 32: req.body['32'], 33: req.body['33'], 34: req.body['34'], } }
                });
                createdSizeID = createdWomenJeansOrPantsSize._id;
                await createdWomenJeansOrPantsSize.save();
                break;
              case 'wShoes':
                const createdWomenShoesSize = new Size({
                  womenSizes: { shoes: { 6: req.body['6'], 7: req.body['7'], 8: req.body['8'], 9: req.body['9'], 10: req.body['10'], } }
                });
                createdSizeID = createdWomenShoesSize._id;
                await createdWomenShoesSize.save();
                break;
              case 'wSkirts':
                const createdWomenSkirtsSize = new Size({
                  womenSizes: { skirts: { XS: req.body.XS, S: req.body.S, M: req.body.M, L: req.body.L, XL: req.body.XL, XXL: req.body.XXL, } }
                });
                createdSizeID = createdWomenSkirtsSize._id;
                await createdWomenSkirtsSize.save();
                break;
              case 'wSweaters':
                const createdWomenSweatersSize = new Size({
                  womenSizes: { sweaters: { XS: req.body.XS, S: req.body.S, M: req.body.M, L: req.body.L, XL: req.body.XL, XXL: req.body.XXL, } }
                });
                createdSizeID = createdWomenSweatersSize._id;
                await createdWomenSweatersSize.save();
                break;
              case 'wTops':
                const createdWomenTopsSize = new Size({
                  womenSizes: { tops: { XS: req.body.XS, S: req.body.S, M: req.body.M, L: req.body.L, XL: req.body.XL, XXL: req.body.XXL, } }
                });
                createdSizeID = createdWomenTopsSize._id;
                await createdWomenTopsSize.save();
                break;
            }
            break;
          default:
            alert('no gender is picked')
            res.status(400).json({ success: false });
            break;
        }
        //=============================working =========================
        Product.create({
          productName: req.body.productName,
          price: req.body.price,
          productImg: req.body.productImg,
          category: req.body.category,
          brand: req.body.brand,
          gender: req.body.gender,
          kids: req.body.kids,
          color: req.body.color,
          // size: req.body.size,
          sizes: createdSizeID,
          author: req.body.author,
          inStock: req.body.inStock,
        }).then((createdProduct) => {
          console.log('=======createdProductt from index POST request', createdProduct)

        }).catch((err) => {
          console.log('=======err from index', err);
        })
        //=============================working =========================

      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default: res.status(400).json({ success: false });
      break;
  }

}
