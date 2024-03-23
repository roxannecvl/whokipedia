import { z } from 'zod'

export const schema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Must be at least 6 characters')
})

export type Schema = z.infer<typeof schema>

export function validateForm(data: Schema) {
    try {
        schema.parse(data)
        return null
    } catch (error) {
        return error
    }
}