import { Link } from "react-router-dom"

const VehicleNotRegistered = () => {
    return (
        <>
            <div className="h-19/20 flex items-center justify-center" >
                <div className="m-auto">
                    <p className="text-primary">Permission Denied</p>
                    <h1 className="text-3xl">
                        Vehicle is not registered
                    </h1>
                </div>
            </div>
            <div className="flex justify-end" >
                <Link to="../maintainer_login" className="mr-10">Settings</Link>
            </div>
        </>

    )
}


export default VehicleNotRegistered