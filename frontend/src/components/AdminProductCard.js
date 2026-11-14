/* import React,  { useState } from 'react'
import { MdModeEditOutline } from "react-icons/md";
import AdminEditProduct from './AdminEditProduct';
import displayINRCurrency from '../helpers/displayCurrency';

const AdminProductCard = ({
  data,
  fetchdata
}) => {
const [editProduct,setEditProduct] = useState(false)
 
return (
  <div className='bg-white p-4 rounded '>
     <div className='w-40'>
          <div className='w-32 h-32 flex justify-center items-center'>
            <img src={data?.productImage[0]}  className='mx-auto object-fill h-full'/>   
          </div> 
          <h1 className='text-ellipsis line-clamp-2'>{data.productName}</h1>

          <div>

              <p className='font-semibold'>
                {
                  displayINRCurrency(data.sellingPrice)
                }
      
              </p>

              <div className='w-fit ml-auto p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer' onClick={()=>setEditProduct(true)}>
                  <MdModeEditOutline/>
              </div>

          </div>

        
     </div>
      
      {
        editProduct && (
          <AdminEditProduct productData={data} onClose={()=>setEditProduct(false)} fetchdata={fetchdata}/>
        )
      }
  
  </div>
)
}

export default AdminProductCard */

import React, { useState } from 'react';
import { MdModeEditOutline, MdDelete } from "react-icons/md";
import { toast } from 'react-toastify';
import AdminEditProduct from './AdminEditProduct';
import displayINRCurrency from '../helpers/displayCurrency';
import optimizeImage from '../helpers/optimizeImage';
import SummaryApi from '../common';

const AdminProductCard = ({ data, fetchdata }) => {
  const [editProduct, setEditProduct] = useState(false);

  const handleDeleteProduct = async () => {
    if (!window.confirm(`Delete "${data?.productName}"? This cannot be undone.`)) {
      return;
    }

    const response = await fetch(SummaryApi.deleteProduct.url, {
      method: SummaryApi.deleteProduct.method,
      credentials: 'include',
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ _id: data?._id })
    });
    const responseData = await response.json();

    if (responseData.success) {
      toast.success(responseData.message);
      fetchdata();
    }

    if (responseData.error) {
      toast.error(responseData.message);
    }
  };

  // Make sure `productImage` is an array and has at least one image
  const productImage = data?.productImage && data.productImage.length > 0 ? data.productImage[0] : 'default-image-url.jpg';

  return (
    <div className='bg-white p-4 rounded'>
      <div className='w-40'>
        <div className='w-32 h-32 flex justify-center items-center'>
          {/* Safely render the first product image */}
          <img
            src={optimizeImage(productImage,300)}
            loading='lazy'
            alt={data?.productName || 'Product Image'}
            className='mx-auto object-fill h-full' 
          />
        </div> 
        <h1 className='text-ellipsis line-clamp-2'>{data?.productName || 'Product Name'}</h1>

        <div>
          <p className='font-semibold'>
            {data?.sellingPrice ? displayINRCurrency(data.sellingPrice) : 'Price Not Available'}
          </p>

          <div className='flex justify-end gap-2'>
            <div
              className='w-fit p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer'
              title='Edit product'
              onClick={() => setEditProduct(true)}
            >
              <MdModeEditOutline />
            </div>

            <div
              className='w-fit p-2 bg-red-100 hover:bg-red-600 rounded-full hover:text-white cursor-pointer'
              title='Delete product'
              onClick={handleDeleteProduct}
            >
              <MdDelete />
            </div>
          </div>
        </div>
      </div>

      {editProduct && (
        <AdminEditProduct 
          productData={data} 
          onClose={() => setEditProduct(false)} 
          fetchdata={fetchdata}
        />
      )}
    </div>
  );
};

export default AdminProductCard;

