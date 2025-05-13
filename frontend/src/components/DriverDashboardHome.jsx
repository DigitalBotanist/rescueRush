import { useAuthContext } from "../hooks/useAuthContext";
import { useVehicleContext } from "../hooks/useVehicleContext";
import MapWithMarker from "./MapWithMarker";
import ProfileImage from "./ProfileImage";
import UserImage from "./UserImage";

const DriverDashboardHome = () => {
    const { user } = useAuthContext();
    const { vin, paramedic, location, isConnected } = useVehicleContext();

    return (
        <div className="flex w-full h-full">
            {/* left */}
            <div className="flex-1 flex flex-col h-full">
                {/* top row */}
                <div className="flex w-full h-fit gap-20 justify-between p-3">
                    {/* vehicle info */}
                    <div className="bg-white grow rounded-2xl p-5">
                        <span className="text-2xl block mb-5">
                            Vehicle Info
                        </span>
                        <div className="flex w-ful justify-between pr-5">
                            <span>VIN</span>
                            <span className="font-light">{vin}</span>
                        </div>
                        <div className="flex w-ful justify-between pr-5">
                            <span>Status</span>
                            <span className="font-light">
                                {isConnected ? "ACTIVE" : "NOT ACTIVE"}
                            </span>
                        </div>
                    </div>
                    {/* connection status */}
                    {isConnected ? (
                        <div className="w-fit bg-secondary-green rounded-2xl p-2 flex justify-center items-center h-10">
                            CONNECTED
                        </div>
                    ) : (
                        <div className="w-fit bg-primary-500 rounded-2xl p-2 flex justify-center items-center h-10">
                            NOT CONNECTED
                        </div>
                    )}
                </div>
                {/* driver info */}
                <div className="flex w-full h-fit gap-20 justify-between p-3">
                    <div className="bg-white grow rounded-2xl p-5">
                        <span className="text-2xl block mb-5">Driver</span>
                        <div className="flex items-center justify-between gap-10">
                            {/* driver image */}
                            <div className="h-full aspect-square w-20 rounded">
                                <UserImage
                                    user_img={user.profileImage}
                                    rounded="true"
                                />
                            </div>
                            {/* driver name, contact */}
                            <div className="grow h-full">
                                <div className="flex w-ful h-full items-center justify-between pr-5">
                                    <span>Name</span>
                                    <span className="font-light">
                                        {user.firstName} {user.lastName}
                                    </span>
                                </div>
                                <div className="flex w-ful justify-between pr-5">
                                    <span>Contact</span>
                                    <span className="font-light">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* paramedic info */}
                {/* todo: show paramedic details when logged in */}
                <div className="flex w-full h-fit gap-20 justify-between p-3">
                    <div className="bg-white grow rounded-2xl p-5">
                        <span className="text-2xl block mb-5">
                            Paramedic Info
                        </span>

                        <div className="flex flex-col gap-6">
                            {paramedic ? (
                                <div className="flex items-center justify-between gap-10">
                                    {/* driver image */}
                                    <div className="h-full aspect-square w-20 rounded">
                                        <ProfileImage
                                            user_img={paramedic.profileImage}
                                            rounded={true}
                                        />
                                    </div>
                                    {/* driver name, contact */}
                                    <div className="grow h-full">
                                        <div className="flex w-ful h-full items-center justify-between pr-5">
                                            <span>Name</span>
                                            <span className="font-light">
                                                {paramedic.firstName}{" "}
                                                {paramedic.lastName}
                                            </span>
                                        </div>
                                        <div className="flex w-ful justify-between pr-5">
                                            <span>Contact</span>
                                            <span className="font-light">
                                                {paramedic.email}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>No paramedic logged in </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* right */}
            <div className="flex-3 bg-white h-full rounded-2xl z-0">
                {<MapWithMarker location={location} isVehicle="true" />}
            </div>
        </div>
    );
};

export default DriverDashboardHome;
