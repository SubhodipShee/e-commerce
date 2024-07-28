import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'

const Home = () => {
  return (
    <div>
      <CategoryList/>
      <BannerProduct/>


      <HorizontalCardProduct category={"airpodes"} heading={"Best Selling Airpodes"}/>

      <HorizontalCardProduct category={"watches"} heading={"Trending Watches"}/>
      <VerticalCardProduct category={"mobiles"} heading={"Popular Mobiles"}/>
      <VerticalCardProduct category={"Mouse"} heading={"Mouses"}/>
      <VerticalCardProduct category={"televisions"} heading={"Televisons"}/>
      <VerticalCardProduct category={"camera"} heading={"Cameras"}/>
      <VerticalCardProduct category={"earphones"} heading={"Wired & Wireless Earphones"}/>
      <VerticalCardProduct category={"refrigerator"} heading={"Refrigeraor"}/>
      <VerticalCardProduct category={"speakers"} heading={"Speakers"}/>
      <VerticalCardProduct category={"trimmers"} heading={"Trimmmers"}/>
      
    
      
    </div>
  )
}

export default Home
