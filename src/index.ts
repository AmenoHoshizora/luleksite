import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { TikTokLiveConnection } from 'tiktok-live-connector'

const app = new Elysia()
    .use(cors())
    .get('/', () => 'Hello from Vercel!') 
    .get('/tiktok-status', async () => {
        const tiktokUsername = 'luliyykitty'
        try {
            const connection = new TikTokLiveConnection(tiktokUsername)
            const state = await connection.connect()
            
            const data = {
                isLive: true
            }
            connection.disconnect()
            return data
        } catch (err) {
            return { isLive: false }
        }
    })
export default app
