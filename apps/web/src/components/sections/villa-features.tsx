interface Feature {
  icon: string
  label: string
}

interface VillaFeaturesProps {
  features: Array<Feature>
}

function VillaFeatures({ features }: VillaFeaturesProps) {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
      {features.map((feature, index) => (
        <div key={index} className="flex flex-col gap-3">
          <span className="text-secondary text-4xl">{feature.icon}</span>
          <span className="font-label text-sm font-semibold tracking-widest uppercase">
            {feature.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export default VillaFeatures
