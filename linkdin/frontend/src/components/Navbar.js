import React from 'react';
export default function Navbar({user,onLogout}){
  return (
    <div className="card nav" style={{marginBottom:12}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:42,height:42,borderRadius:999,background:'#0a66c2',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>{(user?.name||'?')[0].toUpperCase()}</div>
        <div>
          <div style={{fontWeight:700}}>{user?.name}</div>
          <div style={{fontSize:12,color:'#6b7280'}}>{user?.email}</div>
        </div>
      </div>
      <div>
        <button className="btn secondary" onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}
