import { useVehicleContext } from "../hooks/useVehicleContext";
import useVoiceCall from "../hooks/useVoiceCall";
import ProfileImage from "./ProfileImage";
import UserImage from "./UserImage";

const VehicleVoiceCall = ({ user }) => {
    console.log(user);
    const {
        callRequest,
        isIncomingCall,
        rejectIncomingCall,
        acceptIncomingCall,
        participant,
        isConnected,
        remoteAudioRef,
        endCall
    } = useVoiceCall();
    return (
        <div className="relative z-50 w-75">
            <div className="bg-white/80 p-5 rounded-2xl flex flex-col items-center gap-5">
                <div>
                    <div className="w-20 ">
                        <ProfileImage
                            user_img={user.profileImage}
                            rounded={true}
                        />
                    </div>
                    <h1 className="text-lg">
                        {user.firstName} {user.lastName}
                    </h1>
                </div>
                {isConnected ? (
                    <button className="bg-primary-500 w-full p-3 rounded-xl cursor-pointer" onClick={endCall}>
                        End Call
                    </button>
                ) : (
                    <button
                        className="bg-secondary-green-400 w-full p-3 rounded-xl cursor-pointer"
                        onClick={() => callRequest(user._id)}
                    >
                        Call
                    </button>
                )}
            </div>
            <audio ref={remoteAudioRef} className="hidden" />
        </div>
    );
};

export default VehicleVoiceCall;
