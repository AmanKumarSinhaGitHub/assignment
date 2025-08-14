"use client";
import { useState, ChangeEvent } from "react";
import Link from "next/link";

interface RomanMapping {
  value: number;
  numeral: string;
}

export default function NumToRoman() {
  const [number, setNumber] = useState<string>("");
  const [roman, setRoman] = useState<string>("");
  const [error, setError] = useState<string>("");

  const romanMap: RomanMapping[] = [
    { value: 100, numeral: "C" },
    { value: 90, numeral: "XC" },
    { value: 50, numeral: "L" },
    { value: 40, numeral: "XL" },
    { value: 10, numeral: "X" },
    { value: 9, numeral: "IX" },
    { value: 5, numeral: "V" },
    { value: 4, numeral: "IV" },
    { value: 1, numeral: "I" },
  ];

  const convertToRoman = (num: number): string => {
    if (num < 1 || num > 100) {
      setError("Please enter a number between 1 and 100");
      return "";
    }

    setError("");
    let result = "";
    let remaining = num;

    for (const { value, numeral } of romanMap) {
      while (remaining >= value) {
        result += numeral;
        remaining -= value;
      }
    }
    return result;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setNumber(value);
    if (value === "") {
      setRoman("");
      setError("");
    }
  };

  const handleConvert = (): void => {
    const num = parseInt(number, 10);
    if (isNaN(num)) {
      setError("Please enter a valid number");
      setRoman("");
      return;
    }
    const result = convertToRoman(num);
    setRoman(result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center mb-8 text-blue-600 hover:text-blue-800 transition-colors duration-200"
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

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">
              Number to Roman Numeral Converter
            </h1>
            <p className="text-blue-100 mt-1">
              Convert any number between 1 and 100 into Roman numerals
            </p>
          </div>

          <div className="p-6">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter a Number
                </label>
                <input
                  id="number"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="Enter a number (1-100)"
                  value={number}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              <button
                onClick={handleConvert}
                className="cursor-pointer w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 font-medium"
              >
                Convert to Roman Numeral
              </button>

              {(roman || error) && (
                <div className="mt-6 p-4 rounded-lg border">
                  {error ? (
                    <p className="text-red-600 text-center font-medium">
                      ⚠️ {error}
                    </p>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-1">Result:</p>
                      <p className="text-3xl font-bold text-gray-800">
                        {roman}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {number} in Roman numerals
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
