import { useState, useRef, useEffect } from "react";
import Peer from "peerjs";
import { useAuthContext } from "./useAuthContext";

const useVoiceCall = () => {
    const { user, callSocket: socket } = useAuthContext();
    const [peerId, setPeerId] = useState("");
    const [remotePeerId, setRemotePeerId] = useState(null);
    const [participant, setParticipant] = useState(null);
    const [isIncomingCall, setIsIncomingCall] = useState(false);
    const [incomingCall, setIncomingCall] = useState(null); // { call, callerId } or null
    const [isConnected, setIsConnected] = useState(false);
    const peerInstance = useRef(null);
    const localStream = useRef(null);
    const remoteAudioRef = useRef(null);

    useEffect(() => {
        if (!peerInstance.current) {
            //initiate the peer
            const peer = new Peer();
            peerInstance.current = peer;

            peer.on("open", (id) => {
                console.log("peer id", id);
                setPeerId(id);
            });

            peer.on("call", (call) => {
                setIncomingCall({ call, callerId: call.peer });
            });
            peer.on("error", (err) => {
                console.error("Peer error:", err);
            });
        }

        if (!socket) return;
        socket.on("call_rejected", ({ receiverId }) => {
            alert(`Call rejected by ${receiverId}`);
        });

        socket.on("call_accepted", ({ receiverId, peerId }) => {
            console.log("call_accepted: ", receiverId, peerId);
            handleCallAccepted(receiverId, peerId);
        });

        socket.on("call_request_error", (message) => {
            console.log("call_request_error:", message);
        });

        socket.on("incoming_call", ({ sender, peerId }) => {
            console.log("incoming_call");
            handleIncomingCall(sender, peerId);
        });

        socket.on("call_ended", ({ from }) => {
            console.log("call_ended");
            handleCallEnded();
        });

        // socket.on("assign_peer_error", (message) => {
        //     console.log("_error:", message)
        // })
        return () => {
            if (peerInstance.current) {
                peerInstance.current.destroy();
                peerInstance.current = null;
            }
            if (socket) {
            }
        };
    }, [socket]);

    const handleCallAccepted = (receiverId, peerId) => {
        setRemotePeerId(peerId);

        // initiated the call
        initiateCall(peerId);
    };

    const handleIncomingCall = (sender, peerId) => {
        setParticipant(sender);
        setRemotePeerId(peerId);
        setIsIncomingCall(true);
    };

    const handleCallEnded = () => {
        // Stop all tracks of the local stream
        if (localStream.current) {
            localStream.current.getTracks().forEach((track) => track.stop());
            localStream.current = null;
        }

        // Close any active call (incoming or outgoing)
        if (incomingCall?.call) {
            incomingCall.call.close();
        }

        if (peerInstance.current && peerInstance.current.connections) {
            Object.values(peerInstance.current.connections).forEach(
                (connectionArray) => {
                    connectionArray.forEach((connection) => connection.close());
                }
            );
        }
        // Reset state
        setIsConnected(false);
        setIsIncomingCall(false);
        setRemotePeerId(null);
        setIncomingCall(null);
        setParticipant(null);

        if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = null;
        }
    };

    const acceptIncomingCall = () => {
        console.log("accept call", participant._id);
        socket.emit("accept_call", { senderId: participant._id, peerId });
        
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
                localStream.current = stream;

                // answer the call with local audio
                if (incomingCall?.call) {
                    incomingCall.call.answer(stream);

                    incomingCall.call.on("stream", (remoteStream) => {
                        if (remoteAudioRef.current) {
                            remoteAudioRef.current.srcObject = remoteStream;
                            remoteAudioRef.current.play().catch((err) => {
                                console.error("Audio playback error:", err);
                            });
                        }
                        setIsConnected(true);
                        setIsIncomingCall(false);
                    });

                    incomingCall.call.on("close", () => {
                        setIsConnected(false);
                        setRemotePeerId("");
                    });

                    incomingCall.call.on("error", (err) => {
                        console.error("Call error:", err);
                        setIsConnected(false);
                    });
                }
            })
            .catch((err) => {
                console.error("Failed to get local stream:", err);
            });
    };

    const rejectIncomingCall = () => {
        console.log("reject call", participant._id);
        socket.emit("reject_call", { senderId: participant._id });
        setIsIncomingCall(false);
        setIsConnected(false);
    };

    const callRequest = (receiverId) => {
        console.log("call request", receiverId);
        socket.emit("call_request", { receiverId, peerId });
        console.log("sent call request: ", { receiverId, peerId });
    };

    const initiateCall = (remotePeerId) => {
        // check if the remote id or peerInstance is already created
        if (!remotePeerId || !peerInstance.current) {
            console.error("Invalid peer ID or peer instance not ready");
            return;
        }

        // get audio and set up listeners
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
                localStream.current = stream; // setup localStream ref

                // make a new call
                const call = peerInstance.current.call(remotePeerId, stream);
                if (call) {
                    // listen to the stream
                    call.on("stream", (remoteStream) => {
                        if (remoteAudioRef.current) {
                            remoteAudioRef.current.srcObject = remoteStream;
                            remoteAudioRef.current.play().catch((err) => {
                                console.error("Audio playback error:", err);
                            });
                        }
                        setIsConnected(true);
                        setIsIncomingCall(false);
                    });
                    call.on("error", (err) => {
                        console.error("Call error:", err);
                        setIsConnected(false);
                    });
                    call.on("close", () => {
                        setIsConnected(false);
                        setRemotePeerId("");
                    });
                } else {
                    console.error("Failed to initiate call");
                }
            })
            .catch((err) => {
                console.error("Failed to get local stream:", err);
            });
    };

    const endCall = () => {
        console.log("Ending call...");
        socket.emit("end_call", {
            participant: participant._id,
            from: user._id,
        });
        // Stop all tracks of the local stream
        if (localStream.current) {
            localStream.current.getTracks().forEach((track) => track.stop());
            localStream.current = null;
        }

        // Close any active call (incoming or outgoing)
        if (incomingCall?.call) {
            incomingCall.call.close();
        }

        if (peerInstance.current && peerInstance.current.connections) {
            Object.values(peerInstance.current.connections).forEach(
                (connectionArray) => {
                    connectionArray.forEach((connection) => connection.close());
                }
            );
        }

        // Reset state
        setIsConnected(false);
        setIsIncomingCall(false);
        setRemotePeerId(null);
        setIncomingCall(null);
        setParticipant(null);

        if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = null;
        }
    };

    return {
        callRequest,
        isIncomingCall,
        rejectIncomingCall,
        acceptIncomingCall,
        participant,
        remoteAudioRef,
        isConnected,
        endCall,
    };
};

export default useVoiceCall;
