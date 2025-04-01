import Hospital from '../../shared/models/hospitalModel.js'
import validator from 'validator'


export const getHopsitals = async(req,res) =>
{
    const { city, Bed, ICU, EUisTrue} = req.body

    console.log(city)
    console.log(Bed)
    console.log(EUisTrue)
    
    if(!(Bed) )
     {
         throw Error("All fields required")
    }
    
    /*if(!validator.isAlpha(city))
    {
        throw Error("City must be in words")
    }*/

    if(!validator.isNumeric(Bed))
        {
            throw Error("Beds must be in numbers")
        }
    
    if(!validator.isNumeric(ICU))
        {
            throw Error("ICU must be in numbers")
        }

    try
    {
        console.log("searching hospitals")
        const SuggestedHospitals = await Hospital.find({city, Bed:{ $gte: Bed }, ICU:{ $gte: ICU }, Emergency_Unit: EUisTrue})
        console.log(SuggestedHospitals)

        if(SuggestedHospitals.length === 0)
        {
            console.log("No hospitals")
        }

        res.json(SuggestedHospitals)
    }
    catch(err)
    {
        console.error(err)
    }
    
}