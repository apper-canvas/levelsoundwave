import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <ApperIcon name="Music" className="w-24 h-24 mx-auto mb-8 text-primary" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-6xl font-bold mb-4"
        >
          404
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-gray-400 mb-8"
        >
          This track seems to be missing from our playlist
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 bg-primary text-black px-6 py-3 rounded-full font-semibold hover:bg-primary-light transition-colors"
          >
            <ApperIcon name="Home" size={20} />
            Back to Music
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound