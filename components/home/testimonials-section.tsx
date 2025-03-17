import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious 
} from '@/components/ui/carousel'
import { Star } from 'lucide-react'

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Jean Mugabo",
      role: "Coffee Farmer, Rubavu",
      image: "/images/testimonials/farmer1.jpg",
      content: "Since joining AGRILINK Rwanda, I've been able to sell my coffee beans directly to exporters and get better prices. The platform has transformed my business and increased my income by 35%.",
      rating: 5,
    },
    {
      id: 2,
      name: "Marie Uwimana",
      role: "Restaurant Owner, Kigali",
      image: "/images/testimonials/buyer1.jpg",
      content: "AGRILINK allows me to source fresh vegetables directly from farmers for my restaurant. The quality is consistent, and I can plan my purchases in advance with confidence.",
      rating: 5,
    },
    {
      id: 3,
      name: "Emmanuel Niyonkuru",
      role: "Dairy Cooperative Manager, Nyabihu",
      image: "/images/testimonials/cooperative1.jpg",
      content: "Our dairy cooperative has expanded its reach beyond local markets. We now supply hotels in Kigali and even export to neighboring countries, all through AGRILINK's platform.",
      rating: 4,
    },
    {
      id: 4,
      name: "Alice Mukamana",
      role: "Fruit Processor, Musanze",
      image: "/images/testimonials/processor1.jpg",
      content: "Finding consistent suppliers for our juice processing business was always a challenge. With AGRILINK, we can source fruits of specific varieties and quality, ensuring our products meet standards.",
      rating: 5,
    },
  ]

  return (
    <section className="py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Users Say</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Hear from farmers, buyers, and businesses using AGRILINK Rwanda
            </p>
          </div>
        </div>
        <div className="mx-auto max-w-5xl mt-12">
          <Carousel className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial) => (
                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/2 p-4">
                  <Card className="h-full">
                    <CardContent className="flex flex-col p-6 h-full">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative h-12 w-12 overflow-hidden rounded-full">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold">{testimonial.name}</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                        </div>
                      </div>
                      <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < testimonial.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <blockquote className="flex-1 italic text-gray-600 dark:text-gray-300">
                        "{testimonial.content}"
                      </blockquote>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-4">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  )
}