import { useCallopContext } from "../hooks/useCallopContext";
import useVoiceCall from "../hooks/useVoiceCall";

const CallopVoiceCall = () => {
    const { socket: callSocket, connectedVehicleId } = useCallopContext();

    const {
        peerId,
        remotePeerId,
        isConnected,
        incomingCall,
        remoteAudioRef,
        startCall,
        endCall,
        acceptCall,
        rejectCall,
    } = useVoiceCall(
        socket,
        "callop",
        connectedVehicleId,
    );
    return (
        <div>
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 z-30">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    Voice Call
                </h1>
                {incomingCall && !isConnected ? (
                    <div className="mb-4 p-4 bg-yellow-100 rounded">
                        <p className="text-sm text-yellow-800">
                            Incoming call from {incomingCall.callerId}
                        </p>
                        <div className="flex justify-between mt-2">
                            <button
                                onClick={acceptCall}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Accept
                            </button>
                            <button
                                onClick={rejectCall}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">
                            Your ID: {peerId || "Not generated"}
                        </p>
                        <p className="text-sm text-gray-600">
                            Connected to: {remotePeerId || "Not connected"}
                        </p>
                    </div>
                )}
            </div>
            <div className="flex justify-between">
                <button
                    onClick={startCall}
                    className={`px-4 py-2 rounded text-white ${
                        isConnected || incomingCall || !peerId
                            ? "bg-gray-400"
                            : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    // disabled={isConnected || incomingCall || !callopSocket || !peerId}
                >
                    Call
                </button>
                <button
                    onClick={() => {
                        endCall();
                        handleCloseOpen();
                    }}
                    className={`px-4 py-2 rounded text-white ${
                        isConnected
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-gray-400"
                    }`}
                    disabled={!isConnected}
                >
                    End
                </button>
            </div>
            <audio ref={remoteAudioRef} className="hidden" />
        </div>
    );
};

export default CallopVoiceCall;
