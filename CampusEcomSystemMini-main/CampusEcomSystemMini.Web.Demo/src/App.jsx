// Demo App - CampusEcomSystemMini Demo Website
// Uses local mock data instead of backend API

import { useEffect, useRef, useState, useCallback } from "react";

// Components
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import HomePage from "./components/HomePage";
import UserProfile from "./components/UserProfile";
import EditProfile from "./components/EditProfile";
import ChangePassword from "./components/ChangePassword";
import Preferences from "./components/Preferences";
import PostsPage from "./components/PostsPage";
import AllPostsPage from "./components/AllPostsPage";
import SiteHeader from "./components/SiteHeader";
import SmartMatching from "./components/SmartMatching";
import LostFoundPage from "./components/LostFoundPage";
import PostFormModal from "./components/PostFormModal.jsx";
import LikedPostsPage from "./components/LikedPostsPage";
import ConnectionRequests from "./components/ConnectionRequests";
import MessengerPage from "./components/messenger/MessengerPage.jsx";
import LibraryPage from "./components/library/LibraryPage";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminUsers from "./components/admin/AdminUsers";
import AdminPosts from "./components/admin/AdminPosts";
import AdminReports from "./components/admin/AdminReports";
import AdminAuditLogs from "./components/admin/AdminAuditLogs";
import MyReports from "./components/reports/MyReports";
import ReportForm from "./components/reports/ReportForm";

// Demo Services
import {
  getMe,
  getToken,
  isDemoMode,
  login,
  logout,
  register,
  DEMO_CREDENTIALS,
} from "./demo/services/authService";

import {
  getMe as getUserProfile,
  updateProfile,
  updateAvatar,
  changePassword,
} from "./demo/services/userService";

import {
  getPreferences,
  createPreferences,
  updatePreferences,
  deletePreferences,
} from "./demo/services/preferenceService";

import {
  getPosts,
  getMyPosts,
  getLikedPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getPostLikes,
} from "./demo/services/postService";

import {
  getStudentMatches,
  getStudentMatch,
  getRoomMatches,
  getRoomMatch,
  createStudentPost,
  createRoomPost,
} from "./demo/services/matchingService";

import {
  getLostFoundPosts,
  getLostFoundMap,
  createSecretQuestion,
  getSecretQuestion,
  createClaim,
  getClaims,
  approveClaim,
  rejectClaim,
  markReturned,
  getMatches,
} from "./demo/services/lostFoundService";

import {
  sendConnectionRequest,
  getConnectionRequests,
  acceptConnectionRequest,
  rejectConnectionRequest,
} from "./demo/services/connectionService";

import {
  getConversations,
  getConversation,
  getConversationMessages,
  markMessagesAsRead,
  sendMessage,
} from "./demo/services/conversationService";

import { createChatConnection } from "./demo/chatHub";

import {
  getNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "./demo/services/notificationService";

import {
  getBooks,
  getMyBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getExchangeMatches,
  getDocuments,
  getMyDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  deleteDocument,
  downloadDocument,
  getDocumentReviews,
  createDocumentReview,
  updateDocumentReview,
  deleteDocumentReview,
} from "./demo/services/libraryService";

import {
  createReport,
  getMyReports,
  getAdminReports,
  getAdminReportDetail,
  approveAdminReport,
  rejectAdminReport,
} from "./demo/services/reportService";

import {
  getAdminDashboard,
  getAdminUsers,
  getAdminUserDetail,
  updateAdminUserStatus,
  issueAdminUserWarning,
  suspendAdminUser,
  reactivateAdminUser,
  getAdminPosts,
  getAdminPostDetail,
  deleteAdminPost,
  toggleAdminPostHidden,
  getAdminAuditLogs,
} from "./demo/services/adminService";

// Styles
import "./styles/auth.css";
import "./styles/navigation.css";
import "./styles/home.css";
import "./styles/feed.css";
import "./styles/preferences.css";
import "./styles/posts.css";
import "./styles/matching.css";
import "./styles/lostFound.css";
import "./styles/messenger.css";
import "./styles/library.css";
import "./styles/admin.css";
import "./styles/reports.css";

export default function App() {
  // =====================================================
  // STATE
  // =====================================================
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // PREFERENCES
  // =====================================================
  const [preferences, setPreferences] = useState(null);
  const [preferencesLoading, setPreferencesLoading] = useState(false);
  const [preferencesSaving, setPreferencesSaving] = useState(false);
  const [preferencesError, setPreferencesError] = useState("");
  const [preferencesSuccess, setPreferencesSuccess] = useState("");

  // =====================================================
  // POSTS
  // =====================================================
  const [postMode, setPostMode] = useState("all");
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsSaving, setPostsSaving] = useState(false);
  const [postsError, setPostsError] = useState("");
  const [postsSuccess, setPostsSuccess] = useState("");
  const [postFormOpen, setPostFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [postFormDefaultType, setPostFormDefaultType] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailPost, setDetailPost] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [postLikes, setPostLikes] = useState({});
  const [likingPostId, setLikingPostId] = useState(null);
  const [postFilters, setPostFilters] = useState({ type: "", time: "" });

  // =====================================================
  // LIKED POSTS
  // =====================================================
  const [likedPosts, setLikedPosts] = useState([]);
  const [likedPostsLoading, setLikedPostsLoading] = useState(false);
  const [likedPostsError, setLikedPostsError] = useState("");

  // =====================================================
  // SMART MATCHING
  // =====================================================
  const [matches, setMatches] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [matchesError, setMatchesError] = useState("");
  const [matchDetailOpen, setMatchDetailOpen] = useState(false);
  const [matchDetail, setMatchDetail] = useState(null);
  const [matchDetailLoading, setMatchDetailLoading] = useState(false);
  const [matchDetailError, setMatchDetailError] = useState("");
  const [matchingMode, setMatchingMode] = useState("students");
  const [roomMatches, setRoomMatches] = useState([]);
  const [roomMatchesLoading, setRoomMatchesLoading] = useState(false);
  const [roomMatchesError, setRoomMatchesError] = useState("");
  const [roomMatchDetailOpen, setRoomMatchDetailOpen] = useState(false);
  const [roomMatchDetail, setRoomMatchDetail] = useState(null);
  const [roomMatchDetailLoading, setRoomMatchDetailLoading] = useState(false);
  const [roomMatchDetailError, setRoomMatchDetailError] = useState("");
  const [targetPostId, setTargetPostId] = useState(null);
  const [targetPostHighlight, setTargetPostHighlight] = useState(false);

  // =====================================================
  // LOST & FOUND
  // =====================================================
  const [lostFoundFilter, setLostFoundFilter] = useState("");
  const [lostFoundItems, setLostFoundItems] = useState([]);
  const [lostFoundLoading, setLostFoundLoading] = useState(false);
  const [lostFoundError, setLostFoundError] = useState("");
  const [lostFoundPins, setLostFoundPins] = useState([]);
  const [lostFoundMapLoading, setLostFoundMapLoading] = useState(false);
  const [lostFoundMapError, setLostFoundMapError] = useState("");
  const [lostFoundSuccess, setLostFoundSuccess] = useState("");
  const [secretMode, setSecretMode] = useState(null);
  const [secretItem, setSecretItem] = useState(null);
  const [secretQuestion, setSecretQuestion] = useState("");
  const [secretLoading, setSecretLoading] = useState(false);
  const [secretSaving, setSecretSaving] = useState(false);
  const [secretError, setSecretError] = useState("");
  const [claimItem, setClaimItem] = useState(null);
  const [claimQuestion, setClaimQuestion] = useState("");
  const [claimSaving, setClaimSaving] = useState(false);
  const [claimError, setClaimError] = useState("");
  const [claimsItem, setClaimsItem] = useState(null);
  const [claims, setClaims] = useState([]);
  const [claimsLoading, setClaimsLoading] = useState(false);
  const [claimsError, setClaimsError] = useState("");
  const [claimsActionId, setClaimsActionId] = useState(null);
  const [verifiedPostIds, setVerifiedPostIds] = useState(new Set());

  // =====================================================
  // CONNECTION REQUESTS
  // =====================================================
  const [connectionMode, setConnectionMode] = useState("received");
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [connectionLoading, setConnectionLoading] = useState(false);
  const [connectionError, setConnectionError] = useState("");
  const [connectionSuccess, setConnectionSuccess] = useState("");
  const [connectionSendingId, setConnectionSendingId] = useState(null);
  const [connectionActionId, setConnectionActionId] = useState(null);
  const [receiverId, setReceiverId] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");

  // =====================================================
  // MESSENGER
  // =====================================================
  const [conversations, setConversations] = useState([]);
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [conversationsError, setConversationsError] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [conversationDetail, setConversationDetail] = useState(null);
  const [conversationDetailLoading, setConversationDetailLoading] = useState(false);
  const [conversationDetailError, setConversationDetailError] = useState("");
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState("");

  // =====================================================
  // SIGNALR
  // =====================================================
  const [chatConnection, setChatConnection] = useState(null);
  const [chatConnected, setChatConnected] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);

  // =====================================================
  // NOTIFICATIONS
  // =====================================================
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [notificationsError, setNotificationsError] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notificationActionId, setNotificationActionId] = useState(null);

  // =====================================================
  // LIBRARY
  // =====================================================
  const [librarySection, setLibrarySection] = useState("books");
  const [libraryMode, setLibraryMode] = useState("all");
  const [books, setBooks] = useState([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [booksSaving, setBooksSaving] = useState(false);
  const [booksError, setBooksError] = useState("");
  const [booksSuccess, setBooksSuccess] = useState("");
  const [bookFilters, setBookFilters] = useState({ search: "", status: "" });
  const [bookFormOpen, setBookFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [bookDetailOpen, setBookDetailOpen] = useState(false);
  const [bookDetail, setBookDetail] = useState(null);
  const [bookDetailLoading, setBookDetailLoading] = useState(false);
  const [bookDetailError, setBookDetailError] = useState("");
  const [bookMatches, setBookMatches] = useState([]);
  const [bookMatchesLoading, setBookMatchesLoading] = useState(false);
  const [bookMatchesError, setBookMatchesError] = useState("");
  const [documentMode, setDocumentMode] = useState("all");
  const [documents, setDocuments] = useState([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentsSaving, setDocumentsSaving] = useState(false);
  const [documentsError, setDocumentsError] = useState("");
  const [documentsSuccess, setDocumentsSuccess] = useState("");
  const [documentFilters, setDocumentFilters] = useState({ search: "", subject: "", pricing: "" });
  const [documentFormOpen, setDocumentFormOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [documentDetailOpen, setDocumentDetailOpen] = useState(false);
  const [documentDetail, setDocumentDetail] = useState(null);
  const [documentDetailLoading, setDocumentDetailLoading] = useState(false);
  const [documentDetailError, setDocumentDetailError] = useState("");
  const [downloadingDocumentId, setDownloadingDocumentId] = useState("");
  const [documentDownloadError, setDocumentDownloadError] = useState("");
  const [documentDownloadSuccess, setDocumentDownloadSuccess] = useState("");
  const [documentReviews, setDocumentReviews] = useState([]);
  const [documentReviewsLoading, setDocumentReviewsLoading] = useState(false);
  const [documentReviewsError, setDocumentReviewsError] = useState("");
  const [documentReviewsSaving, setDocumentReviewsSaving] = useState(false);
  const [documentReviewsSuccess, setDocumentReviewsSuccess] = useState("");
  const [documentReviewFormError, setDocumentReviewFormError] = useState("");
  const [editingDocumentReviewId, setEditingDocumentReviewId] = useState(null);
  const [deletingDocumentReviewId, setDeletingDocumentReviewId] = useState(null);

  // =====================================================
  // REPORTS
  // =====================================================
  const [myReports, setMyReports] = useState([]);
  const [myReportsLoading, setMyReportsLoading] = useState(false);
  const [myReportsError, setMyReportsError] = useState("");
  const [reportFormOpen, setReportFormOpen] = useState(false);
  const [reportPostId, setReportPostId] = useState(null);
  const [reportPostTitle, setReportPostTitle] = useState("");
  const [reportSaving, setReportSaving] = useState(false);
  const [reportError, setReportError] = useState("");
  const [reportSuccess, setReportSuccess] = useState("");

  // =====================================================
  // ADMIN
  // =====================================================
  const [adminStats, setAdminStats] = useState(null);
  const [adminStatsLoading, setAdminStatsLoading] = useState(false);
  const [adminStatsError, setAdminStatsError] = useState("");
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminUsersLoading, setAdminUsersLoading] = useState(false);
  const [adminUsersError, setAdminUsersError] = useState("");
  const [adminUsersPage, setAdminUsersPage] = useState(1);
  const [adminUsersPageSize, setAdminUsersPageSize] = useState(10);
  const [adminUsersTotalPages, setAdminUsersTotalPages] = useState(1);
  const [adminUsersSearch, setAdminUsersSearch] = useState("");
  const [adminUsersStatus, setAdminUsersStatus] = useState("");
  const [adminPosts, setAdminPosts] = useState([]);
  const [adminPostsLoading, setAdminPostsLoading] = useState(false);
  const [adminPostsError, setAdminPostsError] = useState("");
  const [adminPostsPage, setAdminPostsPage] = useState(1);
  const [adminPostsPageSize, setAdminPostsPageSize] = useState(10);
  const [adminPostsTotalPages, setAdminPostsTotalPages] = useState(1);
  const [adminPostsSearch, setAdminPostsSearch] = useState("");
  const [adminPostsType, setAdminPostsType] = useState("");
  const [adminPostsStatus, setAdminPostsStatus] = useState("");
  const [adminReports, setAdminReports] = useState([]);
  const [adminReportsLoading, setAdminReportsLoading] = useState(false);
  const [adminReportsError, setAdminReportsError] = useState("");
  const [adminReportsStatus, setAdminReportsStatus] = useState("");
  const [adminAuditLogs, setAdminAuditLogs] = useState([]);
  const [adminAuditLogsLoading, setAdminAuditLogsLoading] = useState(false);
  const [adminAuditLogsError, setAdminAuditLogsError] = useState("");
  const [adminActionId, setAdminActionId] = useState(null);

  // =====================================================
  // REFS
  // =====================================================
  const selectedConversationIdRef = useRef(null);
  const receiveMessageRef = useRef(null);
  const receiveNotificationRef = useRef(null);

  useEffect(() => {
    selectedConversationIdRef.current = selectedConversationId;
  }, [selectedConversationId]);

  useEffect(() => {
    receiveMessageRef.current = handleReceiveMessage;
  });

  useEffect(() => {
    receiveNotificationRef.current = handleReceiveNotification;
  });

  // =====================================================
  // INITIALIZE - CHECK DEMO SESSION
  // =====================================================
  useEffect(() => {
    let restoreCancelled = false;

    async function restoreLogin() {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const currentUser = await getMe();
        if (restoreCancelled) return;
        setUser(currentUser);
        setPage(currentUser?.role === "Admin" ? "admin-dashboard" : "home");
      } catch (error) {
        if (restoreCancelled) return;
        if (error.status !== 401) {
          console.error("Restore login failed:", error);
        }
        setUser(null);
        setNotifications([]);
        setUnreadCount(0);
        setNotificationsOpen(false);
        setPage("login");
      } finally {
        if (!restoreCancelled) {
          setLoading(false);
        }
      }
    }

    restoreLogin();
    return () => { restoreCancelled = true; };
  }, []);

  // =====================================================
  // SIGNALR CONNECTION (MOCK)
  // =====================================================
  useEffect(() => {
    if (!user) return;

    let cancelled = false;
    let connectionStarted = false;

    const connection = createChatConnection(
      (message) => receiveMessageRef.current?.(message),
      (notification) => receiveNotificationRef.current?.(notification)
    );

    setChatConnection(connection);

    connection.start().then(() => {
      connectionStarted = true;
      if (!cancelled) setChatConnected(true);
    }).catch((error) => {
      if (!cancelled) setChatConnected(false);
      console.error("Chat connect failed:", error);
    });

    return () => {
      cancelled = true;
      setChatConnected(false);
      setChatConnection(null);
      if (connectionStarted) {
        connection.stop().catch((error) => console.error("Chat stop failed:", error));
      }
    };
  }, [user]);

  // =====================================================
  // UNREAD NOTIFICATIONS
  // =====================================================
  useEffect(() => {
    if (!user) return;
    fetchUnreadNotifications();
  }, [user]);

  // =====================================================
  // AUTH HANDLERS
  // =====================================================
  async function handleLogin(credentials) {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const loginResult = await login(credentials);
      const currentUser = loginResult?.user ?? null;
      setUser(currentUser);
      setPage(currentUser?.role === "Admin" ? "admin-dashboard" : "home");
    } catch (error) {
      console.error("Login error:", error);
      setUser(null);
      setNotifications([]);
      setUnreadCount(0);
      setNotificationsOpen(false);
      setError(error.message || "Đăng nhập thất bại.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(formData) {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await register(formData);
      setSuccess("Đăng ký thành công! Hãy đăng nhập bằng tài khoản vừa tạo.");
      setPage("login");
    } catch (error) {
      console.error("Register error:", error);
      setError(error.message || "Đăng ký thất bại.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoading(true);
    setError("");

    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setNotifications([]);
      setUnreadCount(0);
      setNotificationsOpen(false);
      setPage("login");
      setSuccess("");
      setLoading(false);
    }
  }

  function showLogin() {
    setPage("login");
    setError("");
    setSuccess("");
  }

  function showRegister() {
    setPage("register");
    setError("");
    setSuccess("");
  }

  // =====================================================
  // PROFILE
  // =====================================================
  async function fetchProfile() {
    setLoading(true);
    setError("");
    try {
      const profile = await getUserProfile();
      setUser(profile);
    } catch (error) {
      console.error("Fetch profile failed:", error);
      setError(error.message || "Không thể tải hồ sơ.");
    } finally {
      setLoading(false);
    }
  }

  function showProfile() {
    setPage("profile");
    setError("");
    setSuccess("");
    fetchProfile();
    fetchLikedPosts();
  }

  function showLikedPosts() {
    setPage("liked-posts");
    setError("");
    setSuccess("");
    fetchLikedPosts();
  }

  // =====================================================
  // REPORTS
  // =====================================================
  async function fetchMyReports() {
    setMyReportsLoading(true);
    setMyReportsError("");
    try {
      const data = await getMyReports();
      setMyReports(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch my reports failed:", error);
      setMyReports([]);
      setMyReportsError(error.message || "Không thể tải danh sách báo cáo.");
    } finally {
      setMyReportsLoading(false);
    }
  }

  function showMyReports() {
    setPage("my-reports");
    setError("");
    setSuccess("");
    fetchMyReports();
  }

  function openReportForm(postId, postTitle) {
    setReportPostId(postId);
    setReportPostTitle(postTitle);
    setReportFormOpen(true);
    setReportError("");
    setReportSuccess("");
  }

  function closeReportForm() {
    setReportFormOpen(false);
    setReportPostId(null);
    setReportPostTitle("");
    setReportError("");
    setReportSuccess("");
  }

  async function handleSubmitReport(reason, description) {
    const postId = reportPostId;
    if (!postId) return;

    setReportSaving(true);
    setReportError("");
    setReportSuccess("");

    try {
      await createReport(postId, reason, description);
      setReportSuccess("Báo cáo đã được gửi thành công.");
      closeReportForm();
      fetchMyReports();
    } catch (error) {
      console.error("Submit report failed:", error);
      setReportError(error.message || "Gửi báo cáo thất bại.");
    } finally {
      setReportSaving(false);
    }
  }

  // =====================================================
  // ADMIN
  // =====================================================
  async function fetchAdminDashboard() {
    setAdminStatsLoading(true);
    setAdminStatsError("");
    try {
      const data = await getAdminDashboard();
      setAdminStats(data);
    } catch (error) {
      console.error("Fetch admin dashboard failed:", error);
      setAdminStats(null);
      setAdminStatsError(error.message || "Không thể tải thống kê Admin.");
    } finally {
      setAdminStatsLoading(false);
    }
  }

  function showAdminDashboard() {
    setPage("admin-dashboard");
    setError("");
    setSuccess("");
    fetchAdminDashboard();
  }

  function handleAdminOpenSection(section) {
    switch (section) {
      case "violations": showAdminReports(); break;
      case "content": showAdminPosts(); break;
      case "users": showAdminUsers(); break;
      case "audit-logs": showAdminAuditLogs(); break;
      case "statistics":
      default: showAdminDashboard(); break;
    }
  }

  async function fetchAdminUsers(page = 1, pageSize = 10, search = "", status = "") {
    setAdminUsersLoading(true);
    setAdminUsersError("");
    try {
      const data = await getAdminUsers({ page, pageSize, search, status });
      setAdminUsers(data?.items ?? []);
      setAdminUsersPage(data?.page ?? 1);
      setAdminUsersPageSize(data?.pageSize ?? pageSize);
      setAdminUsersTotalPages(data?.totalPages ?? 1);
    } catch (error) {
      console.error("Fetch admin users failed:", error);
      setAdminUsers([]);
      setAdminUsersError(error.message || "Không thể tải danh sách người dùng.");
    } finally {
      setAdminUsersLoading(false);
    }
  }

  function showAdminUsers() {
    setPage("admin-users");
    setError("");
    setSuccess("");
    setAdminUsersPage(1);
    setAdminUsersSearch("");
    setAdminUsersStatus("");
    fetchAdminUsers(1, adminUsersPageSize, "", "");
  }

  async function handleAdminUserSearchChange(search) {
    setAdminUsersSearch(search);
    fetchAdminUsers(1, adminUsersPageSize, search, adminUsersStatus);
  }

  async function handleAdminUserStatusChange(status) {
    setAdminUsersStatus(status);
    fetchAdminUsers(1, adminUsersPageSize, adminUsersSearch, status);
  }

  async function handleAdminUserPageChange(page) {
    fetchAdminUsers(page, adminUsersPageSize, adminUsersSearch, adminUsersStatus);
  }

  async function handleAdminUserPageSizeChange(pageSize) {
    fetchAdminUsers(1, pageSize, adminUsersSearch, adminUsersStatus);
  }

  async function handleAdminUserViewDetail(userData) {
    const data = await getAdminUserDetail(userData.id);
    fetchAdminUsers(adminUsersPage, adminUsersPageSize, adminUsersSearch, adminUsersStatus);
  }

  async function handleAdminUserWarning(user) {
    const reason = window.prompt("Nhập lý do cảnh báo:");
    if (reason === null || reason.trim() === "") return;
    setAdminActionId(user.id);
    try {
      await issueAdminUserWarning(user.id, reason.trim());
      fetchAdminUsers(adminUsersPage, adminUsersPageSize, adminUsersSearch, adminUsersStatus);
    } catch (error) {
      console.error("Issue warning failed:", error);
      setAdminUsersError(error.message || "Không thể gửi cảnh báo.");
    } finally {
      setAdminActionId(null);
    }
  }

  async function handleAdminUserSuspend(user) {
    const reason = window.prompt("Nhập lý do khóa tài khoản:");
    if (reason === null || reason.trim() === "") return;
    setAdminActionId(user.id);
    try {
      await suspendAdminUser(user.id, reason.trim(), null);
      fetchAdminUsers(adminUsersPage, adminUsersPageSize, adminUsersSearch, adminUsersStatus);
    } catch (error) {
      console.error("Suspend user failed:", error);
      setAdminUsersError(error.message || "Không thể khóa tài khoản.");
    } finally {
      setAdminActionId(null);
    }
  }

  async function handleAdminUserReactivate(user) {
    setAdminActionId(user.id);
    try {
      await reactivateAdminUser(user.id);
      fetchAdminUsers(adminUsersPage, adminUsersPageSize, adminUsersSearch, adminUsersStatus);
    } catch (error) {
      console.error("Reactivate user failed:", error);
      setAdminUsersError(error.message || "Không thể khôi phục tài khoản.");
    } finally {
      setAdminActionId(null);
    }
  }

  async function fetchAdminPosts(page = 1, pageSize = 10, type = "", status = "", search = "") {
    setAdminPostsLoading(true);
    setAdminPostsError("");
    try {
      const data = await getAdminPosts({ page, pageSize, type, status, search });
      setAdminPosts(data?.items ?? []);
      setAdminPostsPage(data?.page ?? 1);
      setAdminPostsPageSize(data?.pageSize ?? pageSize);
      setAdminPostsTotalPages(data?.totalPages ?? 1);
    } catch (error) {
      console.error("Fetch admin posts failed:", error);
      setAdminPosts([]);
      setAdminPostsError(error.message || "Không thể tải danh sách bài đăng.");
    } finally {
      setAdminPostsLoading(false);
    }
  }

  function showAdminPosts() {
    setPage("admin-posts");
    setError("");
    setSuccess("");
    setAdminPostsPage(1);
    setAdminPostsSearch("");
    setAdminPostsType("");
    setAdminPostsStatus("");
    fetchAdminPosts(1, adminPostsPageSize, "", "", "");
  }

  async function handleAdminPostSearchChange(search) {
    setAdminPostsSearch(search);
    fetchAdminPosts(1, adminPostsPageSize, adminPostsType, adminPostsStatus, search);
  }

  async function handleAdminPostTypeChange(type) {
    setAdminPostsType(type);
    fetchAdminPosts(1, adminPostsPageSize, type, adminPostsStatus, adminPostsSearch);
  }

  async function handleAdminPostStatusChange(status) {
    setAdminPostsStatus(status);
    fetchAdminPosts(1, adminPostsPageSize, adminPostsType, status, adminPostsSearch);
  }

  async function handleAdminPostPageChange(page) {
    fetchAdminPosts(page, adminPostsPageSize, adminPostsType, adminPostsStatus, adminPostsSearch);
  }

  async function handleAdminPostPageSizeChange(pageSize) {
    fetchAdminPosts(1, pageSize, adminPostsType, adminPostsStatus, adminPostsSearch);
  }

  async function handleAdminPostViewDetail(post) {
    await getAdminPostDetail(post.id);
  }

  async function handleAdminPostDelete(postId) {
    setAdminActionId(postId);
    try {
      await deleteAdminPost(postId);
      fetchAdminPosts(adminPostsPage, adminPostsPageSize, adminPostsType, adminPostsStatus, adminPostsSearch);
    } catch (error) {
      console.error("Delete admin post failed:", error);
      setAdminPostsError(error.message || "Không thể xóa bài đăng.");
    } finally {
      setAdminActionId(null);
    }
  }

  async function fetchAdminReports(status = "") {
    setAdminReportsLoading(true);
    setAdminReportsError("");
    try {
      const data = await getAdminReports({ status });
      setAdminReports(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch admin reports failed:", error);
      setAdminReports([]);
      setAdminReportsError(error.message || "Không thể tải danh sách báo cáo.");
    } finally {
      setAdminReportsLoading(false);
    }
  }

  function showAdminReports() {
    setPage("admin-reports");
    setError("");
    setSuccess("");
    setAdminReportsStatus("");
    fetchAdminReports("");
  }

  async function handleAdminReportsStatusChange(status) {
    setAdminReportsStatus(status);
    fetchAdminReports(status);
  }

  async function handleAdminReportViewDetail(report) {
    await getAdminReportDetail(report.id);
  }

  async function handleAdminReportApprove(reportId) {
    setAdminActionId(reportId);
    try {
      await approveAdminReport(reportId);
      fetchAdminReports(adminReportsStatus);
    } catch (error) {
      console.error("Approve admin report failed:", error);
      setAdminReportsError(error.message || "Không thể duyệt báo cáo.");
    } finally {
      setAdminActionId(null);
    }
  }

  async function handleAdminReportReject(reportId) {
    setAdminActionId(reportId);
    try {
      await rejectAdminReport(reportId);
      fetchAdminReports(adminReportsStatus);
    } catch (error) {
      console.error("Reject admin report failed:", error);
      setAdminReportsError(error.message || "Không thể từ chối báo cáo.");
    } finally {
      setAdminActionId(null);
    }
  }

  async function fetchAdminAuditLogs() {
    setAdminAuditLogsLoading(true);
    setAdminAuditLogsError("");
    try {
      const data = await getAdminAuditLogs();
      setAdminAuditLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch admin audit logs failed:", error);
      setAdminAuditLogs([]);
      setAdminAuditLogsError(error.message || "Không thể tải nhật ký kiểm tra.");
    } finally {
      setAdminAuditLogsLoading(false);
    }
  }

  function showAdminAuditLogs() {
    setPage("admin-audit-logs");
    setError("");
    setSuccess("");
    fetchAdminAuditLogs();
  }

  async function handleAdminPostToggleHidden(postId, reason = null) {
    setAdminActionId(postId);
    try {
      await toggleAdminPostHidden(postId, reason);
      fetchAdminPosts(adminPostsPage, adminPostsPageSize, adminPostsType, adminPostsStatus, adminPostsSearch);
    } catch (error) {
      console.error("Toggle admin post hidden failed:", error);
      setAdminPostsError(error.message || "Không thể thay đổi trạng thái bài đăng.");
    } finally {
      setAdminActionId(null);
    }
  }

  function showEditProfile() {
    setPage("edit-profile");
    setError("");
    setSuccess("");
  }

  function showChangePassword() {
    setPage("change-password");
    setError("");
    setSuccess("");
  }

  // =====================================================
  // PREFERENCES
  // =====================================================
  async function fetchPreferences() {
    setPreferencesLoading(true);
    setPreferencesError("");
    try {
      const data = await getPreferences();
      setPreferences(data);
    } catch (error) {
      console.error("Fetch preferences failed:", error);
      setPreferencesError(error.message || "Không thể tải vector nhu cầu.");
    } finally {
      setPreferencesLoading(false);
    }
  }

  function showPreferences() {
    setPage("preferences");
    setError("");
    setSuccess("");
    setPreferencesSuccess("");
    setPreferencesError("");
    fetchPreferences();
  }

  async function handleSavePreferences(formData) {
    setPreferencesSaving(true);
    setPreferencesError("");
    setPreferencesSuccess("");

    try {
      const merged = { ...(preferences || {}), ...formData };
      if (formData.studySubjects === null) merged.studySubjects = preferences?.studySubjects ?? null;
      if (formData.studyLanguages === null) merged.studyLanguages = preferences?.studyLanguages ?? null;
      if (formData.studyGoal === null) merged.studyGoal = preferences?.studyGoal ?? null;
      if (formData.studyTime === null) merged.studyTime = preferences?.studyTime ?? null;
      if (formData.studyFormat === null) merged.studyFormat = preferences?.studyFormat ?? null;
      if (formData.studyMethod === null) merged.studyMethod = preferences?.studyMethod ?? null;
      if (formData.roomAmenities === null) merged.roomAmenities = preferences?.roomAmenities ?? null;

      const saved = preferences
        ? await updatePreferences(merged)
        : await createPreferences(merged);

      setPreferences(saved);
      setPreferencesSuccess(preferences ? "Vector nhu cầu đã được cập nhật." : "Vector nhu cầu đã được tạo.");
    } catch (error) {
      console.error("Save preferences error:", error);
      setPreferencesError(error.message || "Lưu vector nhu cầu thất bại.");
    } finally {
      setPreferencesSaving(false);
    }
  }

  async function handleDeletePreferences() {
    setPreferencesSaving(true);
    setPreferencesError("");
    setPreferencesSuccess("");
    try {
      await deletePreferences();
      setPreferences(null);
      setPreferencesSuccess("Vector nhu cầu đã được xóa.");
    } catch (error) {
      console.error("Delete preferences error:", error);
      setPreferencesError(error.message || "Xóa vector nhu cầu thất bại.");
    } finally {
      setPreferencesSaving(false);
    }
  }

  // =====================================================
  // UPDATE PROFILE
  // =====================================================
  async function handleUpdateProfile(formData) {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const updated = await updateProfile({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
      });
      if (formData.avatarUrl) {
        await updateAvatar({ avatarUrl: formData.avatarUrl });
        updated.avatarUrl = formData.avatarUrl;
      }
      setUser(updated);
      setSuccess("Hồ sơ đã được cập nhật.");
      setPage("profile");
    } catch (error) {
      console.error("Update profile error:", error);
      setError(error.message || "Cập nhật hồ sơ thất bại.");
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // CHANGE PASSWORD
  // =====================================================
  async function handleChangePassword(formData) {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      setSuccess("Mật khẩu đã được thay đổi.");
      setPage("profile");
    } catch (error) {
      console.error("Change password error:", error);
      setError(error.message || "Đổi mật khẩu thất bại.");
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // POSTS HELPERS
  // =====================================================
  function summarizeLikes(likes) {
    const list = likes ?? [];
    const currentUserId = user?.id ?? user?.Id ?? "";
    return {
      count: list.length,
      likedByMe: Boolean(currentUserId) && list.some(like => String(like.userId).toLowerCase() === String(currentUserId).toLowerCase()),
    };
  }

  async function loadPostLikes(list) {
    const entries = await Promise.all((list ?? []).map(async (post) => {
      const postId = post?.PostId ?? post?.postId ?? post?.id ?? post?.Id ?? (post?.post ? post.post.PostId ?? post.post.postId ?? post.post.id : null);
      try {
        const likes = await getPostLikes(postId);
        return [postId, summarizeLikes(likes)];
      } catch (error) {
        console.error("Fetch post likes failed:", postId, error);
        return [postId, { count: 0, likedByMe: false }];
      }
    }));
    return Object.fromEntries(entries);
  }

  async function fetchPosts(mode, filters) {
    setPostsLoading(true);
    setPostsError("");
    const activeFilters = filters ?? postFilters;
    try {
      const data = mode === "mine" ? await getMyPosts() : await getPosts(activeFilters);
      setPosts(data);
      setPostLikes(await loadPostLikes(data));
      fetchConnectionRequests();
    } catch (error) {
      console.error("Fetch posts failed:", error);
      setPosts([]);
      setPostLikes({});
      setPostsError(error.message || "Không thể tải danh sách bài đăng.");
    } finally {
      setPostsLoading(false);
    }
  }

  // =====================================================
  // LIKED POSTS
  // =====================================================
  const fetchLikedPosts = useCallback(async () => {
    setLikedPostsLoading(true);
    setLikedPostsError("");
    try {
      const data = await getLikedPosts();
      setLikedPosts(data);
      if (data && data.length > 0) {
        const likesMap = await loadPostLikes(data);
        setPostLikes(likesMap);
      }
    } catch (error) {
      console.error("Fetch liked posts failed:", error);
      setLikedPosts([]);
      setPostLikes({});
      setLikedPostsError(error.message || "Không thể tải lịch sử bài đăng đã thích.");
    } finally {
      setLikedPostsLoading(false);
    }
  }, []);

  function showPosts(mode, targetPostId) {
    const targetMode = mode || "all";
    setPage("posts");
    setError("");
    setSuccess("");
    setPostMode(targetMode);
    setPostsSuccess("");
    setPostFormOpen(false);
    setDetailOpen(false);
    setTargetPostId(targetPostId ?? null);
    fetchPosts(targetMode);
  }

  function showMyPosts() { showPosts("mine"); }
  function showAllPosts(targetPostId) { showPosts("all", targetPostId); }

  function showHome() {
    if (user?.role === "Admin") { setPage("admin-dashboard"); }
    else { setPage("home"); }
    setError(""); setSuccess("");
  }

  function handleFilterChange(nextFilters) {
    const filters = { type: nextFilters.type ?? "", time: nextFilters.time ?? "" };
    setPostFilters(filters);
    setPostsSuccess("");
    if (postMode !== "all") return;
    fetchPosts("all", filters);
  }

  function switchPostMode() { showPosts(postMode === "mine" ? "all" : "mine"); }

  function openPostForm(post, defaultType = "") {
    setEditingPost(post || null);
    setPostFormOpen(true);
    setPostFormDefaultType(defaultType);
    setPostsError(""); setPostsSuccess("");
    setDetailOpen(false);
  }

  function closePostForm() {
    setPostFormOpen(false);
    setEditingPost(null);
    setPostFormDefaultType("");
  }

  async function handleSubmitPost(formData) {
    setPostsSaving(true);
    setPostsError(""); setPostsSuccess("");
    try {
      if (editingPost) {
        await updatePost(editingPost.id, formData);
        setPostsSuccess("Bài đăng đã được cập nhật.");
      } else {
        const type = (formData && formData.type) || postFormDefaultType || '';
        const t = type.toString().toLowerCase();
        if (formData && t === "found") formData.type = "Found";
        if (formData && t === "lost") formData.type = "Lost";
        if (t === 'group') { await createStudentPost(formData); setPostsSuccess("Bài đăng đã được tạo."); }
        else if (t === 'room') { await createRoomPost(formData); setPostsSuccess("Bài đăng đã được tạo."); }
        else {
          const createdPost = await createPost(formData);
          setPostsSuccess("Bài đăng đã được tạo.");
          if (t === 'found' && formData.secretQuestion && formData.secretAnswer) {
            try { await createSecretQuestion(createdPost?.id ?? createdPost?.postId, { question: formData.secretQuestion, answer: formData.secretAnswer }); }
            catch (secretError) { console.error("Create secret question failed:", secretError); }
          }
        }
      }
      closePostForm();
      await fetchPosts(postMode);
    } catch (error) {
      console.error("Save post error:", error);
      setPostsError(error.message || "Lưu bài đăng thất bại.");
    } finally {
      setPostsSaving(false);
    }
  }

  async function handleDeletePost(post) {
    const confirmed = window.confirm("Xóa bài đăng này? Hành động không thể hoàn tác.");
    if (!confirmed) return;
    setPostsSaving(true); setPostsError(""); setPostsSuccess("");
    try {
      await deletePost(post.id);
      setDetailOpen(false);
      setPostsSuccess("Bài đăng đã được xóa.");
      await fetchPosts(postMode);
    } catch (error) {
      console.error("Delete post error:", error);
      setPostsError(error.message || "Xóa bài đăng thất bại.");
    } finally { setPostsSaving(false); }
  }

  async function handleOpenPostDetail(postId) {
    setDetailOpen(true); setDetailLoading(true); setDetailError(""); setDetailPost(null);
    try {
      const data = await getPostById(postId);
      setDetailPost(data);
    } catch (error) {
      console.error("Fetch post detail failed:", error);
      setDetailError(error.message || "Không tìm thấy bài đăng.");
    } finally { setDetailLoading(false); }
  }

  async function handleOpenLikedPostDetail(postId) {
    setPage("posts"); setPostMode("all"); setError(""); setSuccess(""); setPostsSuccess(""); setPostFormOpen(false);
    fetchPosts("all");
    handleOpenPostDetail(postId);
  }

  function closePostDetail() { setDetailOpen(false); setDetailPost(null); }

  async function handleToggleLike(postId) {
    const current = postLikes[postId] ?? { count: 0, likedByMe: false };
    setLikingPostId(postId); setPostsError("");
    try {
      if (current.likedByMe) { await unlikePost(postId); setLikedPosts(prev => prev.filter(p => (p.postId ?? p.PostId ?? p.id ?? p.Id) !== postId)); }
      else { await likePost(postId); }
      const likes = await getPostLikes(postId);
      setPostLikes(prev => ({ ...prev, [postId]: summarizeLikes(likes) }));
    } catch (error) {
      console.error("Toggle like error:", error);
      setPostsError(error.message || "Thao tác thích bài đăng thất bại.");
    } finally { setLikingPostId(null); }
  }

  // =====================================================
  // SMART MATCHING
  // =====================================================
  async function fetchStudentMatches() {
    setMatchesLoading(true); setMatchesError("");
    try {
      const data = await getStudentMatches();
      setMatches(data);
    } catch (error) {
      console.error("Fetch student matches failed:", error);
      setMatches([]); setMatchesError(error.message || "Không thể tải kết quả Smart Matching.");
    } finally { setMatchesLoading(false); }
  }

  function showSmartMatching() {
    setPage("smart-matching"); setError(""); setSuccess(""); setMatchDetailOpen(false); setRoomMatchDetailOpen(false);
    fetchStudentMatches();
    if (matchingMode === "rooms") { fetchRoomMatches(); }
  }

  function handleChangeMatchingMode(mode) {
    if (mode === matchingMode) return;
    setMatchingMode(mode); setMatchDetailOpen(false); setRoomMatchDetailOpen(false);
    setMatchDetailError(""); setRoomMatchDetailError("");
    if (mode === "rooms") { fetchRoomMatches(); return; }
    fetchStudentMatches();
  }

  async function handleRunStudyMatching() { await fetchStudentMatches(); }
  async function handleRunRoomMatching() { await fetchRoomMatches(); }

  async function handleOpenMatchDetail(userId) {
    setMatchDetailOpen(true); setMatchDetailLoading(true); setMatchDetailError(""); setMatchDetail(null);
    try { const data = await getStudentMatch(userId); setMatchDetail(data); }
    catch (error) { console.error("Fetch match detail failed:", error); setMatchDetailError(error.message || "Không tìm thấy người phù hợp."); }
    finally { setMatchDetailLoading(false); }
  }

  function closeMatchDetail() { setMatchDetailOpen(false); setMatchDetail(null); }

  async function fetchRoomMatches() {
    setRoomMatchesLoading(true); setRoomMatchesError("");
    try { const data = await getRoomMatches(); setRoomMatches(data); }
    catch (error) { console.error("Fetch room matches failed:", error); setRoomMatches([]); setRoomMatchesError(error.message || "Không thể tải kết quả tìm trọ/đồng ghép."); }
    finally { setRoomMatchesLoading(false); }
  }

  async function handleOpenRoomMatchDetail(userId) {
    setRoomMatchDetailOpen(true); setRoomMatchDetailLoading(true); setRoomMatchDetailError(""); setRoomMatchDetail(null);
    try { const data = await getRoomMatch(userId); setRoomMatchDetail(data); }
    catch (error) { console.error("Fetch room match detail failed:", error); setRoomMatchDetailError(error.message || "Không tìm thấy ứng viên tìm trọ/đồng ghép."); }
    finally { setRoomMatchDetailLoading(false); }
  }

  function closeRoomMatchDetail() { setRoomMatchDetailOpen(false); setRoomMatchDetail(null); }

  // =====================================================
  // LOST & FOUND
  // =====================================================
  async function fetchLostFoundMap() {
    setLostFoundMapLoading(true); setLostFoundMapError("");
    try { const data = await getLostFoundMap(); setLostFoundPins(data); }
    catch (error) { console.error("Fetch lost & found map failed:", error); setLostFoundPins([]); setLostFoundMapError(error.message || "Không thể tải dữ liệu bản đồ Lost & Found."); }
    finally { setLostFoundMapLoading(false); }
  }

  async function fetchLostFound(filter) {
    setLostFoundLoading(true); setLostFoundError("");
    try { const data = await getLostFoundPosts(filter); setLostFoundItems(data); }
    catch (error) { console.error("Fetch lost & found failed:", error); setLostFoundItems([]); setLostFoundError(error.message || "Không thể tải dữ liệu Lost & Found."); }
    finally { setLostFoundLoading(false); }
  }

  function showLostFound() {
    setPage("lost-found"); setError(""); setSuccess(""); setLostFoundSuccess(""); setLostFoundFilter("");
    fetchLostFound(""); fetchLostFoundMap();
  }

  async function handleLostFoundFilterChange(filter) {
    setLostFoundSuccess(""); setLostFoundFilter(filter);
    await fetchLostFound(filter);
  }

  function closeSecretQuestion() {
    setSecretMode(null); setSecretItem(null); setSecretQuestion(""); setSecretError(""); setSecretLoading(false); setSecretSaving(false);
  }

  async function handleOpenSecretQuestion(item) {
    setSecretItem(item); setSecretQuestion(""); setSecretError("");
    const currentUserId = user?.id ?? user?.Id ?? "";
    const isOwner = Boolean(currentUserId) && String(item?.userId ?? "").toLowerCase() === String(currentUserId).toLowerCase();
    if (isOwner) { setSecretMode("create"); return; }
    setSecretMode("view"); setSecretLoading(true);
    try { const data = await getSecretQuestion(item.postId); setSecretQuestion(data?.question ?? ""); }
    catch (error) { console.error("Fetch secret question failed:", error); setSecretError(error.status === 404 ? "Người nhặt đồ chưa tạo câu hỏi bí mật." : error.message || "Không thể tải câu hỏi bí mật."); }
    finally { setSecretLoading(false); }
  }

  async function handleSubmitSecretQuestion({ question, answer }) {
    setSecretSaving(true); setSecretError("");
    try { await createSecretQuestion(secretItem.postId, { question, answer }); closeSecretQuestion(); }
    catch (error) { console.error("Create secret question failed:", error); setSecretError(getSecretQuestionErrorMessage(error)); }
    finally { setSecretSaving(false); }
  }

  function getSecretQuestionErrorMessage(error) {
    if (error.status === 409) return "Câu hỏi bí mật của bài đăng này đã tồn tại.";
    if (error.status === 403) return "Bạn không phải chủ bài đăng này.";
    return error.message || "Không thể lưu câu hỏi bí mật.";
  }

  async function handleViewMatches(postId) { return await getMatches(postId); }

  async function handleViewLostFoundDetail(item) {
    const postId = item?.postId ?? item?.PostId ?? item?.id ?? item?.Id;
    if (!postId) return;
    setPage("posts"); setPostMode("all"); setError(""); setSuccess(""); setPostsSuccess(""); setPostFormOpen(false);
    setTargetPostId(postId); setTargetPostHighlight(true);
    setDetailOpen(true); await handleOpenPostDetail(postId); fetchPosts("all");
  }

  function closeClaim() { setClaimItem(null); setClaimQuestion(""); setClaimError(""); setClaimSaving(false); }

  function handleAnswerSecretQuestion() {
    setSecretMode(null); setSecretItem(null); setClaimItem(secretItem); setClaimQuestion(secretQuestion); setClaimError("");
  }

  async function handleSubmitClaim({ answer }) {
    setClaimSaving(true); setClaimError("");
    try {
      const data = await createClaim(claimItem.postId, { answer });
      closeClaim(); closeSecretQuestion();
      setVerifiedPostIds(prev => { const next = new Set(prev); next.add(claimItem.postId); return next; });
      setLostFoundSuccess(`Đã gửi yêu cầu nhận đồ (${data?.status ?? "Pending"}).`);
    } catch (error) { console.error("Create claim failed:", error); setClaimError(getClaimErrorMessage(error)); }
    finally { setClaimSaving(false); }
  }

  function getClaimErrorMessage(error) {
    if (error.status === 400) return "Câu trả lời không đúng với câu hỏi bí mật.";
    if (error.status === 409) return "Người nhặt đồ chưa tạo câu hỏi bí mật cho bài đăng này.";
    if (error.status === 403) return "Bạn không thể gửi yêu cầu nhận đồ cho bài đăng của mình.";
    return error.message || "Không thể gửi yêu cầu nhận đồ.";
  }

  function closeClaims() { setClaimsItem(null); setClaims([]); setClaimsError(""); setClaimsLoading(false); }

  async function handleOpenClaims(item) {
    setClaimsItem(item); setClaims([]); setClaimsError(""); setClaimsLoading(true);
    try { const data = await getClaims(item.postId); setClaims(data); }
    catch (error) { console.error("Fetch claims failed:", error); setClaimsError(getClaimsErrorMessage(error)); }
    finally { setClaimsLoading(false); }
  }

  function getClaimsErrorMessage(error) {
    if (error.status === 403) return "Bạn không phải chủ bài đăng này.";
    if (error.status === 409) return "Bài đăng này không nhận yêu cầu nhận đồ.";
    return error.message || "Không thể tải yêu cầu.";
  }

  async function reloadClaims(postId) {
    try { const data = await getClaims(postId); setClaims(data); setClaimsError(""); }
    catch (error) { console.error("Reload claims failed:", error); setClaimsError(getClaimsErrorMessage(error)); }
  }

  async function handleApproveClaim(claim) {
    setClaimsActionId(claim?.claimId); setClaimsError(""); setLostFoundSuccess("");
    try { const data = await approveClaim(claim?.claimId); await reloadClaims(claim?.postId); setLostFoundSuccess(`Đã duyệt yêu cầu (${data?.status ?? "Approved"}).`); }
    catch (error) { console.error("Approve claim failed:", error); setClaimsError(getClaimActionErrorMessage(error, "Không thể duyệt yêu cầu nhận đồ.")); }
    finally { setClaimsActionId(null); }
  }

  async function handleRejectClaim(claim) {
    setClaimsActionId(claim?.claimId); setClaimsError(""); setLostFoundSuccess("");
    try { const data = await rejectClaim(claim?.claimId); await reloadClaims(claim?.postId); setLostFoundSuccess(`Đã từ chối yêu cầu (${data?.status ?? "Rejected"}).`); }
    catch (error) { console.error("Reject claim failed:", error); setClaimsError(getClaimActionErrorMessage(error, "Không thể từ chối yêu cầu nhận đồ.")); }
    finally { setClaimsActionId(null); }
  }

  function getClaimActionErrorMessage(error, fallback) {
    if (error.status === 403) return "Bạn không phải chủ bài đăng này.";
    if (error.status === 409) return error.message || "Yêu cầu này không còn ở trạng thái chờ.";
    return error.message || fallback;
  }

  async function handleMarkReturned(item) {
    const confirmed = window.confirm("Xác nhận đã trao trả đồ? Bài đăng sẽ chuyển sang trạng thái Đã Trao Trả.");
    if (!confirmed) return;
    setClaimsActionId("returned"); setClaimsError(""); setLostFoundSuccess("");
    try { await markReturned(item?.postId); await reloadClaims(item?.postId); await fetchLostFound(lostFoundFilter); await fetchLostFoundMap(); setLostFoundSuccess("Đã xác nhận trả đồ."); }
    catch (error) { console.error("Mark returned failed:", error); setClaimsError(getClaimActionErrorMessage(error, "Không thể xác nhận đã trả đồ.")); }
    finally { setClaimsActionId(null); }
  }

  // =====================================================
  // CONNECTION REQUESTS
  // =====================================================
  async function fetchConnectionRequests() {
    setConnectionLoading(true); setConnectionError("");
    try { const data = await getConnectionRequests(); setConnectionRequests(Array.isArray(data) ? data : []); }
    catch (error) { console.error("Fetch connection requests failed:", error); setConnectionRequests([]); setConnectionError(error.message || "Không thể tải yêu cầu kết nối."); }
    finally { setConnectionLoading(false); }
  }

  function showConnections() {
    setPage("connections"); setError(""); setSuccess(""); setConnectionMode("received"); setConnectionSuccess(""); setConnectionError(""); setSendError(""); setReceiverId(""); fetchConnectionRequests();
  }

  async function handleRequestConnection(receiverId, postId) {
    if (!receiverId) return;
    setConnectionSendingId(postId ?? null); setConnectionSuccess(""); setConnectionError(""); setPostsSuccess(""); setPostsError("");
    try {
      const data = await sendConnectionRequest(receiverId, postId);
      setConnectionSuccess(`Đã gửi yêu cầu kết nối tới ${data?.receiverName ?? "người nhận"}.`);
      await fetchConnectionRequests();
    } catch (error) { console.error("Request connection from post failed:", error); setConnectionError(getConnectionErrorMessage(error, true)); setPostsError(getConnectionErrorMessage(error, true)); }
    finally { setConnectionSendingId(null); }
  }

  function handleConnectionModeChange(mode) { setConnectionMode(mode); setConnectionSuccess(""); setConnectionError(""); }

  function getConnectionErrorMessage(error, postContext = false) {
    if (error.status === 400) { return postContext ? "Không thể gửi yêu cầu kết nối cho bài đăng này." : "Không thể gửi yêu cầu kết nối cho chính mình."; }
    if (error.status === 404) { return postContext ? "Không tìm thấy bài đăng hoặc chủ bài đăng." : "Người nhận không tồn tại."; }
    if (error.status === 409) { return postContext ? "Bạn đã gửi yêu cầu kết nối tới người này rồi." : "Đã có yêu cầu kết nối đang chờ với người này."; }
    return error.message || "Không thể gửi yêu cầu kết nối.";
  }

  async function handleSendConnectionRequest(targetReceiverId) {
    const trimmed = String(targetReceiverId ?? "").trim();
    if (!trimmed) return;
    setSending(true); setSendError(""); setConnectionSuccess("");
    try { const data = await sendConnectionRequest(trimmed); setReceiverId(""); setConnectionSuccess(`Đã gửi yêu cầu kết nối đến ${data?.receiverName ?? "người nhận"}.`); await fetchConnectionRequests(); }
    catch (error) { console.error("Send connection request failed:", error); setSendError(getConnectionErrorMessage(error)); }
    finally { setSending(false); }
  }

  async function handleAcceptConnectionRequest(request) {
    const connectionRequestId = request?.connectionRequestId;
    if (!connectionRequestId) return;
    setConnectionActionId(connectionRequestId); setConnectionError(""); setConnectionSuccess("");
    try { const result = await acceptConnectionRequest(connectionRequestId); setConnectionSuccess(`Đã đồng ý kết nối với ${request?.senderName ?? "người gửi"}.`); await openChatWithConversation(result?.conversationId); await fetchConnectionRequests(); }
    catch (error) { console.error("Accept connection request failed:", error); setConnectionError(getConnectionActionErrorMessage(error)); }
    finally { setConnectionActionId(null); }
  }

  async function openChatWithConversation(conversationId) {
    if (!conversationId) return;
    setPage("messenger"); setError(""); setSuccess(""); setSelectedConversation(null); setSelectedConversationId(null); setConversationDetail(null); setConversationDetailError(""); setMessages([]); setMessagesError("");
    const list = await fetchConversations();
    const found = list.find(c => String(c?.conversationId) === String(conversationId));
    await handleSelectConversation(found || { conversationId });
  }

  async function handleRejectConnectionRequest(request) {
    const connectionRequestId = request?.connectionRequestId;
    if (!connectionRequestId) return;
    setConnectionActionId(connectionRequestId); setConnectionError(""); setConnectionSuccess("");
    try { await rejectConnectionRequest(connectionRequestId); setConnectionSuccess(`Đã từ chối yêu cầu kết nối từ ${request?.senderName ?? "người gửi"}.`); await fetchConnectionRequests(); }
    catch (error) { console.error("Reject connection request failed:", error); setConnectionError(getConnectionActionErrorMessage(error)); }
    finally { setConnectionActionId(null); }
  }

  function getConnectionActionErrorMessage(error) {
    if (error.status === 403) return "Chỉ người nhận yêu cầu mới được thực hiện thao tác này.";
    if (error.status === 404) return "Yêu cầu kết nối không tồn tại.";
    if (error.status === 409) return "Yêu cầu này không còn ở trạng thái chờ.";
    return error.message || "Không thể xử lý yêu cầu kết nối.";
  }

  // =====================================================
  // MESSENGER
  // =====================================================
  async function fetchConversations() {
    setConversationsLoading(true); setConversationsError("");
    try { const data = await getConversations(); const list = Array.isArray(data) ? data : []; setConversations(list); return list; }
    catch (error) { console.error("Fetch conversations failed:", error); setConversations([]); setConversationsError(error.message || "Không thể tải danh sách cuộc trò chuyện."); return []; }
    finally { setConversationsLoading(false); }
  }

  function showMessenger() { setPage("messenger"); setError(""); setSuccess(""); setSelectedConversation(null); setSelectedConversationId(null); setConversationDetail(null); setConversationDetailError(""); setMessages([]); setMessagesError(""); fetchConversations(); }

  async function handleSelectConversation(conversation) {
    const conversationId = conversation?.conversationId;
    if (!conversationId) return;
    setSelectedConversation(conversation); setSelectedConversationId(conversationId); setConversationDetail(null); setConversationDetailError(""); setMessages([]); setMessagesError(""); setConversationDetailLoading(true); setMessagesLoading(true);
    try { const detail = await getConversation(conversationId); setConversationDetail(detail); }
    catch (error) { console.error("Fetch conversation detail failed:", error); setConversationDetail(null); setConversationDetailError(error.status === 403 ? "Bạn không phải participant của cuộc trò chuyện này." : error.message || "Không thể tải chi tiết cuộc trò chuyện."); }
    finally { setConversationDetailLoading(false); }
    try { const data = await getConversationMessages(conversationId); setMessages(Array.isArray(data) ? data : []); try { await markMessagesAsRead(conversationId); setConversations(prev => prev.map(c => String(c?.conversationId ?? "") !== conversationId ? c : { ...c, unreadCount: 0 })); } catch (markError) { console.error("Mark messages as read failed:", markError); } }
    catch (error) { console.error("Fetch messages failed:", error); setMessages([]); setMessagesError(error.status === 403 ? "Bạn không phải participant của cuộc trò chuyện này." : error.message || "Không thể tải lịch sử tin nhắn."); }
    finally { setMessagesLoading(false); }
  }

  function handleReceiveMessage(message) {
    if (!message?.conversationId) return;
    const conversationId = String(message.conversationId);
    setMessages(prev => { if (String(selectedConversationIdRef.current ?? "") !== conversationId) return prev; if (prev.some(item => String(item?.messageId ?? "") === String(message.messageId ?? ""))) return prev; return [...prev, { messageId: message.messageId, senderId: message.senderId, senderName: message.senderName, content: message.content, sentAt: message.sentAt }]; });
    setConversations(prev => prev.map(conversation => { if (String(conversation?.conversationId ?? "") !== conversationId) return conversation; return { ...conversation, lastMessage: message.content, lastMessageAt: message.sentAt, unreadCount: String(selectedConversationIdRef.current ?? "") === conversationId ? Number(conversation?.unreadCount ?? 0) : Number(conversation?.unreadCount ?? 0) + 1 }; }));
  }

  function handleReceiveNotification(notification) {
    if (!notification) return;
    const newNotification = { notificationId: notification.id ?? notification.notificationId, type: notification.type, title: notification.title, message: notification.message, relatedId: notification.relatedId, isRead: false, createdAt: notification.createdAt || new Date().toISOString() };
    setNotifications(prev => { const exists = prev.some(item => String(item?.notificationId ?? item?.id) === String(newNotification.notificationId)); if (exists) return prev; return [newNotification, ...prev]; });
    setUnreadCount(prev => prev + 1);
  }

  async function handleSendMessage(content) {
    const conversationId = selectedConversationIdRef.current;
    if (!chatConnection || !conversationId || !content || sendingMessage) return;
    setSendingMessage(true); setMessagesError("");
    try { await chatConnection.invoke("SendMessage", conversationId, content); }
    catch (error) { console.error("Send message failed:", error); setMessagesError("Không thể gửi tin nhắn. Vui lòng thử lại."); }
    finally { setSendingMessage(false); }
  }

  // =====================================================
  // NOTIFICATIONS
  // =====================================================
  async function fetchNotifications() { setNotificationsLoading(true); setNotificationsError(""); try { const data = await getNotifications(); setNotifications(Array.isArray(data) ? data : []); } catch (error) { console.error("Fetch notifications failed:", error); setNotifications([]); setNotificationsError(error.message || "Không thể tải thông báo."); } finally { setNotificationsLoading(false); } }

  async function fetchUnreadNotifications() { try { const data = await getUnreadNotifications(); setUnreadCount(Number(data?.unreadCount ?? 0) || 0); } catch (error) { console.error("Fetch unread notifications failed:", error); } }

  function handleToggleNotifications() { setNotificationsOpen(open => { const nextOpen = !open; if (nextOpen) { fetchNotifications(); fetchUnreadNotifications(); } return nextOpen; }); }

  async function handleOpenNotification(notification) {
    const notificationId = notification?.notificationId;
    if (!notificationId) return;
    setNotificationActionId(notificationId);
    try { await markNotificationAsRead(notificationId); setNotifications(prev => prev.map(item => String(item?.notificationId ?? "") === String(notificationId) ? { ...item, isRead: true } : item)); await fetchUnreadNotifications(); }
    catch (error) { console.error("Mark notification as read failed:", error); }
    if (notification?.type === "ConnectionRequest") { setPage("connections"); setConnectionMode("received"); setConnectionSuccess(""); setConnectionError(""); setSendError(""); setReceiverId(""); await fetchConnectionRequests(); setNotificationActionId(null); return; }
    if (notification?.type === "Claim") { setPage("connections"); setConnectionMode("received"); setConnectionSuccess(""); setConnectionError(""); setSendError(""); setReceiverId(""); await fetchConnectionRequests(); setNotificationActionId(null); return; }
    const isPostRelated = notification?.type === "LostFoundMatch" || notification?.type === "ReportReceived" || notification?.type === "StudyMatch" || notification?.type === "RoomMatch";
    if (isPostRelated && notification?.relatedId) { showAllPosts(notification.relatedId); }
    setNotificationActionId(null);
  }

  async function handleMarkAllNotificationsAsRead() { setNotificationActionId("all"); try { await markAllNotificationsAsRead(); setNotifications(prev => prev.map(item => ({ ...item, isRead: true }))); setUnreadCount(0); } catch (error) { console.error("Mark all notifications as read failed:", error); } finally { setNotificationActionId(null); } }

  // =====================================================
  // LIBRARY
  // =====================================================
  async function fetchBooks(mode, filters) { setBooksLoading(true); setBooksError(""); const activeFilters = filters ?? bookFilters; try { const data = mode === "mine" ? await getMyBooks() : await getBooks(activeFilters); setBooks(data); } catch (error) { console.error("Fetch books failed:", error); setBooks([]); setBooksError(error.message || "Không thể tải sàn đổi sách."); } finally { setBooksLoading(false); } }

  async function fetchBookMatches() { setBookMatchesLoading(true); setBookMatchesError(""); try { const data = await getExchangeMatches(); setBookMatches(data); } catch (error) { console.error("Fetch exchange matches failed:", error); setBookMatches([]); setBookMatchesError(error.message || "Không thể tải chuỗi đổi sách."); } finally { setBookMatchesLoading(false); } }

  function showLibrary() { setPage("library"); setError(""); setSuccess(""); setBooksSuccess(""); setDocumentsSuccess(""); setBookFormOpen(false); setBookDetailOpen(false); setDocumentFormOpen(false); setDocumentDetailOpen(false); fetchBooks(libraryMode); fetchBookMatches(); fetchDocuments(documentMode); }

  function handleChangeLibrarySection(section) { const targetSection = section === "documents" ? "documents" : "books"; setLibrarySection(targetSection); setBooksSuccess(""); setDocumentsSuccess(""); setBookFormOpen(false); setBookDetailOpen(false); setDocumentFormOpen(false); setDocumentDetailOpen(false); if (targetSection === "documents") { fetchDocuments(documentMode); } else { fetchBooks(libraryMode); fetchBookMatches(); } }

  function handleChangeLibraryMode(mode) { const targetMode = mode || "all"; setLibraryMode(targetMode); setBooksSuccess(""); setBookFormOpen(false); setBookDetailOpen(false); fetchBooks(targetMode); }

  function handleBookFilterChange(nextFilters) { const filters = { search: nextFilters.search ?? "", status: nextFilters.status ?? "" }; setBookFilters(filters); setBooksSuccess(""); fetchBooks("all", filters); }

  function handleResetBookFilters() { const filters = { search: "", status: "" }; setBookFilters(filters); setBooksSuccess(""); fetchBooks(libraryMode, filters); }

  function openBookForm(book) { setEditingBook(book || null); setBookFormOpen(true); setBooksError(""); setBooksSuccess(""); setBookDetailOpen(false); }

  function closeBookForm() { setBookFormOpen(false); setEditingBook(null); }

  async function handleSubmitBook(formData) { setBooksSaving(true); setBooksError(""); setBooksSuccess(""); try { if (editingBook) { await updateBook(editingBook.id, formData); setBooksSuccess("Bài đổi sách đã được cập nhật."); } else { await createBook(formData); setBooksSuccess("Bài đổi sách đã được đăng."); } closeBookForm(); await fetchBooks(libraryMode); await fetchBookMatches(); } catch (error) { console.error("Save book error:", error); setBooksError(getBookErrorMessage(error)); } finally { setBooksSaving(false); } }

  async function handleDeleteBook(book) { const confirmed = window.confirm("Xóa bài đổi sách này? Hành động không thể hoàn tác."); if (!confirmed) return; setBooksSaving(true); setBooksError(""); setBooksSuccess(""); try { await deleteBook(book.id); setBookDetailOpen(false); setBooksSuccess("Bài đổi sách đã được xóa."); await fetchBooks(libraryMode); await fetchBookMatches(); } catch (error) { console.error("Delete book error:", error); setBooksError(getBookErrorMessage(error)); } finally { setBooksSaving(false); } }

  function getBookErrorMessage(error) { if (error.status === 403) return "Bạn không phải chủ bài đổi sách này."; if (error.status === 404) return "Không tìm thấy bài đổi sách."; if (error.status === 400) return "Dữ liệu không hợp lệ, vui lòng kiểm tra lại."; return error.message || "Thao tác với bài đổi sách thất bại."; }

  async function handleOpenBookDetail(bookId) { setPage("posts"); setPostMode("all"); setError(""); setSuccess(""); setPostsSuccess(""); setPostFormOpen(false); setDetailOpen(false); setTargetPostId(bookId); setTargetPostHighlight(true); setPostsLoading(true); setPostsError(""); try { const data = await getPosts({}); setPosts(data); setPostLikes(await loadPostLikes(data)); fetchConnectionRequests(); const communityPost = (data ?? []).find(p => String(p?.libraryPostId ?? p?.LibraryPostId) === String(bookId)); if (communityPost) { handleOpenPostDetail(communityPost.id ?? communityPost.Id); } } catch (error) { console.error("Open book detail from library failed:", error); setPosts([]); setPostLikes({}); setPostsError(error.message || "Không thể mở chi tiết bài đăng."); } finally { setPostsLoading(false); } }

  function handleOpenBookMatch(match) { handleOpenBookDetail(match?.matchedPostId); }

  function closeBookDetail() { setBookDetailOpen(false); setBookDetail(null); }

  async function fetchDocuments(mode, filters) { setDocumentsLoading(true); setDocumentsError(""); const activeFilters = filters ?? documentFilters; try { const targetMode = mode || "all"; let data; if (targetMode === "mine") { data = await getMyDocuments(); } else { data = await getDocuments({ ...activeFilters, pricing: targetMode === "free" ? "Free" : targetMode === "paid" ? "Paid" : activeFilters.pricing }); } setDocuments(data); } catch (error) { console.error("Fetch documents failed:", error); setDocuments([]); setDocumentsError(error.message || "Không thể tải kho tài liệu."); } finally { setDocumentsLoading(false); } }

  function handleChangeDocumentMode(mode) { const targetMode = mode || "all"; setDocumentMode(targetMode); setDocumentsSuccess(""); setDocumentFormOpen(false); setDocumentDetailOpen(false); fetchDocuments(targetMode); }

  function handleDocumentFilterChange(nextFilters) { const filters = { search: nextFilters.search ?? "", subject: nextFilters.subject ?? "", pricing: nextFilters.pricing ?? "" }; setDocumentFilters(filters); setDocumentsSuccess(""); if (documentMode === "mine") return; if (filters.pricing) { setDocumentMode("all"); fetchDocuments("all", { ...filters, pricing: "" }); return; } fetchDocuments(documentMode, filters); }

  function handleResetDocumentFilters() { const filters = { search: "", subject: "", pricing: "" }; setDocumentFilters(filters); setDocumentsSuccess(""); fetchDocuments(documentMode, filters); }

  function openDocumentForm(document) { setEditingDocument(document || null); setDocumentFormOpen(true); setDocumentsError(""); setDocumentsSuccess(""); setDocumentDetailOpen(false); }

  function closeDocumentForm() { setDocumentFormOpen(false); setEditingDocument(null); }

  async function handleSubmitDocument(formData) { setDocumentsSaving(true); setDocumentsError(""); setDocumentsSuccess(""); try { if (editingDocument) { await updateDocument(editingDocument.id, formData); setDocumentsSuccess("Tài liệu đã được cập nhật."); } else { await createDocument(formData); setDocumentsSuccess("Tài liệu đã được đăng tải."); } closeDocumentForm(); await fetchDocuments(documentMode); } catch (error) { console.error("Save document error:", error); setDocumentsError(getDocumentErrorMessage(error)); } finally { setDocumentsSaving(false); } }

  async function handleDeleteDocument(document) { const confirmed = window.confirm("Xóa tài liệu này? File tải lên cũng sẽ bị xóa và không thể khôi phục."); if (!confirmed) return; setDocumentsSaving(true); setDocumentsError(""); setDocumentsSuccess(""); try { await deleteDocument(document.id); setDocumentDetailOpen(false); setDocumentsSuccess("Tài liệu đã được xóa."); await fetchDocuments(documentMode); } catch (error) { console.error("Delete document error:", error); setDocumentsError(getDocumentErrorMessage(error)); } finally { setDocumentsSaving(false); } }

  function getDocumentErrorMessage(error) { if (error.status === 403) return "Bạn không phải chủ tài liệu này."; if (error.status === 404) return "Không tìm thấy tài liệu."; if (error.status === 400) return error.message || "Tài liệu không hợp lệ, vui lòng kiểm tra lại file."; return error.message || "Thao tác với tài liệu thất bại."; }

  async function handleOpenDocumentDetail(documentId) { setDocumentDetailOpen(true); setDocumentDetailLoading(true); setDocumentDetailError(""); setDocumentDetail(null); setDocumentFormOpen(false); resetDocumentReviews(); try { const data = await getDocumentById(documentId); setDocumentDetail(data); await fetchDocumentReviews(documentId); } catch (error) { console.error("Fetch document detail failed:", error); setDocumentDetailError(getDocumentErrorMessage(error)); } finally { setDocumentDetailLoading(false); } }

  function closeDocumentDetail() { setDocumentDetailOpen(false); setDocumentDetail(null); setDocumentDownloadError(""); setDocumentDownloadSuccess(""); resetDocumentReviews(); }

  async function handleDownloadDocument(document) { if (!document?.id) return; setDownloadingDocumentId(document.id); setDocumentDownloadError(""); setDocumentDownloadSuccess(""); try { const result = await downloadDocument(document.id); const url = URL.createObjectURL(result); const a = document.createElement("a"); a.href = url; a.download = document.fileName; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url); setDocumentDownloadSuccess(document.pricingType === "Paid" ? `Đã tải tài liệu, đã trừ ${document.price} điểm.` : "Đã tải tài liệu, file được đóng dấu watermark."); } catch (error) { console.error("Download document failed:", error); setDocumentDownloadError(getDocumentDownloadErrorMessage(error)); } finally { setDownloadingDocumentId(""); } }

  function getDocumentDownloadErrorMessage(error) { if (error.status === 404) return "Tài liệu hoặc file tài liệu không còn tồn tại."; if (error.status === 400) return error.message || "Bạn không đủ điểm để tải tài liệu này."; if (error.status === 409) return error.message || "Hệ thống điểm chưa sẵn sàng, chưa thể tải tài liệu trả phí."; if (error.status === 401) return "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại."; return error.message || "Tải tài liệu thất bại, vui lòng thử lại."; }

  async function fetchDocumentReviews(documentId) { if (!documentId) return; setDocumentReviewsLoading(true); setDocumentReviewsError(""); try { const data = await getDocumentReviews(documentId); setDocumentReviews(data); } catch (error) { console.error("Fetch document reviews failed:", error); setDocumentReviews([]); setDocumentReviewsError(getDocumentReviewErrorMessage(error)); } finally { setDocumentReviewsLoading(false); } }

  function resetDocumentReviews() { setDocumentReviews([]); setDocumentReviewsError(""); setDocumentReviewsSuccess(""); setDocumentReviewFormError(""); setEditingDocumentReviewId(null); setDeletingDocumentReviewId(null); }

  function getDocumentReviewErrorMessage(error) { if (error.status === 403) return "Bạn không phải người viết đánh giá này."; if (error.status === 404) return "Không tìm thấy tài liệu hoặc đánh giá."; if (error.status === 400) return error.message || "Điểm đánh giá phải nằm trong khoảng 1 đến 5."; if (error.status === 409) return error.message || "Bạn đã đánh giá tài liệu này rồi, hãy sửa đánh giá của bạn."; return error.message || "Thao tác với đánh giá thất bại."; }

  function applyDocumentRatingSummary(rating, reviewCount) { setDocumentDetail(prev => prev ? { ...prev, rating: Number(rating ?? 0), reviewCount: Number(reviewCount ?? 0) } : prev); }

  async function refreshDocumentRatingSummary(documentId) { if (!documentId) return; try { const data = await getDocumentById(documentId); setDocumentDetail(prev => prev?.id === data?.id ? data : prev); } catch (error) { console.error("Refresh document rating failed:", error); } }

  function handleEditDocumentReview(review) { setEditingDocumentReviewId(review?.id ?? null); setDocumentReviewsSuccess(""); setDocumentReviewFormError(""); }

  function handleCancelEditDocumentReview() { setEditingDocumentReviewId(null); setDocumentReviewFormError(""); }

  async function handleSubmitDocumentReview(formData) { const documentId = documentDetail?.id; if (!documentId) return; setDocumentReviewsSaving(true); setDocumentReviewsSuccess(""); setDocumentReviewFormError(""); try { const data = await createDocumentReview(documentId, formData); setDocumentReviewsSuccess("Đã ghi nhận đánh giá của bạn."); applyDocumentRatingSummary(data?.documentRating, data?.documentReviewCount); await fetchDocumentReviews(documentId); } catch (error) { console.error("Create document review failed:", error); setDocumentReviewFormError(getDocumentReviewErrorMessage(error)); } finally { setDocumentReviewsSaving(false); } }

  async function handleSubmitEditDocumentReview(formData) { const reviewId = editingDocumentReviewId; const documentId = documentDetail?.id; if (!reviewId || !documentId) return; setDocumentReviewsSaving(true); setDocumentReviewsSuccess(""); setDocumentReviewFormError(""); try { const data = await updateDocumentReview(reviewId, formData); setEditingDocumentReviewId(null); setDocumentReviewsSuccess("Đánh giá của bạn đã được cập nhật."); applyDocumentRatingSummary(data?.documentRating, data?.documentReviewCount); await fetchDocumentReviews(documentId); } catch (error) { console.error("Update document review failed:", error); setDocumentReviewFormError(getDocumentReviewErrorMessage(error)); } finally { setDocumentReviewsSaving(false); } }

  async function handleDeleteDocumentReview(review) { if (!review?.id) return; const confirmed = window.confirm("Xóa đánh giá của bạn? Hành động không thể hoàn tác."); if (!confirmed) return; const documentId = documentDetail?.id; setDeletingDocumentReviewId(review.id); setDocumentReviewsSuccess(""); setDocumentReviewFormError(""); try { await deleteDocumentReview(review.id); if (editingDocumentReviewId === review.id) setEditingDocumentReviewId(null); setDocumentReviewsSuccess("Đánh giá đã được xóa."); await refreshDocumentRatingSummary(documentId); await fetchDocumentReviews(documentId); } catch (error) { console.error("Delete document review failed:", error); setDocumentReviewFormError(getDocumentReviewErrorMessage(error)); } finally { setDeletingDocumentReviewId(null); } }

  // =====================================================
  // RENDER
  // =====================================================
  return (
    <>
      {/* ================================================ LOGIN ================================================= */}
      {page === "login" && (
        <main className="auth-page">
          <div className="auth-background-shape shape-one" />
          <div className="auth-background-shape shape-two" />
          <SiteHeader />
          <section className="auth-layout">
            <div className="welcome-panel">
              <span className="eyebrow">CAMPUS LIFE, CONNECTED</span>
              <h1>Kết nối sinh viên.<br /><span>Chia sẻ cơ hội.</span></h1>
              <p>Một không gian dành cho sinh viên để tìm bạn học, chia sẻ tài liệu và kết nối cuộc sống trong khuôn viên trường.</p>
            </div>
            <div className="auth-panel">
              {loading && <div className="loading-banner">Đang xử lý...</div>}
              {page === "login" && (
                <LoginForm
                  onLogin={handleLogin}
                  onSwitchToRegister={showRegister}
                  loading={loading}
                  error={error}
                  defaultEmail={DEMO_CREDENTIALS.email}
                  defaultPassword={DEMO_CREDENTIALS.password}
                />
              )}
            </div>
          </section>
          {success && <div className="message message-success auth-success-message">{success}</div>}
          <footer className="site-footer">CampusEcomSystemMini Demo · Student & Campus Utility</footer>
        </main>
      )}

      {/* ================================================ REGISTER ================================================= */}
      {page === "register" && (
        <main className="auth-page">
          <div className="auth-background-shape shape-one" />
          <div className="auth-background-shape shape-two" />
          <SiteHeader />
          <section className="auth-layout">
            <div className="welcome-panel">
              <span className="eyebrow">JOIN THE COMMUNITY</span>
              <h1>Tạo tài khoản.<br /><span>Kết nối campus.</span></h1>
              <p>Đăng ký tài khoản để bắt đầu sử dụng các tiện ích dành cho sinh viên.</p>
            </div>
            <div className="auth-panel">
              {loading && <div className="loading-banner">Đang xử lý...</div>}
              <RegisterForm onRegister={handleRegister} onSwitchToLogin={showLogin} loading={loading} error={error} success="" />
            </div>
          </section>
          <footer className="site-footer">CampusEcomSystemMini Demo · Student & Campus Utility</footer>
        </main>
      )}

      {/* ================================================ HOME ================================================= */}
      {page === "home" && user && (
        <HomePage
          user={user} onLogout={handleLogout} onGoHome={showHome} onViewProfile={showProfile}
          onSetupPreferences={showPreferences} onViewMyPosts={showMyPosts} onOpenAllPosts={showAllPosts}
          onOpenMatching={showSmartMatching} onOpenLostFound={showLostFound} onOpenMessenger={showMessenger}
          onOpenLibrary={showLibrary} unreadCount={unreadCount}
        />
      )}

      {/* ================================================ SMART MATCHING ================================================= */}
      {page === "smart-matching" && user && (
        <main className="auth-page">
          <div className="auth-background-shape shape-one" /><div className="auth-background-shape shape-two" />
          <SiteHeader onGoHome={showHome} onLogout={handleLogout} />
          <section className="pref-main">
            <SmartMatching
              mode={matchingMode} preferences={preferences} onChangeMode={handleChangeMatchingMode}
              matches={matches} loading={matchesLoading} error={matchesError}
              detailOpen={matchDetailOpen} detail={matchDetail} detailLoading={matchDetailLoading} detailError={matchDetailError}
              onOpenDetail={(postId) => { if (!postId) return; setPage("posts"); setPostMode("all"); setError(""); setSuccess(""); setPostsSuccess(""); setPostFormOpen(false); setTargetPostId(postId); setTargetPostHighlight(true); fetchPosts("all"); handleOpenPostDetail(postId); }}
              onCloseDetail={closeMatchDetail}
              roomMatches={roomMatches} roomLoading={roomMatchesLoading} roomError={roomMatchesError}
              roomDetailOpen={roomMatchDetailOpen} roomDetail={roomMatchDetail} roomDetailLoading={roomMatchDetailLoading} roomDetailError={roomMatchDetailError}
              onOpenRoomDetail={(postId) => { if (!postId) return; setPage("posts"); setPostMode("all"); setError(""); setSuccess(""); setPostsSuccess(""); setPostFormOpen(false); setTargetPostId(postId); setTargetPostHighlight(true); fetchPosts("all"); handleOpenPostDetail(postId); }}
              onCloseRoomDetail={closeRoomMatchDetail}
              onSave={handleSavePreferences} onRunStudyMatching={handleRunStudyMatching} onRunRoomMatching={handleRunRoomMatching}
              onBack={showHome} onCreatePost={(type) => openPostForm(null, type)}
            />
          </section>
          <footer className="site-footer">CampusEcomSystemMini Demo · Student & Campus Utility</footer>
        </main>
      )}

      {/* ================================================ LOST & FOUND ================================================= */}
      {page === "lost-found" && user && (
        <main className="auth-page">
          <div className="auth-background-shape shape-one" /><div className="auth-background-shape shape-two" />
          <SiteHeader onGoHome={showHome} onLogout={handleLogout} />
          <section className="pref-main">
            <LostFoundPage
              filter={lostFoundFilter} onFilterChange={handleLostFoundFilterChange}
              items={lostFoundItems} loading={lostFoundLoading} error={lostFoundError}
              pins={lostFoundPins} mapLoading={lostFoundMapLoading} mapError={lostFoundMapError}
              user={user} secretItem={secretItem} secretMode={secretMode} secretQuestion={secretQuestion}
              secretLoading={secretLoading} secretSaving={secretSaving} secretError={secretError}
              onOpenSecretQuestion={handleOpenSecretQuestion} onCloseSecretQuestion={closeSecretQuestion}
              onSubmitSecretQuestion={handleSubmitSecretQuestion} onAnswerSecretQuestion={handleAnswerSecretQuestion}
              claimItem={claimItem} claimQuestion={claimQuestion} claimSaving={claimSaving} claimError={claimError}
              success={lostFoundSuccess} onSubmitClaim={handleSubmitClaim} onCloseClaim={closeClaim}
              claimsItem={claimsItem} claims={claims} claimsLoading={claimsLoading} claimsError={claimsError}
              claimsActionId={claimsActionId} onOpenClaims={handleOpenClaims} onCloseClaims={closeClaims}
              onApproveClaim={handleApproveClaim} onRejectClaim={handleRejectClaim} onMarkReturned={handleMarkReturned}
              onBack={showHome} connectionRequests={connectionRequests} connectionSendingId={connectionSendingId}
              onRequestConnection={handleRequestConnection} onCreate={(type) => openPostForm(null, type)}
              onViewMatches={handleViewMatches} onViewDetail={handleViewLostFoundDetail}
              verifiedPostIds={verifiedPostIds}
            />
          </section>
          <footer className="site-footer">CampusEcomSystemMini Demo · Student & Campus Utility</footer>
        </main>
      )}

      {/* ================================================ CONNECTIONS ================================================= */}
      {page === "connections" && user && (
        <main className="auth-page">
          <div className="auth-background-shape shape-one" /><div className="auth-background-shape shape-two" />
          <SiteHeader onGoHome={showHome} onLogout={handleLogout} />
          <section className="pref-main">
            <ConnectionRequests
              mode={connectionMode} onChangeMode={handleConnectionModeChange}
              requests={connectionRequests} loading={connectionLoading} error={connectionError} success={connectionSuccess}
              currentUserId={user?.id ?? user?.Id ?? ""} actionId={connectionActionId}
              receiverId={receiverId} sending={sending} sendError={sendError}
              onReceiverIdChange={setReceiverId} onSend={handleSendConnectionRequest}
              onAccept={handleAcceptConnectionRequest} onReject={handleRejectConnectionRequest}
              onOpenMessenger={showMessenger} onBack={showMessenger}
            />
          </section>
          <footer className="site-footer">CampusEcomSystemMini Demo · Student & Campus Utility</footer>
        </main>
      )}

      {/* ================================================ LIBRARY ================================================= */}
      {page === "library" && user && (
        <main className="auth-page">
          <div className="auth-background-shape shape-one" /><div className="auth-background-shape shape-two" />
          <SiteHeader onGoHome={showHome} onLogout={handleLogout} />
          <section className="pref-main">
            <LibraryPage
              section={librarySection} onChangeSection={handleChangeLibrarySection}
              count={librarySection === "documents" ? documents.length : books.length}
              success={librarySection === "documents" ? documentsSuccess : booksSuccess}
              onCreate={() => librarySection === "documents" ? openDocumentForm(null) : openBookForm(null)}
              onBack={showHome}
              bookExchange={{
                mode: libraryMode, onChangeMode: handleChangeLibraryMode, books, user,
                loading: booksLoading, saving: booksSaving, error: booksError, filters: bookFilters,
                onFilterChange: handleBookFilterChange, onResetFilters: handleResetBookFilters,
                onEdit: openBookForm, onDelete: handleDeleteBook, onSubmitBook: handleSubmitBook,
                onOpenDetail: (book) => handleOpenBookDetail(book.id), onCloseForm: closeBookForm,
                onCloseDetail: closeBookDetail, formOpen: bookFormOpen, formBook: editingBook,
                detailOpen: bookDetailOpen, detail: bookDetail, detailLoading: bookDetailLoading, detailError: bookDetailError,
                matches: bookMatches, matchesLoading: bookMatchesLoading, matchesError: bookMatchesError,
                onOpenMatch: handleOpenBookMatch,
              }}
              documentPanel={{
                mode: documentMode, onChangeMode: handleChangeDocumentMode, documents, user,
                loading: documentsLoading, saving: documentsSaving, error: documentsError, filters: documentFilters,
                onFilterChange: handleDocumentFilterChange, onResetFilters: handleResetDocumentFilters,
                onEdit: openDocumentForm, onDelete: handleDeleteDocument, onSubmitDocument: handleSubmitDocument,
                onOpenDetail: (document) => handleOpenDocumentDetail(document.id), onDownload: handleDownloadDocument,
                onCloseForm: closeDocumentForm, onCloseDetail: closeDocumentDetail,
                formOpen: documentFormOpen, formDocument: editingDocument,
                detailOpen: documentDetailOpen, detail: documentDetail, detailLoading: documentDetailLoading, detailError: documentDetailError,
                downloadingId: downloadingDocumentId, downloadError: documentDownloadError, downloadSuccess: documentDownloadSuccess,
                reviews: documentReviews, reviewsLoading: documentReviewsLoading, reviewsError: documentReviewsError,
                reviewsSaving: documentReviewsSaving, reviewsSuccess: documentReviewsSuccess,
                reviewFormError: documentReviewFormError, editingReviewId: editingDocumentReviewId,
                deletingReviewId: deletingDocumentReviewId,
                onEditReview: handleEditDocumentReview, onCancelEditReview: handleCancelEditDocumentReview,
                onDeleteReview: handleDeleteDocumentReview, onSubmitReview: handleSubmitDocumentReview,
                onSubmitEditReview: handleSubmitEditDocumentReview,
              }}
            />
          </section>
          <footer className="site-footer">CampusEcomSystemMini Demo · Student & Campus Utility</footer>
        </main>
      )}

      {/* ================================================ MESSENGER ================================================= */}
      {page === "messenger" && user && (
        <main className="auth-page">
          <div className="auth-background-shape shape-one" /><div className="auth-background-shape shape-two" />
          <SiteHeader onGoHome={showHome} onLogout={handleLogout} />
          <section className="pref-main">
            <MessengerPage
              conversations={conversations} loading={conversationsLoading} error={conversationsError}
              selectedConversation={selectedConversation} selectedConversationId={selectedConversationId}
              detail={conversationDetail} detailLoading={conversationDetailLoading} detailError={conversationDetailError}
              messages={messages} messagesLoading={messagesLoading} messagesError={messagesError}
              currentUserId={user?.id ?? user?.Id ?? ""} chatConnected={chatConnected} sendingMessage={sendingMessage}
              onSendMessage={handleSendMessage} unreadCount={unreadCount}
              notifications={notifications} notificationsLoading={notificationsLoading} notificationsError={notificationsError}
              notificationsOpen={notificationsOpen} notificationActionId={notificationActionId}
              onToggleNotifications={handleToggleNotifications} onOpenNotification={handleOpenNotification}
              onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead} onSelectConversation={handleSelectConversation}
              onOpenConnections={showConnections} onBack={showHome}
            />
          </section>
          <footer className="site-footer">CampusEcomSystemMini Demo · Student & Campus Utility</footer>
        </main>
      )}

      {/* ================================================ POSTS (ALL) ================================================= */}
      {page === "posts" && user && postMode === "all" && (
        <AllPostsPage
          user={user} posts={posts} loading={postsLoading} saving={postsSaving} error={postsError} success={postsSuccess}
          formOpen={postFormOpen} formPost={editingPost} detailOpen={detailOpen} detailPost={detailPost}
          detailLoading={detailLoading} detailError={detailError} postLikes={postLikes} likingPostId={likingPostId}
          unreadCount={unreadCount} filters={postFilters} currentUserId={user?.id ?? user?.Id ?? ""}
          connectionRequests={connectionRequests} connectionSendingId={connectionSendingId}
          onRequestConnection={handleRequestConnection} onFilterChange={handleFilterChange} onCreate={() => openPostForm(null)}
          onEdit={openPostForm} onDelete={handleDeletePost} onToggleLike={handleToggleLike} onSubmitPost={handleSubmitPost}
          onOpenDetail={handleOpenPostDetail} onCloseForm={closePostForm} onCloseDetail={closePostDetail}
          onGoHome={showHome} onViewProfile={showProfile} onViewMyPosts={showMyPosts} onOpenMatching={showSmartMatching}
          onOpenLostFound={showLostFound} onOpenLibrary={showLibrary} onOpenMessenger={showMessenger} onLogout={handleLogout}
          targetPostId={targetPostId} targetPostHighlight={targetPostHighlight}
          onClearTargetPost={() => { setTargetPostId(null); setTargetPostHighlight(false); }}
        />
      )}

      {/* ================================================ POSTS (MINE) ================================================= */}
      {page === "posts" && user && postMode !== "all" && (
        <main className="auth-page">
          <div className="auth-background-shape shape-one" /><div className="auth-background-shape shape-two" />
          <SiteHeader onGoHome={showHome} onLogout={handleLogout} />
          <section className="pref-main">
            <PostsPage
              mode={postMode} posts={posts} user={user} loading={postsLoading} saving={postsSaving}
              error={postsError} success={postsSuccess} formOpen={postFormOpen} formPost={editingPost}
              detailOpen={detailOpen} detailPost={detailPost} detailLoading={detailLoading} detailError={detailError}
              postLikes={postLikes} likingPostId={likingPostId} filters={postFilters}
              onFilterChange={handleFilterChange} onCreate={() => openPostForm(null)} onEdit={openPostForm}
              onDelete={handleDeletePost} onToggleLike={handleToggleLike} onSubmitPost={handleSubmitPost}
              onOpenDetail={handleOpenPostDetail} onCloseForm={closePostForm} onCloseDetail={closePostDetail}
              onSwitchMode={switchPostMode} onBack={showHome} postFormDefaultType={postFormDefaultType}
            />
          </section>
          <footer className="site-footer">CampusEcomSystemMini Demo · Student & Campus Utility</footer>
        </main>
      )}

      {/* ================================================ PROFILE ================================================= */}
      {(page === "profile" || page === "edit-profile" || page === "change-password") && (
        <main className="auth-page">
          <div className="auth-background-shape shape-one" /><div className="auth-background-shape shape-two" />
          <SiteHeader onGoHome={showHome} onLogout={handleLogout} />
          <section className="auth-layout">
            <div className="welcome-panel">
              <span className="eyebrow">CAMPUS LIFE, CONNECTED</span>
              <h1>Tài khoản & hoạt động.<br /><span>Quản lý cá nhân.</span></h1>
              <p>Cập nhật thông tin cá nhân, đổi mật khẩu và quản lý hoạt động của bạn trên CampusEcomSystemMini.</p>
            </div>
            <div className="auth-panel">
              {loading && <div className="loading-banner">Đang xử lý...</div>}
              {page === "profile" && user && (
                <UserProfile user={user} onBack={showHome} onLogout={handleLogout} onEditProfile={showEditProfile}
                  onChangePassword={showChangePassword} onOpenPreferences={showPreferences} onViewMyPosts={showMyPosts}
                  onOpenMatching={showSmartMatching} onViewLikedPosts={showLikedPosts} loading={loading} error={error} />
              )}
              {page === "edit-profile" && user && (
                <EditProfile user={user} onSave={handleUpdateProfile} onCancel={showProfile} loading={loading} error={error} />
              )}
              {page === "change-password" && (
                <ChangePassword onSave={handleChangePassword} onCancel={showProfile} loading={loading} error={error} />
              )}
              {success && <div className="message message-success auth-success-message">{success}</div>}
            </div>
          </section>
          <footer className="site-footer">CampusEcomSystemMini Demo · Student & Campus Utility</footer>
        </main>
      )}

      {/* ================================================ LIKED POSTS ================================================= */}
      {page === "liked-posts" && user && (
        <main className="auth-page">
          <div className="auth-background-shape shape-one" /><div className="auth-background-shape shape-two" />
          <SiteHeader onGoHome={showHome} onLogout={handleLogout} />
          <section className="pref-main">
            <LikedPostsPage
              likedPosts={likedPosts} likedPostsLoading={likedPostsLoading} likedPostsError={likedPostsError}
              currentUserId={user?.id ?? user?.Id ?? ""} onBack={showProfile} onOpenDetail={handleOpenLikedPostDetail}
              onToggleLike={handleToggleLike} postLikes={postLikes} likingPostId={likingPostId}
              onRefresh={fetchLikedPosts} detailOpen={detailOpen} detailPost={detailPost}
              detailLoading={detailLoading} detailError={detailError} onCloseDetail={closePostDetail}
            />
          </section>
          <footer className="site-footer">CampusEcomSystemMini Demo · Student & Campus Utility</footer>
        </main>
      )}

      {/* ================================================ PREFERENCES ================================================= */}
      {page === "preferences" && user && (
        <main className="auth-page">
          <div className="auth-background-shape shape-one" /><div className="auth-background-shape shape-two" />
          <SiteHeader onGoHome={showHome} onLogout={handleLogout} />
          <section className="pref-main">
            <Preferences
              preferences={preferences} loading={preferencesLoading} saving={preferencesSaving}
              error={preferencesError} success={preferencesSuccess}
              onSave={handleSavePreferences} onDelete={handleDeletePreferences} onBack={showHome}
            />
          </section>
          <footer className="site-footer">CampusEcomSystemMini Demo · Student & Campus Utility</footer>
        </main>
      )}

      {/* ================================================ MY REPORTS ================================================= */}
      {page === "my-reports" && user && (
        <main className="auth-page">
          <div className="auth-background-shape shape-one" /><div className="auth-background-shape shape-two" />
          <SiteHeader onGoHome={showHome} onLogout={handleLogout} />
          <section className="pref-main">
            <MyReports reports={myReports} loading={myReportsLoading} error={myReportsError} />
          </section>
          <footer className="site-footer">CampusEcomSystemMini Demo · Student & Campus Utility</footer>
        </main>
      )}

      {/* ================================================ REPORT FORM MODAL ================================================= */}
      {reportFormOpen && user && (
        <div className="modal-overlay" onClick={closeReportForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <ReportForm postId={reportPostId} postTitle={reportPostTitle} onSubmit={handleSubmitReport}
              onCancel={closeReportForm} loading={reportSaving} error={reportError} success={reportSuccess} />
          </div>
        </div>
      )}

      {/* ================================================ ADMIN DASHBOARD ================================================= */}
      {page === "admin-dashboard" && user && user?.role === "Admin" && (
        <main className="auth-page">
          <div className="auth-background-shape shape-one" /><div className="auth-background-shape shape-two" />
          <SiteHeader onGoHome={showHome} onLogout={handleLogout} />
          <section className="pref-main">
            <AdminDashboard stats={adminStats} loading={adminStatsLoading} error={adminStatsError}
              onBack={showHome} onOpenSection={handleAdminOpenSection} />
          </section>
          <footer className="site-footer">CampusEcomSystemMini Demo · Student & Campus Utility</footer>
        </main>
      )}

      {/* ================================================ ADMIN USERS ================================================= */}
      {page === "admin-users" && user && user?.role === "Admin" && (
        <main className="auth-page">
          <div className="auth-background-shape shape-one" /><div className="auth-background-shape shape-two" />
          <SiteHeader onGoHome={showHome} onLogout={handleLogout} />
          <section className="pref-main">
            <AdminUsers
              users={adminUsers} loading={adminUsersLoading} error={adminUsersError}
              page={adminUsersPage} pageSize={adminUsersPageSize} totalPages={adminUsersTotalPages}
              search={adminUsersSearch} status={adminUsersStatus}
              onSearchChange={handleAdminUserSearchChange} onStatusChange={handleAdminUserStatusChange}
              onIssueWarning={handleAdminUserWarning} onSuspendUser={handleAdminUserSuspend}
              onReactivateUser={handleAdminUserReactivate} onPageChange={handleAdminUserPageChange}
              onPageSizeChange={handleAdminUserPageSizeChange} onViewDetail={handleAdminUserViewDetail}
              onBack={showAdminDashboard} />
          </section>
          <footer className="site-footer">CampusEcomSystemMini Demo · Student & Campus Utility</footer>
        </main>
      )}

      {/* ================================================ ADMIN POSTS ================================================= */}
      {page === "admin-posts" && user && user?.role === "Admin" && (
        <main className="auth-page">
          <div className="auth-background-shape shape-one" /><div className="auth-background-shape shape-two" />
          <SiteHeader onGoHome={showHome} onLogout={handleLogout} />
          <section className="pref-main">
            <AdminPosts
              posts={adminPosts} loading={adminPostsLoading} error={adminPostsError}
              page={adminPostsPage} pageSize={adminPostsPageSize} totalPages={adminPostsTotalPages}
              type={adminPostsType} status={adminPostsStatus} search={adminPostsSearch}
              onTypeChange={handleAdminPostTypeChange} onStatusChange={handleAdminPostStatusChange}
              onSearchChange={handleAdminPostSearchChange} onPageChange={handleAdminPostPageChange}
              onPageSizeChange={handleAdminPostPageSizeChange} onViewDetail={handleAdminPostViewDetail}
              onToggleHidden={handleAdminPostToggleHidden} onDelete={handleAdminPostDelete} onBack={showAdminDashboard} />
          </section>
          <footer className="site-footer">CampusEcomSystemMini Demo · Student & Campus Utility</footer>
        </main>
      )}

      {/* ================================================ ADMIN REPORTS ================================================= */}
      {page === "admin-reports" && user && user?.role === "Admin" && (
        <main className="auth-page">
          <div className="auth-background-shape shape-one" /><div className="auth-background-shape shape-two" />
          <SiteHeader onGoHome={showHome} onLogout={handleLogout} />
          <section className="pref-main">
            <AdminReports reports={adminReports} loading={adminReportsLoading} error={adminReportsError}
              status={adminReportsStatus} onStatusChange={handleAdminReportsStatusChange}
              onViewDetail={handleAdminReportViewDetail} onApprove={handleAdminReportApprove}
              onReject={handleAdminReportReject} onBack={showAdminDashboard} />
          </section>
          <footer className="site-footer">CampusEcomSystemMini Demo · Student & Campus Utility</footer>
        </main>
      )}

      {/* ================================================ ADMIN AUDIT LOGS ================================================= */}
      {page === "admin-audit-logs" && user && user?.role === "Admin" && (
        <main className="auth-page">
          <div className="auth-background-shape shape-one" /><div className="auth-background-shape shape-two" />
          <SiteHeader onGoHome={showHome} onLogout={handleLogout} />
          <section className="pref-main">
            <AdminAuditLogs logs={adminAuditLogs} loading={adminAuditLogsLoading} error={adminAuditLogsError} onBack={showAdminDashboard} />
          </section>
          <footer className="site-footer">CampusEcomSystemMini Demo · Student & Campus Utility</footer>
        </main>
      )}

      {/* ================================================ POST FORM MODAL ================================================= */}
      {postFormOpen && (
        <PostFormModal
          key={editingPost ? editingPost.id : "new"} post={editingPost} saving={postsSaving} error={postsError}
          onSubmit={handleSubmitPost} onClose={closePostForm} defaultType={postFormDefaultType} />
      )}

    </>
  );
}