import { useCallopContext } from "../hooks/useCallopContext";
import useVoiceCall from "../hooks/useVoiceCall";
import ProfileImage from "./ProfileImage";

const CallopVoiceCall = () => {
    const {
        callRequest,
        isIncomingCall,
        rejectIncomingCall,
        acceptIncomingCall,
        participant,
        remoteAudioRef,
        isConnected,
        endCall
    } = useVoiceCall();
    return (
        <div className="h-full w-full p-2">
            {participant &&
                (isIncomingCall ? (
                    <div className="bg-gradient-to-b from-gray-200 via-gray-300 to-gray-500  p-5 rounded-2xl flex flex-col items-center justify-between gap-5 h-full w-full">
                        <div className="flex flex-col items-center">
                            <div className="w-20">
                                <ProfileImage
                                    user_img={participant.profileImage}
                                    rounded={true}
                                />
                            </div>
                            <h1 className="text-lg">
                                {participant.firstName} {participant.lastName}
                            </h1>
                        </div>
                        <div className="flex gap-3 w-full">
                            <button
                                className="bg-secondary-green-400 w-full p-3 rounded-xl cursor-pointer"
                                onClick={() => acceptIncomingCall()}
                            >
                                accept
                            </button>

                            <button
                                className="bg-primary-500 w-full p-3 rounded-xl cursor-pointer"
                                onClick={() => rejectIncomingCall()}
                            >
                                reject
                            </button>
                        </div>
                    </div>
                ) : isConnected ? (
                    <div className="bg-gradient-to-b from-gray-200 to-gray-400 p-5 rounded-2xl flex flex-col items-center justify-between gap-5 h-full w-full">
                        <div className="w-full flex flex-col gap-5">
                            <div className="flex flex-col items-center">
                                <div className="w-20">
                                    <ProfileImage
                                        user_img={participant.profileImage}
                                        rounded={true}
                                    />
                                </div>
                                <h1 className="text-lg">
                                    {participant.firstName}{" "}
                                    {participant.lastName}
                                </h1>
                            </div>
                            <button className="bg-primary-500 w-full p-3 rounded-xl cursor-pointer" onClick={endCall}>
                                End Call
                            </button>
                        </div>
                    </div>
                ) : (
                    <></>
                ))}
            <audio ref={remoteAudioRef} className="hidden" />
        </div>
    );
};

export default CallopVoiceCall;
