"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  description: string;
  brand: string;
  category: string;
  rating: number;
  discountPercentage: number;
}

interface ApiResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export default function InfiniteScrollProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [skip, setSkip] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const observer = useRef<IntersectionObserver | null>(null);

  // Fetch products function
  const fetchProducts = useCallback(async () => {
    if (loading) return; // Prevent duplicate requests
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://dummyjson.com/products?limit=10&skip=${skip}`
      );
      const data: ApiResponse = await res.json();

      if (data.products.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prev) => [...prev, ...data.products]);
        setSkip((prev) => prev + 10);
      }
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }, [loading, skip]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // IntersectionObserver to detect last element
  const lastProductRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchProducts();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchProducts]
  );

  const ProductCard = ({ product, isLast }: { product: Product; isLast: boolean }) => (
    <div
      ref={isLast ? lastProductRef : null}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
    >
      <div className="relative h-48 bg-gray-200">
        <Image
          src={product.thumbnail}
          alt={product.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-sm">
          ${product.price}
        </div>
        {product.discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-sm">
            {Math.round(product.discountPercentage)}% OFF
          </div>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
          {product.title}
        </h2>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {product.category}
          </span>
          <div className="flex items-center">
            <span className="text-sm text-yellow-500 mr-1">★</span>
            <span className="text-sm text-gray-600">{product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Infinite Product Gallery</h1>
          <div className="w-24"></div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              isLast={index === products.length - 1}
            />
          ))}
        </div>

        {loading && (
          <div className="flex justify-center items-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading more products...</span>
          </div>
        )}

        {!hasMore && products.length > 0 && (
          <div className="text-center mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-600">You&apos;ve reached the end! 🎉</p>
            <p className="text-sm text-gray-500">No more products to load</p>
          </div>
        )}
      </div>
    </div>
  );
}
