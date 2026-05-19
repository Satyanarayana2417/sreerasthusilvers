import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  X,
  Loader2,
  Image as ImageIcon,
  Video,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import {
  createProduct,
  updateProduct,
  getProduct,
  generateSlug,
  Product,
} from '@/services/productService';
import {
  uploadToCloudinary,
  validateFile,
  UploadProgress,
} from '@/services/cloudinaryService';

const shopCategories = [
  'Top Deals',
  'Best Sellers',
  'Trend Products',
  'Jewellery',
  'Furniture',
  'Articles',
  'Other Products',
];

const specificCategories = [
  'Bracelets',
  'Necklaces',
  'Rings',
  'Jewelry',
];

const subcategoriesByCategory: Record<string, string[]> = {
  'Bracelets': ['Diamond', 'Gemstone', 'Pearl', 'Gold', 'Silver', 'Bangle'],
  'Necklaces': ['Diamond', 'Gemstone', 'Pearl', 'Gold', 'Silver', 'Cross'],
  'Rings': ['Diamond', 'Gemstone', 'Wedding', 'Engagement', 'Gold', 'Fashion'],
  'Jewelry': ['Men\'s Jewelry', 'Birthstone', 'Pearl', 'Rose Gold', 'New Arrivals', 'Sale'],
  'Jewellery': ['Necklaces', 'Rings', 'Bracelets', 'Anklets', 'Pendants', 'Earrings', 'Chains', 'Sets'],
  'Furniture': ['Silver Sofa Collection', 'Royal Silver Chairs', 'Royal Silver Tables', 'Antique Silver Décor', 'Silver Swing (Jhoola)'],
  'Articles': ['Silver Pooja Kalash Set', 'Silver Coconut', 'Silver Footwear', 'Silver Gopuram Idol Stand', 'Silver Camel Cart', 'Silver Jhula'],
  'Other Products': ['Silver Idols', 'Silver Pooja Items', 'Silver Gift Articles', 'Custom Engraved Items', 'Silver Coins', 'Limited Edition Pieces'],
};

const ProductForm = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(isEditing);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [imageUploadMode, setImageUploadMode] = useState<'upload' | 'url'>('upload');
  const [videoUploadMode, setVideoUploadMode] = useState<'upload' | 'url'>('upload');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subcategory: '',
    description: '',
    tags: '',
    price: '',
    originalPrice: '',
    discount: '',
    rating: '',
    reviewCount: '',
    stock: '',
    weight: '',
    material: '',
    purity: '',
    dimensions: '',
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
  });

  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<string>('');

  // Fetch product if editing
  useEffect(() => {
    if (isEditing && id) {
      fetchProductData();
    }
  }, [id]);

  const fetchProductData = async () => {
    try {
      const product = await getProduct(id!);
      if (product) {
        setFormData({
          name: product.name,
          category: product.category,
          subcategory: product.subcategory || '',
          description: product.description,
          tags: '',
          price: product.price.toString(),
          originalPrice: product.originalPrice?.toString() || '',
          discount: product.discount?.toString() || '',
          rating: product.rating?.toString() || '',
          reviewCount: product.reviewCount?.toString() || '',
          stock: product.inventory?.stock?.toString() || '',
          weight: product.inventory?.weight || '',
          material: product.specifications?.material || '',
          purity: product.specifications?.purity || '',
          dimensions: product.specifications?.dimensions || '',
          isActive: product.flags?.isActive ?? true,
          isFeatured: product.flags?.isFeatured ?? false,
          isNewArrival: product.flags?.isNewArrival ?? false,
          isBestSeller: product.flags?.isBestSeller ?? false,
        });
        setImages(product.media?.images || []);
        setVideos(product.media?.videos || []);
        setThumbnail(product.media?.thumbnail || '');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch product details',
        variant: 'destructive',
      });
    } finally {
      setFetchingProduct(false);
    }
  };

  // Auto-toggle flags when Best Sellers or Trend Products category is selected
  useEffect(() => {
    if (formData.category === 'Best Sellers') {
      setFormData((prev) => ({ ...prev, isBestSeller: true }));
    } else if (formData.category === 'Trend Products') {
      setFormData((prev) => ({ ...prev, isNewArrival: true }));
    }
  }, [formData.category]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    setUploadProgress(0);

    try {
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file
        const validation = validateFile(file, {
          maxSizeMB: 10,
          allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
        });
        
        if (!validation.valid) {
          toast({
            title: 'Invalid File',
            description: validation.error,
            variant: 'destructive',
          });
          continue;
        }

        const result = await uploadToCloudinary(file, (progress: UploadProgress) => {
          setUploadProgress(
            Math.round(((i + progress.percentage / 100) / files.length) * 100)
          );
        });

        uploadedUrls.push(result.secure_url);
      }

      setImages((prev) => [...prev, ...uploadedUrls]);
      
      // Set first image as thumbnail if not set
      if (!thumbnail && uploadedUrls.length > 0) {
        setThumbnail(uploadedUrls[0]);
      }

      toast({
        title: 'Success',
        description: `${uploadedUrls.length} image(s) uploaded successfully`,
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload images',
        variant: 'destructive',
      });
    } finally {
      setUploadingImages(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveImage = (url: string) => {
    setImages((prev) => prev.filter((img) => img !== url));
    if (thumbnail === url) {
      setThumbnail(images.find((img) => img !== url) || '');
    }
  };

  const handleSetThumbnail = (url: string) => {
    setThumbnail(url);
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    
    // Basic URL validation
    try {
      new URL(imageUrlInput);
      setImages((prev) => [...prev, imageUrlInput]);
      if (!thumbnail) {
        setThumbnail(imageUrlInput);
      }
      setImageUrlInput('');
      toast({
        title: 'Success',
        description: 'Image URL added successfully',
      });
    } catch (error) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid URL',
        variant: 'destructive',
      });
    }
  };

  const handleAddVideoUrl = () => {
    if (!videoUrlInput.trim()) return;
    
    // Basic URL validation
    try {
      new URL(videoUrlInput);
      setVideos((prev) => [...prev, videoUrlInput]);
      setVideoUrlInput('');
      toast({
        title: 'Success',
        description: 'Video URL added successfully',
      });
    } catch (error) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid video URL',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.category || !formData.price) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please upload at least one product image',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'> = {
        name: formData.name,
        slug: generateSlug(formData.name),
        category: formData.category,
        subcategory: formData.subcategory,
        description: formData.description,
        price: parseFloat(formData.price),
        ...(formData.originalPrice && { originalPrice: parseFloat(formData.originalPrice) }),
        ...(formData.discount && { discount: parseFloat(formData.discount) }),
        ...(formData.rating && { rating: parseFloat(formData.rating) }),
        ...(formData.reviewCount && { reviewCount: parseFloat(formData.reviewCount) }),
        currency: 'INR',
        media: {
          images,
          videos,
          thumbnail: thumbnail || images[0],
        },
        inventory: {
          stock: parseInt(formData.stock) || 0,
          sku: '', // Auto-generated in backend
          weight: formData.weight,
        },
        specifications: {
          material: formData.material,
          purity: formData.purity,
          dimensions: formData.dimensions,
        },
        flags: {
          isActive: formData.isActive,
          isFeatured: formData.isFeatured,
          isNewArrival: formData.isNewArrival,
          isBestSeller: formData.isBestSeller,
        },
      } as any;

      console.log('ProductForm: Saving product with data:', productData);

      if (isEditing) {
        await updateProduct(id!, productData);
        toast({
          title: 'Success',
          description: 'Product updated successfully',
        });
      } else {
        const newProductId = await createProduct(productData, user!.uid);
        console.log('ProductForm: Product created with ID:', newProductId);
        toast({
          title: 'Success',
          description: 'Product created successfully',
        });
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('ProductForm: Error saving product:', error);
      toast({
        title: 'Error',
        description: `Failed to ${isEditing ? 'update' : 'create'} product`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchingProduct) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/admin/products')}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing
              ? 'Update details for your existing product'
              : 'Add a new product to your catalog'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      name="category"
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, category: value, subcategory: '' }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {shopCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                        <hr className="my-2" />
                        {specificCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Select
                      name="subcategory"
                      value={formData.subcategory}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, subcategory: value }))
                      }
                      disabled={!subcategoriesByCategory[formData.category]}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category first" />
                      </SelectTrigger>
                      <SelectContent>
                        {(subcategoriesByCategory[formData.category] || []).map((sub) => (
                          <SelectItem key={sub} value={sub}>
                            {sub}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter product description"
                    rows={5}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Image Upload */}
                <div>
                  <Label>Images</Label>
                  <div className="flex gap-2 mb-2">
                    <Button
                      type="button"
                      variant={imageUploadMode === 'upload' ? 'secondary' : 'ghost'}
                      onClick={() => setImageUploadMode('upload')}
                    >
                      Upload Files
                    </Button>
                    <Button
                      type="button"
                      variant={imageUploadMode === 'url' ? 'secondary' : 'ghost'}
                      onClick={() => setImageUploadMode('url')}
                    >
                      Add from URL
                    </Button>
                  </div>

                  {imageUploadMode === 'upload' ? (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Drag & drop files here, or click to select files
                      </p>
                      <Input
                        id="image-upload"
                        type="file"
                        multiple
                        onChange={handleImageUpload}
                        className="sr-only"
                        accept="image/jpeg,image/png,image/webp"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4"
                        onClick={() => document.getElementById('image-upload')?.click()}
                        disabled={uploadingImages}
                      >
                        {uploadingImages ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Uploading... ({uploadProgress}%)
                          </>
                        ) : (
                          'Select Files'
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                      <Button type="button" onClick={handleAddImageUrl}>
                        Add
                      </Button>
                    </div>
                  )}

                  {images.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                      {images.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Product image ${index + 1}`}
                            className={`w-full h-24 object-cover rounded-lg border-2 ${
                              thumbnail === url ? 'border-amber-600' : 'border-transparent'
                            }`}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-white"
                              onClick={() => handleSetThumbnail(url)}
                              title="Set as thumbnail"
                            >
                              <ImageIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-white"
                              onClick={() => handleRemoveImage(url)}
                              title="Remove image"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Video Upload */}
                <div>
                  <Label>Videos</Label>
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      value={videoUrlInput}
                      onChange={(e) => setVideoUrlInput(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                    <Button type="button" onClick={handleAddVideoUrl}>
                      Add
                    </Button>
                  </div>
                  {videos.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {videos.map((url, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-gray-500" />
                          <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 truncate">
                            {url}
                          </a>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setVideos(prev => prev.filter(v => v !== url))}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g., 199.99"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice">Original Price</Label>
                  <Input
                    id="originalPrice"
                    name="originalPrice"
                    type="number"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    placeholder="e.g., 249.99"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inventory & Specifications</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="e.g., 100"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="e.g., 250g"
                  />
                </div>
                <div>
                  <Label htmlFor="material">Material</Label>
                  <Input
                    id="material"
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                    placeholder="e.g., 925 Sterling Silver"
                  />
                </div>
                <div>
                  <Label htmlFor="purity">Purity</Label>
                  <Input
                    id="purity"
                    name="purity"
                    value={formData.purity}
                    onChange={handleInputChange}
                    placeholder="e.g., 92.5%"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    name="dimensions"
                    value={formData.dimensions}
                    onChange={handleInputChange}
                    placeholder="e.g., 10cm x 5cm x 2cm"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isActive">Active</Label>
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isActive: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="isFeatured">Featured</Label>
                  <Switch
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isFeatured: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="isNewArrival">New Arrival</Label>
                  <Switch
                    id="isNewArrival"
                    checked={formData.isNewArrival}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isNewArrival: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="isBestSeller">Best Seller</Label>
                  <Switch
                    id="isBestSeller"
                    checked={formData.isBestSeller}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isBestSeller: checked }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full bg-amber-600 hover:bg-amber-700"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                isEditing ? 'Save Changes' : 'Create Product'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
