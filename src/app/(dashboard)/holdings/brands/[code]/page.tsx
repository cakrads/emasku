import BrandCategoryView from '@/frontend/features/holdings-brand-category/brand-category-view'

export default async function Page({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  return <BrandCategoryView brandId={code} />
}
