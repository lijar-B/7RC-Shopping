import React from 'react'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { firestore } from './config/firebase'
import {
  onSnapshot,
  query,
  where,
  collection,
  orderBy,
} from 'firebase/firestore'
import { useParams } from 'react-router-dom'

import CardHeader from '@mui/material/CardHeader'
import Avatar from '@mui/material/Avatar'
import { red } from '@mui/material/colors'
import LocalGroceryStoreRoundedIcon from '@mui/icons-material/LocalGroceryStoreRounded'
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded'

import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

const ProductDetails = () => {
  const { categoryId, productId } = useParams()
  const [category, setCategory] = useState([])
  const [product, setProduct] = useState([])
  const [moreImg, setMoreImg] = useState([])

  useEffect(() => {
    const collectionRef = collection(firestore, 'Products')
    // const q = query(collectionRef, where('categoryId', '==', categoryId))
    onSnapshot(collectionRef, (snapshot) => {
      const snap = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      const filtercategory = snap.find(
        (category) => category.categoryId === categoryId,
      )
      setCategory(filtercategory)
    })
  }, [categoryId])

  document.title = `7RC Shopping-${category.categoryName}`

  useEffect(() => {
    const productCollectionRef = collection(
      firestore,
      `Products/${category.categoryName}/products`,
    )
    const productQ = query(
      productCollectionRef,
      where('productId', '==', productId),
    )
    onSnapshot(productQ, (snapshot) => {
      const snap = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      setProduct(snap)
    })
  }, [productId, category.categoryName])

  useEffect(() => {
    product.map((p) => {
      const productName = p.productName
      const collectionRef = collection(
        firestore,

        `Products/${category.categoryName}/products/${productName}/MoreImages`,
      )
      const q = query(collectionRef, orderBy('timestamp', 'desc'))
      onSnapshot(q, (snapshot) => {
        setMoreImg(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      })
      console.log(category.categoryName)
      console.log(productName)

      return console.log('hi')
    })
  }, [category.categoryName, product])

  return (
    <>
      <Card sx={{ maxWidth: 400 }}>
        {/* {category.map((category) => ( */}
        <>
          <Link
            className="link"
            to={`/7RC-Shopping/category/${categoryId}`}
            target="_blank"
          >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                  <img
                    style={{ width: '3rem' }}
                    src={category.categoryImg}
                    alt=""
                  />
                </Avatar>
              }
              title={category.categoryName}
              // subheader="September 14, 2016"
            />
          </Link>

          {product.map((p) => (
            <>
              <CardMedia
                component="img"
                height="350"
                image={p.productImg}
                alt="Paella dish"
              />
              <div className="call-actions">
                <Link
                  className="link"
                  to={`/7RC-Shopping/category/${categoryId}`}
                  target="_blank"
                >
                  <div className="left">More {category.categoryName}</div>
                  <div className="left">{p.productName}</div>
                </Link>
                <div className="right">
                  <button className="btn">
                    <a href="tel:09421219435" className="btn">
                      <PhoneRoundedIcon fontSize="small" />
                    </a>
                  </button>
                  <button className="btn btn-2">
                    <a
                      href="https://www.messenger.com/t/107886948439928/?messaging_source=source%3Apages%3Amessage_shortlink&source_id=1441792"
                      class="btn"
                    >
                      <LocalGroceryStoreRoundedIcon
                        fontSize="small"
                        className="icon"
                      />
                    </a>
                  </button>
                </div>
              </div>
              <div className="more-images">
                {moreImg.map((img) => (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <img style={{ width: '14rem' }} src={img.img} alt="" />
                  </div>
                ))}
              </div>

              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  <p className="myanmarFont">{p.productReview}</p>
                </Typography>
              </CardContent>
            </>
          ))}
        </>
      </Card>
    </>
  )
}

export default ProductDetails
