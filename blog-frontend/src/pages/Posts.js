import { useEffect, useState } from "react";
import api from "../api";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchPosts = async () => {
    const res = await api.get("/posts");
    setPosts(res.data);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size should be less than 5MB');
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const createPost = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      
      // Always use FormData to maintain consistency
      const formData = new FormData();
      formData.append('title', newPost.title);
      formData.append('content', newPost.content);
      
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      
      await api.post("/posts", formData, {
        headers: { 
          Authorization: `Bearer ${token}`
          // Don't set Content-Type, let the browser set it with boundary for multipart
        },
      });
      
      // Reset form
      setNewPost({ title: "", content: "" });
      setSelectedImage(null);
      setImagePreview(null);
      fetchPosts();
    } catch (err) {
      console.error(err);
      alert("Error creating post");
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  return (
    <div>
      <h2>All Posts</h2>
      <form onSubmit={createPost} style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px' 
      }}>
        <h3 style={{ marginBottom: '15px', color: '#333' }}>Create New Post</h3>
        <input 
          placeholder="Post Title" 
          value={newPost.title} 
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px'
          }}
          required
        />
        <textarea 
          placeholder="What's on your mind?" 
          value={newPost.content} 
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          style={{
            width: '100%',
            padding: '10px',
            marginBottom: '15px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            resize: 'vertical',
            minHeight: '80px'
          }}
          required
        />
        
        {/* Image Upload Section */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '5px', 
            fontSize: '14px', 
            fontWeight: 'bold',
            color: '#333' 
          }}>
            📷 Add Image (Optional)
          </label>
          <input 
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px'
            }}
          />
          
          {/* Image Preview */}
          {imagePreview && (
            <div style={{ 
              marginTop: '10px', 
              position: 'relative',
              display: 'inline-block'
            }}>
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{
                  maxWidth: '200px',
                  maxHeight: '200px',
                  objectFit: 'cover',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
              <button 
                type="button"
                onClick={removeImage}
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>
          )}
        </div>
        
        <button 
          type="submit"
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
        >
          📝 Create Post
        </button>
      </form>

      <div style={{ marginTop: '20px' }}>
        {posts.map((post) => (
          <div key={post._id} style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '15px', 
            marginBottom: '15px',
            backgroundColor: '#f9f9f9'
          }}>
            <h3 style={{ color: '#333', marginBottom: '8px' }}>{post.title}</h3>
            {post.imageUrl && (
              <div style={{ marginBottom: '10px' }}>
                <img 
                  src={post.imageUrl} 
                  alt=""
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                />
              </div>
            )}
            <p style={{ marginBottom: '10px', lineHeight: '1.5' }}>{post.content}</p>
            <div style={{ 
              fontSize: '12px', 
              color: '#666', 
              borderTop: '1px solid #eee', 
              paddingTop: '8px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span><strong>Author:</strong> {post.authorName || 'Unknown User'}</span>
              <span><strong>Posted:</strong> {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            {post.likes && post.likes.length > 0 && (
              <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                <strong>Likes:</strong> {post.likes.length}
              </div>
            )}
            {post.comments && post.comments.length > 0 && (
              <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                <strong>Comments:</strong> {post.comments.length}
              </div>
            )}
          </div>
        ))}
        {posts.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666', marginTop: '20px' }}>
            No posts yet. Be the first to create one!
          </p>
        )}
      </div>
    </div>
  );
}

export default Posts;
