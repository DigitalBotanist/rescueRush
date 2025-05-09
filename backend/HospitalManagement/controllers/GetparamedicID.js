import mongoose from 'mongoose'

const Paramedicid=null;

const addOtherDetails = async(req,res) =>
{
    const {paramedicID} = req.body;    
    Paramedicid = paramedicID;

    res,JSON(Paramedicid)
    
}