// ask Cloudinary for a smaller, compressed version of the image
// c_limit,w_ = resize down to this width (never upscale), q_auto = auto quality, f_auto = best format (webp/avif) for the browser
const optimizeImage = (url, width = 400) => {
    if(!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")){
        return url
    }

    return url.replace("/upload/", `/upload/c_limit,w_${width},q_auto,f_auto/`)
}

export default optimizeImage
