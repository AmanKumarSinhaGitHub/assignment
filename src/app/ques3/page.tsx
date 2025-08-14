"use client";
import { useState, useEffect, useCallback, ChangeEvent } from "react";
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
}

interface SearchResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

type DebouncedFunction<T> = (...args: T[]) => void;

function debounce<T>(func: DebouncedFunction<T>, delay: number): DebouncedFunction<T> {
  let timer: NodeJS.Timeout;
  return (...args: T[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

export default function SearchPage() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchResults = async (searchTerm: string): Promise<void> => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://dummyjson.com/products/search?q=${encodeURIComponent(searchTerm)}`
      );
      const data: SearchResponse = await res.json();
      setResults(data.products || []);
    } catch (error) {
      setError("Failed to fetch results. Please try again.");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Memoize the debounced function
  const debouncedFetch = useCallback(debounce<string>(fetchResults, 1000), []);

  useEffect(() => {
    debouncedFetch(query);
  }, [query, debouncedFetch]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setQuery(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
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
          <h1 className="text-3xl font-bold text-gray-900">Smart Product Search</h1>
          <div className="w-24"></div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Start typing to search products..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>

          {loading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Searching...</span>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="mt-4">
              <div className="bg-gray-50 px-4 py-2 rounded-t-lg border-b border-gray-200">
                <p className="text-sm text-gray-600">
                  Found {results.length} results
                </p>
              </div>
              <ul className="divide-y divide-gray-200">
                {results.map((product) => (
                  <li
                    key={product.id}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                  >
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {product.title}
                      </h3>
                      <p className="text-sm text-gray-500 truncate">
                        {product.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                          {product.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {product.brand}
                        </span>
                      </div>
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      ${product.price}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {query && !loading && results.length === 0 && (
            <div className="mt-4 text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No products found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
