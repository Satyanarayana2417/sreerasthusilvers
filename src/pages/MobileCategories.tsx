import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import MobileBottomNav from '@/components/MobileBottomNav';
import { getAllProducts, Product } from '@/services/productService';
import logo from '@/assets/logo-new.png';
import heroJewelry from '@/assets/hero-jewelry.jpg';
import heroSilverJewelry from '@/assets/hero-silver-jewelry.png';
import collectionBanner from '@/assets/collection-banner.jpg';
import handmadeCrafting from '@/assets/handmade-crafting.jpg';
import handmadeSection from '@/assets/handmade-section.jpg';
import promoSection from '@/assets/promo-section.jpg';
import shoppingBags from '@/assets/shopping-bags.png';
import silversofa from '@/assets/silversofa.png';
import promoNecklace from '@/assets/promo-necklace.jpg';
import promoHeart from '@/assets/promo-heart.jpg';
import ring1 from '@/assets/products/ring-1.jpg';
import ring4 from '@/assets/products/ring-4.jpg';
import necklace1 from '@/assets/products/necklace-1.jpg';
import necklace2 from '@/assets/products/necklace-2.jpg';
import earrings1 from '@/assets/products/earrings-1.jpg';
import band1 from '@/assets/products/band-1.jpg';
import set1 from '@/assets/products/set-1.jpg';
import categoryUnique from '@/assets/categories/unique.jpg';
import categoryTide from '@/assets/categories/tide.jpg';
import categoryOrganic from '@/assets/categories/organic.jpg';
import categoryIcons from '@/assets/categories/icons.jpg';

type Subcategory = {
  name: string;
  image: string;
  path: string;
};

type MainCategory = {
  id: string;
  name: string;
  image: string;
  subcategories: Subcategory[];
};

const mainCategories: MainCategory[] = [
  {
    id: 'jewelry',
    name: 'Jewelry',
    image: heroJewelry,
    subcategories: [
      { name: 'Silver Rings', image: ring1, path: '/rings' },
      { name: 'Silver Chains', image: necklace1, path: '/necklaces' },
      { name: 'Silver Earrings', image: earrings1, path: '/earrings' },
      { name: 'Silver Bangles', image: band1, path: '/bracelets' },
      { name: 'Silver Necklaces', image: necklace2, path: '/necklaces' },
      { name: 'Silver Pendants', image: promoNecklace, path: '/pendants' },
      { name: 'Silver Anklets', image: promoHeart, path: '/anklets' },
      { name: 'Silver Bracelets', image: ring4, path: '/bracelets' },
      { name: 'Temple Jewelry', image: set1, path: '/jewelry' },
    ],
  },
  {
    id: 'furniture',
    name: 'Furniture',
    image: silversofa,
    subcategories: [
      { name: 'Silver Chairs', image: silversofa, path: '/furniture/royal-silver-chairs' },
      { name: 'Silver Tables', image: collectionBanner, path: '/furniture/royal-silver-tables' },
      { name: 'Silver Swings', image: handmadeSection, path: '/furniture/silver-swing-jhoola' },
      { name: 'Silver Cradles', image: handmadeCrafting, path: '/furniture/silver-cradles' },
      { name: 'Silver Thrones', image: promoSection, path: '/furniture/silver-thrones' },
      { name: 'Decorative Items', image: categoryUnique, path: '/furniture/antique-silver-decor' },
    ],
  },
  {
    id: 'articles',
    name: 'Articles',
    image: categoryIcons,
    subcategories: [
      { name: 'Pooja Items', image: categoryIcons, path: '/articles/silver-pooja-items' },
      { name: 'Gift Articles', image: shoppingBags, path: '/articles/gift-articles' },
      { name: 'Silver Lamps', image: categoryTide, path: '/articles/silver-lamps' },
      { name: 'Silver Plates', image: categoryOrganic, path: '/articles/silver-plates' },
      { name: 'Silver Idols', image: handmadeCrafting, path: '/articles/silver-idols' },
      { name: 'Silver Vessels', image: collectionBanner, path: '/articles/silver-vessels' },
    ],
  },
  {
    id: 'other',
    name: 'Other Products',
    image: heroSilverJewelry,
    subcategories: [
      { name: 'Silver Coins', image: heroSilverJewelry, path: '/other-products/silver-coins' },
      { name: 'Silver Bars', image: heroSilverJewelry, path: '/other-products/silver-bars' },
      { name: 'Silver Utensils', image: categoryOrganic, path: '/other-products/silver-utensils' },
      { name: 'Baby Items', image: categoryTide, path: '/other-products/baby-items' },
      { name: 'Antique Silver', image: categoryUnique, path: '/other-products/antique-silver' },
      { name: 'Custom Orders', image: handmadeCrafting, path: '/other-products/custom-orders' },
    ],
  },
  {
    id: 'decor',
    name: 'Home Decor',
    image: collectionBanner,
    subcategories: [
      { name: 'Wall Decor', image: collectionBanner, path: '/home-decor/silver-wall-decor' },
      { name: 'Photo Frames', image: promoSection, path: '/home-decor/silver-photo-frames' },
      { name: 'Showpieces', image: handmadeSection, path: '/home-decor/silver-showpieces' },
      { name: 'Candle Stands', image: categoryIcons, path: '/home-decor/silver-candle-stands' },
      { name: 'Flower Vases', image: categoryOrganic, path: '/home-decor/silver-flower-vases' },
    ],
  },
  {
    id: 'gifts',
    name: 'Gifts',
    image: shoppingBags,
    subcategories: [
      { name: 'Wedding Gifts', image: shoppingBags, path: '/gifts/wedding' },
      { name: 'Birthday Gifts', image: promoHeart, path: '/gifts/birthday' },
      { name: 'Festival Gifts', image: set1, path: '/gifts/festival' },
      { name: 'Corporate Gifts', image: handmadeCrafting, path: '/gifts/corporate' },
      { name: 'Return Gifts', image: collectionBanner, path: '/gifts/return' },
    ],
  },
];

const normalize = (value: string) => value.toLowerCase().replace(/^silver\s+/, '');

const MobileCategories = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<MainCategory>(() => {
    const savedId = sessionStorage.getItem('selectedCategoryId');
    return mainCategories.find((category) => category.id === savedId) || mainCategories[0];
  });
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    sessionStorage.setItem('selectedCategoryId', selectedCategory.id);
  }, [selectedCategory]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await getAllProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      }
    };

    loadProducts();
  }, []);

  const getSubcategoryImage = (subcategory: Subcategory) => {
    const subcategoryName = normalize(subcategory.name);
    const product = products.find((item) => {
      const productName = normalize(item.name || '');
      const productSubcategory = normalize(item.subcategory || '');

      return productName.includes(subcategoryName) || productSubcategory.includes(subcategoryName);
    });

    return product?.media?.thumbnail || product?.media?.images?.[0] || subcategory.image;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="sticky top-0 bg-white z-40 px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="p-1"
            aria-label="Back to home"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Top Categories</h1>
        </div>
        <img
          src={logo}
          alt="Sreerasthu Silvers"
          className="h-6 w-auto"
        />
      </div>

      <div className="flex">
        <div className="w-20 bg-white border-r border-gray-100 min-h-[calc(100vh-120px)]">
          {mainCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category)}
              className={`w-full py-3 px-2 flex flex-col items-center gap-1 transition-all ${
                selectedCategory.id === category.id
                  ? 'bg-red-50'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className={`w-12 h-12 rounded-full overflow-hidden border-2 bg-gray-100 ${
                selectedCategory.id === category.id
                  ? 'border-red-500'
                  : 'border-gray-200'
              }`}>
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = heroJewelry;
                  }}
                />
              </div>
              <span className={`text-[10px] text-center leading-tight font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-full ${
                selectedCategory.id === category.id
                  ? 'text-red-600'
                  : 'text-gray-600'
              }`}>
                {category.name.length > 10 ? `${category.name.slice(0, 10)}...` : category.name}
              </span>
            </button>
          ))}
        </div>

        <div className="flex-1 p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{selectedCategory.name}</h2>

          <div className="grid grid-cols-3 gap-3">
            {selectedCategory.subcategories.map((subcategory, index) => (
              <motion.button
                key={subcategory.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(subcategory.path)}
                className="flex flex-col items-center"
              >
                <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 mb-2 shadow-sm">
                  <img
                    src={getSubcategoryImage(subcategory)}
                    alt={subcategory.name}
                    className="w-full h-full object-cover"
                    onError={(event) => {
                      event.currentTarget.src = subcategory.image;
                    }}
                  />
                </div>
                <span className="text-xs text-gray-700 text-center font-medium truncate w-full">
                  {subcategory.name.length > 12 ? `${subcategory.name.slice(0, 12)}...` : subcategory.name}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <MobileBottomNav />
    </div>
  );
};

export default MobileCategories;
