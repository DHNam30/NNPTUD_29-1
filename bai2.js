// API URL
const API_URL = 'http://localhost:3000';

// State
let posts = [];
let comments = [];
let editingPostId = null;
let editingCommentId = null;
let editingPostIdForComment = null;

// DOM Elements
const postsContainer = document.getElementById('postsContainer');
const postTitleInput = document.getElementById('postTitle');
const postViewsInput = document.getElementById('postViews');
const editModal = document.getElementById('editModal');
const editBackdrop = document.getElementById('editBackdrop');
const editCommentModal = document.getElementById('editCommentModal');
const editCommentBackdrop = document.getElementById('editCommentBackdrop');

// Load data
async function loadData() {
    try {
        postsContainer.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading posts...</div>';
        
        const [postsRes, commentsRes] = await Promise.all([
            fetch(`${API_URL}/posts`),
            fetch(`${API_URL}/comments`)
        ]);

        if (!postsRes.ok || !commentsRes.ok) {
            throw new Error('Failed to fetch data');
        }

        posts = await postsRes.json();
        comments = await commentsRes.json();

        displayPosts();
    } catch (error) {
        postsContainer.innerHTML = `
            <div style="padding: 30px; text-align: center; color: #ff6b6b;">
                <strong>Error:</strong> ${error.message}<br>
                <small>Make sure json-server is running on port 3000</small>
            </div>
        `;
    }
}

// Display posts
function displayPosts() {
    if (posts.length === 0) {
        postsContainer.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><br>No posts yet. Create one!</div>';
        return;
    }

    const postsHTML = posts.map(post => {
        const postComments = comments.filter(c => c.postId === post.id);
        const isDeleted = post.isDeleted;

        return `
            <div class="post-item ${isDeleted ? 'deleted' : ''}">
                <div class="post-header">
                    <h3 class="post-title">${post.title}</h3>
                    <span style="font-size: 0.85em; color: #999;">#${post.id}</span>
                </div>
                
                <div class="post-meta">
                    <div class="post-meta-item">
                        <i class="fas fa-eye"></i>
                        <span>${post.views || 0} views</span>
                    </div>
                    <div class="post-meta-item">
                        <i class="fas fa-comments"></i>
                        <span>${postComments.filter(c => !c.isDeleted).length} comments</span>
                    </div>
                </div>

                <div class="post-actions">
                    ${!isDeleted ? `
                        <button class="btn-edit" onclick="openEditModal('${post.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-delete" onclick="softDeletePost('${post.id}')">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    ` : `
                        <button class="btn-restore" onclick="restorePost('${post.id}')">
                            <i class="fas fa-undo"></i> Restore
                        </button>
                    `}
                </div>

                <div class="comments-section">
                    <div class="comments-title">💬 Comments</div>
                    
                    ${postComments.length === 0 ? '<p style="color: #999; font-style: italic;">No comments yet</p>' : ''}
                    
                    ${postComments.map(comment => `
                        <div class="comment-item ${comment.isDeleted ? 'deleted' : ''}">
                            <p class="comment-text">${comment.text}</p>
                            <div class="comment-actions">
                                ${!comment.isDeleted ? `
                                    <button class="btn-comment-edit" onclick="openEditCommentModal('${comment.id}', '${post.id}')">
                                        <i class="fas fa-edit"></i> Edit
                                    </button>
                                    <button class="btn-comment-delete" onclick="softDeleteComment('${comment.id}')">
                                        <i class="fas fa-trash"></i> Delete
                                    </button>
                                ` : `
                                    <button class="btn-comment-restore" onclick="restoreComment('${comment.id}')">
                                        <i class="fas fa-undo"></i> Restore
                                    </button>
                                `}
                            </div>
                        </div>
                    `).join('')}

                    ${!isDeleted ? `
                        <div class="add-comment-form">
                            <input type="text" id="commentInput-${post.id}" placeholder="Add a comment...">
                            <button onclick="addComment('${post.id}')">
                                <i class="fas fa-paper-plane"></i> Post
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');

    postsContainer.innerHTML = postsHTML;
}

// Add post
async function addPost() {
    const title = postTitleInput.value.trim();
    const views = parseInt(postViewsInput.value) || 0;

    if (!title) {
        alert('Please enter a post title');
        return;
    }

    try {
        // Get next ID
        const maxId = posts.length > 0 ? Math.max(...posts.map(p => parseInt(p.id))) : 0;
        const newId = String(maxId + 1);

        const response = await fetch(`${API_URL}/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: newId,
                title,
                views,
                isDeleted: false
            })
        });

        if (!response.ok) throw new Error('Failed to add post');

        postTitleInput.value = '';
        postViewsInput.value = '0';
        
        loadData();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Open edit post modal
function openEditModal(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    editingPostId = postId;
    document.getElementById('editTitle').value = post.title;
    document.getElementById('editViews').value = post.views || 0;

    editModal.classList.add('show');
    editBackdrop.classList.add('show');
}

// Close edit modal
function closeEditModal() {
    editModal.classList.remove('show');
    editBackdrop.classList.remove('show');
    editingPostId = null;
}

// Save post changes
async function savePost() {
    if (!editingPostId) return;

    const title = document.getElementById('editTitle').value.trim();
    const views = parseInt(document.getElementById('editViews').value) || 0;

    if (!title) {
        alert('Please enter a title');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/posts/${editingPostId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, views })
        });

        if (!response.ok) throw new Error('Failed to update post');

        closeEditModal();
        loadData();
        alert('Post updated successfully!');
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Soft delete post
async function softDeletePost(postId) {
    if (!confirm('Soft delete this post?')) return;

    try {
        const response = await fetch(`${API_URL}/posts/${postId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isDeleted: true })
        });

        if (!response.ok) throw new Error('Failed to delete post');

        loadData();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Restore post
async function restorePost(postId) {
    try {
        const response = await fetch(`${API_URL}/posts/${postId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isDeleted: false })
        });

        if (!response.ok) throw new Error('Failed to restore post');

        loadData();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Add comment
async function addComment(postId) {
    const input = document.getElementById(`commentInput-${postId}`);
    const text = input.value.trim();

    if (!text) {
        alert('Please enter a comment');
        return;
    }

    try {
        const maxId = comments.length > 0 ? Math.max(...comments.map(c => parseInt(c.id))) : 0;
        const newId = String(maxId + 1);

        const response = await fetch(`${API_URL}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: newId,
                text,
                postId,
                isDeleted: false
            })
        });

        if (!response.ok) throw new Error('Failed to add comment');

        input.value = '';
        loadData();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Open edit comment modal
function openEditCommentModal(commentId, postId) {
    const comment = comments.find(c => c.id === commentId);
    if (!comment) return;

    editingCommentId = commentId;
    editingPostIdForComment = postId;
    document.getElementById('editCommentText').value = comment.text;

    editCommentModal.classList.add('show');
    editCommentBackdrop.classList.add('show');
}

// Close edit comment modal
function closeEditCommentModal() {
    editCommentModal.classList.remove('show');
    editCommentBackdrop.classList.remove('show');
    editingCommentId = null;
    editingPostIdForComment = null;
}

// Save comment changes
async function saveComment() {
    if (!editingCommentId) return;

    const text = document.getElementById('editCommentText').value.trim();

    if (!text) {
        alert('Please enter comment text');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/comments/${editingCommentId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        if (!response.ok) throw new Error('Failed to update comment');

        closeEditCommentModal();
        loadData();
        alert('Comment updated successfully!');
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Soft delete comment
async function softDeleteComment(commentId) {
    if (!confirm('Soft delete this comment?')) return;

    try {
        const response = await fetch(`${API_URL}/comments/${commentId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isDeleted: true })
        });

        if (!response.ok) throw new Error('Failed to delete comment');

        loadData();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Restore comment
async function restoreComment(commentId) {
    try {
        const response = await fetch(`${API_URL}/comments/${commentId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isDeleted: false })
        });

        if (!response.ok) throw new Error('Failed to restore comment');

        loadData();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// Close modals with backdrop click
document.getElementById('editBackdrop').addEventListener('click', closeEditModal);
document.getElementById('editCommentBackdrop').addEventListener('click', closeEditCommentModal);

// Load data on page load
document.addEventListener('DOMContentLoaded', loadData);
