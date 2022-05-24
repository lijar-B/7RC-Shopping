import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import Navbar from './Navbar'

import { Admin, CategoryDetails4 } from './Admin'
import ProductDetails4 from './ProductDetails4'
import ProductDetails from './ProductDetails'
import CategoryDetails from './CategoryDetails'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route
            path="/7RC-Shopping/category/admin/:categoryId/*"
            element={<CategoryDetails4 />}
          />
          <Route
            path="/7RC-Shopping/productDetails4/:categoryId/:productId/*"
            element={<ProductDetails4 />}
          />
          <Route
            path="/7RC-Shopping/productDetails/:categoryId/:productId/*"
            element={<ProductDetails />}
          />
          <Route
            path="/7RC-Shopping/category/:categoryId/*"
            element={<CategoryDetails />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
