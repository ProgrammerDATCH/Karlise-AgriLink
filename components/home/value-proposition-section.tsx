import { ShieldCheck, Truck, LineChart, DollarSign, Users, Leaf } from 'lucide-react'

export default function ValuePropositionSection() {
  const valueProps = [
    {
      icon: <ShieldCheck className="h-8 w-8 text-green-600" />,
      title: "Quality Assurance",
      description: "All products are verified at collection points ensuring consistent quality standards",
    },
    {
      icon: <LineChart className="h-8 w-8 text-green-600" />,
      title: "Market Intelligence",
      description: "Access real-time pricing information and market trends to make informed decisions",
    },
    {
      icon: <Truck className="h-8 w-8 text-green-600" />,
      title: "Efficient Distribution",
      description: "Streamlined logistics and delivery network to get products to market faster",
    },
    {
      icon: <DollarSign className="h-8 w-8 text-green-600" />,
      title: "Fair Pricing",
      description: "Transparent pricing model that ensures farmers receive fair compensation",
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Community Building",
      description: "Connect with a network of agricultural professionals across Rwanda",
    },
    {
      icon: <Leaf className="h-8 w-8 text-green-600" />,
      title: "Sustainable Practices",
      description: "Promoting environmentally-friendly and sustainable agricultural methods",
    },
  ]

  return (
    <section className="py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Why Choose AGRILINK Rwanda</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Creating value for all participants in Rwanda's agricultural ecosystem
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {valueProps.map((prop, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center space-y-2 rounded-lg border p-6 bg-white shadow-sm dark:bg-gray-950"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-900/20">
                {prop.icon}
              </div>
              <h3 className="text-xl font-bold">{prop.title}</h3>
              <p className="text-center text-gray-500 dark:text-gray-400">{prop.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}