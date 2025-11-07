import React,{useState} from 'react';
import {useNavigate,Link} from 'react-router-dom';
import API from '../api';
export default function Login(){
  const [form,setForm] = useState({email:'',password:''});
  const [error,setError] = useState('');
  const navigate = useNavigate();
  const submit = async (e)=>{
    e.preventDefault();
    setError('');
    if(!form.email||!form.password) return setError('fill all');
    try{
      const res = await API.post('/auth/login',form);
      localStorage.setItem('token',res.data.token);
      localStorage.setItem('user',JSON.stringify(res.data.user));
      navigate('/');
    }catch(err){ setError(err.response?.data?.message||'error'); }
  };
  return (
    <div className="container">
      <div className="card" style={{maxWidth:480,margin:'0 auto'}}>
        <h2>Login</h2>
        <form onSubmit={submit} style={{display:'grid',gap:8,marginTop:8}}>
          <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
          <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} />
          {error && <div style={{color:'red'}}>{error}</div>}
          <button className="btn">Login</button>
          <div style={{marginTop:8}}>New here? <Link to="/signup">Create account</Link></div>
        </form>
      </div>
    </div>
  );
}
