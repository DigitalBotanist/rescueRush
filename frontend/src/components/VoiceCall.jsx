import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";

const VoiceCall = ({ socket, type, receiverId, isOpen, handleCloseOpen }) => {
    const [peerId, setPeerId] = useState("");
    const [remotePeerId, setRemotePeerId] = useState("");
    const [isConnected, setIsConnected] = useState(null);
    const peerInstance = useRef(null);
    const localStream = useRef(null);
    const remoteAudioRef = useRef(null);

    useEffect(() => {
        const peer = new Peer();
        peerInstance.current = peer;

        peer.on("open", (id) => {
            setPeerId(id);
        });

        peer.on("error", (err) => {
            console.error("Peer error:", err);
        });

        if (socket) {
            socket.on("assign_peer", (remoteId) => {
                setRemotePeerId(remoteId);
                initiateCall(remoteId);
            });

            socket.on("disconnect", () => {
                setIsConnected(false);
                setRemotePeerId("");
                if (peerInstance.current) {
                    peerInstance.current.destroy();
                    peerInstance.current = null;
                    setPeerId("");
                }
            });
        }

        return () => {
            if (peerInstance.current) {
                peerInstance.current.destroy();
                peerInstance.current = null;
            }
            if (socket) {
                socket.off("assign_peer");
                socket.off("disconnect");
            }
        };
    }, [socket]);

    const setupReceiveHandler = (peer) => {
        peer.on("call", (call) => {
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
                })
                .catch((err) => {
                    console.error(
                        "Failed to get local stream for answering:",
                        err
                    );
                });
        });
    };

    const initiateCall = (remoteId) => {
        if (!remoteId || !peerInstance.current) {
            console.error("Invalid peer ID or peer instance not ready");
            return;
        }
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
                localStream.current = stream;
                const call = peerInstance.current.call(remoteId, stream);
                if (call) {
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
                } else {
                    console.error("Failed to initiate call");
                }
            })
            .catch((err) => {
                console.error("Failed to get local stream:", err);
            });
    };

    const startCall = () => {
        if (isConnected) {
            console.error("already connected");
            return;
        }

        if (!socket) {
            console.error("socket is not given");
            return;
        }

        if (!peerInstance.current) {
            // Reinitialize PeerJS if destroyed
            const peer = new Peer();
            peerInstance.current = peer;
            peer.on("open", (id) => {
                setPeerId(id);
                // Register peer with signaling server
                socket.emit("register_peer", { peerId: id, type, receiverId });
                // Setup receive handler
                setupReceiveHandler(peer);
            });
            peer.on("error", (err) => {
                console.error("Peer error:", err);
            });
        } else if (peerId) {
            // Peer already initialized, just register
            socket.emit("register_peer", { peerId, type, receiverId });
            setupReceiveHandler(peerInstance.current);
        } else {
            console.error("Peer ID not yet available");
            alert("Waiting for peer initialization");
            return;
        }
    };

    const endCall = () => {
        if (localStream.current) {
            localStream.current.getTracks().forEach((track) => track.stop());
        }
        setIsConnected(false);
        setRemotePeerId("");
        if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = null;
        }
        if (peerInstance.current) {
            peerInstance.current.destroy();
            peerInstance.current = null;
            setPeerId("");
        }
        if (socket) {
            socket.emit("unregister_peer", {
                type,
                receiverId,
                peerId,
            });
        }
    };

    return (
        <div className="absolute h-full w-full z-30 flex items-center justify-center">
            <div
                className="absolute h-full w-full bg-black opacity-20 z-0"
                onClick={handleCloseOpen}
            ></div>
            <div className={`bg-white p-6 rounded-lg shadow-lg w-96 z-30`}>
                <h1 className="text-2xl font-bold mb-4 text-center">
                    Voice Call
                </h1>
                <div className="mb-4">
                    <p className="text-sm text-gray-600">
                        Your ID: {peerId || "Not generated"}
                    </p>
                    <p className="text-sm text-gray-600">
                        Connected to: {remotePeerId || "Not connected"}
                    </p>
                </div>
                <div className="flex justify-between">
                    <button
                        onClick={startCall}
                        className={`px-4 py-2 rounded text-white ${
                            isConnected
                                ? "bg-gray-400"
                                : "bg-blue-500 hover:bg-blue-600"
                        }`}
                        disabled={isConnected || !socket}
                    >
                        Call
                    </button>
                    <button
                        onClick={endCall}
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
        </div>
    );
};

export default VoiceCall;
