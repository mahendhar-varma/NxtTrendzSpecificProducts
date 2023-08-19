import './index.css'
import {Component} from 'react'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productItem: {},
    similarProducts: [],
    count: 1,
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProductItem()
  }

  getProductItem = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `http://localhost:3000/products/${id}`

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)
    console.log(response.ok)

    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatedData = {
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        description: data.description,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
        similarProducts: data.similar_products,
      }
      const {similarProducts} = updatedData
      this.setState({
        productItem: updatedData,
        similarProducts,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  decreaseCount = () => {
    this.setState(prevState => ({
      count: prevState.count - 1,
    }))
  }

  increaseCount = () => {
    this.setState(prevState => ({
      count: prevState.count + 1,
    }))
  }

  render() {
    const {productItem, similarProducts, count, apiStatus} = this.state
    console.log(apiStatus)
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
    } = productItem
    return (
      <>
        <Header />
        <div className="product-item-container">
          <img src={imageUrl} alt="product" className="product-item-image" />
          <div className="product-item-details-container">
            <h1 className="item-head">{title}</h1>
            <p className="item-price">Rs {price}/- </p>
            <div className="review-container">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="reviews">{totalReviews}</p>
            </div>
            <p className="description">{description}</p>
            <p className="available">
              Available: <span>{availability}</span>
            </p>
            <p className="brand">
              Brand: <span>{brand}</span>
            </p>
            <hr />
            <div className="item-count-container">
              <BsDashSquare data-testid="minus" onClick={this.decreaseCount} />
              <p className="count">{count}</p>
              <BsPlusSquare data-testid="plus" onClick={this.increaseCount} />
            </div>
            <button className="button" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-products-section">
          <h1 className="similar-head">Similar Products</h1>
          <ul className="similar-products-container">
            {similarProducts.map(item => (
              <SimilarProductItem key={item.id} similarProductsDetails={item} />
            ))}
          </ul>
        </div>
      </>
    )
  }
}

export default ProductItemDetails
