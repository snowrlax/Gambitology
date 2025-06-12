import {
    Zap,
    Smartphone,
    Palette,
    Code,
    Search,
    TrendingUp,
    LifeBuoy,
    Shield,
    Cpu,
    type LucideIcon,
  } from "lucide-react"
  
  interface FeatureCardProps {
    title: string
    description: string
    icon: string
  }
  
  export default function FeatureCard({ title, description, icon }: FeatureCardProps) {
    const iconMap: Record<string, LucideIcon> = {
      zap: Zap,
      smartphone: Smartphone,
      palette: Palette,
      code: Code,
      search: Search,
      "trending-up": TrendingUp,
      "life-buoy": LifeBuoy,
      shield: Shield,
      cpu: Cpu,
    }
  
    const IconComponent = iconMap[icon] || Zap
  
    return (
      <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <div className="card-body">
          <div className="flex items-center mb-4">
            <div className="p-3 rounded-lg bg-primary bg-opacity-10">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h3 className="card-title">{title}</h3>
          <p>{description}</p>
        </div>
      </div>
    )
  }
  