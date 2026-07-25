const axios = require('axios');

async function test() {
  const api = axios.create({
    baseURL: 'https://resoanance-neondb.onrender.com/api',
  });
  
  api.interceptors.response.use(response => response);
  
  const getPosts = async (page = 1, limit = 10) => {
    const { data } = await api.get(`/posts?page=${page}&limit=${limit}`);
    console.log("Raw axios data:", JSON.stringify(data).substring(0, 100) + '...');
    return { ...data, data: data?.data?.posts || data?.data || [] };
  };

  const postsData = await getPosts();
  console.log("Mapped postsData:", JSON.stringify(postsData).substring(0, 100) + '...');
  
  const rawPosts = postsData?.data;
  const posts = Array.isArray(rawPosts) ? rawPosts : (Array.isArray(postsData) ? postsData : []);
  
  console.log("Final posts array length:", posts.length);
  console.log("Is array:", Array.isArray(posts));
}

test().catch(console.error);
