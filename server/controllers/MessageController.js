

import Chat from "../models/Chat.js"
import groqClient from "../configs/groq.js"
import User from "../models/User.js"
import axios from "axios"
import imageKitClient from "../configs/imageKit.js"





// Text-based AI Chat Message Controller
export const textMessageController = async (req, res) => {
    try {
        const userId = req.user._id


        if (req.user.credits < 1) {
            return res.json({ success: false, message: "You don't have enough credits to use this feature" })
        }

        const { chatId, prompt } = req.body

        //push user message
        const chat = await Chat.findOne({ userId, _id: chatId })
        chat.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        })


        //integrating groq chat
        const { choices } = await groqClient.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful assistant.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });


        const reply = { ...choices[0].message, timestamp: Date.now(), isImage: false }


        res.json({ success: true, reply })



        chat.messages.push(reply)
        await chat.save()

        //to reduce credit by 1 for one ai chat completion...using mongoose method here
        await User.updateOne({ _id: userId }, { $inc: { credits: -1 } })



    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}







// image generation message controller
export const imageMessageController = async (req, res) => {
    try {
        const userId = req.user._id


        // Check credits ..so that it does not generate anything when it reach 0...2 credit for image generation
        if (req.user.credits < 2) {
            return res.json({ success: false, message: "You don't have enough credits to use  this feature" })
        }


        const { chatId, prompt, isPublished } = req.body


        //Find chat
        const chat = await Chat.findOne({ userId, _id: chatId })

        //push user message
        chat.messages.push({
            role: "user",
            content: prompt,
            timestamp: Date.now(),
            isImage: false
        })

        //encode the prompt
        const encodedPrompt = encodeURIComponent(prompt)


        //Construct ImageKit ai generation url
        //refer this website .. https://imagekit.io/image-api/ ...imagekit ai sesssion..in pic there is a url..we are trying to write this here..datenow is to assign different image a unique name(like event.jpg in pic)
        const generatedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}/ik-genimg-prompt-${encodedPrompt}/SynchroGPT/${Date.now()}.png?tr=w-600,h-600`


        console.log("Generated URL:", generatedImageUrl);

        //Trigger generation by fetching from ImageKit
        const aiImageResponse = await axios.get(generatedImageUrl, { responseType: "arraybuffer" })


        //convert to base64
        const base64Image = `data:image/png;base64,${Buffer.from(aiImageResponse.data, "binary").toString('base64')}`


        // Upload to Imagekit Media Library...we get live link of response but in form of imagekit url
        const uploadResponse = await imageKitClient.files.upload({
            file: base64Image,
            fileName: `${Date.now()}.png`,
            folder: "SynchroGPT" //same name as mentioned in generatedimageurl
        })


        const reply = {
            role: 'assistant',
            content: uploadResponse.url,
            timestamp: Date.now(),
            isImage: true,
            isPublished
        }


        res.json({ success: true, reply })

        chat.messages.push(reply)
        await chat.save()

        //to reduce credit by 2 for one ai chat completion...using mongoose method here
        await User.updateOne({ _id: userId }, { $inc: { credits: -2 } })


    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}