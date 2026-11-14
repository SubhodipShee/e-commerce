import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import productCategory from '../helpers/productCategory'
import VerticalCard from '../components/VerticalCard'
import SummaryApi from '../common'

const CategoryProduct = () => {
  const [data,setData] = useState([])
  const navigate = useNavigate()
  const [loading,setLoading] = useState(false)
  const location = useLocation()
  const urlSearch = new URLSearchParams(location.search)
  const urlCategoryListinArray = urlSearch.getAll("category")

  const urlCategoryListObject = {}
  urlCategoryListinArray.forEach(el =>{
    urlCategoryListObject[el] = true
  })

  const [selectCategory,setSelectCategory] = useState(urlCategoryListObject)
  const [filterCategoryList,setFilterCategoryList] = useState([])

  const [sortBy,setSortBy] = useState("")

  // price inputs, applied only when user clicks Apply
  const [priceInput,setPriceInput] = useState({ minPrice : "", maxPrice : "" })
  const [priceFilter,setPriceFilter] = useState({ minPrice : "", maxPrice : "" })

  const [page,setPage] = useState(1)
  const [totalProduct,setTotalProduct] = useState(0)
  const limit = 20
  const totalPage = Math.ceil(totalProduct / limit)

  const fetchData = async()=>{
    setLoading(true)
    const response = await fetch(SummaryApi.filterProduct.url,{
      method : SummaryApi.filterProduct.method,
      headers : {
        "content-type" : "application/json"
      },
      body : JSON.stringify({
        category : filterCategoryList,
        minPrice : priceFilter.minPrice,
        maxPrice : priceFilter.maxPrice,
        sortBy : sortBy,
        page : page,
        limit : limit
      })
    })

    const dataResponse = await response.json()
    setData(dataResponse?.data || [])
    setTotalProduct(dataResponse?.totalProduct || 0)
    setLoading(false)
  }

  const handleSelectCategory = (e) =>{
    const {name , value, checked} =  e.target

    setSelectCategory((preve)=>{
      return{
        ...preve,
        [value] : checked
      }
    })
  }

  useEffect(()=>{
    fetchData()
  },[filterCategoryList, priceFilter, sortBy, page])

  useEffect(()=>{
    const arrayOfCategory = Object.keys(selectCategory).map(categoryKeyName =>{
      if(selectCategory[categoryKeyName]){
        return categoryKeyName
      }
      return null
    }).filter(el => el)

    setFilterCategoryList(arrayOfCategory)
    setPage(1)

    //format for url change when change on the checkbox
    const urlFormat = arrayOfCategory.map((el,index) => {
      if((arrayOfCategory.length - 1 ) === index  ){
        return `category=${el}`
      }
      return `category=${el}&&`
    })

    navigate("/product-category?"+urlFormat.join(""))
  },[selectCategory])


  // sorting is done on the server, so it works across all pages
  const handleOnChangeSortBy = (e)=>{
    const { value } = e.target

    setSortBy(value)
    setPage(1)
  }

  const handleOnChangePrice = (e)=>{
    const { name, value } = e.target

    setPriceInput((preve)=>{
      return{
        ...preve,
        [name] : value
      }
    })
  }

  const handleApplyPrice = (e)=>{
    e.preventDefault()
    setPriceFilter(priceInput)
    setPage(1)
  }
  
return (
  <div className='container mx-auto p-4'>

     {/***filters on the left for desktop, on top for mobile */}
     <div className='grid lg:grid-cols-[200px,1fr] gap-4 lg:gap-0'>
         {/***left side */}
         <div className='bg-white p-3 rounded-xl border border-slate-100 shadow-sm lg:min-h-[calc(100vh-120px)] lg:overflow-y-auto'>
              {/**sort by */}
              <div className=''>
                  <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Sort by</h3>

                  <form className='text-sm flex flex-col gap-2 py-2'>
                      <div className='flex items-center gap-3'>
                        <input type='radio' name='sortBy' checked={sortBy === 'asc'} onChange={handleOnChangeSortBy} value={"asc"}/>
                        <label>Price - Low to High</label>
                      </div>

                      <div className='flex items-center gap-3'>
                        <input type='radio' name='sortBy' checked={sortBy === 'dsc'} onChange={handleOnChangeSortBy} value={"dsc"}/>
                        <label>Price - High to Low</label>
                      </div>
                  </form>
              </div>


              {/**price range */}
              <div className=''>
                  <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Price</h3>

                  <form className='text-sm flex flex-col gap-2 py-2' onSubmit={handleApplyPrice}>
                      <div className='flex items-center gap-2'>
                        <input type='number' min={0} name='minPrice' placeholder='Min' value={priceInput.minPrice} onChange={handleOnChangePrice} className='w-full p-1 bg-slate-100 border rounded'/>
                        <span>-</span>
                        <input type='number' min={0} name='maxPrice' placeholder='Max' value={priceInput.maxPrice} onChange={handleOnChangePrice} className='w-full p-1 bg-slate-100 border rounded'/>
                      </div>
                      <button className='bg-purple-600 hover:bg-purple-700 text-white py-1 rounded'>Apply</button>
                  </form>
              </div>


              {/**filter by */}
              <div className=''>
                  <h3 className='text-base uppercase font-medium text-slate-500 border-b pb-1 border-slate-300'>Category</h3>

                  <form className='text-sm flex flex-col gap-2 py-2'>
                      {
                        productCategory.map((categoryName,index)=>{
                          return(
                            <div className='flex items-center gap-3' key={categoryName?.value}>
                               <input type='checkbox' name={"category"} checked={selectCategory[categoryName?.value]} value={categoryName?.value} id={categoryName?.value} onChange={handleSelectCategory} />
                               <label htmlFor={categoryName?.value}>{categoryName?.label}</label>
                            </div>
                          )
                        })
                      }
                  </form>
              </div>


         </div>


          {/***right side ( product ) */}
          <div className='lg:px-4'>
            <p className='font-medium text-slate-800 text-lg my-2'>Search Results : {totalProduct}</p>

           <div className='lg:min-h-[calc(100vh-170px)] lg:overflow-y-scroll lg:max-h-[calc(100vh-170px)]'>
            {
                data.length !== 0 && !loading && (
                  <VerticalCard data={data} loading={loading}/>
                )
            }
           </div>

            {/**pagination */}
            {
              totalPage > 1 && (
                <div className='flex items-center justify-center gap-4 my-4'>
                  <button className='px-3 py-1 rounded border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white disabled:opacity-40 disabled:pointer-events-none' disabled={page === 1} onClick={()=>setPage(preve => preve - 1)}>Prev</button>
                  <p>Page {page} of {totalPage}</p>
                  <button className='px-3 py-1 rounded border border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white disabled:opacity-40 disabled:pointer-events-none' disabled={page === totalPage} onClick={()=>setPage(preve => preve + 1)}>Next</button>
                </div>
              )
            }
          </div>
     </div>
     
  </div>
)
}

export default CategoryProduct