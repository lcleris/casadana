interface Feature {
  icon: string
  label: string
}

interface VillaFeaturesProps {
  features: Array<Feature>
}

function VillaFeatures({ features }: VillaFeaturesProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8">
      {features.map((feature, index) => (
        <div key={index} className="flex flex-col gap-3">
          <span className="text-secondary text-4xl">{feature.icon}</span>
          <span className="text-sm font-label uppercase tracking-widest font-semibold">
            {feature.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export default VillaFeatures
