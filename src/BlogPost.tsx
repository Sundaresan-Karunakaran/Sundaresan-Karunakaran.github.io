import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { loadPosts } from './lib/loadPosts'
import { parsePost } from './lib/parsePost'
import './BlogPost.css'

type FullPost = {
  title: string
  subtitle: string
  date: string
  html: string
}

export function BlogPost() {
  const { slug } = useParams()
  const [post, setPost] = useState<FullPost | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPost() {
      try {
        const rawPosts = await loadPosts()
        const match = rawPosts.find(p => p.slug === slug)

        if (!match) {
          setError(`Post not found`)
          return
        }

        setPost(parsePost(match.raw))
      } catch (err) {
        console.error('Error loading post:', err)
        setError('Failed to load post')
      }
    }

    fetchPost()
  }, [slug])

  if (error) {
    return (
      <div className="blog-container">
        <div className="blog-error">
          <p>{error}</p>
          <Link to="/" className="blog-back-link">← Back to home</Link>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="blog-container">
        <div className="blog-loading">Loading...</div>
      </div>
    )
  }

  return (
    <div className="blog-container">
      <Link to="/" className="blog-back-link">← Back to home</Link>
      <article className="blog-post">
        <header className="blog-header">
          <h1 className="blog-title">{post.title}</h1>
          <h4 className="blog-subtitle">{post.subtitle}</h4>
          <time className="blog-date">{post.date}</time>
        </header>
        <div 
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </article>
    </div>
  )
}