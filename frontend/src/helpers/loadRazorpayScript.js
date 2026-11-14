// load Razorpay checkout script only when user clicks Payment
const loadRazorpayScript = () =>{
    return new Promise((resolve)=>{
        if(window.Razorpay){
            return resolve(true)
        }

        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"
        script.onload = () => resolve(true)
        script.onerror = () => resolve(false)
        document.body.appendChild(script)
    })
}

export default loadRazorpayScript
