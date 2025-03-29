import Hospital from '../../shared/models/hospitalModel.js'
import validator from 'validator'


export const getHopsitals = async(req,res) =>
{
    const { city, Bed, ICU, Emergency_Unit} = req.body

    
    if(!(city) ||!(Bed) ||!(ICU) ||!(Emergency_Unit) )
        {
            throw Error("All fields required")
        }
    
    if(!validator.isAlpha(city))
    {
        throw Error("City must be in words")
    }

    if(!validator.isNumeric(Bed))
        {
            throw Error("Beds must be in numbers")
        }

    try
    {
        const SuggestedHospitals = await Hospital.find({city, Bed:{ $gte: Bed }, ICU, Emergency_Unit})
        
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