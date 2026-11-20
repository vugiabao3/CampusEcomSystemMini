const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'App.jsx');
let content = fs.readFileSync(filePath, 'utf8');

// Find the function
const startMarker = 'async function loadPostLikes(list) {';
const startIdx = content.indexOf(startMarker);
if (startIdx === -1) {
  console.log('FAILED: function not found');
  process.exit(1);
}

// Find the closing brace - look for the next '}' at the same indentation level
// The function ends with '  }' followed by blank lines
let endIdx = startIdx;
let braceCount = 0;
let foundStart = false;
for (let i = startIdx; i < content.length; i++) {
  if (content[i] === '{') {
    braceCount++;
    foundStart = true;
  } else if (content[i] === '}') {
    braceCount--;
    if (foundStart && braceCount === 0) {
      endIdx = i + 1;
      break;
    }
  }
}

const oldFunc = content.substring(startIdx, endIdx);
console.log('Old function found, length:', oldFunc.length);

const newFunc = `async function loadPostLikes(list) {

    const entries = await Promise.all(
      (list ?? []).map(async (post) => {

        // Hỗ trợ cả hai kiểu tên: PascalCase (từ Backend) và camelCase.
        const postId =
          post?.PostId ?? post?.id ?? post?.Id ??
          (post?.post ? post.post.PostId ?? post.post.id : null);

        try {

          // GET /api/posts/{id}/likes
          const likes = await getPostLikes(postId);

          return [postId, summarizeLikes(likes)];

        } catch (error) {

          console.error(
            "Fetch post likes failed:",
            postId,
            error
          );

          return [postId, { count: 0, likedByMe: false }];

        }

      })

    );

    return Object.fromEntries(entries);

  }`;

content = content.substring(0, startIdx) + newFunc + content.substring(endIdx);
fs.writeFileSync(filePath, content, 'utf8');
console.log('SUCCESS: loadPostLikes fixed');