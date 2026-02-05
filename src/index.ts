import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { TikTokLiveConnection } from 'tiktok-live-connector'

const app = new Elysia()
    .use(cors())
    .get('/', () => 'Hello from Vercel!')
    
    .get('/tiktok-followers', async () => {
        const username = 'luliyykitty'
        try {
            const response = await fetch(`https://www.tiktok.com/@${username}`, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' 
                }
            })
            
            if (!response.ok) throw new Error('TikTok Fetch Failed')
            
            const html = await response.text()
            
            const match = html.match(/"followerCount":(\d+)/)
            
            if (match && match[1]) {
                return { 
                    followers: parseInt(match[1], 10),
                    cached: false
                }
            } else {
                return { error: "Could not parse follower count" }
            }
        } catch (error) {
            return { error: "Failed to fetch data" }
        }
    })

    .get('/tiktok-status', async () => {
        const tiktokUsername = 'luliyykitty'
        try {
            const connection = new TikTokLiveConnection(tiktokUsername)
            const state = await connection.connect()
            const data = { isLive: true }
            connection.disconnect()
            return data
        } catch (err) {
            return { isLive: false }
        }
    })

export default app
