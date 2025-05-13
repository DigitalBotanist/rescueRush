import React, { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const ProfileImage = ({ user_img, rounded}) => {
    const {user} = useAuthContext()
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch image when component mounts or when userId changes
    useEffect(() => {
        console.log(user_img)
        const fetchImage = async () => {
            try {
                const response = await fetch(`/api${user_img}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${user.token}`, // Pass the Bearer token for authentication
                    },
                });

                if (!response.ok) {
                    throw new Error("Image fetch failed");
                }

                // Convert the response to a Blob (binary large object)
                const imageBlob = await response.blob();

                // Create a URL for the Blob
                const imageUrl = URL.createObjectURL(imageBlob);
                setImageUrl(imageUrl);
            } catch (error) {
                console.error("Error fetching the image:", error);
                setError("Failed to load image");
            } finally {
                setLoading(false);
            }
        };

        if (user_img) {
            fetchImage();
        }
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt="User Profile"
                    className={`h-full aspect-square object-cover  ${rounded && 'rounded-[50%]'}`}
                />
            ) : (
                <div>No image available</div>
            )}
        
        </>
    );
};

export default ProfileImage;