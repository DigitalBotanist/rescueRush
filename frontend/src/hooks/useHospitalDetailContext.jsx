import {DetailHospitalContext} from "../context/DetailHospitalContext"

import {useContext} from 'react'

export const useHospitalDetailsContext =() =>{
    const context = useContext(DetailHospitalContext)

    if(!context){
        throw Error('useHospitalDetailsContext must be used inside the HospitalContextProvider')

    }
    return context
}

