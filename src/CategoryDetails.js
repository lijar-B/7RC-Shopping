import React from 'react'

import { useParams } from 'react-router-dom'
import { firestore } from './config/firebase'
import { useState, useEffect } from 'react'
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
} from 'firebase/firestore'
import { Link } from 'react-router-dom'

import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { CardActionArea } from '@mui/material'

const CategoryDetails = () => {
  const { categoryId } = useParams()
  const [category, setCategory] = useState([])
  const [products, setProducts] = useState([])
  const [itemCategory, setItemCategory] = useState([])

  const [value, setValue] = React.useState(0)
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  // window.scrollTo(0, 0)
  useEffect(() => {
    const collectionRef = collection(firestore, 'Products')

    onSnapshot(collectionRef, (snapshot) => {
      const snap = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      const filtercategory = snap.find(
        (category) => category.categoryId === categoryId,
      )
      setCategory(filtercategory)
    })

    const collectionRefproduct = collection(
      firestore,
      `Products/${category.categoryName}/products`,
    )
    const q = query(collectionRefproduct, orderBy('timestamp', 'desc'))
    const unsub = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    })

    return unsub
  }, [categoryId, category.categoryName])

  useEffect(() => {
    const collectionRef = collection(firestore, 'Products')

    onSnapshot(collectionRef, (snapshot) => {
      const snap = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      const filterCategory = snap.find(
        (category) => category.categoryId === categoryId,
      )
      setCategory(filterCategory)

      const collectionCategory = collection(
        firestore,
        `Product/${category.categoryName}/category`,
      )
      onSnapshot(collectionCategory, (snapshot) => {
        setItemCategory(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
        )
      })
    })

    //
  }, [categoryId, category.categoryName])

  const handleItemCategory = (type) => {
    const collectionRef = collection(
      firestore,
      `Product/${category.categoryName}/products`,
    )
    const q = query(
      collectionRef,
      where('productType', '==', type),
      orderBy('timestamp', 'desc'),
    )
    onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    })
    window.scrollTo(0, 600)
  }

  return (
    <>
      <div className="category-profile">
        <img
          className="category-profile-img"
          style={{ width: '24.5rem' }}
          src={category.categoryImg}
          alt=""
        />
        <div className="category-info">
          <h1 className="category-profile-name">{category.categoryName}</h1>
          <h3 className="category-profile-info">{category.categoryType}</h3>
        </div>
      </div>
      {itemCategory ? (
        <div>
          <Box
            className="categoryBox"
            sx={{ maxWidth: { xs: 400, sm: 480 }, bgcolor: 'background.paper' }}
          >
            <Tabs
              className="categoryBar"
              value={value}
              onChange={handleChange}
              variant="scrollable"
              scrollButtons
              allowScrollButtonsMobile
              aria-label="scrollable force tabs example"
            >
              {itemCategory.map((cat) => (
                <Tab
                  onClick={() => {
                    handleItemCategory(cat.productType)
                  }}
                  label={cat.productType}
                />
              ))}
            </Tabs>
          </Box>

          <div>
            {products.map((product) => (
              <ProductCard
                categoryId={categoryId}
                product={product}
                productName={product.productName}
                productPrice={product.productPrice}
                productImg={product.productImg}
                productReview={product.productReview}
              />
            ))}
          </div>
        </div>
      ) : (
        <div>
          {products.map((product) => (
            <ProductCard
              categoryId={categoryId}
              product={product}
              productName={product.productName}
              productPrice={product.productPrice}
              productImg={product.productImg}
              productReview={product.productReview}
            />
          ))}
        </div>
      )}
    </>
  )
}

const ProductCard = (props) => {
  const {
    categoryId,
    product,
    productName,
    productPrice,
    // productReview,
    productImg,
  } = props
  return (
    <div>
      <Card sx={{ maxWidth: 400 }}>
        <CardActionArea>
          <Link
            to={`/7RC-Shopping/productDetails/${categoryId}/${product.productId}`}
            target="_blank"
          >
            <CardMedia
              className="item-img"
              component="img"
              image={productImg}
              alt="green iguana"
            />
          </Link>

          <CardContent className="card-content">
            <Typography
              className="card-text text1"
              gutterBottom
              component="div"
            >
              {productName} | {productPrice} MMK
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  )
}

export default CategoryDetails
