import * as Icons from "lucide-react"
import React from "react"

interface IconProps {
  name: keyof typeof Icons
  size?: number
  className?: string
}

const Icon: React.FC<IconProps> = ({ name, size = 24, className = "" }) => {
  const IconComponent = Icons[name] as React.ComponentType<{
    size?: number
    className?: string
  }>

  if (!IconComponent) {
    return null
  }

  return <IconComponent size={size} className={className} />
}

export default Icon
