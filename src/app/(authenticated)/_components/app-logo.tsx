import Image from 'next/image'
import { useTheme } from 'next-themes'

export function AppLogo() {
  const { theme } = useTheme()
  return (
    <Image
      src={theme === 'light' ? '/logo.svg' : '/logo-dark.svg'}
      alt="Doutor Agenda"
      width={136}
      height={28}
    />
  )
}
