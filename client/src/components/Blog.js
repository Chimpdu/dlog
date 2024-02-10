import { useState } from 'react';

function Blog({blog, deleteBlog, updateLikes}) {
    const [hoveredBlogId, setHoveredBlogId] = useState(null);

    const onMouseOver = (id) => {
        setHoveredBlogId(id);
    };

    const onMouseLeave = () => {
        setHoveredBlogId(null);
    };
    
    const onClickLikeCounter = (id) => {
        updateLikes(id);
    }
    return (
        <div
                    className="blog-card" 
                    key={blog._id} 
                    onMouseOver={() => onMouseOver(blog._id)} 
                    onMouseLeave={onMouseLeave}
                >
            <button className='like-counter' onClick={()=>{onClickLikeCounter(blog._id)}}> {blog.likes} ❤️</button>
            <h2>{blog.title}</h2>
            <p className='blog-body'>{blog.body}</p>
            <p className='blog-author'>{blog.author}</p>
            {hoveredBlogId === blog._id && (
            <button 
                        className='waves-effect waves-light btn blog-del-btn' 
                        onClick={() => deleteBlog(blog._id)}
                    >
                        Delete
                    </button>
            )}
        </div>
    
    )
}

export default Blog
