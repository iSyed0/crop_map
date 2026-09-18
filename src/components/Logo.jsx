import ndmaLogo from '../assets/ndma-logo.png'

export default function Logo({ size = 44, className = '' }) {
  return (
    <img
      src={ndmaLogo}
      alt="NDMA Pakistan"
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, objectFit: 'contain' }}
    />
  )
}
