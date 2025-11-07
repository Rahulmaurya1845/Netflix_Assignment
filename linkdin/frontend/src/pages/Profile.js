import React,{useEffect,useState} from 'react';
import {useParams} from 'react-router-dom';
import API from '../api';
export default function Profile(){
  const {id} = useParams();
  const [data,setData] = useState(null);
  const fetch = async ()=>{ try{ const res = await API.get(`/users/${id}`); setData(res.data); }catch(err){ console.error(err); } };
  useEffect(()=>{ fetch(); },[id]);
  if(!data) return <div className="container"><div className="card">Loading...</div></div>;
  return (
    <div className="container">
      <div className="card" style={{marginBottom:12}}>
        <h2>{data.user.name}</h2>
        <div>{data.user.email}</div>
      </div>
      <div>
        {data.posts.map(p=>(
          <div key={p._id} className="card" style={{marginBottom:10}}>
            <div style={{fontWeight:700}}>{p.user?.name}</div>
            <div className="post-meta">{new Date(p.createdAt).toLocaleString()}</div>
            <div style={{marginTop:8}}>{p.text}</div>
            {p.image && <img className="post-image" src={(process.env.REACT_APP_API_URL? process.env.REACT_APP_API_URL.replace('/api','') : 'http://localhost:5000')+p.image} />}
          </div>
        ))}
      </div>
    </div>
  );
}
