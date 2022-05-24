import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { firestore } from './config/firebase'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
// import required modules
import { Autoplay, Pagination, Navigation } from 'swiper'

const ImageSlider = () => {
  const [slideImages, setSlideImages] = useState([])

  useEffect(() => {
    const collectionRef = collection(firestore, 'SlideImages')
    const q = query(collectionRef, orderBy('timestamp', 'desc'))
    onSnapshot(q, (snapshot) => {
      setSlideImages(
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
      )
    })
  }, [setSlideImages])
  return (
    <>
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {slideImages.map((val) => (
          <SwiperSlide key={val.id}>
            <img style={{ width: '25rem' }} src={val.img} alt="" />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}

export default ImageSlider
