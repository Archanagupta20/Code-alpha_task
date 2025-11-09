const $ = id => document.getElementById(id);
const API = '/api';

let token = localStorage.getItem('token');
let user = localStorage.getItem('user');
if(user) user = JSON.parse(user);

const setAuthUI = () => {
  if(token && user){
    $('auth').style.display = 'none';
    $('app').style.display = 'block';
    $('welcome').innerText = 'Hello, ' + user.name;
    loadPosts();
  } else {
    $('auth').style.display = 'block';
    $('app').style.display = 'none';
  }
};

$('registerBtn').onclick = async () => {
  const name = $('name').value.trim();
  const email = $('email').value.trim();
  const password = $('password').value;
  const res = await fetch(API + '/auth/register', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ name, email, password })
  });
  const data = await res.json();
  if(res.ok){
    token = data.token; user = data.user;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuthUI();
  } else {
    $('authMsg').innerText = data.message || 'Error';
  }
};

$('loginBtn').onclick = async () => {
  const email = $('email').value.trim();
  const password = $('password').value;
  const res = await fetch(API + '/auth/login', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if(res.ok){
    token = data.token; user = data.user;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuthUI();
  } else {
    $('authMsg').innerText = data.message || 'Error';
  }
};

$('logoutBtn').onclick = () => {
  token = null; user = null;
  localStorage.removeItem('token'); localStorage.removeItem('user');
  setAuthUI();
};

$('postBtn').onclick = async () => {
  const text = $('postText').value.trim();
  if(!text) return;
  const res = await fetch(API + '/posts', {
    method:'POST', headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
    body: JSON.stringify({ text })
  });
  if(res.ok){
    $('postText').value = '';
    loadPosts();
  } else {
    alert('Could not create post');
  }
};

async function loadPosts(){
  const res = await fetch(API + '/posts');
  const posts = await res.json();
  const el = $('posts'); el.innerHTML = '';
  posts.forEach(p => {
    const d = document.createElement('div'); d.className='post';
    d.innerHTML = `<strong>${p.author.name}</strong> <small>${new Date(p.createdAt).toLocaleString()}</small>
      <p>${p.text}</p>
      <div><button data-id="${p._id}" class="likeBtn">Like (${p.likes.length||0})</button></div>`;
    el.appendChild(d);
  });
  document.querySelectorAll('.likeBtn').forEach(b => {
    b.onclick = async () => {
      const id = b.dataset.id;
      await fetch(API + '/posts/' + id + '/like', {
        method:'POST', headers:{'Authorization':'Bearer '+token}
      });
      loadPosts();
    };
  });
}

setAuthUI();
