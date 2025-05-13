'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Product } from '../../types/product';
import Button from '../common/Button';
import Modal from '../common/Modal';

type ProductFormProps = {
  onSubmit: (data: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => void;
  onClose: () => void;
  initialData?: Product;
};

type FormData = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

export default function ProductForm({ onSubmit, onClose, initialData }: ProductFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ defaultValues: initialData });
  const [imagePreview, setImagePreview] = useState<string | undefined>(initialData?.image_url);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const onFormSubmit: SubmitHandler<FormData> = (data) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
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
        </div>
        <div className="mb-4">
          <label htmlFor="category_name" className="block text-gray-700 mb-1">Category</label>
          <select
            id="category_name"
            {...register('category_name', { required: 'Category is required' })}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Category</option>
            <option value="Cereals">Cereals</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Legumes">Legumes</option>
            <option value="Tubers">Tubers</option>
          </select>
          {errors.category_name && <p className="text-red-500 text-sm mt-1">{errors.category_name.message}</p>}
        </div>
        <div className="mb-4">
          <label htmlFor="county_name" className="block text-gray-700 mb-1">County</label>
          <select
            id="county_name"
            {...register('county_name', { required: 'County is required' })}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select County</option>
            <option value="Nakuru County">Nakuru County</option>
            <option value="Kiambu County">Kiambu County</option>
            <option value="Murang’a County">Murang’a County</option>
            <option value="Machakos County">Machakos County</option>
            <option value="Nyandarua County">Nyandarua County</option>
            <option value="Nairobi County">Nairobi County</option>
          </select>
          {errors.county_name && <p className="text-red-500 text-sm mt-1">{errors.county_name.message}</p>}
        </div>
        <Button
          type="submit"
          className="w-full bg-[#278783] hover:bg-[#1f6b67] text-white transition-colors"
        >
          {initialData ? 'Update Product' : 'Add Product'}
        </Button>
      </form>
    </Modal>
  );
}