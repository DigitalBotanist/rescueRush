import mongoose from 'mongoose' 
import Hospital from '../../shared/models/hospitalModel.js'

//get 
export const getdetails= async(req,res)=>{
    const getDetails= await Hospital.find({})

    res.status(200).json(getDetails)
}


//get using id


//create 
export const createDetails = async(req,res)=>{
    const {location,name,Bed,ICU,Emergency_Unit}=req.body
    
    // add doc to db
    try{

        const detail=await Hospital.createNew(location,name,Bed,ICU,Emergency_Unit)
        res.status(200).json(detail)
    }catch(error){
        res.status(400).json({msg:error.message})
    }
}


//delete
export const deleteDetails =async(req,res)=>{
    const{id}=req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({ërror:"No such workout"})
    }

    const detail= await Hospital.findOneAndDelete({_id:id})

    if(!detail){
        return res.status(400).json({ërror:"No such workout"})
    }

    return res.status(200).json(detail)
}


//update
export const upadateDetails =async(req,res)=>{
     const{name}=req.params

     if(!mongoose.Types.ObjectId.isValid(id)){
         return res.status(404).json({ërror:"No such workout"})
     }

     const detail= await Hospital.findOneAndUpdate({_name:name},{
         ...req.body
     })

     if(!detail){
         return res.status(400).json({ërror:"No such workout"})
     }

     return res.status(200).json(detail)
}
