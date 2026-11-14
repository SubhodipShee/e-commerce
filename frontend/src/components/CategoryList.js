import React,{useState ,useEffect} from 'react'
import SummaryApi from '../common'
import { Link } from 'react-router-dom'
import optimizeImage from '../helpers/optimizeImage'

const CategoryList = () => {
    const [categoryProduct,setCategoryProduct] = useState([])
    const [loading,setLoading] = useState(false)

    const categoryLoading = new Array(13).fill(null)

    const fetchCategoryProduct = async() =>{
        setLoading(true)
        const response = await fetch(SummaryApi.categoryProduct.url)
        const dataResponse = await response.json()
        setLoading(false)
        setCategoryProduct(dataResponse.data)
    }

    useEffect(()=>{
        fetchCategoryProduct()
    },[])
  return (
    <div className='container mx-auto p-4'>
        <div className='flex items-start gap-4 md:gap-6 justify-between overflow-x-auto scrollbar-none py-1'>
        {

            loading ?(
                
                    categoryLoading.map((el,index)=>{
                        return(
                            <div className='h-16 w-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-slate-200 animate-pulse' key={"categoryLoading"+index}>

                            </div>
                        )
                    })
                
               
            ):
            (
                categoryProduct.map((product,index)=>{
                    return(
                        <Link to={"/product-category?category="+product?.category} className='cursor-pointer group flex flex-col items-center gap-1 shrink-0' key={product?.category}>
                            <div className='w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden p-3 bg-white border border-slate-200 shadow-sm flex items-center justify-center transition group-hover:border-purple-400 group-hover:shadow-md'>
                            <img src={optimizeImage(product?.productImage[0],150)} alt={product?.category} className='h-full object-scale-down mix-blend-multiply group-hover:scale-110 transition-transform duration-300'/>
                            </div>
                            <p className='text-center text-xs md:text-sm font-medium text-slate-600 capitalize group-hover:text-purple-700 transition-colors'>{product?.category}</p>
                        </Link>
                    )
                })
            )
                
            
     
      }
        </div>
    </div>
  )
}

export default CategoryList
