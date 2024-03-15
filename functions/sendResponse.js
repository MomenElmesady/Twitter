module.exports = (res,data,message)=>{
  res.status(200).json({
    status: "success",
    data: data,
    message: message 
  })
}