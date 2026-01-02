import { Button } from '@/frontend/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Stack } from '@/frontend/components/ui/layout'

interface AddHoldingButtonProps {
  onClick?: () => void
}

export default function AddHoldingButton({ onClick }: AddHoldingButtonProps) {
  return (
    <Stack className="fixed bottom-6 right-6 z-50">
      <Link href="/add-holding">
        <Button
          onClick={onClick}
          size="icon"
          className="h-16 w-16 rounded-full bg-accent-gold shadow-lg hover:scale-105 hover:bg-accent-gold/90 active:scale-95 transition-all cursor-pointer border-none"
          aria-label="Add Gold Holding"
        >
          <Plus className="h-8 w-8 text-white" strokeWidth={2.5} />
        </Button>
      </Link>
    </Stack>
  )
}
