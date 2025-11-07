import React,{useState} from 'react';
import dayjs from 'dayjs';
import API from '../api';
export default function PostCard({post,currentUser,onUpdate}){
  const [liked,setLiked] = useState(post.likes?.some(l=>l===currentUser?.id));
  const [likesCount,setLikesCount] = useState(post.likes?.length||0);
  const [commentText,setCommentText] = useState('');
  const [comments,setComments] = useState(post.comments||[]);
  const [editing,setEditing] = useState(false);
  const [editText,setEditText] = useState(post.text||'');
  const toggleLike = async ()=>{
    try{
      const res = await API.post(`/posts/${post._id}/like`);
      setLiked(res.data.liked);
      setLikesCount(res.data.likes);
      if(onUpdate) onUpdate();
    }catch(err){ console.error(err); }
  };
  const addComment = async ()=>{
    if(!commentText.trim()) return;
    try{
      const res = await API.post(`/posts/${post._id}/comment`,{text:commentText});
      setComments(res.data);
      setCommentText('');
    }catch(err){ console.error(err); }
  };
  const saveEdit = async ()=>{
    try{
      const form = new FormData();
      form.append('text', editText);
      const res = await API.put(`/posts/${post._id}`, form);
      if(onUpdate) onUpdate();
      setEditing(false);
    }catch(err){ console.error(err); }
  };
  const deletePost = async ()=>{
    if(!window.confirm('Delete post?')) return;
    try{
      await API.delete(`/posts/${post._1d}`);
      if(onUpdate) onUpdate();
    }catch(err){ console.error(err); }
  };
  return (
    <div className="card" style={{marginBottom:10}}>
      <div style={{display:'flex',alignItems:'center',gap:10}}>
        <div style={{width:40,height:40,borderRadius:999,background:'#0a66c2',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>{(post.user?.name||'?')[0].toUpperCase()}</div>
        <div style={{flex:1}}>
          <div style={{fontWeight:700}}>{post.user?.name||'Unknown'}</div>
          <div className="post-meta">{dayjs(post.createdAt).format('DD MMM YYYY, HH:mm')}</div>
        </div>
        {currentUser?.id===post.user?._id && <div style={{display:'flex',gap:8}}>
          <button className="btn secondary" onClick={()=>setEditing(!editing)}>{editing? 'Cancel' : 'Edit'}</button>
          <button className="btn secondary" onClick={deletePost}>Delete</button>
        </div>}
      </div>
      {editing ? (
        <div style={{marginTop:10}}>
          <textarea value={editText} onChange={e=>setEditText(e.target.value)} />
          <div style={{marginTop:8,display:'flex',gap:8}}>
            <button className="btn" onClick={saveEdit}>Save</button>
          </div>
        </div>
      ) : (
        <div style={{marginTop:10,whiteSpace:'pre-wrap'}}>{post.text}</div>
      )}
      {post.image && <img className="post-image" src={process.env.REACT_APP_API_URL? process.env.REACT_APP_API_URL.replace('/api','')+post.image : ('http://localhost:5000'+post.image)} alt="post" />}
      <div style={{marginTop:8,display:'flex',gap:8,alignItems:'center'}}>
        <button className="btn secondary" onClick={toggleLike}>{liked? 'Unlike':'Like'}</button>
        <div className="post-meta">{likesCount} likes</div>
      </div>
      <div style={{marginTop:8}}>
        <div style={{display:'flex',gap:8}}>
          <input placeholder="Write a comment..." value={commentText} onChange={e=>setCommentText(e.target.value)} />
          <button className="btn" onClick={addComment}>Comment</button>
        </div>
        <div style={{marginTop:8}}>
          {comments.map(c=>(
            <div key={c._id} style={{marginTop:6}}>
              <div style={{fontWeight:700}}>{c.user?.name||'User'}</div>
              <div className="post-meta">{dayjs(c.createdAt).format('DD MMM YYYY, HH:mm')}</div>
              <div style={{whiteSpace:'pre-wrap'}}>{c.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
