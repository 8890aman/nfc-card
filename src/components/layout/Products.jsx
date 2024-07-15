import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import { motion } from 'framer-motion'
import AnimatedBackground from '../utils/AnimatedBackground';
import Qrimage from "../../assets/images/NFC-Card-removebg-preview.png"

const Product = ({ image, title, description, features, price }) => {
  return (
    <div className="group bg-white bg-opacity-10 hover:bg-green-800 rounded-xl overflow-hidden transition-all duration-300 p-4 backdrop-filter backdrop-blur-sm hover:backdrop-blur-none shadow-lg hover:shadow-xl">
      <div className="relative w-full aspect-[1.586/1] max-w-[340px] mx-auto mb-4 rounded-lg overflow-hidden">
        <img src={image} alt={description} className="w-full h-full object-cover object-center" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-green-800 opacity-0 group-hover:opacity-70 transition-opacity duration-300"></div>
        <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-green-800 dark:text-green-300 group-hover:text-white transition-colors duration-300">{title}</h3>
      </div>
      
      <div className="p-4">
        <p className="text-green-800 dark:text-green-300 group-hover:text-white mb-4 transition-colors duration-300">{description}</p>
        <h4 className="text-lg font-semibold text-green-700 dark:text-green-400 group-hover:text-white mb-3 transition-colors duration-300">Key Features</h4>
        <ul className="space-y-2 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-green-700 dark:text-green-400 group-hover:text-white transition-colors duration-300">
              <FontAwesomeIcon icon={faCheckCircle} className="text-green-600 dark:text-green-500 group-hover:text-white mr-2 transition-colors duration-300" />
              {feature}
            </li>
          ))}
        </ul>
        <div className="flex justify-between items-center">
          <span className="text-3xl font-bold text-green-700 dark:text-green-400 group-hover:text-white transition-colors duration-300">{price}</span>
          <button className="bg-green-600 group-hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full flex items-center transition-all duration-300">
            <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}

const Products = () => {
  const products = [
    {
      title: "QR Cards",
      image: Qrimage,
      description: "High quality PVC cards with embedded QR technology",
      features: ["Instant information sharing", "Customizable designs", "Durable material"],
      price: "$2.99",
    },
    {
      title: "NFC Cards",
      image: Qrimage,
      description: "Advanced PVC cards with NFC capabilities",
      features: ["Contactless data transfer", "Programmable content", "Sleek and modern design"],
      price: "$4.99",
    },
  ]

  return (
    <section className="relative py-20 bg-transparent dark:bg-transparent transition-colors duration-300 overflow-hidden">
      <AnimatedBackground />
      <div className="absolute inset-0 bg-green-50 dark:bg-green-900 bg-opacity-20 dark:bg-opacity-20 backdrop-blur-sm backdrop-filter z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2 
          className="text-5xl font-bold mb-12 text-center text-green-700 dark:text-green-300"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Our Products
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {products.map((product, index) => (
            <Product key={index} {...product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Products