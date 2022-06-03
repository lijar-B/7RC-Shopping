import React from 'react'
import { firestore, storage } from './config/firebase'
import { useState, useEffect } from 'react'
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  deleteDoc,
  doc,
  setDoc,
  where,
  getDocs,
  updateDoc,
} from 'firebase/firestore'
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from 'firebase/storage'
import { v4 } from 'uuid'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'

import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'

import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { CardActionArea } from '@mui/material'

const Admin = () => {
  const [slideImages, setSlideImages] = useState([])
  const [uploadImage, setUploadImage] = useState([])

  const handleAddImage = () => {
    const collectionRef = collection(firestore, 'SlideImages')

    if (uploadImage == null) return
    const imageRef = ref(storage, `SlideImages/${uploadImage.name}`)
    uploadBytes(imageRef, uploadImage).then(async (snapshot) => {
      await getDownloadURL(snapshot.ref).then(async (url) => {
        const payload = {
          imgId: v4(),
          img: url,
          timestamp: serverTimestamp(),
        }
        await addDoc(collectionRef, payload)
        setUploadImage([])
      })
    })
  }

  const handleDelete = async (id, img) => {
    const docRef = doc(firestore, 'SlideImages', id)
    const imgRef = ref(storage, img)
    await deleteDoc(docRef)
    await deleteObject(imgRef)
  }

  useEffect(() => {
    const collectionRef = collection(firestore, 'SlideImages')
    const q = query(collectionRef, orderBy('timestamp', 'desc'))
    onSnapshot(q, (snapshot) => {
      setSlideImages(
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
      )
    })
  }, [])

  return (
    <div>
      <div className="section1">
        <h3 style={{ color: 'white', textAlign: 'center' }}>Slide Images</h3>
        <div className="add-image-slider">
          <input
            type="file"
            id="imageSlide"
            onChange={(event) => {
              setUploadImage(event.target.files[0])
            }}
          />
          <button className="btn" onClick={handleAddImage}>
            Add Image
          </button>
        </div>
        <div className="slide-images">
          {slideImages.map((image) => (
            <div className="single-img" key={image.id}>
              <img className="img" src={image.img} alt="" />
              <button
                onClick={() => handleDelete(image.id, image.img)}
                className="btn"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="section2">
        <AddCategory />
      </div>
    </div>
  )
}

const AddCategory = () => {
  const [categories, setCategories] = useState([
    { categoryName: 'Loading...', categoryId: 'initial' },
  ])
  const [imageUpload, setImageUpload] = useState(null)

  useEffect(() => {
    const collectionRef = collection(firestore, 'Products')
    const q = query(collectionRef, orderBy('timestamp', 'desc'))
    const unsub = onSnapshot(q, (snapshot) => {
      setCategories(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    })

    return unsub
  }, [])

  const AddCategory = () => {
    var categoryName = document.getElementById('categoryName').value
    var categoryState = document.getElementById('categoryState').value
    // var categoryType = document.getElementById('categoryType').value

    const collectionRef = doc(firestore, 'Products', categoryName)

    if (imageUpload == null) return
    const imageRef = ref(storage, `Products/categoryImg/${imageUpload.name}`)
    uploadBytes(imageRef, imageUpload).then(async (snapshot) => {
      await getDownloadURL(snapshot.ref).then(async (url) => {
        const payload = {
          categoryId: v4(),
          categoryName: categoryName,
          categoryState: categoryState,
          // categoryType: categoryType,
          categoryImg: url,
          timestamp: serverTimestamp(),
        }
        await setDoc(collectionRef, payload)
        document.getElementById('categoryName').value = ''
        document.getElementById('categoryState').value = ''
        // document.getElementById('categoryType').value = ''
        //   document.getElementById('categoryImg').value = ''
      })
    })
    // props.setVisible(true)
  }

  return (
    <div>
      <div className="add-category-form">
        <h3 style={{ color: 'white' }}>Add Category</h3>
        <input
          className="input"
          id="categoryName"
          placeholder="Category Name"
          type="text"
        />
        <input
          className="input"
          id="categoryState"
          placeholder="Category Type"
          type="text"
        />
        {/* <input
          className="input"
          id="categoryType"
          placeholder="category Type"
          type="text"
        /> */}
        <label className="fileUpload">
          <input
            type="file"
            placeholder="select file"
            id="categoryImg"
            onChange={(event) => {
              setImageUpload(event.target.files[0])
            }}
          />
        </label>
        <button className="btn" onClick={AddCategory}>
          Add Category
        </button>
      </div>

      <div>
        <Card sx={{ maxWidth: 400 }}>
          {categories.map((category) => (
            <>
              <Link to={`/7RC-Shopping/category/admin/${category.categoryId}`}>
                <CardMedia
                  component="img"
                  height="300"
                  image={category.categoryImg}
                  alt="Paella dish"
                />
              </Link>
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  <div
                    className="font-family
          "
                  >
                    {category.categoryName}
                  </div>
                  <div
                    className="font-family
          "
                  >
                    အမျိုးအစား | {category.categoryState}
                  </div>
                </Typography>
              </CardContent>
              <CardActions disableSpacing></CardActions>
            </>
          ))}
        </Card>
      </div>
    </div>
  )
}

const CategoryDetails4 = () => {
  const { categoryId } = useParams()
  const [category, setCategory] = useState([])
  const [products, setProducts] = useState([])
  const [imageUpload, setImageUpload] = useState(null)
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
        `Products/${category.categoryName}/category`,
      )
      onSnapshot(collectionCategory, (snapshot) => {
        setItemCategory(
          snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
        )
      })
    })

    //
  }, [categoryId, category.categoryName])

  const addProduct = async () => {
    var productName = document.getElementById('productName').value
    var productPrice = document.getElementById('productPrice').value
    var productType = document.getElementById('productType').value
    var productReview = document.getElementById('productReview').value

    console.log(categoryId)

    const q = query(
      collection(firestore, 'Products'),
      where('categoryId', '==', categoryId),
    )
    const querySnapShot = await getDocs(q)
    const queryData = querySnapShot.docs.map((detail) => ({
      ...detail.data(),
      id: detail.id,
    }))
    if (imageUpload == null) {
      const payload = {
        productId: v4(),
        productName: productName,
        productPrice: productPrice,
        productReview: productReview,
        // productImg: url,
        timestamp: serverTimestamp(),
      }
      queryData.map(async (v) => {
        const docRef = doc(firestore, `Products/${v.id}/products`, productName)
        await setDoc(docRef, payload)
      })
      document.getElementById('productName').value = ''
      // document.getElementById('productPrice').value = ''
    } else {
      const imageRef = ref(storage, `Products/${imageUpload.name}`)
      uploadBytes(imageRef, imageUpload).then(async (snapshot) => {
        await getDownloadURL(snapshot.ref).then(async (url) => {
          const payload = {
            productId: v4(),
            productName: productName,
            productPrice: productPrice,
            productType: productType,
            productReview: productReview,
            productImg: url,
            timestamp: serverTimestamp(),
          }
          queryData.map(async (v) => {
            const docRef = doc(
              firestore,
              `Products/${v.id}/products`,
              productName,
            )
            await setDoc(docRef, payload)
          })
          document.getElementById('productName').value = ''
          document.getElementById('productPrice').value = ''
          document.getElementById('productType').value = ''
          document.getElementById('productReview').value = ''

          setImageUpload('')
        })
      })
    }
  }

  const handleItemCategory = (type) => {
    const collectionRef = collection(
      firestore,
      `Products/${category.categoryName}/category`,
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

  const handleEdit = async (id, editProductName, editProductPrice) => {
    const docRef = doc(
      firestore,
      `Products/${category.categoryName}/products`,
      id,
    )

    const payload = {
      productName: editProductName,
      productPrice: editProductPrice,
    }
    await updateDoc(docRef, payload)
  }

  const [moreImg, setMoreImg] = useState([])
  const handleDelete = async (id, img) => {
    const docRef = doc(
      firestore,
      `Products/${category.categoryName}/products`,
      id,
    )
    const imgRef = ref(storage, img)
    await deleteDoc(docRef)
    await deleteObject(imgRef)

    const collectionRef = collection(
      firestore,
      `Products/${category.id}/products/${id}/MoreImages`,
    )
    onSnapshot(collectionRef, (snapshot) => {
      setMoreImg(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    })
    moreImg.map((img) => {
      const docRef = doc(
        firestore,
        `Products/${category.id}/products/${id}/MoreImages`,
        img.id,
      )
      const imgRef = ref(storage, img)
      deleteDoc(docRef)
      deleteObject(imgRef)
      return console.log('hi')
    })
  }

  return (
    <>
      <div className="add-product-form">
        <h3>Add Product</h3>
        <input
          className="input"
          type="text"
          id="productName"
          placeholder="Product Name"
        />
        <input
          className="input"
          type="text"
          id="productPrice"
          placeholder="Product Price"
        />
        <input
          className="input"
          type="text"
          id="productType"
          placeholder="Product Type"
        />
        <textarea
          id="productReview"
          cols="30"
          rows="10"
          placeholder="Write Review"
        ></textarea>
        <label className="fileUpload">
          <input
            type="file"
            multiple
            placeholder="select file"
            id="menuImg"
            onChange={(event) => {
              setImageUpload(event.target.files[0])
            }}
          />
        </label>
        <button
          className="btn"
          type="submit"
          onClick={() => addProduct(category.categoryId)}
        >
          Add Product
        </button>
      </div>
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
                handleDelete={handleDelete}
                handleEdit={handleEdit}
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
              handleDelete={handleDelete}
              handleEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </>
  )
}

const EditModal = (props) => {
  const [openModal, setOpenModal] = useState(false)
  const [editProductName, seteditProductName] = useState('')
  const [editProductPrice, seteditProductPrice] = useState('')
  const { productName, productPrice, handleEdit, product } = props

  return (
    <>
      <EditIcon onClick={() => setOpenModal(!openModal)}>Edit</EditIcon>
      {openModal && (
        <div className="modal-box">
          <input
            type="text"
            defaultValue={productName}
            onChange={(e) => seteditProductName(e.target.value)}
          />
          <input
            type="text"
            defaultValue={productPrice}
            onChange={(e) => seteditProductPrice(e.target.value)}
          />
          <button
            className="edit"
            onClick={() => {
              handleEdit(product.id, editProductName, editProductPrice)
              setOpenModal(!openModal)
            }}
          >
            Edit
          </button>
          <button
            className="close"
            onClick={() => {
              setOpenModal(false)
            }}
          >
            Close
          </button>
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
    handleDelete,
    handleEdit,
  } = props
  return (
    <div>
      <Card sx={{ maxWidth: 400 }}>
        <CardActionArea>
          <Link
            to={`/7RC-Shopping/productDetails4/${categoryId}/${product.productId}`}
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

            <div className="call-action col3">
              <button
                className="btn"
                onClick={() => handleDelete(product.id, product.productImg)}
              >
                <DeleteIcon fontSize="small" />
              </button>

              <button className="btn btn-2" id={product.id}>
                <EditModal
                  product={product}
                  productName={product.productName}
                  productPrice={product.productPrice}
                  handleEdit={handleEdit}
                />
              </button>
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
  )
}

export { Admin, CategoryDetails4 }
