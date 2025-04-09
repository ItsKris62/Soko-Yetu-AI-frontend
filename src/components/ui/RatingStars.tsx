interface Props {
    rating: number // ex: 4.5
  }
  
  export default function RatingStars({ rating }: Props) {
    const full = Math.floor(rating)
    const hasHalf = rating % 1 !== 0
  
    return (
      <div className="flex gap-1 text-orange-500">
        {[...Array(full)].map((_, i) => (
          <i key={i} className="fas fa-star" />
        ))}
        {hasHalf && <i className="fas fa-star-half-alt" />}
        {[...Array(5 - full - (hasHalf ? 1 : 0))].map((_, i) => (
          <i key={i} className="far fa-star" />
        ))}
      </div>
    )
  }
  