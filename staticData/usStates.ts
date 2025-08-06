export const usaStates: Record<string, string> = {
  "AL": "Alabama",
  "AK": "Alaska",
  "AS": "American Samoa",
  "AZ": "Arizona",
  "AR": "Arkansas",
  "CA": "California",
  "CO": "Colorado",
  "CT": "Connecticut",
  "DE": "Delaware",
  "DC": "District Of Columbia",
  "FM": "Federated States Of Micronesia",
  "FL": "Florida",
  "GA": "Georgia",
  "GU": "Guam",
  "HI": "Hawaii",
  "ID": "Idaho",
  "IL": "Illinois",
  "IN": "Indiana",
  "IA": "Iowa",
  "KS": "Kansas",
  "KY": "Kentucky",
  "LA": "Louisiana",
  "ME": "Maine",
  "MH": "Marshall Islands",
  "MD": "Maryland",
  "MA": "Massachusetts",
  "MI": "Michigan",
  "MN": "Minnesota",
  "MS": "Mississippi",
  "MO": "Missouri",
  "MT": "Montana",
  "NE": "Nebraska",
  "NV": "Nevada",
  "NH": "New Hampshire",
  "NJ": "New Jersey",
  "NM": "New Mexico",
  "NY": "New York",
  "NC": "North Carolina",
  "ND": "North Dakota",
  "MP": "Northern Mariana Islands",
  "OH": "Ohio",
  "OK": "Oklahoma",
  "OR": "Oregon",
  "PW": "Palau",
  "PA": "Pennsylvania",
  "PR": "Puerto Rico",
  "RI": "Rhode Island",
  "SC": "South Carolina",
  "SD": "South Dakota",
  "TN": "Tennessee",
  "TX": "Texas",
  "UT": "Utah",
  "VT": "Vermont",
  "VI": "Virgin Islands",
  "VA": "Virginia",
  "WA": "Washington",
  "WV": "West Virginia",
  "WI": "Wisconsin",
  "WY": "Wyoming"
};
export const staticMenCategories = ['Jackets', 'Jeans', 'Pants', 'Shoes', 'Sweaters', 'Tees'];
export const staticWomenCategories = ['Dresses', 'Jackets', 'Jeans', 'Pants', 'Shoes', 'Skirts', 'Sweaters', 'Tops',];
export const staticMenShoeSizes = ['8', '9', '9_5', '10', '10_5', '11', '12'];
export const staticWomenShoeSizes = ['6', '7', '8', '9', '10'];
export const staticMenNumericSizes = ['28', '30', '32', '34', '36', '38'];
export const staticWomenNumericSizes = ['24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34',];
export const staticAlphaSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// Export type/structure of USA States
export type USAStates = typeof usaStates;


export default usaStates;