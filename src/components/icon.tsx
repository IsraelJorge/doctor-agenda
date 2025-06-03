import { DynamicIcon, IconName } from 'lucide-react/dynamic'
import { ComponentProps } from 'react'

type IconProps = ComponentProps<'svg'> & {
  name: IconName
}

export const Icon = (props: IconProps) => {
  return <DynamicIcon {...props} />
}
