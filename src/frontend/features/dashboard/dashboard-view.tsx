'use client'

import React from 'react';
import { usePortfolio } from '../portfolio/hooks';
import Card from '../../components/card';

export default function DashboardView() {
  const { data: portfolio, isLoading, error } = usePortfolio();

  if (isLoading) return <div className="p-8">Loading portfolio...</div>;
  if (error) return <div className="p-8 text-red-500">Error loading portfolio</div>;

  const totalWeight = portfolio?.reduce((acc: number, asset: any) => acc + Number(asset.weight), 0) || 0;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Portfolio Overview</h1>
        <p className="text-gray-500">Track your gold holdings and performance.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="Total Holdings">
          <div className="text-4xl font-bold text-yellow-600">{totalWeight.toFixed(2)} g</div>
          <p className="text-sm text-gray-500 mt-1">Physical gold weight</p>
        </Card>

        <Card title="Current Value">
          <div className="text-4xl font-bold text-gray-900">Rp --</div>
          <p className="text-sm text-gray-500 mt-1">Based on latest market price</p>
        </Card>

        <Card title="Profit / Loss">
          <div className="text-4xl font-bold text-green-600">Rp --</div>
          <p className="text-sm text-green-600 mt-1">+ --%</p>
        </Card>
      </div>

      <Card title="Recent Holdings">
        {portfolio?.length === 0 ? (
          <p className="text-gray-500 py-4 text-center">No gold holdings found. Add your first gold asset!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 font-semibold text-gray-600">Brand</th>
                  <th className="py-4 font-semibold text-gray-600">Weight</th>
                  <th className="py-4 font-semibold text-gray-600">Buy Price</th>
                  <th className="py-4 font-semibold text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {portfolio?.map((asset: any) => (
                  <tr key={asset.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 text-gray-800 font-medium">{asset.brand}</td>
                    <td className="py-4 text-gray-800">{asset.weight} g</td>
                    <td className="py-4 text-gray-800">Rp {Number(asset.buyPricePerGram).toLocaleString()}</td>
                    <td className="py-4 text-gray-500 text-sm">
                      {new Date(asset.buyDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
