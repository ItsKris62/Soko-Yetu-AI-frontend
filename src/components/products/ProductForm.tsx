'use client';

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form';
import { Product } from '../../types/product';
import { fetchCategories, fetchCounties, createProduct, uploadImage } from '../../utils/api';
import Button from '../common/Button';

type ProductFormProps = {
  onSubmit: (data: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => void;
  onClose: () => void;
  initialData?: Product;
};

type FormData = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

export default function ProductForm({ onSubmit, onClose, initialData }: ProductFormProps) {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({ defaultValues: initialData });
  const [imagePreview, setImagePreview] = useState<string | undefined>(initialData?.image_url);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [counties, setCounties] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        const fetchedCounties = await fetchCounties();
        setCategories(fetchedCategories);
        setCounties(fetchedCounties);
      } catch {
        setError('Failed to load categories or counties.');
      }
    };
    loadData();
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onFormSubmit: SubmitHandler<FieldValues> = async (data) => {
    setLoading(true);
    setError(null);
    try {
      let image_url = initialData?.image_url;
      if (imageFile) {
        image_url = await uploadImage(imageFile);
      }

      const productData: Omit<Product, 'id' | 'created_at' | 'updated_at'> = {
        ...data,
        farmer_id: initialData?.farmer_id || 1, // Replace with actual farmer_id from auth store
        category_id: parseInt(data.category_id as any),
        county_id: parseInt(data.county_id as any),
        country_id: 1, // Assuming Kenya for now (fetch from user data)
        ai_suggested_price: data.ai_suggested_price || 0,
        ai_quality_grade: data.ai_quality_grade || '0',
        image_url,
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
          <label htmlFor="name" className="block text-gray-700 mb-1">Product Name</label>
          <input
            id="name"
            type="text"
            {...register('name', { required: 'Product name is required' })}
            className="w-full p-2 border border-gray-300 rounded input-focus"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
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
          <label htmlFor="category_id" className="block text-gray-700 mb-1">Category</label>
          <select
            id="category_id"
            {...register('category_id', { required: 'Category is required' })}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option key={category} value={index + 1}>{category}</option>
            ))}
          </select>
          {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id.message}</p>}
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