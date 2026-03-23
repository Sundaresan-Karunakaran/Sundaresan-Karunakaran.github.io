const fs = require('fs');
const { marked } = require('marked');

function parseMD(fileName) {
    const raw = fs.readFileSync(`../src/posts/${fileName}`, 'utf8');

    // Better frontmatter parsing
    const match = raw.match(/^---\n([\s\S]*?)\n---/);
    const frontmatter = match ? match[1] : '';
    const contentMD = match ? raw.slice(match[0].length) : raw;

    const titleMatch = frontmatter.match(/title:\s*"?([^"\n]+)"?/);
    const subMatch = frontmatter.match(/subtitle:\s*"?([^"\n]+)"?/);
    const dateMatch = frontmatter.match(/date:\s*"?([^"\n]+)"?/);

    const contentHTML = marked.parse(contentMD);

    return {
        title: titleMatch ? titleMatch[1].trim() : 'Blog',
        subtitle: subMatch ? subMatch[1].trim() : '',
        date: dateMatch ? dateMatch[1].trim() : '',
        contentHTML
    };
}

function writeBlog(slug, data) {
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Outfit:wght@400;600;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
    <style>
        .blog-container {
            max-width: 90%;
            margin: 0 auto;
            padding: 100px 20px 50px;
            position: relative;
            z-index: 2;
            overflow-x: hidden; /* Hard cap against body overflow */
        }
        
        /* New Layout Styles for Sticky Sidebar */
        .blog-layout {
            display: flex;
            align-items: flex-start;
            gap: 4rem;
            width: 100%;
            box-sizing: border-box;
        }
        .blog-sidebar {
            flex: 0 0 320px;
            position: sticky;
            top: 100px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            max-height: calc(100vh - 120px);
            overflow-y: auto;
            box-sizing: border-box;
        }

        .blog-sidebar::-webkit-scrollbar {
            width: 4px;
        }
        .blog-sidebar::-webkit-scrollbar-thumb {
            background: rgba(255, 40, 40, 0.3);
            border-radius: 4px;
        }

        .back-btn {
            display: inline-flex;
            align-items: center;
            margin-bottom: 2rem;
            color: var(--text-secondary);
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
            background: rgba(25, 0, 0, 0.4);
            padding: 0.5rem 1rem;
            border-radius: 8px;
            border: 1px solid rgba(255, 40, 40, 0.15);
        }
        .back-btn:hover {
            color: var(--text-primary);
            border-color: var(--accent-1);
            box-shadow: 0 0 15px rgba(255, 0, 0, 0.2);
            transform: translateX(-5px);
        }
        .blog-header {
            text-align: left;
            margin-bottom: 2rem;
            width: 100%;
        }
        .blog-header h1 {
            font-size: 2.2rem;
            margin-bottom: 1rem;
            line-height: 1.3;
            word-wrap: break-word;
        }
        .blog-header h4 {
            color: var(--text-secondary);
            font-weight: 400;
            margin-bottom: 1rem;
            font-size: 1.1rem;
            word-wrap: break-word;
        }
        .blog-date {
            color: var(--accent-1);
            font-size: 0.9rem;
            font-family: monospace;
            background: rgba(255, 0, 0, 0.1);
            padding: 0.3rem 0.8rem;
            border-radius: 20px;
            display: inline-block;
        }
        
        .blog-content {
            flex: 1;
            min-width: 0;
            width: 100%;
            max-width: 100%;
            line-height: 1.8;
            font-size: 1.1rem;
            color: var(--text-secondary);
            box-sizing: border-box;
            overflow-x: hidden;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        .blog-content h2, .blog-content h3 {
            color: var(--text-primary);
            margin-top: 2.5rem;
            margin-bottom: 1rem;
            font-weight: 600;
            word-wrap: break-word;
        }
        .blog-content p {
            margin-bottom: 1.5rem;
        }
        .blog-content img, .blog-content video, .blog-content iframe {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
        }
        .blog-content ul, .blog-content ol {
            margin-bottom: 1.5rem;
            padding-left: 1.5rem;
        }
        .blog-content li {
            margin-bottom: 0.5rem;
        }
        .blog-content a {
            color: var(--accent-1);
            text-decoration: none;
            border-bottom: 1px solid transparent;
            transition: all 0.3s ease;
            cursor: none;
            word-break: break-all;
        }
        .blog-content a:hover {
            border-color: var(--accent-1);
            text-shadow: 0 0 8px rgba(255, 40, 40, 0.5);
        }
        .blog-content code {
            background: rgba(255, 0, 0, 0.15);
            color: #ff8888;
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            font-family: monospace;
            font-size: 0.9em;
            word-break: break-word;
        }
        
        /* Ensure rigid scrollable bounds for pre and table */
        .blog-content pre {
            background: rgba(5, 5, 5, 0.8);
            padding: 1.5rem;
            border-radius: 8px;
            max-width: 100%;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            margin-bottom: 1.5rem;
            border: 1px solid rgba(255, 40, 40, 0.2);
            box-sizing: border-box;
        }
        .blog-content pre code {
            background: none;
            color: #e2e8f0;
            padding: 0;
            word-break: normal;
        }
        
        .blog-content table {
            width: 100%;
            max-width: 100%;
            border-collapse: collapse;
            margin-bottom: 1.5rem;
            display: block;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            white-space: nowrap;
            box-sizing: border-box;
        }
        .blog-content th, .blog-content td {
            border: 1px solid rgba(255, 40, 40, 0.15);
            padding: 0.75rem;
            text-align: left;
        }
        .blog-content th {
            background: rgba(25, 0, 0, 0.6);
            color: var(--accent-1);
            font-weight: 500;
        }
        .blog-content blockquote {
            border-left: 3px solid var(--accent-1);
            padding-left: 1.5rem;
            margin-left: 0;
            font-style: italic;
            color: #94a3b8;
            background: rgba(255, 40, 40, 0.05);
            padding-top: 1rem;
            padding-bottom: 1rem;
            border-radius: 0 8px 8px 0;
        }
        
        /* Media Queries for Mobile Responsiveness */
        @media (max-width: 900px) {
            .blog-layout {
                flex-direction: column;
                gap: 2rem;
            }
            .blog-sidebar {
                flex: none;
                width: 100%;
                position: relative;
                top: 0;
                align-items: center;
                text-align: center;
                max-height: none;
                overflow-y: visible;
            }
            .blog-header {
                text-align: center;
                margin-bottom: 0;
            }
        }
    </style>
</head>
<body>
    <div id="cursor-glow" class="cursor-glow"></div>
    <div class="fixed-bg"></div>
    <main class="blog-container fade-up">
        
        <!-- Removed inline padding: 3rem; so it doesn't override the mobile responsive padding defined in styles.css -->
        <article class="glass-card blog-layout">
            
            <div class="blog-sidebar">
                <a href="index.html" class="back-btn">← Return to Main Terminal</a>
                <header class="blog-header">
                    <h1 class="gradient-text">${data.title}</h1>
                    <h4>${data.subtitle}</h4>
                    <div style="margin-top: 1.5rem;"><time class="blog-date">${data.date}</time></div>
                </header>
            </div>
            
            <div class="blog-content">
                ${data.contentHTML}
            </div>
            
        </article>
    </main>
    <script src="main.js"></script>
</body>
</html>`;
    fs.writeFileSync(`blog-${slug}.html`, html);
}

try {
    const ucp = parseMD('ucp_blog_post.md');
    writeBlog('ucp', ucp);

    const ws = parseMD('websocket_blog_post.md');
    writeBlog('websocket', ws);

    console.log("Blogs generated successfully.");
} catch (e) {
    console.error(e);
}
