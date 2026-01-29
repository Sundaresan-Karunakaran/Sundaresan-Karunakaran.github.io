const postFiles = import.meta.glob('../posts/*.md', { as: 'raw' });

export async function loadPosts() {
    const posts = []

    for (const path in postFiles){
        const raw = await postFiles[path]();
        posts.push({
            slug: path.split('/').pop()?.replace('.md',""),
            raw
        })
    }

    return posts;
}