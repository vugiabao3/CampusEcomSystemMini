// Base Repository for Demo Data
import { loadFromStorage, saveToStorage, getStorageKey } from "../data/mockData";

class BaseRepository {
  constructor(storageKey) {
    this.storageKey = storageKey;
  }

  // Get all items
  async getAll() {
    return loadFromStorage(this.storageKey, []);
  }

  // Get item by ID
  async getById(id) {
    const items = await this.getAll();
    return items.find(item => item.id === id || item.postId === id || item.connectionRequestId === id || item.conversationId === id || item.notificationId === id || item.claimId === id);
  }

  // Create new item
  async create(item) {
    const items = await this.getAll();
    const newItem = {
      ...item,
      id: item.id || `${this.storageKey}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    items.unshift(newItem);
    saveToStorage(this.storageKey, items);
    return newItem;
  }

  // Update item
  async update(id, updates) {
    const items = await this.getAll();
    const index = items.findIndex(item => item.id === id || item.postId === id || item.connectionRequestId === id || item.conversationId === id || item.notificationId === id || item.claimId === id);
    if (index === -1) {
      throw new Error(`${this.storageKey} with id ${id} not found`);
    }
    const updatedItem = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    items[index] = updatedItem;
    saveToStorage(this.storageKey, items);
    return updatedItem;
  }

  // Delete item
  async delete(id) {
    const items = await this.getAll();
    const index = items.findIndex(item => item.id === id || item.postId === id || item.connectionRequestId === id || item.conversationId === id || item.notificationId === id || item.claimId === id);
    if (index === -1) {
      throw new Error(`${this.storageKey} with id ${id} not found`);
    }
    const deleted = items.splice(index, 1)[0];
    saveToStorage(this.storageKey, items);
    return deleted;
  }

  // Find items by filter
  async find(filterFn) {
    const items = await this.getAll();
    return items.filter(filterFn);
  }

  // Find one item by filter
  async findOne(filterFn) {
    const items = await this.getAll();
    return items.find(filterFn) || null;
  }

  // Count items
  async count(filterFn = null) {
    const items = await this.getAll();
    if (filterFn) {
      return items.filter(filterFn).length;
    }
    return items.length;
  }
}

// User Repository
export class UserRepository extends BaseRepository {
  constructor() {
    super("users");
  }

  async getByEmail(email) {
    const users = await this.getAll();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async getByRole(role) {
    return this.find(u => u.role === role);
  }

  async authenticate(email, password) {
    const user = await this.getByEmail(email);
    if (user && user.password === password) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  async updateLastLogin(userId) {
    return this.update(userId, { lastLoginAt: new Date().toISOString() });
  }
}

// Post Repository
export class PostRepository extends BaseRepository {
  constructor() {
    super("posts");
  }

  async getFeed(filters = {}) {
    let posts = await this.getAll();
    
    // Filter by type
    if (filters.type) {
      posts = posts.filter(p => p.type === filters.type);
    }
    
    // Filter by time (recent first)
    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Apply pagination
    const page = filters.page || 1;
    const pageSize = filters.pageSize || 20;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    return {
      items: posts.slice(start, end),
      page,
      pageSize,
      totalPages: Math.ceil(posts.length / pageSize),
      totalItems: posts.length,
    };
  }

  async getMyPosts(userId) {
    return this.find(p => p.userId === userId);
  }

  async getLikedPosts(userId) {
    // In demo, we'll simulate liked posts by returning posts that user has liked
    const posts = await this.getAll();
    // For demo, return first few posts as "liked"
    return posts.slice(0, 5).map(p => ({ ...p, likedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString() }));
  }

  async likePost(postId, userId) {
    const post = await this.getById(postId);
    if (!post) throw new Error("Post not found");
    
    // In a real app, we'd track likes separately
    // For demo, just increment count
    post.likesCount = (post.likesCount || 0) + 1;
    post.likedByMe = true;
    return this.update(postId, { likesCount: post.likesCount, likedByMe: true });
  }

  async unlikePost(postId, userId) {
    const post = await this.getById(postId);
    if (!post) throw new Error("Post not found");
    
    post.likesCount = Math.max(0, (post.likesCount || 1) - 1);
    post.likedByMe = false;
    return this.update(postId, { likesCount: post.likesCount, likedByMe: false });
  }

  async getPostLikes(postId) {
    const post = await this.getById(postId);
    if (!post) return [];
    // Return mock likes
    return Array.from({ length: post.likesCount || 0 }, (_, i) => ({
      userId: `demo-user-${i + 2}`,
      createdAt: new Date(Date.now() - i * 100000).toISOString(),
    }));
  }
}

// Lost & Found Repository
export class LostFoundRepository extends BaseRepository {
  constructor() {
    super("lostFound");
  }

  async getPosts(filter = "") {
    let items = await this.getAll();
    
    if (filter) {
      if (filter === "Returned") {
        items = items.filter(i => i.status === "Returned");
      } else {
        items = items.filter(i => i.type === filter);
      }
    }
    
    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return items;
  }

  async getMapPins() {
    const items = await this.getAll();
    return items.map(item => ({
      postId: item.postId || item.id,
      type: item.type,
      title: item.title,
      location: item.location,
      lat: item.lat,
      lng: item.lng,
      status: item.status,
    }));
  }

  async getSecretQuestion(postId) {
    const item = await this.getById(postId);
    if (!item || !item.secretQuestion) {
      throw new Error("Secret question not found");
    }
    return { question: item.secretQuestion };
  }

  async createSecretQuestion(postId, { question, answer }) {
    return this.update(postId, { secretQuestion: question, secretAnswer: answer });
  }

  async createClaim(postId, { answer }) {
    const item = await this.getById(postId);
    if (!item) throw new Error("Post not found");
    
    const claim = {
      claimId: `claim-${Date.now()}`,
      postId,
      claimantId: "demo-user-1", // Current user - would be passed in real app
      claimantName: "Nguyễn Văn An",
      answer,
      status: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const claims = item.claims || [];
    claims.push(claim);
    return this.update(postId, { claims });
  }

  async getClaims(postId) {
    const item = await this.getById(postId);
    return item?.claims || [];
  }

  async approveClaim(claimId) {
    // Find the post containing this claim
    const items = await this.getAll();
    for (const item of items) {
      const claimIndex = item.claims?.findIndex(c => c.claimId === claimId);
      if (claimIndex !== undefined && claimIndex >= 0) {
        item.claims[claimIndex].status = "Approved";
        item.claims[claimIndex].updatedAt = new Date().toISOString();
        if (!item.verifiedUsers) item.verifiedUsers = [];
        item.verifiedUsers.push(item.claims[claimIndex].claimantId);
        await this.update(item.id, { claims: item.claims, verifiedUsers: item.verifiedUsers });
        return { status: "Approved" };
      }
    }
    throw new Error("Claim not found");
  }

  async rejectClaim(claimId) {
    const items = await this.getAll();
    for (const item of items) {
      const claimIndex = item.claims?.findIndex(c => c.claimId === claimId);
      if (claimIndex !== undefined && claimIndex >= 0) {
        item.claims[claimIndex].status = "Rejected";
        item.claims[claimIndex].updatedAt = new Date().toISOString();
        await this.update(item.id, { claims: item.claims });
        return { status: "Rejected" };
      }
    }
    throw new Error("Claim not found");
  }

  async markReturned(postId) {
    return this.update(postId, { status: "Returned" });
  }

  async getMatches(postId) {
    const item = await this.getById(postId);
    if (!item) return [];
    // Return mock matches - users who claimed
    return item.claims?.filter(c => c.status === "Approved").map(c => ({
      userId: c.claimantId,
      userName: c.claimantName,
      matchedAt: c.updatedAt,
    })) || [];
  }
}

// Matching Repository
export class MatchingRepository extends BaseRepository {
  constructor() {
    super("studentMatches");
  }

  async getStudentMatches(userId) {
    const matches = await this.getAll();
    // Add match scores based on preferences
    return matches.map(m => ({
      ...m,
      matchScore: m.matchScore || Math.floor(Math.random() * 30) + 70,
    }));
  }

  async getStudentMatch(userId) {
    return this.getById(userId);
  }

  async getRoomMatches(userId) {
    const roomMatches = loadFromStorage("roomMatches", []);
    return roomMatches.map(m => ({
      ...m,
      matchScore: m.matchScore || Math.floor(Math.random() * 30) + 70,
    }));
  }

  async getRoomMatch(userId) {
    const roomMatches = loadFromStorage("roomMatches", []);
    return roomMatches.find(m => m.userId === userId) || null;
  }

  async createStudentPost(formData) {
    // Create a post of type 'group'
    const postRepo = new PostRepository();
    return postRepo.create({
      ...formData,
      type: "group",
      userId: "demo-user-1",
      userName: "Nguyễn Văn An",
      university: "Đại học Bách Khoa Hà Nội",
      faculty: "Công nghệ thông tin",
    });
  }

  async createRoomPost(formData) {
    const postRepo = new PostRepository();
    return postRepo.create({
      ...formData,
      type: "room",
      userId: "demo-user-1",
      userName: "Nguyễn Văn An",
      university: "Đại học Bách Khoa Hà Nội",
      faculty: "Công nghệ thông tin",
    });
  }
}

// Connection Repository
export class ConnectionRepository extends BaseRepository {
  constructor() {
    super("connectionRequests");
  }

  async getRequests(userId) {
    return this.find(r => r.receiverId === userId || r.senderId === userId);
  }

  async sendRequest(receiverId, postId = null) {
    const currentUserId = "demo-user-1";
    const currentUser = (await new UserRepository().getById(currentUserId));
    
    // Check if request already exists
    const existing = await this.findOne(r => 
      r.senderId === currentUserId && r.receiverId === receiverId && r.status === "Pending"
    );
    if (existing) {
      throw new Error("Đã có yêu cầu kết nối đang chờ với người này.");
    }
    
    // Check if already connected
    const connected = await this.findOne(r => 
      ((r.senderId === currentUserId && r.receiverId === receiverId) ||
       (r.senderId === receiverId && r.receiverId === currentUserId)) &&
      r.status === "Accepted"
    );
    if (connected) {
      throw new Error("Đã kết nối với người này rồi.");
    }
    
    const receiver = await new UserRepository().getById(receiverId);
    
    const request = {
      connectionRequestId: `conn-${Date.now()}`,
      senderId: currentUserId,
      senderName: currentUser.fullName,
      senderAvatar: currentUser.avatarUrl,
      receiverId,
      receiverName: receiver.fullName,
      status: "Pending",
      postId,
      postTitle: postId ? (await new PostRepository().getById(postId))?.title : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return this.create(request);
  }

  async acceptRequest(connectionRequestId) {
    const request = await this.getById(connectionRequestId);
    if (!request) throw new Error("Yêu cầu không tồn tại");
    
    request.status = "Accepted";
    request.updatedAt = new Date().toISOString();
    await this.update(connectionRequestId, request);
    
    // Create conversation
    const conversation = await new ConversationRepository().create({
      participants: [
        { userId: request.senderId, fullName: request.senderName, avatarUrl: request.senderAvatar },
        { userId: request.receiverId, fullName: request.receiverName, avatarUrl: null },
      ],
    });
    
    return { conversationId: conversation.conversationId };
  }

  async rejectRequest(connectionRequestId) {
    const request = await this.getById(connectionRequestId);
    if (!request) throw new Error("Yêu cầu không tồn tại");
    
    request.status = "Rejected";
    request.updatedAt = new Date().toISOString();
    return this.update(connectionRequestId, request);
  }
}

// Conversation Repository
export class ConversationRepository extends BaseRepository {
  constructor() {
    super("conversations");
  }

  async getConversations(userId) {
    const conversations = await this.getAll();
    return conversations
      .filter(c => c.participants.some(p => p.userId === userId))
      .sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt));
  }

  async getConversation(conversationId) {
    return this.getById(conversationId);
  }

  async getConversationMessages(conversationId) {
    const messages = loadFromStorage("messages", {});
    return messages[conversationId] || [];
  }

  async markMessagesAsRead(conversationId, userId) {
    const messages = loadFromStorage("messages", {});
    if (messages[conversationId]) {
      messages[conversationId] = messages[conversationId].map(m => ({
        ...m,
        isRead: m.senderId !== userId ? true : m.isRead,
      }));
      saveToStorage("messages", messages);
    }
    // Update conversation unread count
    const conversation = await this.getById(conversationId);
    if (conversation) {
      conversation.unreadCount = 0;
      await this.update(conversationId, { unreadCount: 0 });
    }
  }

  async sendMessage(conversationId, content, senderId) {
    const conversation = await this.getById(conversationId);
    if (!conversation) throw new Error("Cuộc trò chuyện không tồn tại");
    
    const sender = conversation.participants.find(p => p.userId === senderId);
    const message = {
      messageId: `msg-${Date.now()}`,
      conversationId,
      senderId,
      senderName: sender?.fullName || "Unknown",
      content,
      sentAt: new Date().toISOString(),
      isRead: false,
    };
    
    const messages = loadFromStorage("messages", {});
    if (!messages[conversationId]) messages[conversationId] = [];
    messages[conversationId].push(message);
    saveToStorage("messages", messages);
    
    // Update conversation
    conversation.lastMessage = content;
    conversation.lastMessageAt = message.sentAt;
    conversation.unreadCount = (conversation.unreadCount || 0) + 1;
    await this.update(conversationId, conversation);
    
    return message;
  }
}

// Notification Repository
export class NotificationRepository extends BaseRepository {
  constructor() {
    super("notifications");
  }

  async getNotifications(userId) {
    return this.find(n => n.userId === userId);
  }

  async getUnreadNotifications(userId) {
    const notifications = await this.find(n => n.userId === userId && !n.isRead);
    return { unreadCount: notifications.length };
  }

  async markAsRead(notificationId) {
    return this.update(notificationId, { isRead: true });
  }

  async markAllAsRead(userId) {
    const notifications = await this.find(n => n.userId === userId && !n.isRead);
    for (const n of notifications) {
      await this.update(n.notificationId, { isRead: true });
    }
  }

  async createNotification(notification) {
    return this.create({
      ...notification,
      notificationId: `notif-${Date.now()}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    });
  }
}

// Library Repository
export class LibraryRepository extends BaseRepository {
  constructor() {
    super("books");
  }

  async getBooks(filters = {}) {
    let books = await this.getAll();
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      books = books.filter(b => 
        b.title.toLowerCase().includes(search) ||
        b.author.toLowerCase().includes(search)
      );
    }
    
    if (filters.status) {
      books = books.filter(b => b.status === filters.status);
    }
    
    books.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return books;
  }

  async getMyBooks(userId) {
    return this.find(b => b.userId === userId);
  }

  async getBookById(id) {
    return this.getById(id);
  }

  async createBook(formData) {
    const currentUser = (await new UserRepository().getById("demo-user-1"));
    return this.create({
      ...formData,
      userId: "demo-user-1",
      userName: currentUser.fullName,
      userAvatar: currentUser.avatarUrl,
      status: "Available",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      matches: [],
    });
  }

  async updateBook(id, formData) {
    return this.update(id, { ...formData, updatedAt: new Date().toISOString() });
  }

  async deleteBook(id) {
    return this.delete(id);
  }

  async getExchangeMatches(userId) {
    const books = await this.getAll();
    const myBooks = books.filter(b => b.userId === userId);
    const otherBooks = books.filter(b => b.userId !== userId && b.status === "Available");
    
    // Simple matching: find books that match wanted books
    const matches = [];
    for (const myBook of myBooks) {
      if (myBook.wantedBooks && myBook.wantedBooks.length > 0) {
        for (const otherBook of otherBooks) {
          if (myBook.wantedBooks.some(w => otherBook.title.toLowerCase().includes(w.toLowerCase()) || w.toLowerCase().includes(otherBook.title.toLowerCase()))) {
            matches.push({
              myBookId: myBook.id,
              matchedBookId: otherBook.id,
              matchedPostId: otherBook.id, // For compatibility
              matchedTitle: otherBook.title,
              matchedAuthor: otherBook.author,
              matchedOwnerName: otherBook.userName,
              matchedOwnerId: otherBook.userId,
              matchReason: `Bạn muốn: "${myBook.wantedBooks.find(w => otherBook.title.toLowerCase().includes(w.toLowerCase()) || w.toLowerCase().includes(otherBook.title.toLowerCase()))}"`,
            });
          }
        }
      }
    }
    return matches;
  }

  // Documents
  async getDocuments(filters = {}) {
    let docs = loadFromStorage("documents", []);
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      docs = docs.filter(d => 
        d.title.toLowerCase().includes(search) ||
        d.subject.toLowerCase().includes(search) ||
        d.description.toLowerCase().includes(search)
      );
    }
    
    if (filters.subject) {
      docs = docs.filter(d => d.subject === filters.subject);
    }
    
    if (filters.pricing) {
      docs = docs.filter(d => d.pricingType === filters.pricing);
    }
    
    docs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return docs;
  }

  async getMyDocuments(userId) {
    const docs = loadFromStorage("documents", []);
    return docs.filter(d => d.userId === userId);
  }

  async getDocumentById(id) {
    const docs = loadFromStorage("documents", []);
    return docs.find(d => d.id === id) || null;
  }

  async createDocument(formData) {
    const currentUser = (await new UserRepository().getById("demo-user-1"));
    const doc = {
      ...formData,
      id: `doc-${Date.now()}`,
      userId: "demo-user-1",
      userName: currentUser.fullName,
      userAvatar: currentUser.avatarUrl,
      rating: 0,
      reviewCount: 0,
      downloadCount: 0,
      status: "Approved",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const docs = loadFromStorage("documents", []);
    docs.unshift(doc);
    saveToStorage("documents", docs);
    return doc;
  }

  async updateDocument(id, formData) {
    const docs = loadFromStorage("documents", []);
    const index = docs.findIndex(d => d.id === id);
    if (index === -1) throw new Error("Document not found");
    docs[index] = { ...docs[index], ...formData, updatedAt: new Date().toISOString() };
    saveToStorage("documents", docs);
    return docs[index];
  }

  async deleteDocument(id) {
    const docs = loadFromStorage("documents", []);
    const index = docs.findIndex(d => d.id === id);
    if (index === -1) throw new Error("Document not found");
    const deleted = docs.splice(index, 1)[0];
    saveToStorage("documents", docs);
    return deleted;
  }

  async downloadDocument(id) {
    const doc = await this.getDocumentById(id);
    if (!doc) throw new Error("Document not found");
    
    // Increment download count
    doc.downloadCount = (doc.downloadCount || 0) + 1;
    await this.updateDocument(id, { downloadCount: doc.downloadCount });
    
    // Return mock blob data
    return new Blob([`Mock content for ${doc.title}`], { type: "application/pdf" });
  }

  async getDocumentReviews(documentId) {
    const reviews = loadFromStorage("documentReviews", []);
    return reviews.filter(r => r.documentId === documentId);
  }

  async createDocumentReview(documentId, formData) {
    const currentUser = (await new UserRepository().getById("demo-user-1"));
    const review = {
      id: `rev-${Date.now()}`,
      documentId,
      userId: "demo-user-1",
      userName: currentUser.fullName,
      rating: formData.rating,
      comment: formData.comment,
      createdAt: new Date().toISOString(),
    };
    const reviews = loadFromStorage("documentReviews", []);
    reviews.push(review);
    saveToStorage("documentReviews", reviews);
    
    // Update document rating
    const doc = await this.getDocumentById(documentId);
    const docReviews = reviews.filter(r => r.documentId === documentId);
    const avgRating = docReviews.reduce((sum, r) => sum + r.rating, 0) / docReviews.length;
    await this.updateDocument(documentId, { 
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: docReviews.length,
    });
    
    return { documentRating: avgRating, documentReviewCount: docReviews.length };
  }

  async updateDocumentReview(reviewId, formData) {
    const reviews = loadFromStorage("documentReviews", []);
    const index = reviews.findIndex(r => r.id === reviewId);
    if (index === -1) throw new Error("Review not found");
    reviews[index] = { ...reviews[index], ...formData };
    saveToStorage("documentReviews", reviews);
    
    // Update document rating
    const doc = await this.getDocumentById(reviews[index].documentId);
    const docReviews = reviews.filter(r => r.documentId === doc.id);
    const avgRating = docReviews.reduce((sum, r) => sum + r.rating, 0) / docReviews.length;
    await this.updateDocument(doc.id, { 
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: docReviews.length,
    });
    
    return { documentRating: avgRating, documentReviewCount: docReviews.length };
  }

  async deleteDocumentReview(reviewId) {
    const reviews = loadFromStorage("documentReviews", []);
    const index = reviews.findIndex(r => r.id === reviewId);
    if (index === -1) throw new Error("Review not found");
    const docId = reviews[index].documentId;
    reviews.splice(index, 1);
    saveToStorage("documentReviews", reviews);
    
    // Update document rating
    const doc = await this.getDocumentById(docId);
    const docReviews = reviews.filter(r => r.documentId === docId);
    const avgRating = docReviews.length > 0 ? docReviews.reduce((sum, r) => sum + r.rating, 0) / docReviews.length : 0;
    await this.updateDocument(docId, { 
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: docReviews.length,
    });
  }
}

// Report Repository
export class ReportRepository extends BaseRepository {
  constructor() {
    super("reports");
  }

  async getMyReports(userId) {
    return this.find(r => r.reporterId === userId);
  }

  async createReport(postId, reason, description) {
    const currentUser = (await new UserRepository().getById("demo-user-1"));
    const post = await new PostRepository().getById(postId);
    return this.create({
      reporterId: "demo-user-1",
      reporterName: currentUser.fullName,
      postId,
      postTitle: post?.title || "Unknown",
      reason,
      description,
      status: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  // Admin methods
  async getAllReports(status = "") {
    let reports = await this.getAll();
    if (status) {
      reports = reports.filter(r => r.status === status);
    }
    return reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getReportDetail(reportId) {
    return this.getById(reportId);
  }

  async approveReport(reportId) {
    return this.update(reportId, { status: "Approved", updatedAt: new Date().toISOString() });
  }

  async rejectReport(reportId) {
    return this.update(reportId, { status: "Rejected", updatedAt: new Date().toISOString() });
  }
}

// Admin Repository
export class AdminRepository extends BaseRepository {
  constructor() {
    super("adminStats");
  }

  async getDashboard() {
    const stats = loadFromStorage("adminStats", {});
    const users = loadFromStorage("users", []);
    const posts = loadFromStorage("posts", []);
    const reports = loadFromStorage("reports", []);
    const lostFound = loadFromStorage("lostFound", []);
    const connections = loadFromStorage("connectionRequests", []);
    const conversations = loadFromStorage("conversations", []);
    const books = loadFromStorage("books", []);
    const documents = loadFromStorage("documents", []);
    
    return {
      totalUsers: users.length,
      totalPosts: posts.length,
      totalReports: reports.length,
      totalLostFound: lostFound.length,
      totalConnections: connections.length,
      totalConversations: conversations.length,
      totalBooks: books.length,
      totalDocuments: documents.length,
      activeUsersToday: Math.floor(users.length * 0.7),
      newUsersThisWeek: 2,
      postsByType: {
        group: posts.filter(p => p.type === "group").length,
        room: posts.filter(p => p.type === "room").length,
        study: posts.filter(p => p.type === "study").length,
        activity: posts.filter(p => p.type === "activity").length,
        general: posts.filter(p => p.type === "general").length,
      },
      usersByRole: {
        User: users.filter(u => u.role === "User").length,
        Admin: users.filter(u => u.role === "Admin").length,
      },
      usersByUniversity: users.reduce((acc, u) => {
        acc[u.university] = (acc[u.university] || 0) + 1;
        return acc;
      }, {}),
    };
  }

  async getUsers({ page = 1, pageSize = 10, search = "", status = "" }) {
    let users = loadFromStorage("users", []).filter(u => u.role !== "Admin");
    
    if (search) {
      const s = search.toLowerCase();
      users = users.filter(u => 
        u.fullName.toLowerCase().includes(s) ||
        u.email.toLowerCase().includes(s) ||
        u.studentId.toLowerCase().includes(s)
      );
    }
    
    if (status) {
      users = users.filter(u => u.status === status);
    }
    
    users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    return {
      items: users.slice(start, end),
      page,
      pageSize,
      totalPages: Math.ceil(users.length / pageSize),
      totalItems: users.length,
    };
  }

  async getUserDetail(userId) {
    const users = loadFromStorage("users", []);
    return users.find(u => u.id === userId) || null;
  }

  async updateUserStatus(userId, status) {
    return new UserRepository().update(userId, { status });
  }

  async issueUserWarning(userId, reason) {
    // Just log for demo
    console.log(`Warning issued to ${userId}: ${reason}`);
    return { success: true };
  }

  async suspendUser(userId, reason, until) {
    return new UserRepository().update(userId, { status: "Suspended", suspendedReason: reason, suspendedUntil: until });
  }

  async reactivateUser(userId) {
    return new UserRepository().update(userId, { status: "Active", suspendedReason: null, suspendedUntil: null });
  }

  async getPosts({ page = 1, pageSize = 10, type = "", status = "", search = "" }) {
    let posts = loadFromStorage("posts", []);
    
    if (type) posts = posts.filter(p => p.type === type);
    if (status) posts = posts.filter(p => p.status === status);
    if (search) {
      const s = search.toLowerCase();
      posts = posts.filter(p => p.title.toLowerCase().includes(s) || p.content.toLowerCase().includes(s));
    }
    
    posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    
    return {
      items: posts.slice(start, end),
      page,
      pageSize,
      totalPages: Math.ceil(posts.length / pageSize),
      totalItems: posts.length,
    };
  }

  async getPostDetail(postId) {
    return new PostRepository().getById(postId);
  }

  async deletePost(postId) {
    return new PostRepository().delete(postId);
  }

  async togglePostHidden(postId, reason) {
    const post = await new PostRepository().getById(postId);
    const newStatus = post.status === "Hidden" ? "Active" : "Hidden";
    return new PostRepository().update(postId, { status: newStatus, hiddenReason: reason });
  }

  async getReports({ status = "" }) {
    return new ReportRepository().getAllReports(status);
  }

  async getReportDetail(reportId) {
    return new ReportRepository().getReportDetail(reportId);
  }

  async approveReport(reportId) {
    return new ReportRepository().approveReport(reportId);
  }

  async rejectReport(reportId) {
    return new ReportRepository().rejectReport(reportId);
  }

  async getAuditLogs() {
    // Mock audit logs
    return [
      { id: "audit-1", action: "LOGIN", userId: "demo-user-1", details: "User logged in", timestamp: new Date().toISOString() },
      { id: "audit-2", action: "CREATE_POST", userId: "demo-user-1", details: "Created post: Tìm thành viên nhóm", timestamp: new Date(Date.now() - 1000000).toISOString() },
      { id: "audit-3", action: "SEND_CONNECTION_REQUEST", userId: "demo-user-2", details: "Sent connection request to demo-user-1", timestamp: new Date(Date.now() - 2000000).toISOString() },
      { id: "audit-4", action: "APPROVE_REPORT", userId: "demo-admin-1", details: "Approved report report-1", timestamp: new Date(Date.now() - 3000000).toISOString() },
      { id: "audit-5", action: "CREATE_BOOK", userId: "demo-user-1", details: "Created book exchange: Clean Code", timestamp: new Date(Date.now() - 4000000).toISOString() },
    ];
  }
}

// Preferences Repository
export class PreferencesRepository {
  async getPreferences() {
    return loadFromStorage("preferences", {});
  }

  async createPreferences(formData) {
    const prefs = {
      userId: "demo-user-1",
      ...formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveToStorage("preferences", prefs);
    return prefs;
  }

  async updatePreferences(formData) {
    const existing = await this.getPreferences();
    const merged = { ...existing, ...formData, updatedAt: new Date().toISOString() };
    saveToStorage("preferences", merged);
    return merged;
  }

  async deletePreferences() {
    saveToStorage("preferences", {});
    return { success: true };
  }
}

// Export all repositories
export const userRepository = new UserRepository();
export const postRepository = new PostRepository();
export const lostFoundRepository = new LostFoundRepository();
export const matchingRepository = new MatchingRepository();
export const connectionRepository = new ConnectionRepository();
export const conversationRepository = new ConversationRepository();
export const notificationRepository = new NotificationRepository();
export const libraryRepository = new LibraryRepository();
export const reportRepository = new ReportRepository();
export const adminRepository = new AdminRepository();
export const preferencesRepository = new PreferencesRepository();