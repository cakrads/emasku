import { redirect } from 'next/navigation'
import { ROUTES } from '@/frontend/config/routes'

export default function Home() {
  redirect(ROUTES.DASHBOARD)
}
