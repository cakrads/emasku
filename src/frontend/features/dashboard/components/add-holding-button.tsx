import { Button } from '@/frontend/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Stack } from '@/frontend/components/ui/layout'
import { ROUTES } from '@/frontend/config/routes'
import { useLanguage } from '@/frontend/hooks/use-language'

interface AddHoldingButtonProps {
  onClick?: () => void
}

export default function AddHoldingButton({ onClick }: AddHoldingButtonProps) {
  const { t } = useLanguage()
  return (
    <Stack className="hidden md:flex fixed bottom-6 right-6 z-50">
      <Link href={ROUTES.ADD_HOLDING}>
        <Button
          onClick={onClick}
          size="icon"
          color="primary"
          rounded="full"
          className="h-16 w-16"
          aria-label={t('dashboard.addGoldHolding')}
        >
          <Plus className="h-8 w-8 text-white" strokeWidth={2.5} />
        </Button>
      </Link>
    </Stack>
  )
}
