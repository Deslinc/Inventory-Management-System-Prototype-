// ============================================================
// SAMPLE INVENTORY DATA
// Built from your real Excel file (Sheet2 columns)
// Replace this with a real API call once your backend is live:
//   const res = await fetch('/api/inventory');
//   const data = await res.json();
// ============================================================

const WEEKS = ['Wk25','Wk26','Wk27','Wk28','Wk29','Wk30','Wk31','Wk32','Wk33','Wk34','Wk35','Wk36','Wk37','Wk38','Wk39','Wk40','Wk41'];

function fakeWeeks(base, vol) {
  return WEEKS.map(() => Math.max(0, base + Math.floor((Math.random() - 0.45) * vol)));
}

const RAW = [
  { id: '000001', name: 'Bel Aqua Mineral Water 1.5L',           vendor: 'Blowchem Industries (water)',       cat: 'SOFT DRINKS',          subcat: 'Mineral Water',        food: 'FOOD',     price: 3.50,   oh: 42,  sales: 18, status: 'Active' },
  { id: '000002', name: 'Bel Aqua Active Lemon 500ml',            vendor: 'Blowchem Industries',               cat: 'SOFT DRINKS',          subcat: 'Flavoured Water',      food: 'FOOD',     price: 2.80,   oh: 15,  sales: 22, status: 'Active' },
  { id: '000009', name: 'Bel Aqua Sparkling Water 330ml',         vendor: 'Blowchem Industries (water)',       cat: 'SOFT DRINKS',          subcat: 'Sparkling Water',      food: 'FOOD',     price: 2.50,   oh: 0,   sales: 9,  status: 'Active' },
  { id: '000016', name: 'Frezz Bakes Bar Cake Vanilla 250g',      vendor: 'Maurya Foods',                      cat: 'PACKED CROISSANT & CAKE', subcat: 'Vanilla Cake',      food: 'FOOD',     price: 8.50,   oh: 24,  sales: 11, status: 'Active' },
  { id: '000017', name: 'Frezz Bakes Bar Cake Chocolate 250g',    vendor: 'Maurya Foods',                      cat: 'PACKED CROISSANT & CAKE', subcat: 'Chocolate Cake',    food: 'FOOD',     price: 8.50,   oh: 18,  sales: 14, status: 'Active' },
  { id: '000019', name: 'Frezz Bakes Wheat Bread 600g',           vendor: 'Maurya Foods',                      cat: 'BREAD & KAAK',         subcat: 'Sliced Brown Bread',   food: 'FOOD',     price: 7.20,   oh: 0,   sales: 0,  status: 'Discontinued' },
  { id: '000023', name: 'Zwan Beef Luncheon Meat 200g',           vendor: 'Whitelane',                         cat: 'CANNED SEAFOOD',       subcat: 'Beef Meat',            food: 'FOOD',     price: 12.00,  oh: 30,  sales: 8,  status: 'Active' },
  { id: '000034', name: 'Blue Skies Mango Orange Banana Juice 500ml', vendor: 'Blue Skies',                   cat: 'JUICE',                subcat: 'Fruit Juice',          food: 'FOOD',     price: 9.80,   oh: 60,  sales: 35, status: 'Active' },
  { id: '000037', name: 'Blue Skies Chocolate Orange Ice Cream 125ml', vendor: 'Blue Skies',                  cat: 'ICE CREAM',            subcat: 'Ice Cream Sticks',     food: 'FOOD',     price: 7.50,   oh: 18,  sales: 22, status: 'Active' },
  { id: '000043', name: "Sawa's Granola Cereal 250g",             vendor: 'Sawa Foods Ent',                    cat: 'CEREAL BARS',          subcat: 'Energy Bars',          food: 'FOOD',     price: 22.00,  oh: 12,  sales: 6,  status: 'Active' },
  { id: '000046', name: "Kellogg's Coco Pops Cereal 430g",        vendor: 'Two Thousand Ltd',                  cat: 'CEREAL BARS',          subcat: 'Cereal',               food: 'FOOD',     price: 32.00,  oh: 20,  sales: 9,  status: 'Active' },
  { id: '000050', name: 'Indomie Onion Chicken Noodles 70G',      vendor: 'Multipro Private',                  cat: 'INSTANT NOODLES & RICE', subcat: 'Instant Ramen Bag',  food: 'FOOD',     price: 3.50,   oh: 88,  sales: 65, status: 'Active' },
  { id: '000057', name: "Huggies Size 3 Midi 44's 5-9kg",        vendor: 'Multipro Private',                  cat: 'WIPES',                subcat: 'Baby Wipes',           food: 'NON FOOD', price: 55.00,  oh: 14,  sales: 7,  status: 'Active' },
  { id: '000059', name: 'Akwaaba Roasted Cashews 40g',            vendor: 'Akwaaba Fine Foods Ltd',            cat: 'NUTS & KERNELS',       subcat: 'Roasted Mixed Nuts',   food: 'FOOD',     price: 6.50,   oh: 45,  sales: 28, status: 'Active' },
  { id: '000062', name: "Dove Cool Fresh Spray 24's",            vendor: 'Beauty Glow',                       cat: 'DEO M SPRAY',          subcat: 'Deodorant Spray',      food: 'NON FOOD', price: 38.00,  oh: 9,   sales: 4,  status: 'Active' },
  { id: '000073', name: 'Dove Deeply Nourishing Shower Gel 500ml', vendor: 'Beauty Glow',                     cat: 'SHOWER GEL',           subcat: 'Regular Shower Gel',   food: 'NON FOOD', price: 28.00,  oh: 16,  sales: 11, status: 'Active' },
  { id: '000076', name: 'Golden Tree Kingsbite Bar 50g',          vendor: 'Choco-lala Ltd',                    cat: 'CHOCOLATE',            subcat: 'Milk Chocolate',       food: 'FOOD',     price: 5.50,   oh: 70,  sales: 42, status: 'Active' },
  { id: '000078', name: 'Bounty Chocolate 57g',                   vendor: 'Transmed (Gh) Ltd',                 cat: 'CHOCOLATE',            subcat: 'Chocolate Bar',        food: 'FOOD',     price: 8.00,   oh: 33,  sales: 19, status: 'Active' },
  { id: '000083', name: 'Heinz Baked Beans 200g',                 vendor: 'Forewin (GH) Ltd',                  cat: 'CANNED BEANS',         subcat: 'Kidney Beans',         food: 'FOOD',     price: 9.50,   oh: 28,  sales: 13, status: 'Active' },
  { id: '000086', name: 'Heinz Tomato Ketchup 570g',              vendor: 'Forewin (GH) Ltd',                  cat: 'COOKING SAUCES',       subcat: 'Tomato Ketchup',       food: 'FOOD',     price: 22.00,  oh: 35,  sales: 17, status: 'Active' },
  { id: '000089', name: 'Loacker Sandwich Chocolate 25g',         vendor: 'BOX FOR LESS',                      cat: 'WAFERS & BISCUITS',    subcat: 'Chocolate Wafer',      food: 'FOOD',     price: 4.50,   oh: 55,  sales: 38, status: 'Active' },
  { id: '000094', name: 'M&M Chocolate 45g',                      vendor: 'Fairway Wholesale',                 cat: 'CHOCOLATE',            subcat: 'Chocolate Candy',      food: 'FOOD',     price: 7.00,   oh: 40,  sales: 24, status: 'Active' },
  { id: '000107', name: 'Raid Flying Insect Killer 300ml',        vendor: 'Forewin (GH) Ltd',                  cat: 'INSECTICIDES',         subcat: 'Insecticide Sprays',   food: 'NON FOOD', price: 24.00,  oh: 18,  sales: 6,  status: 'Active' },
  { id: '000110', name: 'Red Bull Energy Drink 250ML',            vendor: 'Forewin (GH) Ltd',                  cat: 'SOFT DRINKS',          subcat: 'Energy Drinks',        food: 'FOOD',     price: 15.00,  oh: 48,  sales: 31, status: 'Active' },
  { id: '000120', name: 'Twix Original Chocolate 50g',            vendor: 'Fairway Wholesale',                 cat: 'CHOCOLATE',            subcat: 'Chocolate Bar',        food: 'FOOD',     price: 8.00,   oh: 28,  sales: 16, status: 'Active' },
  { id: '000160', name: 'Everpack Multipurpose Jumbo Roll 39.5m', vendor: 'Everpack (GH) Ltd',                 cat: 'KITCHEN ROLLS',        subcat: 'Kitchen Towels',       food: 'NON FOOD', price: 14.00,  oh: 40,  sales: 18, status: 'Active' },
  { id: '000162', name: 'Everpack Fluffy Economical 2ply 10 rolls', vendor: 'Everpack (GH) Ltd',              cat: 'TOILET ROLLS',         subcat: 'Standard Toilet Paper', food: 'NON FOOD', price: 18.00, oh: 55,  sales: 28, status: 'Active' },
  { id: '000186', name: 'Ariel Powder Auto Detergent 4kg',        vendor: 'Two Thousand Ltd',                  cat: 'FABRIC & LAUNDRY CARE', subcat: 'Laundry Detergent',  food: 'NON FOOD', price: 85.00,  oh: 12,  sales: 5,  status: 'Active' },
  { id: '000205', name: 'Domestos Bleach Original 750ml',         vendor: 'SIAN Wholesale UK',                 cat: 'SURFACE CLEANING',     subcat: 'Disinfectant',         food: 'NON FOOD', price: 22.00,  oh: 25,  sales: 11, status: 'Active' },
  { id: '000221', name: 'Listerine Freshburst 500ml',             vendor: 'Two Thousand Ltd',                  cat: 'MOUTHWASH & FLOSS',    subcat: 'Mouthwash',            food: 'NON FOOD', price: 35.00,  oh: 16,  sales: 8,  status: 'Active' },
  { id: '000223', name: 'Nescafe Gold Blend 95g',                 vendor: 'Two Thousand Ltd',                  cat: 'AMERICAN COFFEE',      subcat: 'Instant Coffee',       food: 'FOOD',     price: 48.00,  oh: 20,  sales: 9,  status: 'Active' },
  { id: '000249', name: 'Dettol Antiseptic Liquid 500ml',         vendor: 'Fareast Mercantile Ltd',            cat: 'SURFACE CLEANING',     subcat: 'Multi-Surface',        food: 'NON FOOD', price: 28.00,  oh: 22,  sales: 10, status: 'Active' },
  { id: '000258', name: 'Omo Auto Detergent Powder 2kg',          vendor: 'Fareast Mercantile (Unilever)',     cat: 'FABRIC & LAUNDRY CARE', subcat: 'Laundry Detergent',  food: 'NON FOOD', price: 42.00,  oh: 0,   sales: 8,  status: 'Active' },
  { id: '000273', name: 'Colgate Toothpaste Triple Action 140g',  vendor: 'Fareast Mercantile Ltd',            cat: 'TOOTHPASTE',           subcat: 'Cavity Protection',    food: 'NON FOOD', price: 16.00,  oh: 38,  sales: 20, status: 'Active' },
  { id: '000338', name: 'Lurpak Unsalted Butter 200g',            vendor: 'Fairway Wholesale',                 cat: 'MILK SUBSTITUTES',     subcat: 'Butter',               food: 'FOOD',     price: 28.00,  oh: 14,  sales: 9,  status: 'Active' },
  { id: '000344', name: 'Sadia Full Frozen Chicken 1.3kg',        vendor: 'Poultrade Ghana',                   cat: 'FROZEN',               subcat: 'Frozen Poultry',       food: 'FOOD',     price: 65.00,  oh: 22,  sales: 14, status: 'Active' },
  { id: '000391', name: 'Pringles Cheese & Onion Chips 158g',     vendor: 'Kippax Trading Ltd',                cat: 'CHIPS & DIPS',         subcat: 'Potato Chips',         food: 'FOOD',     price: 22.00,  oh: 40,  sales: 28, status: 'Active' },
  { id: '000430', name: 'Ferrero Rocher T3 Chocolate 37.5g',      vendor: 'Goldcoast Matcom',                  cat: 'CHOCOLATE',            subcat: 'Milk Chocolate',       food: 'FOOD',     price: 12.00,  oh: 45,  sales: 30, status: 'Active' },
  { id: '000441', name: 'Kinder Joy Boy Chocolate 20g',           vendor: 'Goldcoast Matcom',                  cat: 'CHOCOLATE',            subcat: 'Compound Chocolate',   food: 'FOOD',     price: 6.00,   oh: 60,  sales: 40, status: 'Active' },
  { id: '000530', name: 'Party Ice Ice Cubes 2.27kg',             vendor: 'Panda Investment Ltd',              cat: 'ICE CUBES',            subcat: 'Ice cubes',            food: 'FOOD',     price: 8.00,   oh: 30,  sales: 22, status: 'Active' },
  { id: '000547', name: 'Ceres Apple Juice 1L',                   vendor: 'Forewin (GH) Ltd',                  cat: 'JUICE',                subcat: 'Apple Juice',          food: 'FOOD',     price: 18.00,  oh: 35,  sales: 20, status: 'Active' },
  { id: '000562', name: 'Cadbury Dairy Milk 45g',                 vendor: 'Ramsden International, UK',         cat: 'CHOCOLATE',            subcat: 'Milk Chocolate',       food: 'FOOD',     price: 8.00,   oh: 50,  sales: 32, status: 'Active' },
  { id: '000575', name: 'Barilla Penne Rigate Pasta 500g',        vendor: 'Transmed (Gh) Ltd',                 cat: 'PASTA',                subcat: 'Pasta',                food: 'FOOD',     price: 14.00,  oh: 30,  sales: 14, status: 'Active' },
  { id: '000643', name: "Pampers Pants Midi S3 58's",            vendor: 'Transmed (Gh) Ltd',                 cat: 'WIPES',                subcat: 'Baby Diapers',         food: 'NON FOOD', price: 68.00,  oh: 20,  sales: 10, status: 'Active' },
  { id: '000653', name: 'Akwaaba Roasted Peanuts 250G',           vendor: 'Akwaaba Fine Foods Ltd',            cat: 'NUTS & KERNELS',       subcat: 'Roasted Peanuts',      food: 'FOOD',     price: 10.00,  oh: 55,  sales: 32, status: 'Active' },
  { id: '000701', name: "Meannan Eggs 6's",                       vendor: 'Meannan Foods (EGGS)',              cat: 'EGGS',                 subcat: 'Brown Eggs',           food: 'FOOD',     price: 8.00,   oh: 45,  sales: 38, status: 'Active' },
  { id: '000702', name: "Meannan Eggs 12's",                      vendor: 'Meannan Foods (EGGS)',              cat: 'EGGS',                 subcat: 'Brown Eggs',           food: 'FOOD',     price: 15.00,  oh: 38,  sales: 30, status: 'Active' },
  { id: '000757', name: 'Nestle Kitkat 4 Finger 41.5g',          vendor: 'Maxmart Distribution',              cat: 'CHOCOLATE',            subcat: 'Chocolate Wafer',      food: 'FOOD',     price: 7.00,   oh: 55,  sales: 38, status: 'Active' },
  { id: '000759', name: 'Oreo Original Choco Biscuits 176g',      vendor: 'MARINA RETAIL CO.LTD',              cat: 'WAFERS & BISCUITS',    subcat: 'Sandwich Cookies',     food: 'FOOD',     price: 12.00,  oh: 42,  sales: 28, status: 'Active' },
  { id: '000820', name: 'Onion White 1Kg',                        vendor: 'Agripak Logistics Limited',         cat: 'VEGETABLES',           subcat: 'Onion',                food: 'FOOD',     price: 5.00,   oh: 35,  sales: 28, status: 'Active' },
  { id: '000824', name: 'Apple Red 1Kg',                          vendor: 'FAD FM LTD',                        cat: 'FRUITS',               subcat: 'Apple Red',            food: 'FOOD',     price: 12.00,  oh: 28,  sales: 20, status: 'Active' },
  { id: '000831', name: 'Banana 1kg',                             vendor: 'New Agricultural Services Ltd',     cat: 'FRUITS',               subcat: 'Banana',               food: 'FOOD',     price: 8.00,   oh: 40,  sales: 35, status: 'Active' },
  { id: '000860', name: 'Coca-Cola Classic 300ml',                vendor: 'Coca Cola Bottling GH',             cat: 'SOFT DRINKS',          subcat: 'Cola Drinks',          food: 'FOOD',     price: 4.50,   oh: 120, sales: 95, status: 'Active' },
  { id: '000861', name: 'Fanta Cocktail 300ml',                   vendor: 'Coca Cola Bottling GH',             cat: 'SOFT DRINKS',          subcat: 'Fizzy Drinks',         food: 'FOOD',     price: 4.50,   oh: 95,  sales: 72, status: 'Active' },
  { id: '000864', name: 'Sprite Zero 300ml',                      vendor: 'Coca Cola Bottling GH',             cat: 'SOFT DRINKS',          subcat: 'Cola Drinks',          food: 'FOOD',     price: 4.50,   oh: 60,  sales: 45, status: 'Active' },
  { id: '000940', name: 'Milo Sachet 20g',                        vendor: 'Ceebotch Ventures Ltd.',            cat: 'AMERICAN COFFEE',      subcat: 'Instant Coffee Sachet', food: 'FOOD',    price: 3.00,   oh: 80,  sales: 65, status: 'Active' },
  { id: '000945', name: 'Nescafe Breakfast Cup 3 In 1 40g',      vendor: 'Ceebotch Ventures Ltd.',            cat: 'AMERICAN COFFEE',      subcat: 'Instant Coffee Sachet', food: 'FOOD',    price: 5.00,   oh: 50,  sales: 38, status: 'Active' },
  { id: '000953', name: 'Maggi Chicken Tablet 600g',              vendor: 'MARINA RETAIL CO.LTD',              cat: 'HERBS & SPICES',       subcat: 'Seasoning',            food: 'FOOD',     price: 14.00,  oh: 45,  sales: 35, status: 'Active' },
  { id: '000983', name: 'Oldenburger Full Fat Milk 1L',           vendor: 'MAC Sources Limited',               cat: 'MILK SUBSTITUTES',     subcat: 'UHT Milk',             food: 'FOOD',     price: 14.00,  oh: 30,  sales: 18, status: 'Active' },
];

// Attach 17-week history to every row
export const INVENTORY_DATA = RAW.map(r => ({
  ...r,
  weeks: fakeWeeks(r.sales, r.sales * 0.6),
}));

export const WEEK_LABELS = WEEKS;
