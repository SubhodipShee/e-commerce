import React,{useState , useEffect} from 'react'
import { FaAngleRight } from "react-icons/fa6";
import { FaAngleLeft } from "react-icons/fa6";

import image1 from '../assest/banner/img1.jpg'
import image2 from '../assest/banner/img2.webp'
import image3 from '../assest/banner/img3.jpg'
import image4 from '../assest/banner/img4.jpg'
import image5 from '../assest/banner/img5.jpg'

import image1Mobile from '../assest/banner/img1_mobile.jpg'
import image2Mobile from '../assest/banner/img2_mobile.png'
import image3Mobile from '../assest/banner/img3_mobile.jpg'
import image4Mobile from '../assest/banner/img4_mobile.jpg'
import image5Mobile from '../assest/banner/img5_mobile.jpg'


const BannerProduct = () => {
    const [currentImage,setCurrentImage] = useState(1)

    const desktopImages = [
        image1,
        image2,
        image3,
        image4,
        image5
    ]
    
    const mobileImages = [
        image1Mobile,
        image2Mobile,
        image3Mobile,
        image4Mobile,
        image5Mobile
    ]

    const nextImage = () =>{
        if(desktopImages.length - 1 > currentImage){
            setCurrentImage(preve => preve + 1)
        }
    }
    const preveImage = () =>{
        if(currentImage != 0){
            setCurrentImage(preve => preve - 1)
        }
    }

    useEffect(()=>{
        const interval = setInterval(()=>{
            if(desktopImages.length - 1 > currentImage){
                nextImage()
            }else{
                setCurrentImage(0)
            }
        },5000)
        return ()=> clearInterval(interval)
    },[currentImage])

  return (
    <div className='container mx-auto px-4'>
      <div className='h-56 md:h-72 w-full bg-slate-200 relative rounded-2xl overflow-hidden shadow-sm group'>

        {/**arrows show on hover (desktop) */}
        <div className='absolute z-10 h-full w-full md:flex items-center hidden px-3 pointer-events-none'>
            <div className='flex justify-between w-full text-xl'>
                <button onClick={preveImage} className='pointer-events-auto bg-white/80 backdrop-blur hover:bg-white shadow-md rounded-full p-2 opacity-0 group-hover:opacity-100 transition'><FaAngleLeft/></button>
                <button onClick={nextImage} className='pointer-events-auto bg-white/80 backdrop-blur hover:bg-white shadow-md rounded-full p-2 opacity-0 group-hover:opacity-100 transition'><FaAngleRight/></button>
            </div>

        </div>

        {/**dots to show and change the current slide */}
        <div className='absolute z-10 bottom-3 w-full flex justify-center gap-2'>
            {
                desktopImages.map((imageURl,index)=>{
                    return(
                        <button key={"dot"+index} onClick={()=>setCurrentImage(index)} className={`h-2 rounded-full transition-all duration-300 ${currentImage === index ? 'w-6 bg-white' : 'w-2 bg-white/60'}`}></button>
                    )
                })
            }
        </div>

        {/* dekstop version */}
            <div className='hidden md:flex h-full w-full overflow-hidden'>
                {
                desktopImages.map((imageURl,index)=>{
                    return(
                        <div className='w-full h-full min-w-full min-h-full transition-transform duration-700 ease-in-out' key={imageURl} style={{transform : `translateX(-${currentImage * 100}%)`}}>
                            <img src={imageURl} loading='lazy' className='w-full h-full'/>
                        </div>
                    )
                    })
                }
            </div>

             {/**mobile version */}
             <div className='flex h-full w-full overflow-hidden md:hidden'>
                {
                        mobileImages.map((imageURl,index)=>{
                            return(
                            <div className='w-full h-full min-w-full min-h-full transition-transform duration-700 ease-in-out' key={imageURl} style={{transform : `translateX(-${currentImage * 100}%)`}}>
                                <img src={imageURl} loading='lazy' className='w-full h-full object-cover'/>
                            </div>
                            )
                        })
                }
              </div>
           
      </div>
    </div>
  )
}

export default BannerProduct
