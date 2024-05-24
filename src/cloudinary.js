import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';
config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: process.env.CLOUDINARY_SECURE
})

export async function uploadImage(filePath) {
    return await cloudinary.uploader.upload(filePath, {
        folder: 'cokieEnterprice/profilePics'
    })
}

export async function uploadVideoPost(filePath) {
    return await cloudinary.uploader.upload(filePath, {
        resource_type: "video",
        folder: 'cokieEnterprice/posts/videos'
    })
}

export async function IploadImagePost(filePath) {
    return await cloudinary.uploader.upload(filePath, {
        folder: 'cokieEnterprice/posts/images'
    })
}

export async function uploadImageStory(filePath) {
    return await cloudinary.uploader.upload(filePath, {
        folder: 'cokieEnterprice/story/images'
    })
}

export async function uploadVideoStory(filePath) {
    return await cloudinary.uploader.upload(filePath, {
        resource_type: "video",
        folder: 'cokieEnterprice/story/videos'
    })
}

export async function uploadImageChat(filePath) {
    return await cloudinary.uploader.upload(filePath, {
        folder: 'cokieEnterprice/user/chats/images'
    })
}