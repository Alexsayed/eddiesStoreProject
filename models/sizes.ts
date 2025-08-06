import mongoose, { Document } from 'mongoose';

export interface ISizes extends Document {
  menSizes: {
    jackets: {
      XS: boolean,
      S: boolean,
      M: boolean,
      L: boolean,
      XL: boolean,
      XXL: boolean,
    },
    pantsOrJeans: {
      '28': boolean,
      '30': boolean,
      '32': boolean,
      '34': boolean,
      '36': boolean,
      '38': boolean,

    },
    shoes: {
      '8': boolean,
      '9': boolean,
      '9_5': boolean,
      '10': boolean,
      '10_5': boolean,
      '11': boolean,
      '12': boolean,

    },
    sweaters: {
      XS: boolean,
      S: boolean,
      M: boolean,
      L: boolean,
      XL: boolean,
      XXL: boolean,
    },
    tees: {
      XS: boolean,
      S: boolean,
      M: boolean,
      L: boolean,
      XL: boolean,
      XXL: boolean,
    },
  },
  womenSizes: {
    dresses: {
      XS: boolean,
      S: boolean,
      M: boolean,
      L: boolean,
      XL: boolean,
      XXL: boolean,
    },
    jackets: {
      XS: boolean,
      S: boolean,
      M: boolean,
      L: boolean,
      XL: boolean,
      XXL: boolean,
    },
    pantsOrJeans: {
      '24': boolean,
      '25': boolean,
      '26': boolean,
      '27': boolean,
      '28': boolean,
      '29': boolean,
      '30': boolean,
      '31': boolean,
      '32': boolean,
      '34': boolean,
    },
    shoes: {
      '6': boolean,
      '7': boolean,
      '8': boolean,
      '9': boolean,
      '10': boolean,
    },
    skirts: {
      XS: boolean,
      S: boolean,
      M: boolean,
      L: boolean,
      XL: boolean,
      XXL: boolean,
    },
    sweaters: {
      XS: boolean,
      S: boolean,
      M: boolean,
      L: boolean,
      XL: boolean,
      XXL: boolean,
    },
    tops: {
      XS: boolean,
      S: boolean,
      M: boolean,
      L: boolean,
      XL: boolean,
      XXL: boolean,
    },
  },

}

const sizeSchema = new mongoose.Schema<ISizes>({
  menSizes: {
    jackets: {
      XS: { type: Boolean, default: false },
      S: { type: Boolean, default: false },
      M: { type: Boolean, default: false },
      L: { type: Boolean, default: false },
      XL: { type: Boolean, default: false },
      XXL: { type: Boolean, default: false },
    },
    pantsOrJeans: {
      '28': { type: Boolean, default: false },
      '30': { type: Boolean, default: false },
      '32': { type: Boolean, default: false },
      '34': { type: Boolean, default: false },
      '36': { type: Boolean, default: false },
      '38': { type: Boolean, default: false },
    },
    shoes: {
      '8': { type: Boolean, default: false },
      '9': { type: Boolean, default: false },
      '9_5': { type: Boolean, default: false },
      '10': { type: Boolean, default: false },
      '10_5': { type: Boolean, default: false },
      '11': { type: Boolean, default: false },
      '12': { type: Boolean, default: false },
    },
    sweaters: {
      XS: { type: Boolean, default: false },
      S: { type: Boolean, default: false },
      M: { type: Boolean, default: false },
      L: { type: Boolean, default: false },
      XL: { type: Boolean, default: false },
      XXL: { type: Boolean, default: false },
    },
    tees: {
      XS: { type: Boolean, default: false },
      S: { type: Boolean, default: false },
      M: { type: Boolean, default: false },
      L: { type: Boolean, default: false },
      XL: { type: Boolean, default: false },
      XXL: { type: Boolean, default: false },
    },
  },
  womenSizes: {
    dresses: {
      XS: { type: Boolean, default: false },
      S: { type: Boolean, default: false },
      M: { type: Boolean, default: false },
      L: { type: Boolean, default: false },
      XL: { type: Boolean, default: false },
      XXL: { type: Boolean, default: false },
    },
    jackets: {
      XS: { type: Boolean, default: false },
      S: { type: Boolean, default: false },
      M: { type: Boolean, default: false },
      L: { type: Boolean, default: false },
      XL: { type: Boolean, default: false },
      XXL: { type: Boolean, default: false },
    },
    pantsOrJeans: {
      '24': { type: Boolean, default: false },
      '25': { type: Boolean, default: false },
      '26': { type: Boolean, default: false },
      '27': { type: Boolean, default: false },
      '28': { type: Boolean, default: false },
      '29': { type: Boolean, default: false },
      '30': { type: Boolean, default: false },
      '31': { type: Boolean, default: false },
      '32': { type: Boolean, default: false },
      '33': { type: Boolean, default: false },
      '34': { type: Boolean, default: false },
    },
    shoes: {
      '6': { type: Boolean, default: false },
      '7': { type: Boolean, default: false },
      '8': { type: Boolean, default: false },
      '9': { type: Boolean, default: false },
      '10': { type: Boolean, default: false },
    },
    skirts: {
      XS: { type: Boolean, default: false },
      S: { type: Boolean, default: false },
      M: { type: Boolean, default: false },
      L: { type: Boolean, default: false },
      XL: { type: Boolean, default: false },
      XXL: { type: Boolean, default: false },

    },
    sweaters: {
      XS: { type: Boolean, default: false },
      S: { type: Boolean, default: false },
      M: { type: Boolean, default: false },
      L: { type: Boolean, default: false },
      XL: { type: Boolean, default: false },
      XXL: { type: Boolean, default: false },
    },
    tops: {
      XS: { type: Boolean, default: false },
      S: { type: Boolean, default: false },
      M: { type: Boolean, default: false },
      L: { type: Boolean, default: false },
      XL: { type: Boolean, default: false },
      XXL: { type: Boolean, default: false },
    },



  }

  // },

})

const Size = mongoose.models?.Size || mongoose.model<ISizes>('Size', sizeSchema);

export default Size;


