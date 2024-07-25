// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {imageUrl, title, brand, price, rating} = productDetails
  return (
    <li className="similar-item">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-image"
      />
      <h1 className="title-similar">{title}</h1>
      <p className="brand-name">{brand}</p>
      <div className="bottom-div">
        <p className="price-bottom">{price}/-</p>
        <p className="rating-bottom">
          <span>{rating}</span>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            className="star-img"
            alt="star"
          />
        </p>
      </div>
    </li>
  )
}

export default SimilarProductItem
