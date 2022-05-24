import React from 'react'
import { firestore } from './config/firebase'
import { useState, useEffect } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { Link } from 'react-router-dom'

const Content = () => {
  const [categories, setCategories] = useState([])

  // Category Fetch
  useEffect(() => {
    const collectionRef = collection(firestore, 'Products')
    const q = query(collectionRef, orderBy('timestamp', 'desc'))
    onSnapshot(q, (snapshot) => {
      setCategories(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    })
  }, [])

  return (
    <div>
      <div className="section">
        {categories.map((category) => (
          <>
            <h3>{category.categoryName}</h3>
            <Item categoryId={category.categoryId} />
          </>
        ))}
      </div>
    </div>
  )
}

const Item = (props) => {
  const { categoryId } = props
  const [category, setCategory] = useState([])
  const [products, setProducts] = useState([])

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
  return (
    <div>
      <div className="section-box">
        {products.slice(0, 5).map((p) => (
          <div className="item">
            <Link
              to={`/7RC-Shopping/productDetails/${categoryId}/${p.productId}`}
              target="_blank"
            >
              <img src={p.productImg} alt="" />
            </Link>
            <span>{p.productPrice}ks</span>
          </div>
        ))}
        <Link
          to={`/7RC-Shopping/category/${categoryId}`}
          className="item-more link"
        >
          <h4 className="more">More>>></h4>
        </Link>
      </div>
    </div>
  )
}

export default Content
