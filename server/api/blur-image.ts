import Jimp from "jimp"
import z from "zod"

export default defineEventHandler(async (event) => {
    const value = await readBody(event)

    const schema = z.object({
        url: z.string(),
        blur: z.number()
    })

    const data = schema.safeParse(value)

    if (!data.success) {
        throw createError({
            statusCode: 400,
            statusMessage: data.error.message
        })
    }

    const { url, blur} = data.data

    if (!event.context || !event.context.params) {
        throw createError({
            statusCode: 400,
            statusMessage: "Missing parameter"
        })
    }

    const response = await fetch(url)

    if (!response.ok) {
        throw createError({
            statusCode: response.status,
            statusMessage: response.statusText
        })
    }

    const blob = await response.blob()
    const image = await Jimp.read(Buffer.from(await blob.arrayBuffer()))

    if (blur > 0) {
        image.blur(blur)
    }

    return await image.getBase64Async(Jimp.MIME_JPEG)

    // return `<img src="${await image.getBase64Async(Jimp.MIME_JPEG)}" />`
})