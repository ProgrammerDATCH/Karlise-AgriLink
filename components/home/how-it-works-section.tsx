import { UserPlus, ShoppingBag, TruckIcon, CheckCircle } from 'lucide-react'

export default function HowItWorksSection() {
  const steps = [
    {
      icon: <UserPlus className="h-12 w-12 text-green-600" />,
      title: "Create an Account",
      description: "Sign up as a farmer, buyer, processor, or supplier on the AGRILINK platform.",
      color: "bg-green-50 dark:bg-green-900/20",
    },
    {
      icon: <ShoppingBag className="h-12 w-12 text-yellow-600" />,
      title: "Buy or Sell Products",
      description: "List your agricultural products or browse the marketplace to make purchases.",
      color: "bg-yellow-50 dark:bg-yellow-900/20",
    },
    {
      icon: <TruckIcon className="h-12 w-12 text-blue-600" />,
      title: "Arrange Delivery",
      description: "Coordinate logistics through our network of trusted delivery partners.",
      color: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: <CheckCircle className="h-12 w-12 text-green-600" />,
      title: "Complete Transaction",
      description: "Receive payment for your products or confirm receipt of your purchase.",
      color: "bg-green-50 dark:bg-green-900/20",
    },
  ]

  return (
    <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-950/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How AGRILINK Works</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              A simple process to connect agricultural buyers and sellers
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-4">
              <div className={`flex h-24 w-24 items-center justify-center rounded-full ${step.color}`}>
                {step.icon}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-xl font-bold">{step.title}</span>
                </div>
                <p className="text-gray-500 dark:text-gray-400">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:flex items-center justify-center w-full h-0.5 bg-gray-200 dark:bg-gray-800 absolute translate-x-1/2 mt-12"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}