import React,{useState} from 'react';
import {useNavigate,Link} from 'react-router-dom';
import API from '../api';
export default function Signup(){
  const [form,setForm] = useState({name:'',email:'',password:''});
  const [error,setError] = useState('');
  const navigate = useNavigate();
  const submit = async (e)=>{
    e.preventDefault();
    setError('');
    if(!form.name||!form.email||!form.password) return setError('fill all');
    try{ await API.post('/auth/signup',form); navigate('/login'); }catch(err){ setError(err.response?.data?.message||'error'); }
  };
  return (
    <div className="container">
      <div className="card" style={{maxWidth:480,margin:'0 auto'}}>
        <h2>Sign up</h2>
        <form onSubmit={submit} style={{display:'grid',gap:8,marginTop:8}}>
          <input placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
          <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
          {error && <div style={{color:'red'}}>{error}</div>}
          <button className="btn">Create account</button>
          <div style={{marginTop:8}}>Already have an account? <Link to="/login">Login</Link></div>
        </form>
      </div>
    </div>
  );
}
