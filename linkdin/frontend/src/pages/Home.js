import React,{useEffect,useState} from 'react';
import API from '../api';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
export default function Home(){
  const [posts,setPosts] = useState([]);
  const [text,setText] = useState('');
  const [file,setFile] = useState(null);
  const user = JSON.parse(localStorage.getItem('user')||'null');
  const fetchPosts = async ()=>{ try{ const res = await API.get('/posts'); setPosts(res.data); }catch(err){ console.error(err); } };
  useEffect(()=>{ fetchPosts(); },[]);
  const createPost = async ()=>{
    if(!text.trim() && !file) return alert('write or attach');
    try{
      const form = new FormData();
      form.append('text', text);
      if(file) form.append('image', file);
      const res = await API.post('/posts', form);
      setPosts(prev => [res.data, ...prev]);
      setText(''); setFile(null);
    }catch(err){ console.error(err); }
  };
  const logout = ()=>{ localStorage.clear(); window.location.href = '/login'; };
  return (
    <div className="container">
      <Navbar user={user} onLogout={logout} />
      <div className="card" style={{marginBottom:12}}>
        <h3>Create a post</h3>
        <textarea placeholder="Share something..." value={text} onChange={e=>setText(e.target.value)} />
        <div style={{marginTop:8}}>
          <input type="file" onChange={e=>setFile(e.target.files[0])} />
        </div>
        <div style={{marginTop:8,display:'flex',gap:8}}>
          <button className="btn" onClick={createPost}>Post</button>
        </div>
      </div>
      <div>{posts.length===0? <div className="card">No posts yet</div> : posts.map(p=>(<PostCard key={p._id} post={p} currentUser={user} onUpdate={fetchPosts}/>))}</div>
    </div>
  );
}
