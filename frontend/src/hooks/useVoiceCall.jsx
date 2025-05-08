import { useState, useRef, useEffect } from "react";
import Peer from "peerjs";

const useVoiceCall = ( socket, type, receiverId ) => {
    const [peerId, setPeerId] = useState("");
    const [remotePeerId, setRemotePeerId] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [incomingCall, setIncomingCall] = useState(null); // { call, callerId } or null
    const peerInstance = useRef(null);
    const localStream = useRef(null);
    const remoteAudioRef = useRef(null);

    useEffect(() => {
        if (!peerInstance.current) {
            //initiate the peer
            const peer = new Peer();
            peerInstance.current = peer;

            peer.on("open", (id) => {
                console.log("peer id", id)
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

        // this is from the caller, receiving id 
        socket.on("register_peer", (remoteId) => {
            console.log("register peerId: ", remoteId)

            setRemotePeerId(remoteId.peerId)
            const currentPeerId = peerInstance.current?.id;
            setPeerId(currentPeerId)
            console.log("current peerid: ", currentPeerId)
            console.log("register peer receiver id", receiverId)
            socket.emit("assign_peer", {type, peerId: currentPeerId, receiverId: remoteId.vehicle.vehicle._id})
        })
        

        // this is from the receiver 
        socket.on("assign_peer", (remoteId) => {
            console.log("assign peer:", remoteId);
            
            setRemotePeerId(remoteId)
            // make the call 
            initiateCall(remoteId)
            
        })

        socket.on("call_rejected", ({ peerId }) => {
            alert(`Call rejected by ${peerId}`);
            setIsConnected(false);
            setRemotePeerId("");
            setIncomingCall(null);
        });

        socket.on("register_peer_error", (message) => {
            console.log(message)
        })

        socket.on("assign_peer_error", (message) => {
            console.log(message)
        })
        return () => {
            if (peerInstance.current) {
                peerInstance.current.destroy();
                peerInstance.current = null;
            }
            if (socket) {
                socket.off("peer_registered");
                socket.off("register_request");
                socket.off("no_peer_available");
                socket.off("call_rejected");
            }
        };
    }, [socket]);


    const initiateCall = (remoteId) => {
        // check if the remote id or peerInstance is already created
        if (!remoteId || !peerInstance.current) {
            console.error("Invalid peer ID or peer instance not ready");
            return;
        }
                console.log("int")

        // get audio and set up listeners
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
                localStream.current = stream; // setup localStream ref

                // make a new call
                const call = peerInstance.current.call(remoteId, stream);
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

    const startCall = () => {
        // check if already connected or not 
        if (isConnected || incomingCall) {
            console.error("Already connected or incoming call pending");
            return;
        }

        // check if socket is given
        if (!socket) {
            console.error("Socket not provided");
            return;
        }

        if (!peerInstance.current) { // if peer is not created yet create it 
            const peer = new Peer();
            peerInstance.current = peer;
            peer.on("open", (id) => {
                setPeerId(id);
                console.log(id)
                socket.emit("register_peer", { peerId: id, type, receiverId }); // send register_peer message to the server
            });
            peer.on("call", (call) => {
                    console.log("inside", call)
                setIncomingCall({ call, callerId: call.peer });
            });
            peer.on("error", (err) => {
                console.error("Peer error:", err);
                alert("Peer connection error: " + err.message);
            });
        } else if (peerId) {    // if peerInstance is already created 
            socket.emit("register_peer", { peerId, type, receiverId });
        } else {
            console.error("Peer ID not yet available");
            return;
        }
    }


    const acceptCall = () => {
        if (!incomingCall) {
            console.error("No incoming call to accept");
            return;
        }
        const { call } = incomingCall;
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
                localStream.current = stream;
                call.answer(stream);
                call.on("stream", (remoteStream) => {
                    if (remoteAudioRef.current) {
                        remoteAudioRef.current.srcObject = remoteStream;
                        remoteAudioRef.current.play().catch((err) => {
                            console.error("Audio playback error:", err);
                        });
                    }
                    setIsConnected(true);
                    setRemotePeerId(call.peer);
                });
                call.on("error", (err) => {
                    console.error("Call error:", err);
                    setIsConnected(false);
                });
                call.on("close", () => {
                    setIsConnected(false);
                    setRemotePeerId("");
                });
                setIncomingCall(null);
            })
            .catch((err) => {
                console.error("Failed to get local stream for answering:", err);
            });
    };

    const rejectCall = () => {
        if (!incomingCall) {
            console.error("No incoming call to reject");
            return;
        }
        const { call } = incomingCall;
        call.close();
        setIncomingCall(null);
        if (socket) {
            socket.emit("call_rejected", { peerId, rejectedPeerId: call.peer });
        }
    };

    const endCall = () => {
        console.log("end call")
        if (localStream.current) {
            localStream.current.getTracks().forEach((track) => track.stop());
        }
        setIsConnected(false);
        setRemotePeerId("");
        setIncomingCall(null);
        if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = null;
        }
        // if (peerInstance.current) {
        //     peerInstance.current.destroy();
        //     peerInstance.current = null;
        //     setPeerId("");
        // }
        if (socket) {
            socket.emit("unregister_peer", { peerId, type, receiverId });
        }
    };

    return {
        peerId,
        remotePeerId,
        isConnected,
        incomingCall,
        remoteAudioRef,
        startCall,
        endCall,
        acceptCall,
        rejectCall,
    };
};

export default useVoiceCall;
