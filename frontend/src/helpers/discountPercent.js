// percentage off from the original price, e.g. price 2699 and selling price 1199 = 56
const discountPercent = (price, sellingPrice) =>{
    if(!price || !sellingPrice || sellingPrice >= price){
        return 0
    }

    return Math.round(((price - sellingPrice) / price) * 100)
}

export default discountPercent
