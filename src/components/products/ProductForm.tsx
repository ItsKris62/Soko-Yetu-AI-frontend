'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { Product } from '../../types/product';
import { fetchCategories, fetchPredefinedProducts, fetchCounties, createProduct, uploadImage } from '../../utils/api';
import Button from '../common/Button';
import { useAuthStore } from '../../stores/authStore';

type ProductFormProps = {
  onSubmit: (data: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => void;
  onClose: () => void;
  initialData?: Product;
};

type FormData = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

export default function ProductForm({ onSubmit, onClose, initialData }: ProductFormProps) {
  const { user } = useAuthStore();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({ defaultValues: initialData });
  const [imagePreview, setImagePreview] = useState<string | undefined>(initialData?.image_url);
  const [categories, setCategories] = useState<{ id: number | string; name: string }[]>([]);
  const [predefinedProducts, setPredefinedProducts] = useState<{ id: number | string; name: string; category_id: number | string; category_name: string }[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<{ id: number | string; name: string; category_id: number | string; category_name: string }[]>([]);
  const [counties, setCounties] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedCategoryId = watch('category_id');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [fetchedCategories, fetchedProducts, fetchedCounties] = await Promise.all([
          fetchCategories(),
          fetchPredefinedProducts(),
          fetchCounties(),
        ]);
        setCategories(fetchedCategories);
        setPredefinedProducts(fetchedProducts);
        setCounties(fetchedCounties);
      } catch (err) {
        setError('Failed to load categories, products, or counties.');
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      const filtered = predefinedProducts.filter(p => p.category_id.toString() === selectedCategoryId.toString());
      setFilteredProducts(filtered);
      setValue('predefined_product_id', undefined); // Reset product selection when category changes
    } else {
      setFilteredProducts([]);
    }
  }, [selectedCategoryId, predefinedProducts, setValue]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadImage(file);
        setImagePreview(url);
        setValue('image_url', url);
      } catch (err) {
        setError('Failed to upload image.');
      }
    }
  };

  const onFormSubmit: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const productData: Omit<Product, 'id' | 'created_at' | 'updated_at'> = {
        ...data,
        farmer_id: user?.id || initialData?.farmer_id || 1,
        predefined_product_id: parseInt(data.predefined_product_id as any),
        category_id: parseInt(data.category_id as any),
        county_id: parseInt(data.county_id as any),
        country_id: 1, // Assuming Kenya
        ai_suggested_price: data.ai_suggested_price || 0,
        ai_quality_grade: data.ai_quality_grade || 0,
      } as Omit<Product, 'id' | 'created_at' | 'updated_at'>;
      await createProduct(productData);
      onSubmit(productData);
      onClose();
    } catch (err) {
      setError('Failed to save product.');
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">{initialData ? 'Edit Product' : 'Add Product'}</h2>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="mb-4">
          <label htmlFor="category_id" className="block text-gray-700 mb-1">Category</label>
          <select
            id="category_id"
            {...register('category_id', { required: 'Category is required' })}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
          {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id.message}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="predefined_product_id" className="block text-gray-700 mb-1">Product</label>
          <select
            id="predefined_product_id"
            {...register('predefined_product_id', { required: 'Product is required' })}
            className="w-full p-2 border border-gray-300 rounded"
            disabled={!selectedCategoryId}
          >
            <option value="">Select Product</option>
            {filteredProducts.map((product) => (
              <option key={product.id} value={product.id}>{product.name}</option>
            ))}
          </select>
          {errors.predefined_product_id && <p className="text-red-500 text-sm mt-1">{errors.predefined_product_id.message}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 mb-1">Description</label>
          <textarea
            id="description"
            {...register('description')}
            className="w-full p-2 border border-gray-300 rounded input-focus"
            rows={3}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 mb-1">Price (KSH)</label>
          <input
            id="price"
            type="number"
            step="0.01"
            {...register('price', { required: 'Price is required', min: { value: 0, message: 'Price must be positive' } })}
            className="w-full p-2 border border-gray-300 rounded input-focus"
          />
          {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="image_url" className="block text-gray-700 mb-1">Product Image</label>
          <input
            id="image_url"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded"
          />
          {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />}
          <input
            type="hidden"
            {...register('image_url', { required: 'Image is required' })}
          />
          {errors.image_url && <p className="text-red-500 text-sm mt-1">{errors.image_url.message}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="county_id" className="block text-gray-700 mb-1">County</label>
          <select
            id="county_id"
            {...register('county_id', { required: 'County is required' })}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select County</option>
            {counties.map((county) => (
              <option key={county.id} value={county.id}>{county.name}</option>
            ))}
          </select>
          {errors.county_id && <p className="text-red-500 text-sm mt-1">{errors.county_id.message}</p>}
        </div>
        <div className="flex gap-4">
          <Button
            type="submit"
            className="w-full bg-[#278783] hover:bg-[#1f6b67] text-white transition-colors"
            disabled={loading}
          >
            {loading ? 'Saving...' : initialData ? 'Update Product' : 'Add Product'}
          </Button>
          <Button
            onClick={onClose}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}