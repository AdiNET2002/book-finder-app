/**
 * Premium loading spinner with stunning animations
 */
const LoadingSpinner = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-20 h-20'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-xl'
  };

  return (
    <div className="flex flex-col items-center justify-center p-12">
      {/* Premium Animated Loader */}
      <div className="relative mb-8">
        {/* Outer spinning ring */}
        <div className={`${sizeClasses[size]} rounded-full border-4 border-white/20 animate-spin`}>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-purple-500 animate-spin"></div>
        </div>
        
        {/* Inner pulsing core */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`${size === 'small' ? 'w-3 h-3' : size === 'medium' ? 'w-5 h-5' : 'w-8 h-8'} bg-gradient-to-r from-blue-500 to-purple-500 rounded-full pulse-glow`}></div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute -inset-4">
          <div className="absolute top-0 left-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
          <div className="absolute bottom-0 right-1/4 w-1 h-1 bg-green-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute top-1/2 left-0 w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/4 right-0 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
        </div>
      </div>

      {/* Premium Loading Text */}
      {text && (
        <div className="text-center space-y-4">
          <p className={`${textSizes[size]} font-semibold text-white`}>
            {text}
          </p>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;