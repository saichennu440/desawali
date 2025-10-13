import React from 'react'
import { Award, Heart, Leaf, Truck, Users, Clock } from 'lucide-react'

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-cream-100 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg')] bg-cover bg-center opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                  Our Story of <span className="text-primary-600">Tradition</span> & <span className="text-seafood-600">Freshness</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Since 2010, Desawali has been bringing authentic flavors from traditional kitchens 
                  and fresh coastal catches directly to your doorstep. We believe in preserving 
                  culinary heritage while ensuring the highest quality standards.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-primary-600 mb-2">14+</div>
                  <div className="text-gray-600">Years of Experience</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-seafood-600 mb-2">5000+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg"
                alt="Traditional pickle making"
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full">
                <Heart className="h-8 w-8 text-primary-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                To preserve and share the authentic taste of traditional Indian pickles and provide 
                the freshest seafood from coastal waters. We're committed to supporting local 
                communities while delivering exceptional quality products that bring families 
                together around the dinner table.
              </p>
            </div>

            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-seafood-100 rounded-full">
                <Award className="h-8 w-8 text-seafood-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                To become India's most trusted brand for premium pickles and fresh seafood, 
                while maintaining our commitment to traditional recipes, sustainable practices, 
                and customer satisfaction. We envision a future where authentic flavors are 
                accessible to every household across the country.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do, from sourcing ingredients to delivering your order
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                <Heart className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quality First</h3>
              <p className="text-gray-600">
                We never compromise on quality. Every product is carefully selected and tested 
                to meet our stringent standards before reaching your kitchen.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-seafood-100 rounded-full mb-6">
                <Leaf className="h-8 w-8 text-seafood-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Sustainability</h3>
              <p className="text-gray-600">
                We're committed to sustainable practices, from eco-friendly packaging to 
                supporting local fishermen and farmers in their sustainable practices.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Community</h3>
              <p className="text-gray-600">
                We support local communities by sourcing directly from farmers and fishermen, 
                ensuring fair prices and building long-term partnerships.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-6">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Authenticity</h3>
              <p className="text-gray-600">
                Our recipes are passed down through generations, preserving the authentic taste 
                and traditional methods that make our products special.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <Truck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Reliability</h3>
              <p className="text-gray-600">
                Count on us for consistent quality and timely delivery. We understand the importance 
                of fresh ingredients in your daily cooking.
              </p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Freshness</h3>
              <p className="text-gray-600">
                From our pickle-making kitchen to the fishing boats, everything is prepared fresh 
                and delivered quickly to maintain peak flavor and quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The passionate people behind Desawali who work tirelessly to bring you the best
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-primary-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-primary-600 text-3xl font-bold">RK</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Rajesh Kumar</h3>
              <p className="text-primary-600 font-medium mb-4">Founder & CEO</p>
              <p className="text-gray-600 text-sm">
                With 20+ years in food industry, Rajesh started Desawali to preserve 
                traditional flavors and support local communities.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-seafood-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-seafood-600 text-3xl font-bold">PS</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Priya Sharma</h3>
              <p className="text-seafood-600 font-medium mb-4">Head of Quality</p>
              <p className="text-gray-600 text-sm">
                Priya ensures every product meets our quality standards, from ingredient 
                selection to final packaging and delivery.
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-green-600 text-3xl font-bold">AS</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Arjun Singh</h3>
              <p className="text-green-600 font-medium mb-4">Supply Chain Director</p>
              <p className="text-gray-600 text-sm">
                Arjun manages our network of suppliers and ensures fresh ingredients 
                reach our facility and your home on time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Experience Authentic Flavors?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join our family of food lovers and discover why thousands trust Desawali 
            for their pickle and seafood needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/shop"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Shop Now
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About