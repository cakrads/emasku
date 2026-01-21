import { PrivacyView } from '@/frontend/features/public/privacy/privacy-view'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi | Emasku',
  description: 'Kebijakan privasi dan perlindungan data pribadi pengguna Emasku sesuai UU PDP.',
}

export default function PrivacyPolicyPage() {
  return <PrivacyView />
}
