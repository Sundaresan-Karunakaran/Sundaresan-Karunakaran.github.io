import matter from 'gray-matter'
import {marked} from 'marked'

export function parsePost(raw: string){
    try {
        console.log("parsePost: Starting")
        console.log("parsePost: raw content length:", raw.length)
        console.log("parsePost: About to call matter()")
        
        let parsed
        try {
            parsed = matter(raw)
            console.log("parsePost: matter() succeeded")
        } catch (matterError) {
            console.error("parsePost: matter() error:", matterError)
            throw matterError
        }
        
        const { data, content } = parsed
        console.log("parsePost: matter() succeeded")
        console.log("HELLO WORLD")
        console.log(data.title)
        console.log("parsePost: About to call marked()")
        const html = marked.parse(content)
        console.log("parsePost: marked() succeeded")
        
        // Convert date to string if it's a Date object
        let dateString = ''
        if (data.date) {
            if (data.date instanceof Date) {
                dateString = data.date.toISOString().split('T')[0] // Format as YYYY-MM-DD
            } else {
                dateString = String(data.date)
            }
        }
        
        return {
            title: data.title || 'No title',
            subtitle: data.subtitle || '',
            date: dateString,
            html: String(html)
        }
    } catch (error) {
        console.error("parsePost error:", error)
        throw error
    }
}