// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}
class ProductItemDetails extends Component {
  state = {
    productsList: {},
    quantity: 1,
    similarProductsData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getTeamMatches()
  }

  getFormattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getTeamMatches = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(`https://apis.ccbp.in/products/${id}`, option)
    console.log(response)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData)
      const updatedSimilarProductsData = fetchedData.similar_products.map(
        eachSimilarProduct => this.getFormattedData(eachSimilarProduct),
      )
      this.setState({
        productsList: updatedData,
        similarProductsData: updatedSimilarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  increment = () => {
    this.setState(prevState => ({
      quantity: prevState.quantity + 1,
    }))
  }

  decrement = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({
        quantity: prevState.quantity - 1,
      }))
    }
  }

  rendersuccessDetails = () => {
    const {productsList, quantity, similarProductsData, apiStatus} = this.state
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      availability,
      description,
      brand,
    } = productsList
    console.log(similarProductsData)
    return (
      <>
        <div className="product-cont">
          <img src={imageUrl} alt="product" className="product-image" />
          <div className="product-details-cont">
            <h1 className="product-title">{title}</h1>
            <p className="product-price">Rs {price}/-</p>
            <div className="review-cont">
              <div className="rating-cont">
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  className="star-img"
                  alt="star"
                />
              </div>
              <p className="total-reviews">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <p className="description">
              <span className="available-heading">Available:</span>{' '}
              {availability}
            </p>
            <p className="description">
              <span className="available-heading">Brand:</span> {brand}
            </p>
            <hr className="line" />
            <div className="quantity-holder">
              <button
                type="button"
                data-testid="minus"
                className="btn"
                onClick={this.decrement}
              >
                <BsDashSquare className="btn-icons" />
              </button>
              <p className="available-heading">{quantity}</p>
              <button type="button" data-testid="plus" className="btn">
                <BsPlusSquare className="btn-icons" onClick={this.increment} />
              </button>
            </div>
            <button className="cart-btn">ADD TO CART</button>
          </div>
        </div>
        <div className="similar-products-cont">
          <h1 className="similar-products-heading">Similar Products</h1>
          <ul className="similar-list">
            {similarProductsData.map(eachItem => (
              <SimilarProductItem key={eachItem.id} productDetails={eachItem} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderFailureView = () => (
    <div>
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="failure-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderLoaderView = () => (
    <div data-testid="loader" className="loader-cont">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderProductDetails = () => {
    const {apiStatus} = this.state
    console.log(apiStatus)
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.rendersuccessDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderProductDetails()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
