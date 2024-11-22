const API_URL = "http://localhost:4000/graphql";

// Helper function to send GraphQL queries
async function sendQuery(query) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });
  const data = await response.json();
  return data.data;
}

// Fetch all users
document.getElementById("fetchUsers").addEventListener("click", async () => {
  const query = `
    query {
      users {
        id
        name
        email
      }
    }
  `;
  const data = await sendQuery(query);
  const usersDiv = document.getElementById("users");
  usersDiv.innerHTML = ""; // Clear previous results

  data.users.forEach((user) => {
    const userDiv = document.createElement("div");
    userDiv.className = "user";
    userDiv.innerHTML = `<strong>${user.name}</strong> (${user.email})`;
    usersDiv.appendChild(userDiv);
  });
});

// Fetch a specific user by ID
document.getElementById("fetchUser").addEventListener("click", async () => {
  const userId = document.getElementById("userIdInput").value;
  if (!userId) {
    alert("Please enter a User ID");
    return;
  }

  const query = `
    query {
      user(id: ${userId}) {
        name
        email
        posts {
          title
          content
        }
      }
    }
  `;
  const data = await sendQuery(query);
  const userDetailsDiv = document.getElementById("userDetails");
  userDetailsDiv.innerHTML = ""; // Clear previous results

  if (!data.user) {
    userDetailsDiv.innerHTML = `<p>User not found</p>`;
    return;
  }

  const user = data.user;
  userDetailsDiv.innerHTML = `
    <h3>${user.name}</h3>
    <p>Email: ${user.email}</p>
    <h4>Posts:</h4>
    <ul>
      ${user.posts
        .map((post) => `<li><strong>${post.title}</strong>: ${post.content}</li>`)
        .join("")}
    </ul>
  `;
});

// Fetch all posts
document.getElementById("fetchPosts").addEventListener("click", async () => {
  const query = `
    query {
      posts {
        title
        content
        user {
          name
        }
      }
    }
  `;
  const data = await sendQuery(query);
  const postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = ""; // Clear previous results

  data.posts.forEach((post) => {
    const postDiv = document.createElement("div");
    postDiv.className = "post";
    postDiv.innerHTML = `
      <strong>${post.title}</strong><br>
      ${post.content}<br>
      <em>By: ${post.user.name}</em>
    `;
    postsDiv.appendChild(postDiv);
  });
});
