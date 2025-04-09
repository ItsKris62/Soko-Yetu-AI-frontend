import { fetchProductsSSR } from '@/lib/api'
import MarketGrid from './components/MarketGrid'

export default async function MarketPage() {
  const products = await fetchProductsSSR({}) // SSR fetch

  return (
    <section className="py-12 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
      <MarketGrid initialData={products} />
    </section>
  )
}
