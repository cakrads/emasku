import BrandCategoryView from '@/frontend/features/brand-category/brand-category-view'

export default async function Page({ params }: { params: Promise<{ brandId: string }> }) {
  const { brandId } = await params
  return <BrandCategoryView brandId={brandId} />
}
