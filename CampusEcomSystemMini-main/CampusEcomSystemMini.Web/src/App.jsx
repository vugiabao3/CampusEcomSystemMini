

//logic ghép các COMPONENTS l?i v?i nhauuuuu





import { useEffect, useRef, useState, useCallback } from "react";



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

import {

  getMe,

  getToken,

  isDemoMode,

  login,

  logout,

  register,

} from "./services/authService";



import {

  getMe as getUserProfile,

  updateProfile,

  updateAvatar,

  changePassword,

} from "./services/userService";



import {

  getPreferences,

  createPreferences,

  updatePreferences,

  deletePreferences,

} from "./services/preferenceService";



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

} from "./services/postService";



import {

  getStudentMatches,

  getStudentMatch,

  getRoomMatches,

  getRoomMatch,

  createStudentPost,

  createRoomPost,

} from "./services/matchingService";



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

} from "./services/lostFoundService";



import {

  sendConnectionRequest,

  getConnectionRequests,

  acceptConnectionRequest,

  rejectConnectionRequest,

} from "./services/connectionService";



import {

  getConversations,

  getConversation,

  getConversationMessages,

  markMessagesAsRead,


} from "./services/conversationService.js";



import { createChatConnection } from "./hubs/chatHub.js";



import {

  getNotifications,

  getUnreadNotifications,

  markNotificationAsRead,

  markAllNotificationsAsRead,

} from "./services/notificationService.js";



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

  saveDownloadedFile,

  getDocumentReviews,

  createDocumentReview,

  updateDocumentReview,

  deleteDocumentReview,

} from "./services/libraryService";



import {

  createReport,

  getMyReports,

} from "./services/reportService.js";



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
  getAdminReports,
  getAdminReportDetail,
  approveAdminReport,
  rejectAdminReport,
  getAdminAuditLogs,
} from "./services/adminService.js";
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



  const [page, setPage] = useState("login");



  const [user, setUser] = useState(null);



  const [loading, setLoading] = useState(false);



  const [error, setError] = useState("");



  const [success, setSuccess] = useState("");



  // =====================================================

  // VECTOR NHU C?U (PREFERENCES)

  // =====================================================



  const [preferences, setPreferences] = useState(null);



  const [preferencesLoading, setPreferencesLoading] = useState(false);



  const [preferencesSaving, setPreferencesSaving] = useState(false);



  const [preferencesError, setPreferencesError] = useState("");



  const [preferencesSuccess, setPreferencesSuccess] = useState("");



  // =====================================================

  // BÀI ÐANG (POSTS)

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



  // Lu?t thích theo t?ng bài dang: { [postId]: { count, likedByMe } }

  const [postLikes, setPostLikes] = useState({});



  const [likingPostId, setLikingPostId] = useState(null);



  // B? l?c GET /api/posts?type=...&time=...

  const [postFilters, setPostFilters] = useState({

    type: "",

    time: "",

  });



  // =====================================================

  // LIKED POSTS HISTORY (MODULE 1)

  // =====================================================



  const [likedPosts, setLikedPosts] = useState([]);



  const [likedPostsLoading, setLikedPostsLoading] = useState(false);



  const [likedPostsError, setLikedPostsError] = useState("");



  // =====================================================

  // SMART MATCHING (MODULE 2)

  // =====================================================



  const [matches, setMatches] = useState([]);



  const [matchesLoading, setMatchesLoading] = useState(false);



  const [matchesError, setMatchesError] = useState("");



  const [matchDetailOpen, setMatchDetailOpen] = useState(false);



  const [matchDetail, setMatchDetail] = useState(null);



  const [matchDetailLoading, setMatchDetailLoading] = useState(false);



  const [matchDetailError, setMatchDetailError] = useState("");



  // Ch? d? Smart Matching: tìm nhóm h?c ho?c tìm tr? / ? ghép

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

  // CAMPUS LOST & FOUND (MODULE 3)

  // =====================================================



  // "" | "Lost" | "Found" | "Returned"

  const [lostFoundFilter, setLostFoundFilter] = useState("");



  const [lostFoundItems, setLostFoundItems] = useState([]);



  const [lostFoundLoading, setLostFoundLoading] = useState(false);



  const [lostFoundError, setLostFoundError] = useState("");



  const [lostFoundPins, setLostFoundPins] = useState([]);



  const [lostFoundMapLoading, setLostFoundMapLoading] = useState(false);



  const [lostFoundMapError, setLostFoundMapError] = useState("");



  const [lostFoundSuccess, setLostFoundSuccess] = useState("");



  // Câu h?i bí m?t: "create" (ch? bài dang Found)

  // ho?c "view" (ngu?i b? m?t d? xem câu h?i).

  const [secretMode, setSecretMode] = useState(null);



  const [secretItem, setSecretItem] = useState(null);



  const [secretQuestion, setSecretQuestion] = useState("");



  const [secretLoading, setSecretLoading] = useState(false);



  const [secretSaving, setSecretSaving] = useState(false);



  const [secretError, setSecretError] = useState("");



  // Yêu c?u nh?n d? (MODULE_3 / BATCH 3)

  const [claimItem, setClaimItem] = useState(null);



  const [claimQuestion, setClaimQuestion] = useState("");



  const [claimSaving, setClaimSaving] = useState(false);



  const [claimError, setClaimError] = useState("");



  // Danh sách yêu c?u nh?n d? c?a ch? bài dang Found

  const [claimsItem, setClaimsItem] = useState(null);



  const [claims, setClaims] = useState([]);



  const [claimsLoading, setClaimsLoading] = useState(false);



  const [claimsError, setClaimsError] = useState("");



// Yêu c?u dang du?c duy?t / t? ch?i, ho?c "returned"

// khi ch? bài dang xác nh?n dã tr? d?.

  const [claimsActionId, setClaimsActionId] = useState(null);



  // Danh sách ID bài dang mà ngu?i dùng hi?n t?i dã xác minh

  // (dã tr? l?i dúng câu h?i bí m?t / dã t?o claim thành công).

  // Dùng d? gating nút "Yêu c?u k?t n?i" cho ngu?i không ph?i ch? bài dang.

  const [verifiedPostIds, setVerifiedPostIds] = useState(new Set());



  // =====================================================

  // CONNECTION REQUESTS (MODULE 5 / BATCH 1)

  // =====================================================



  // Tab: "received" (nh?n du?c) | "sent" (dã g?i)

  const [connectionMode, setConnectionMode] = useState("received");



  const [connectionRequests, setConnectionRequests] = useState([]);



  const [connectionLoading, setConnectionLoading] = useState(false);



  const [connectionError, setConnectionError] = useState("");



  const [connectionSuccess, setConnectionSuccess] = useState("");



  // Id bài dang dang g?i yêu c?u k?t n?i, d? disable nút cho dúng th?.

  const [connectionSendingId, setConnectionSendingId] = useState(null);



  // Yêu c?u dang du?c ch?p nh?n / t? ch?i

  const [connectionActionId, setConnectionActionId] = useState(null);



  // Form g?i yêu c?u k?t n?i

  const [receiverId, setReceiverId] = useState("");



  const [sending, setSending] = useState(false);



  const [sendError, setSendError] = useState("");



  // =====================================================

  // MESSENGER (MODULE 5 / BATCH 2)

  // =====================================================



  const [conversations, setConversations] = useState([]);



  const [conversationsLoading, setConversationsLoading] = useState(false);



  const [conversationsError, setConversationsError] = useState("");



  // Cu?c trò chuy?n dang du?c ch?n trong Messenger

  const [selectedConversation, setSelectedConversation] = useState(null);



  const [selectedConversationId, setSelectedConversationId] = useState(null);



  // Chi ti?t cu?c trò chuy?n (participant)

  const [conversationDetail, setConversationDetail] = useState(null);



  const [conversationDetailLoading, setConversationDetailLoading] =

    useState(false);



  const [conversationDetailError, setConversationDetailError] =

    useState("");



  // L?ch s? tin nh?n c?a cu?c trò chuy?n dang ch?n

  const [messages, setMessages] = useState([]);



  const [messagesLoading, setMessagesLoading] = useState(false);



  const [messagesError, setMessagesError] = useState("");



  // =====================================================

  // SIGNALR REALTIME CHAT (MODULE 5 / BATCH 3)

  // =====================================================



  // K?t n?i SignalR d?n /hubs/chat.

  const [chatConnection, setChatConnection] = useState(null);



  const [chatConnected, setChatConnected] = useState(false);



  const [sendingMessage, setSendingMessage] = useState(false);



  // =====================================================

  // NOTIFICATIONS (MODULE 5 / BATCH 4)

  // =====================================================



  const [notifications, setNotifications] = useState([]);



  const [notificationsLoading, setNotificationsLoading] =

    useState(false);



  const [notificationsError, setNotificationsError] =

    useState("");



  // Unread count cho Notification Bell.

  const [unreadCount, setUnreadCount] = useState(0);



  const [notificationsOpen, setNotificationsOpen] =

    useState(false);



  // Thông báo dang du?c dánh d?u dã d?c.

  const [notificationActionId, setNotificationActionId] =

    useState(null);



  // =====================================================

  // KHO TÀI LI?U & SÁCH — MODULE 4

  // =====================================================



  // "books" ho?c "documents"

  const [librarySection, setLibrarySection] = useState("books");



  // "all" = GET /api/library/books, "mine" = GET /api/library/books/me

  const [libraryMode, setLibraryMode] = useState("all");



  const [books, setBooks] = useState([]);



  const [booksLoading, setBooksLoading] = useState(false);



  const [booksSaving, setBooksSaving] = useState(false);



  const [booksError, setBooksError] = useState("");



  const [booksSuccess, setBooksSuccess] = useState("");



  // B? l?c GET /api/library/books?search=...&status=...

  const [bookFilters, setBookFilters] = useState({

    search: "",

    status: "",

  });



  const [bookFormOpen, setBookFormOpen] = useState(false);



  const [editingBook, setEditingBook] = useState(null);



  const [bookDetailOpen, setBookDetailOpen] = useState(false);



  const [bookDetail, setBookDetail] = useState(null);



  const [bookDetailLoading, setBookDetailLoading] = useState(false);



  const [bookDetailError, setBookDetailError] = useState("");



  // Chu?i d?i sách c?a ngu?i dang dang nh?p

  const [bookMatches, setBookMatches] = useState([]);



  const [bookMatchesLoading, setBookMatchesLoading] = useState(false);



  const [bookMatchesError, setBookMatchesError] = useState("");



  // =====================================================

  // TÀI LI?U S? — MODULE 4 / BATCH 2 + BATCH 3

  // =====================================================



  // "all" | "free" | "paid" = GET /api/library/documents

  // "mine" = GET /api/library/documents/me

  const [documentMode, setDocumentMode] = useState("all");



  const [documents, setDocuments] = useState([]);



  const [documentsLoading, setDocumentsLoading] = useState(false);



  const [documentsSaving, setDocumentsSaving] = useState(false);



  const [documentsError, setDocumentsError] = useState("");



  const [documentsSuccess, setDocumentsSuccess] = useState("");



  // B? l?c GET /api/library/documents?search=...&subject=...&pricing=...

  const [documentFilters, setDocumentFilters] = useState({

    search: "",

    subject: "",

    pricing: "",

  });



  const [documentFormOpen, setDocumentFormOpen] = useState(false);



  const [editingDocument, setEditingDocument] = useState(null);



  const [documentDetailOpen, setDocumentDetailOpen] = useState(false);



  const [documentDetail, setDocumentDetail] = useState(null);



  const [documentDetailLoading, setDocumentDetailLoading] = useState(false);



  const [documentDetailError, setDocumentDetailError] = useState("");



  // Ðang t?i tài li?u: luu id d? disable dúng nút t?i.

  const [downloadingDocumentId, setDownloadingDocumentId] =

    useState("");



  const [documentDownloadError, setDocumentDownloadError] = useState("");



  const [documentDownloadSuccess, setDocumentDownloadSuccess] =

    useState("");



  // =====================================================

  // ÐÁNH GIÁ TÀI LI?U — MODULE 4 / BATCH 4

  // =====================================================



  // Ðánh giá c?a tài li?u dang m? chi ti?t.

  const [documentReviews, setDocumentReviews] = useState([]);



  const [documentReviewsLoading, setDocumentReviewsLoading] =

    useState(false);



  const [documentReviewsError, setDocumentReviewsError] = useState("");



  const [documentReviewsSaving, setDocumentReviewsSaving] =

    useState(false);



  const [documentReviewsSuccess, setDocumentReviewsSuccess] =

    useState("");



  const [documentReviewFormError, setDocumentReviewFormError] =

    useState("");



  // Review dang s?a, null = không s?a review nào.

  const [editingDocumentReviewId, setEditingDocumentReviewId] =

    useState(null);



  // Review dang xóa, dùng d? disable dúng nút xóa.

  const [deletingDocumentReviewId, setDeletingDocumentReviewId] =

    useState(null);





  // =====================================================

  // REPORTS (MODULE 6 / BATCH 3)

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

  // ADMIN HUB (MODULE 6 / BATCH 4)

  // =====================================================



  // Dashboard

  const [adminStats, setAdminStats] = useState(null);



  const [adminStatsLoading, setAdminStatsLoading] = useState(false);



  const [adminStatsError, setAdminStatsError] = useState("");



  // Users

  const [adminUsers, setAdminUsers] = useState([]);



  const [adminUsersLoading, setAdminUsersLoading] = useState(false);



  const [adminUsersError, setAdminUsersError] = useState("");



  const [adminUsersPage, setAdminUsersPage] = useState(1);



  const [adminUsersPageSize, setAdminUsersPageSize] = useState(10);



  const [adminUsersTotalPages, setAdminUsersTotalPages] = useState(1);



  const [adminUsersSearch, setAdminUsersSearch] = useState("");



  const [adminUsersStatus, setAdminUsersStatus] = useState("");



  // Posts

  const [adminPosts, setAdminPosts] = useState([]);



  const [adminPostsLoading, setAdminPostsLoading] = useState(false);



  const [adminPostsError, setAdminPostsError] = useState("");



  const [adminPostsPage, setAdminPostsPage] = useState(1);



  const [adminPostsPageSize, setAdminPostsPageSize] = useState(10);



  const [adminPostsTotalPages, setAdminPostsTotalPages] = useState(1);



  const [adminPostsSearch, setAdminPostsSearch] = useState("");



  const [adminPostsType, setAdminPostsType] = useState("");



  const [adminPostsStatus, setAdminPostsStatus] = useState("");



  // Reports

  const [adminReports, setAdminReports] = useState([]);



  const [adminReportsLoading, setAdminReportsLoading] = useState(false);



  const [adminReportsError, setAdminReportsError] = useState("");



  const [adminReportsStatus, setAdminReportsStatus] = useState("");



  // Audit Logs

  const [adminAuditLogs, setAdminAuditLogs] = useState([]);



  const [adminAuditLogsLoading, setAdminAuditLogsLoading] = useState(false);



  const [adminAuditLogsError, setAdminAuditLogsError] = useState("");



  const [adminActionId, setAdminActionId] = useState(null);





  // =====================================================

  // KI?M TRA JWT KHI M? / REFRESH TRANG

  // =====================================================



  useEffect(() => {

    let restoreCancelled = false;



    async function restoreLogin() {



      const token = getToken();



      // Không có token

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



        // Có token + /me thành công

        // => vào trang ch?

        setPage(currentUser?.role === "Admin" ? "admin-dashboard" : "home");



      } catch (error) {



        if (restoreCancelled) return;



        // Ch? log l?i n?u không ph?i 401 (token h?t h?n/h?y b?)

        // 401 là bình thu?ng khi token không còn h?p l?

        if (error.status !== 401) {

          console.error(

            "Restore login failed:",

            error

          );

        }



        setUser(null);



        // Ð?t l?i tr?ng thái notification

        // khi restore login th?t b?i.

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



    return () => {

      restoreCancelled = true;

    };

  }, []);





  // =====================================================

  // SIGNALR /hubs/chat — K?T N?I THEO LOGIN / LOGOUT

  // (MODULE_5 / BATCH 3)

  // =====================================================



  // Ref luôn tr? d?n cu?c trò chuy?n dang ch?n,

  // d? handler SignalR không dùng closure cu.

  const selectedConversationIdRef = useRef(null);



  useEffect(() => {

    selectedConversationIdRef.current = selectedConversationId;

  }, [selectedConversationId]);



  // Ref luôn tr? d?n phiên b?n m?i nh?t c?a

  // handler nh?n tin nh?n realtime.

  const receiveMessageRef = useRef(null);

  const receiveNotificationRef = useRef(null);

  useEffect(() => {

    receiveMessageRef.current = handleReceiveMessage;

  });

  useEffect(() => {

    receiveNotificationRef.current = handleReceiveNotification;

  });
  useEffect(() => {

    if (!user) {

      return;

    }



    let cancelled = false;

    let connectionStarted = false;



    // T?o k?t n?i SignalR. JWT du?c g?i qua

    // accessTokenFactory (query string access_token).

    const connection = createChatConnection(

      (message) => {

        receiveMessageRef.current?.(message);
      },

      (notification) => {
        receiveNotificationRef.current?.(notification);
      }
    );



    setChatConnection(connection);



    connection

      .start()

      .then(() => {

        connectionStarted = true;

        if (!cancelled) {

          setChatConnected(true);

        }

      })

      .catch((error) => {

        if (!cancelled) {

          setChatConnected(false);

        }

        console.error("Chat connect failed:", error);

      });



    // Logout / chuy?n user ? d?ng HubConnection.

    return () => {

      cancelled = true;



      setChatConnected(false);



      setChatConnection(null);



      // Ch? stop n?u k?t n?i dã hoàn t?t negotiation.

      // Tránh "The connection was stopped during negotiation" error.

      if (connectionStarted) {

        connection.stop().catch((error) => {

          console.error("Chat stop failed:", error);

        });

      }

    };

  }, [user]);





  // =====================================================

  // UNREAD NOTIFICATION COUNT KHI ÐANG NH?P / REFRESH

  // (MODULE_5 / BATCH 4)

  // =====================================================



  useEffect(() => {

    if (!user) {

      return;

    }



    fetchUnreadNotifications();

  }, [user]);





  // =====================================================

  // LOGIN

  // =====================================================



  async function handleLogin(credentials) {



    setLoading(true);



    setError("");



    setSuccess("");



    try {



      // 1. G?i POST /api/auth/login

      const loginResult =

        await login(credentials);



      // 2. Login thành công

      // authService dã luu JWT vào localStorage





      // 3. G?i GET /api/auth/me

      const currentUser = isDemoMode()
        ? (loginResult?.user ?? null)
        : await getMe();





      // 4. Luu user vào React state

      setUser(currentUser);





      // 5. CHUY?N SANG TRANG CH?

      setPage(currentUser?.role === "Admin" ? "admin-dashboard" : "home");





    } catch (error) {



      console.error(

        "Login error:",

        error

      );



        setUser(null);



        // Ð?t l?i tr?ng thái notification

        // khi dang nh?p th?t b?i.

        setNotifications([]);

        setUnreadCount(0);

        setNotificationsOpen(false);



        setError(

          error.message ||

          "Ðang nh?p th?t b?i."

        );



    } finally {



      setLoading(false);



    }

  }





  // =====================================================

  // REGISTER

  // =====================================================



  async function handleRegister(formData) {



    setLoading(true);



    setError("");



    setSuccess("");



    try {



      // POST /api/auth/register

      await register(formData);





      // Ðang ký thành công

      setSuccess(

        "Ðang ký thành công! Hãy dang nh?p b?ng tài kho?n v?a t?o."

      );





      // Chuy?n v? LOGIN

      setPage("login");





    } catch (error) {



      console.error(

        "Register error:",

        error

      );



      setError(

        error.message ||

        "Ðang ký th?t b?i."

      );



    } finally {



      setLoading(false);



    }

  }





  // =====================================================

  // LOGOUT

  // =====================================================



  async function handleLogout() {



    setLoading(true);



    setError("");



    try {



      await logout();



    } catch (error) {



      console.error(

        "Logout error:",

        error

      );



    } finally {



      // Xóa user kh?i React

      setUser(null);



      // D?ng chuông thông báo khi dang xu?t.

      setNotifications([]);

      setUnreadCount(0);

      setNotificationsOpen(false);



      // Quay l?i Login

      setPage("login");



      setSuccess("");



      setLoading(false);



    }

  }





  // =====================================================

  // CHUY?N LOGIN

  // =====================================================



  function showLogin() {



    setPage("login");



    setError("");



    setSuccess("");



  }





  // =====================================================

  // CHUY?N REGISTER

  // =====================================================



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



      console.error(



        "Fetch profile failed:",



        error



      );



      setError(



        error.message ||



        "Không th? t?i h? so."



      );



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

  // REPORTS (MODULE 6 / BATCH 3)

  // =====================================================



  async function fetchMyReports() {

    setMyReportsLoading(true);

    setMyReportsError("");



    try {

      // GET /api/reports/me

      const data = await getMyReports();



      setMyReports(Array.isArray(data) ? data : []);

    } catch (error) {

      console.error("Fetch my reports failed:", error);



      setMyReports([]);

      setMyReportsError(

        error.message || "Không th? t?i danh sách báo cáo."

      );

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



    if (!postId) {

      return;

    }



    setReportSaving(true);

    setReportError("");



    try {

      // POST /api/reports

      await createReport(postId, reason, description);



      setReportSuccess("Báo cáo dã du?c g?i thành công.");

      closeReportForm();



      // Refresh my reports list

      fetchMyReports();

    } catch (error) {

      console.error("Submit report failed:", error);

      setReportError(

        error.message || "G?i báo cáo th?t b?i."

      );

    } finally {

      setReportSaving(false);

    }

  }



  // =====================================================

  // ADMIN HUB (MODULE 6 / BATCH 4)

  // =====================================================



  // Dashboard

  async function fetchAdminDashboard() {

    setAdminStatsLoading(true);

    setAdminStatsError("");



    try {

      // GET /api/admin/dashboard

      const data = await getAdminDashboard();



      setAdminStats(data);

    } catch (error) {

      console.error("Fetch admin dashboard failed:", error);

      setAdminStats(null);

      setAdminStatsError(

        error.message || "Không th? t?i th?ng kê Admin."

      );

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

      case "violations":

        showAdminReports();

        break;

      case "content":

        showAdminPosts();

        break;

      case "users":

        showAdminUsers();

        break;

      case "audit-logs":

        showAdminAuditLogs();

        break;

      case "statistics":

      default:

        showAdminDashboard();

        break;

    }

  }



  // Users

  async function fetchAdminUsers(page = 1, pageSize = 10, search = "", status = "") {

    setAdminUsersLoading(true);

    setAdminUsersError("");



    try {

      // GET /api/admin/users

      const data = await getAdminUsers({ page, pageSize, search, status });



      setAdminUsers(data?.items ?? []);

      setAdminUsersPage(data?.page ?? 1);

      setAdminUsersPageSize(data?.pageSize ?? pageSize);

      setAdminUsersTotalPages(data?.totalPages ?? 1);

    } catch (error) {

      console.error("Fetch admin users failed:", error);

      setAdminUsers([]);

      setAdminUsersError(

        error.message || "Không th? t?i danh sách ngu?i dùng."

      );

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
    // View detail
    const data = await getAdminUserDetail(userData.id);
    // Could open a modal with details - for now just refresh
    fetchAdminUsers(adminUsersPage, adminUsersPageSize, adminUsersSearch, adminUsersStatus);
  }

  async function handleAdminUserWarning(user) {
    const reason = window.prompt("Nhập lý do cảnh báo:");
    if (reason === null || reason.trim() === "") {
      return;
    }
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
    if (reason === null || reason.trim() === "") {
      return;
    }
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


  // Posts

  async function fetchAdminPosts(page = 1, pageSize = 10, type = "", status = "", search = "") {

    setAdminPostsLoading(true);

    setAdminPostsError("");



    try {

      // GET /api/admin/posts

      const data = await getAdminPosts({ page, pageSize, type, status, search });



      setAdminPosts(data?.items ?? []);

      setAdminPostsPage(data?.page ?? 1);

      setAdminPostsPageSize(data?.pageSize ?? pageSize);

      setAdminPostsTotalPages(data?.totalPages ?? 1);

    } catch (error) {

      console.error("Fetch admin posts failed:", error);

      setAdminPosts([]);

      setAdminPostsError(

        error.message || "Không th? t?i danh sách bài dang."

      );

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

    // View detail - could open modal

    await getAdminPostDetail(post.id);

  }



  async function handleAdminPostDelete(postId) {

    setAdminActionId(postId);

    try {

      await deleteAdminPost(postId);

      fetchAdminPosts(adminPostsPage, adminPostsPageSize, adminPostsType, adminPostsStatus, adminPostsSearch);

    } catch (error) {

      console.error("Delete admin post failed:", error);

      setAdminPostsError(error.message || "Không th? xóa bài dang.");

    } finally {

      setAdminActionId(null);

    }

  }



  // Reports

  async function fetchAdminReports(status = "") {

    setAdminReportsLoading(true);

    setAdminReportsError("");



    try {

      // GET /api/admin/reports

      const data = await getAdminReports({ status });



      setAdminReports(Array.isArray(data) ? data : []);

    } catch (error) {

      console.error("Fetch admin reports failed:", error);

      setAdminReports([]);

      setAdminReportsError(

        error.message || "Không th? t?i danh sách báo cáo."

      );

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

    // View detail - could open modal

    await getAdminReportDetail(report.id);

  }



  async function handleAdminReportApprove(reportId) {

    setAdminActionId(reportId);

    try {

      await approveAdminReport(reportId);

      fetchAdminReports(adminReportsStatus);

    } catch (error) {

      console.error("Approve admin report failed:", error);

      setAdminReportsError(error.message || "Không th? duy?t báo cáo.");

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

      setAdminReportsError(error.message || "Không th? t? ch?i báo cáo.");

    } finally {

      setAdminActionId(null);

    }

  }



  // Audit Logs

  async function fetchAdminAuditLogs() {

    setAdminAuditLogsLoading(true);

    setAdminAuditLogsError("");



    try {

      // GET /api/admin/audit-logs

      const data = await getAdminAuditLogs();



      setAdminAuditLogs(Array.isArray(data) ? data : []);

    } catch (error) {

      console.error("Fetch admin audit logs failed:", error);

      setAdminAuditLogs([]);

      setAdminAuditLogsError(

        error.message || "Không th? t?i nh?t ký ki?m tra."

      );

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



  // Posts - toggle hidden

  async function handleAdminPostToggleHidden(postId, reason = null) {
    setAdminActionId(postId);
    try {
      await toggleAdminPostHidden(postId, reason);
      fetchAdminPosts(

        adminPostsPage,

        adminPostsPageSize,

        adminPostsType,

        adminPostsStatus,

        adminPostsSearch

      );

    } catch (error) {

      console.error("Toggle admin post hidden failed:", error);

      setAdminPostsError(error.message || "Không th? thay d?i tr?ng thái bài dang.");

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



      // GET /api/users/me/preferences

      const data = await getPreferences();



      setPreferences(data);



    } catch (error) {



      console.error(



        "Fetch preferences failed:",



        error



      );



      setPreferencesError(



        error.message ||



        "Không th? t?i vector nhu c?u."



      );



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
    // Merge form data (domain-specific fields only) into existing preferences.
    const merged = {
      ...(preferences || {}),
      ...formData,
    };

    // Null values mean "don't change" — preserve existing values
    // so saving one vector never wipes the other.
    if (formData.studySubjects === null)
      merged.studySubjects = preferences?.studySubjects ?? null;
    if (formData.studyLanguages === null)
      merged.studyLanguages = preferences?.studyLanguages ?? null;
    if (formData.studyGoal === null)
      merged.studyGoal = preferences?.studyGoal ?? null;
    if (formData.studyTime === null)
      merged.studyTime = preferences?.studyTime ?? null;
    if (formData.studyFormat === null)
      merged.studyFormat = preferences?.studyFormat ?? null;
    if (formData.studyMethod === null)
      merged.studyMethod = preferences?.studyMethod ?? null;
    if (formData.roomAmenities === null)
      merged.roomAmenities = preferences?.roomAmenities ?? null;

      // Existing preferences => PUT, otherwise => POST
      const saved = preferences
        ? await updatePreferences(merged)
        : await createPreferences(merged);


      setPreferences(saved);



      setPreferencesSuccess(



        preferences



          ? "Vector nhu c?u dã du?c c?p nh?t."



          : "Vector nhu c?u dã du?c t?o."



      );



    } catch (error) {



      console.error(



        "Save preferences error:",



        error



      );



      setPreferencesError(



        error.message ||



        "Luu vector nhu c?u th?t b?i."



      );



    } finally {



      setPreferencesSaving(false);



    }



  }





  async function handleDeletePreferences() {



    setPreferencesSaving(true);



    setPreferencesError("");



    setPreferencesSuccess("");



    try {



      // DELETE /api/users/me/preferences

      await deletePreferences();



      setPreferences(null);



      setPreferencesSuccess("Vector nhu c?u dã du?c xóa.");



    } catch (error) {



      console.error(



        "Delete preferences error:",



        error



      );



      setPreferencesError(



        error.message ||



        "Xóa vector nhu c?u th?t b?i."



      );



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



      // C?p nh?t thông tin cá nhân

      const updated = await updateProfile({



        fullName: formData.fullName,



        email: formData.email,



        phone: formData.phone,



      });



      // C?p nh?t avatar n?u có URL m?i

      if (formData.avatarUrl) {



        await updateAvatar({



          avatarUrl: formData.avatarUrl,



        });



        updated.avatarUrl = formData.avatarUrl;



      }



      // C?p nh?t React state

      setUser(updated);



      setSuccess("H? so dã du?c c?p nh?t.");



      setPage("profile");



    } catch (error) {



      console.error(



        "Update profile error:",



        error



      );



      setError(



        error.message ||



        "C?p nh?t h? so th?t b?i."



      );



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



      setSuccess("M?t kh?u dã du?c thay d?i.");



      setPage("profile");



    } catch (error) {



      console.error(



        "Change password error:",



        error



      );



      setError(



        error.message ||



        "Ð?i m?t kh?u th?t b?i."



      );



    } finally {



      setLoading(false);



    }

  }





  // =====================================================

  // BÀI ÐANG (POSTS)

  // =====================================================



  // Rút g?n danh sách lu?t thích thành s? lu?ng + dã thích hay chua.

  function summarizeLikes(likes) {



    const list = likes ?? [];



    const currentUserId = user?.id ?? user?.Id ?? "";



    return {



      count: list.length,



      likedByMe:

        Boolean(currentUserId) &&

        list.some(

          (like) =>

            String(like.userId).toLowerCase() ===

            String(currentUserId).toLowerCase()

        ),



    };



  }





  async function loadPostLikes(list) {



    const entries = await Promise.all(

      (list ?? []).map(async (post) => {



        // H? tr? c? hai ki?u tên: PascalCase (t? Backend) và camelCase.

        const postId =

          post?.PostId ?? post?.postId ?? post?.id ?? post?.Id ??

          (post?.post ? post.post.PostId ?? post.post.postId ?? post.post.id : null);



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



  }





  async function fetchPosts(mode, filters) {



    setPostsLoading(true);



    setPostsError("");



    const activeFilters = filters ?? postFilters;



    try {



      // GET /api/posts (có type/time) ho?c GET /api/posts/me

      const data =

        mode === "mine"

          ? await getMyPosts()

          : await getPosts(activeFilters);



      setPosts(data);



      setPostLikes(await loadPostLikes(data));



      // Nút "Yêu c?u k?t n?i" trên th? bài dang c?n bi?t dã g?i

      // yêu c?u hay dã k?t n?i v?i ch? bài dang chua.

      // T?i kèm danh sách yêu c?u (l?i riêng không ch?n feed).

      fetchConnectionRequests();



    } catch (error) {



      console.error(



        "Fetch posts failed:",



        error



      );



      setPosts([]);



      setPostLikes({});



      setPostsError(



        error.message ||



        "Không th? t?i danh sách bài dang."



      );



    } finally {



      setPostsLoading(false);



    }



  }





  // =====================================================

  // LIKED POSTS HISTORY (MODULE 1)

  // =====================================================



  const fetchLikedPosts = useCallback(async () => {



    setLikedPostsLoading(true);



    setLikedPostsError("");



    try {



      // GET /api/posts/me/liked



      const data = await getLikedPosts();



      setLikedPosts(data);



      // Load like info for each liked post to display correct counts

      if (data && data.length > 0) {

        const likesMap = await loadPostLikes(data);

        setPostLikes(likesMap);

      }



    } catch (error) {



      console.error(

        "Fetch liked posts failed:",

        error

      );



      setLikedPosts([]);



      setPostLikes({});



      setLikedPostsError(

        error.message ||

        "Không th? t?i l?ch s? bài dang dã thích."

      );



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





  function showMyPosts() {



    showPosts("mine");



  }





  // Trang c?ng d?ng: GET /api/posts — bài dang c?a toàn b? sinh viên.

  function showAllPosts(targetPostId) {



    showPosts("all", targetPostId);



  }





  // Logo "CampusEcom" ? header dùng hàm này d? quay v? Trang ch?.

  function showHome() {
    if (user?.role === "Admin") {
      setPage("admin-dashboard");
    } else {
      setPage("home");
    }

    setError("");



    setSuccess("");



  }





  // B? l?c ch? áp d?ng cho GET /api/posts.

  function handleFilterChange(nextFilters) {



    const filters = {



      type: nextFilters.type ?? "",



      time: nextFilters.time ?? "",



    };



    setPostFilters(filters);



    setPostsSuccess("");



    if (postMode !== "all") {

      return;

    }



    fetchPosts("all", filters);



  }





  function switchPostMode() {



    showPosts(postMode === "mine" ? "all" : "mine");



  }





  function openPostForm(post, defaultType = "") {



    setEditingPost(post || null);



    setPostFormOpen(true);



    setPostFormDefaultType(defaultType);



    setPostsError("");



    setPostsSuccess("");



    setDetailOpen(false);



  }





  function closePostForm() {



    setPostFormOpen(false);



    setEditingPost(null);



    setPostFormDefaultType("");



  }





  async function handleSubmitPost(formData) {



    setPostsSaving(true);



    setPostsError("");



    setPostsSuccess("");



    try {



      if (editingPost) {



        // PUT /api/posts/{id}

        await updatePost(editingPost.id, formData);



        setPostsSuccess("Bài dang dã du?c c?p nh?t.");



      } else {

        const type = (formData && formData.type) || postFormDefaultType || '';

        const t = type.toString().toLowerCase();

        // Chu?n hóa casing c?a type Lost/Found d? kh?p v?i giá tr?

        // mà Backend luu và Frontend so sánh (item?.type === "Found").

        if (formData && t === "found") formData.type = "Found";

        if (formData && t === "lost") formData.type = "Lost";

        if (t === 'group') {

          await createStudentPost(formData);

          setPostsSuccess("Bài dang dã du?c t?o.");

        } else if (t === 'room') {

          await createRoomPost(formData);

          setPostsSuccess("Bài dang dã du?c t?o.");

        } else {

          // Fallback: POST /api/posts

          const createdPost = await createPost(formData);

          setPostsSuccess("Bài dang dã du?c t?o.");



          // N?u là bài dang Found và có câu h?i bí m?t, t?o câu h?i bí m?t sau khi t?o bài dang.

          if (t === 'found' && formData.secretQuestion && formData.secretAnswer) {

            try {

              await createSecretQuestion(createdPost?.id ?? createdPost?.postId, {

                question: formData.secretQuestion,

                answer: formData.secretAnswer,

              });

            } catch (secretError) {

              console.error("Create secret question failed:", secretError);

              // Không ch?n lu?ng t?o bài dang n?u câu h?i bí m?t th?t b?i.

            }

          }

        }

      }



      closePostForm();



      await fetchPosts(postMode);



    } catch (error) {



      console.error(



        "Save post error:",



        error



      );



      setPostsError(



        error.message ||



        "Luu bài dang th?t b?i."



      );



    } finally {



      setPostsSaving(false);



    }



  }





  async function handleDeletePost(post) {



    const confirmed = window.confirm(

      "Xóa bài dang này? Hành d?ng không th? hoàn tác."

    );



    if (!confirmed) {

      return;

    }



    setPostsSaving(true);



    setPostsError("");



    setPostsSuccess("");



    try {



      // DELETE /api/posts/{id}

      await deletePost(post.id);



      setDetailOpen(false);



      setPostsSuccess("Bài dang dã du?c xóa.");



      await fetchPosts(postMode);



    } catch (error) {



      console.error(



        "Delete post error:",



        error



      );



      setPostsError(



        error.message ||



        "Xóa bài dang th?t b?i."



      );



    } finally {



      setPostsSaving(false);



    }



  }





  async function handleOpenPostDetail(postId) {



    setDetailOpen(true);



    setDetailLoading(true);



    setDetailError("");



    setDetailPost(null);



    try {



      // GET /api/posts/{id}

      const data = await getPostById(postId);



      setDetailPost(data);



    } catch (error) {



      console.error(



        "Fetch post detail failed:",



        error



      );



      setDetailError(



        error.message ||



        "Không tìm th?y bài dang."



      );



    } finally {



      setDetailLoading(false);



    }



   }





  // =====================================================

  // CHI TI?T T? L?CH S? ÐÃ THÍCH ? ÐI T?I TRANG C?NG Ð?NG

  // =====================================================



  // Khi ngu?i dùng b?n "Xem chi ti?t" ? trang "L?ch s? dã thích",

  // di?u hu?ng t?i trang C?ng d?ng (T?t c? bài dang) r?i m? cùng

  // PostDetailModal/mechanism dang dùng ? trang C?ng d?ng.

  // Không g?i showPosts("all") vì hàm này g?i setDetailOpen(false)

  // ngay tru?c khi handleOpenPostDetail g?i setDetailOpen(true).

  async function handleOpenLikedPostDetail(postId) {



    // 1. Chuy?n trang sang C?ng d?ng (feed all)

    setPage("posts");



    setPostMode("all");



    setError("");



    setSuccess("");



    setPostsSuccess("");



    setPostFormOpen(false);



    // T?i feed c?ng d?ng d? trang hi?n th? d?y d? sau khi chuy?n.

    fetchPosts("all");



    // 2. M? chi ti?t bài dang b?ng co ch? dã có ? trang C?ng d?ng

    //    (GET /api/posts/{id} ? PostDetailModal).

    handleOpenPostDetail(postId);



  }





  function closePostDetail() {



    setDetailOpen(false);



    setDetailPost(null);



  }





  async function handleToggleLike(postId) {



    const current = postLikes[postId] ?? {



      count: 0,



      likedByMe: false,



    };



    setLikingPostId(postId);



    setPostsError("");



    try {



      if (current.likedByMe) {



        // DELETE /api/posts/{id}/like

        await unlikePost(postId);



        // Remove from liked posts history if we're on the liked posts page

        setLikedPosts((prev) => prev.filter((p) => (p.postId ?? p.PostId ?? p.id ?? p.Id) !== postId));



      } else {



        // POST /api/posts/{id}/like

        await likePost(postId);



      }



      const likes = await getPostLikes(postId);



      setPostLikes((previous) => ({

        ...previous,

        [postId]: summarizeLikes(likes),

      }));



    } catch (error) {



      console.error(



        "Toggle like error:",



        error



      );



      setPostsError(



        error.message ||



        "Thao tác thích bài dang th?t b?i."



      );



    } finally {



      setLikingPostId(null);



    }



  }





  // =====================================================

  // SMART MATCHING (MODULE 2)

  // =====================================================



  async function fetchStudentMatches() {



    setMatchesLoading(true);



    setMatchesError("");



    try {



      // GET /api/matching/students

      const data = await getStudentMatches();



      setMatches(data);



    } catch (error) {



      console.error(



        "Fetch student matches failed:",



        error



      );



      setMatches([]);



      setMatchesError(



        error.message ||



        "Không th? t?i k?t qu? Smart Matching."



      );



    } finally {



      setMatchesLoading(false);



    }



  }





  function showSmartMatching() {



    setPage("smart-matching");



    setError("");



    setSuccess("");



    setMatchDetailOpen(false);



    setRoomMatchDetailOpen(false);



    fetchStudentMatches();



    if (matchingMode === "rooms") {



      fetchRoomMatches();



    }



  }





  // Ð?i ch? d? Smart Matching: nhóm h?c ho?c tìm tr? / ? ghép

  function handleChangeMatchingMode(mode) {



    if (mode === matchingMode) {



      return;



    }



    setMatchingMode(mode);



    setMatchDetailOpen(false);



    setRoomMatchDetailOpen(false);



    setMatchDetailError("");



    setRoomMatchDetailError("");



    if (mode === "rooms") {



      fetchRoomMatches();



      return;



    }



    fetchStudentMatches();


  }

  async function handleRunStudyMatching() {
    await fetchStudentMatches();
  }

  async function handleRunRoomMatching() {
    await fetchRoomMatches();
  }

  async function handleOpenMatchDetail(userId) {


    setMatchDetailOpen(true);



    setMatchDetailLoading(true);



    setMatchDetailError("");



    setMatchDetail(null);



    try {



      // GET /api/matching/students/{userId}

      const data = await getStudentMatch(userId);



      setMatchDetail(data);



    } catch (error) {



      console.error(



        "Fetch match detail failed:",



        error



      );



      setMatchDetailError(



        error.message ||



        "Không tìm th?y ngu?i phù h?p."



      );



    } finally {



      setMatchDetailLoading(false);



    }



  }





  function closeMatchDetail() {



    setMatchDetailOpen(false);



    setMatchDetail(null);



  }





  async function fetchRoomMatches() {



    setRoomMatchesLoading(true);



    setRoomMatchesError("");



    try {



      // GET /api/matching/rooms

      const data = await getRoomMatches();



      setRoomMatches(data);



    } catch (error) {



      console.error(



        "Fetch room matches failed:",



        error



      );



      setRoomMatches([]);



      setRoomMatchesError(



        error.message ||



        "Không th? t?i k?t qu? tìm tr? / ? ghép."



      );



    } finally {



      setRoomMatchesLoading(false);



    }



  }





  async function handleOpenRoomMatchDetail(userId) {



    setRoomMatchDetailOpen(true);



    setRoomMatchDetailLoading(true);



    setRoomMatchDetailError("");



    setRoomMatchDetail(null);



    try {



      // GET /api/matching/rooms/{userId}

      const data = await getRoomMatch(userId);



      setRoomMatchDetail(data);



    } catch (error) {



      console.error(



        "Fetch room match detail failed:",



        error



      );



      setRoomMatchDetailError(



        error.message ||



        "Không tìm th?y ?ng viên tìm tr? / ? ghép."



      );



    } finally {



      setRoomMatchDetailLoading(false);



    }



  }





  function closeRoomMatchDetail() {



    setRoomMatchDetailOpen(false);



    setRoomMatchDetail(null);



  }





  // =====================================================

  // CAMPUS LOST & FOUND (MODULE 3)

  // =====================================================



  async function fetchLostFoundMap() {



    setLostFoundMapLoading(true);



    setLostFoundMapError("");



    try {



      // GET /api/lost-found/map

      const data = await getLostFoundMap();



      setLostFoundPins(data);



    } catch (error) {



      console.error(



        "Fetch lost & found map failed:",



        error



      );



      setLostFoundPins([]);



      setLostFoundMapError(



        error.message ||



        "Không th? t?i d? li?u b?n d? Lost & Found."



      );



    } finally {



      setLostFoundMapLoading(false);



    }



  }





  async function fetchLostFound(filter) {



    setLostFoundLoading(true);



    setLostFoundError("");



    try {



      // GET /api/lost-found?type=... ho?c ?status=Returned

      const data = await getLostFoundPosts(filter);



      setLostFoundItems(data);



    } catch (error) {



      console.error(



        "Fetch lost & found failed:",



        error



      );



      setLostFoundItems([]);



      setLostFoundError(



        error.message ||



        "Không th? t?i d? li?u Lost & Found."



      );



    } finally {

      setLostFoundLoading(false);


    }

  }

  function showLostFound() {

    setPage("lost-found");

    setError("");

    setSuccess("");

    setLostFoundSuccess("");

    setLostFoundFilter("");

    fetchLostFound("");

    fetchLostFoundMap();


  }




  // Backend là noi l?c d? li?u, không l?c l?i ? React.

  async function handleLostFoundFilterChange(filter) {



    setLostFoundSuccess("");



    setLostFoundFilter(filter);



    await fetchLostFound(filter);



  }





  // =====================================================

  // CÂU H?I BÍ M?T (MODULE 3 / BATCH 2)

  // =====================================================



  function closeSecretQuestion() {



    setSecretMode(null);



    setSecretItem(null);



    setSecretQuestion("");



    setSecretError("");



    setSecretLoading(false);



    setSecretSaving(false);



  }





  // Ch? bài dang Found t?o câu h?i, ngu?i khác ch? xem câu h?i.

  async function handleOpenSecretQuestion(item) {



    setSecretItem(item);



    setSecretQuestion("");



    setSecretError("");



    const currentUserId = user?.id ?? user?.Id ?? "";



    const isOwner =

      Boolean(currentUserId) &&

      String(item?.userId ?? "").toLowerCase() ===

        String(currentUserId).toLowerCase();



    if (isOwner) {



      setSecretMode("create");



      return;



    }



    setSecretMode("view");



    setSecretLoading(true);



    try {



      // GET /api/lost-found/{postId}/secret-question

      const data = await getSecretQuestion(item.postId);



      setSecretQuestion(data?.question ?? "");



    } catch (error) {



      console.error(



        "Fetch secret question failed:",



        error



      );



      setSecretError(



        error.status === 404

          ? "Ngu?i nh?t d? chua t?o câu h?i bí m?t."

          : error.message ||

            "Không th? t?i câu h?i bí m?t."



      );



    } finally {



      setSecretLoading(false);



    }



  }





  async function handleSubmitSecretQuestion({ question, answer }) {



    setSecretSaving(true);



    setSecretError("");



    try {



      // POST /api/lost-found/{postId}/secret-question

      await createSecretQuestion(secretItem.postId, {

        question,

        answer,

      });



      closeSecretQuestion();



    } catch (error) {



      console.error(



        "Create secret question failed:",



        error



      );



      setSecretError(getSecretQuestionErrorMessage(error));



    } finally {



      setSecretSaving(false);



    }



  }





  function getSecretQuestionErrorMessage(error) {

    if (error.status === 409) {

      return "Câu h?i bí m?t c?a bài dang này dã t?n t?i.";

    }



    if (error.status === 403) {

      return "B?n không ph?i ch? bài dang này.";

    }



    return error.message || "Không th? luu câu h?i bí m?t.";

  }





  // =====================================================

  // XEM Ð? KH?P (MODULE 3 / BATCH 3)

  // =====================================================



  async function handleViewMatches(postId) {

    return await getMatches(postId);

  }





  // MODULE_3: Xem chi ti?t bài dang Lost & Found

  // Ði?u hu?ng sang trang T?t c? bài dang và m? bài dang tuong ?ng.

  async function handleViewLostFoundDetail(item) {



    const postId =

      item?.postId ??

      item?.PostId ??

      item?.id ??

      item?.Id;



    if (!postId) {

      return;

    }



    setPage("posts");



    setPostMode("all");



    setError("");



    setSuccess("");



    setPostsSuccess("");



    setPostFormOpen(false);



    setTargetPostId(postId);



    setTargetPostHighlight(true);



    // M? modal chi ti?t bài dang ngay sau khi di?u hu?ng.

    setDetailOpen(true);

    await handleOpenPostDetail(postId);



    fetchPosts("all");

  }





  // =====================================================

  // YÊU C?U NH?N Ð? (MODULE 3 / BATCH 3)

  // =====================================================



  function closeClaim() {



    setClaimItem(null);



    setClaimQuestion("");



    setClaimError("");



    setClaimSaving(false);



  }





  // T? câu h?i bí m?t sang form g?i câu tr? l?i.

  function handleAnswerSecretQuestion() {



    setSecretMode(null);



    setSecretItem(null);



    setClaimItem(secretItem);



    setClaimQuestion(secretQuestion);



    setClaimError("");



  }





  async function handleSubmitClaim({ answer }) {



    setClaimSaving(true);



    setClaimError("");



    try {



      // POST /api/lost-found/{postId}/claims

      const data = await createClaim(claimItem.postId, { answer });



      closeClaim();



      closeSecretQuestion();



      // Ðánh d?u bài dang dã du?c xác minh d? m? khóa nút k?t n?i.

      setVerifiedPostIds((prev) => {

        const next = new Set(prev);

        next.add(claimItem.postId);

        return next;

      });



      setLostFoundSuccess(

        `Ðã g?i yêu c?u nh?n d? (${data?.status ?? "Pending"}).`

      );



    } catch (error) {



      console.error(



        "Create claim failed:",



        error



      );



      setClaimError(getClaimErrorMessage(error));



    } finally {



      setClaimSaving(false);



    }



  }





  function getClaimErrorMessage(error) {

    // Backend ch? tr? l?i sai khi câu tr? l?i không kh?p.

    if (error.status === 400) {

      return "Câu tr? l?i không dúng v?i câu h?i bí m?t.";

    }



    if (error.status === 409) {

      return "Ngu?i nh?t d? chua t?o câu h?i bí m?t cho bài dang này.";

    }



    if (error.status === 403) {

      return "B?n không th? g?i yêu c?u nh?n d? cho bài dang c?a mình.";

    }



    return error.message || "Không th? g?i yêu c?u nh?n d?.";

  }





  function closeClaims() {



    setClaimsItem(null);



    setClaims([]);



    setClaimsError("");



    setClaimsLoading(false);



  }





  async function handleOpenClaims(item) {



    setClaimsItem(item);



    setClaims([]);



    setClaimsError("");



    setClaimsLoading(true);



    try {



      // GET /api/lost-found/{postId}/claims

      const data = await getClaims(item.postId);



      setClaims(data);



    } catch (error) {



      console.error(



        "Fetch claims failed:",



        error



      );



      setClaimsError(getClaimsErrorMessage(error));



    } finally {



      setClaimsLoading(false);



    }



  }





  function getClaimsErrorMessage(error) {

    if (error.status === 403) {

      return "B?n không ph?i ch? bài dang này.";

    }



    if (error.status === 409) {

      return "Bài dang này không nh?n yêu c?u nh?n d?.";

    }



    return error.message || "Không th? t?i yêu c?u.";

  }





  // Backend là ngu?n s? th?t: sau khi duy?t / t? ch?i,

  // danh sách yêu c?u du?c t?i l?i t? API.

  async function reloadClaims(postId) {



    try {



      const data = await getClaims(postId);



      setClaims(data);



      setClaimsError("");



    } catch (error) {



      console.error(



        "Reload claims failed:",



        error



      );



      setClaimsError(getClaimsErrorMessage(error));



    }



  }





  // =====================================================

  // DUY?T / T? CH?I / ÐÃ TR? Ð? (MODULE 3 / BATCH 4)

  // =====================================================



  function getClaimActionErrorMessage(error, fallback) {

    if (error.status === 403) {

      return "B?n không ph?i ch? bài dang này.";

    }



    if (error.status === 409) {

      return error.message ||

        "Yêu c?u này không còn ? tr?ng thái ch?.";

    }



    return error.message || fallback;

  }





  async function handleApproveClaim(claim) {



    setClaimsActionId(claim?.claimId);



    setClaimsError("");



    setLostFoundSuccess("");



    try {



      // PUT /api/lost-found/claims/{claimId}/approve

      const data = await approveClaim(claim?.claimId);



      await reloadClaims(claim?.postId);



      setLostFoundSuccess(

        `Ðã duy?t yêu c?u (${data?.status ?? "Approved"}).`

      );



    } catch (error) {



      console.error(



        "Approve claim failed:",



        error



      );



      setClaimsError(

        getClaimActionErrorMessage(

          error,

          "Không th? duy?t yêu c?u nh?n d?."

        )

      );



    } finally {



      setClaimsActionId(null);



    }



  }





  async function handleRejectClaim(claim) {



    setClaimsActionId(claim?.claimId);



    setClaimsError("");



    setLostFoundSuccess("");



    try {



      // PUT /api/lost-found/claims/{claimId}/reject

      const data = await rejectClaim(claim?.claimId);



      await reloadClaims(claim?.postId);



      setLostFoundSuccess(

        `Ðã t? ch?i yêu c?u (${data?.status ?? "Rejected"}).`

      );



    } catch (error) {



      console.error(



        "Reject claim failed:",



        error



      );



      setClaimsError(

        getClaimActionErrorMessage(

          error,

          "Không th? t? ch?i yêu c?u nh?n d?."

        )

      );



    } finally {



      setClaimsActionId(null);



    }



  }





  async function handleMarkReturned(item) {



    const confirmed = window.confirm(

      "Xác nh?n dã trao tr? d?? Bài dang s? chuy?n sang tr?ng thái Ðã Trao Tr?."

    );



    if (!confirmed) {

      return;

    }



    setClaimsActionId("returned");



    setClaimsError("");



    setLostFoundSuccess("");



    try {



      // PUT /api/lost-found/{postId}/returned

      await markReturned(item?.postId);



      // T?i l?i danh sách, tin và b?n d? t? Backend.

      await reloadClaims(item?.postId);



      await fetchLostFound(lostFoundFilter);



      await fetchLostFoundMap();



      setLostFoundSuccess("Ðã xác nh?n trao tr? d?.");



    } catch (error) {



      console.error(



        "Mark returned failed:",



        error



      );



      setClaimsError(

        getClaimActionErrorMessage(

          error,

          "Không th? xác nh?n dã tr? d?."

        )

      );



    } finally {



      setClaimsActionId(null);



    }



  }





   // =====================================================

  // CONNECTION REQUESTS (MODULE 5 / BATCH 1)

  // =====================================================



  // Backend là ngu?n s? th?t: sau m?i thao tác,

  // danh sách yêu c?u du?c t?i l?i t? API.

  async function fetchConnectionRequests() {

    setConnectionLoading(true);

    setConnectionError("");



    try {

      // GET /api/connections/requests

      const data = await getConnectionRequests();



      setConnectionRequests(Array.isArray(data) ? data : []);

    } catch (error) {

      console.error("Fetch connection requests failed:", error);



      setConnectionRequests([]);



      setConnectionError(

        error.message || "Không th? t?i yêu c?u k?t n?i."

      );

    } finally {

      setConnectionLoading(false);

    }

  }



  function showConnections() {

    setPage("connections");



    setError("");

    setSuccess("");



    setConnectionMode("received");

    setConnectionSuccess("");

    setConnectionError("");

    setSendError("");

    setReceiverId("");



    fetchConnectionRequests();

  }



  // =====================================================

  // YÊU C?U K?T N?I T? BÀI ÐANG

  // Dùng chung connectionService + Notification c?a

  // MODULE_5, không t?o h? th?ng th? hai.

  // =====================================================



  // G?i yêu c?u k?t n?i t?i ch? m?t bài dang.

  async function handleRequestConnection(receiverId, postId) {

    if (!receiverId) {

      return;

    }



    setConnectionSendingId(postId ?? null);

    setConnectionSuccess("");

    setConnectionError("");

    setPostsSuccess("");

    setPostsError("");



    try {

      // POST /api/connections/requests (kèm PostId n?u có)

      const data = await sendConnectionRequest(receiverId, postId);



      setConnectionSuccess(

        `Ðã g?i yêu c?u k?t n?i t?i ${

          data?.receiverName ?? "ngu?i nh?n"

        }.`

      );



      // T?i l?i d? nút chuy?n sang "Ðã g?i yêu c?u".

      await fetchConnectionRequests();

    } catch (error) {

      console.error("Request connection from post failed:", error);



      setConnectionError(

        getConnectionErrorMessage(error, true)

      );



      setPostsError(

        getConnectionErrorMessage(error, true)

      );

    } finally {

      setConnectionSendingId(null);

    }

  }



  function handleConnectionModeChange(mode) {

    setConnectionMode(mode);

    setConnectionSuccess("");

    setConnectionError("");

  }



  function getConnectionErrorMessage(error, postContext = false) {

    // Khi b?m t? bài dang, 404/400 có th? do PostId không h?p l?.

    if (error.status === 400) {

      if (postContext) {

        return "Không th? g?i yêu c?u k?t n?i cho bài dang này.";

      }



      return "Không th? g?i yêu c?u k?t n?i cho chính mình.";

    }



    if (error.status === 404) {

      if (postContext) {

        return "Không tìm th?y bài dang ho?c ch? bài dang.";

      }



      return "Ngu?i nh?n không t?n t?i.";

    }



    if (error.status === 409) {

      if (postContext) {

        return "B?n dã g?i yêu c?u k?t n?i t?i ngu?i này r?i.";

      }



      return "Ðã có yêu c?u k?t n?i dang ch? v?i ngu?i này.";

    }



    return error.message || "Không th? g?i yêu c?u k?t n?i.";

  }



  async function handleSendConnectionRequest(targetReceiverId) {

    const trimmed = String(targetReceiverId ?? "").trim();



    if (!trimmed) {

      return;

    }



    setSending(true);

    setSendError("");

    setConnectionSuccess("");



    try {

      // POST /api/connections/requests

      const data = await sendConnectionRequest(trimmed);



      setReceiverId("");



      setConnectionSuccess(

        `Ðã g?i yêu c?u k?t n?i d?n ${

          data?.receiverName ?? "ngu?i nh?n"

        }.`

      );



      await fetchConnectionRequests();

    } catch (error) {

      console.error("Send connection request failed:", error);



      setSendError(getConnectionErrorMessage(error));

    } finally {

      setSending(false);

    }

  }



  async function handleAcceptConnectionRequest(request) {

    const connectionRequestId = request?.connectionRequestId;



    if (!connectionRequestId) {

      return;

    }



    setConnectionActionId(connectionRequestId);

    setConnectionError("");

    setConnectionSuccess("");



    try {

      // PUT /api/connections/requests/{id}/accept

      const result = await acceptConnectionRequest(connectionRequestId);



      setConnectionSuccess(

        `Ðã d?ng ý k?t n?i v?i ${

          request?.senderName ?? "ngu?i g?i"

        }.`

      );



      await openChatWithConversation(result?.conversationId);



      await fetchConnectionRequests();

    } catch (error) {

      console.error("Accept connection request failed:", error);



      setConnectionError(

        getConnectionActionErrorMessage(error)

      );

    } finally {

      setConnectionActionId(null);

    }

  }



  // M? trang Messenger và ch?n ngay conversation

  // v?a du?c t?o/k?t n?i khi Accept thành công.

  async function openChatWithConversation(conversationId) {

    if (!conversationId) {

      return;

    }



    // Chuy?n trang và reset state d? refetch conversation list.

    setPage("messenger");

    setError("");

    setSuccess("");

    setSelectedConversation(null);

    setSelectedConversationId(null);

    setConversationDetail(null);

    setConversationDetailError("");

    setMessages([]);

    setMessagesError("");



    // Ð?m b?o danh sách conversation dã du?c d?ng b? nh?m

    // tìm conversation v?a m?i t?o (theo conversationId).

    const list = await fetchConversations();



    const found = list.find(

      (c) => String(c?.conversationId) === String(conversationId)

    );



    await handleSelectConversation(

      found || { conversationId: conversationId }

    );

  }



  async function handleRejectConnectionRequest(request) {

    const connectionRequestId = request?.connectionRequestId;



    if (!connectionRequestId) {

      return;

    }



    setConnectionActionId(connectionRequestId);

    setConnectionError("");

    setConnectionSuccess("");



    try {

      // PUT /api/connections/requests/{id}/reject

      await rejectConnectionRequest(connectionRequestId);



      setConnectionSuccess(

        `Ðã t? ch?i yêu c?u k?t n?i t? ${

          request?.senderName ?? "ngu?i g?i"

        }.`

      );



      await fetchConnectionRequests();

    } catch (error) {

      console.error("Reject connection request failed:", error);



      setConnectionError(

        getConnectionActionErrorMessage(error)

      );

    } finally {

      setConnectionActionId(null);

    }

  }



  function getConnectionActionErrorMessage(error) {

    if (error.status === 403) {

      return "Ch? ngu?i nh?n yêu c?u m?i du?c th?c hi?n thao tác này.";

    }



    if (error.status === 404) {

      return "Yêu c?u k?t n?i không t?n t?i.";

    }



    if (error.status === 409) {

      return "Yêu c?u này không còn ? tr?ng thái ch?.";

    }



    return error.message || "Không th? x? lý yêu c?u k?t n?i.";

  }



  // =====================================================

  // MESSENGER (MODULE 5 / BATCH 2)

  // =====================================================



  async function fetchConversations() {

    setConversationsLoading(true);

    setConversationsError("");



    try {

      // GET /api/conversations

      const data = await getConversations();



      const list = Array.isArray(data) ? data : [];



      setConversations(list);



      // Tr? v? danh sách d? caller (m? Chat sau Accept)

      // có th? tìm conversation m?i t?o mà không ch? render l?i.

      return list;

    } catch (error) {

      console.error("Fetch conversations failed:", error);



      setConversations([]);



      setConversationsError(

        error.message ||

          "Không th? t?i danh sách cu?c trò chuy?n."

      );



      return [];

    } finally {

      setConversationsLoading(false);

    }

  }



  function showMessenger() {

    setPage("messenger");



    setError("");

    setSuccess("");



    setSelectedConversation(null);

    setSelectedConversationId(null);

    setConversationDetail(null);

    setConversationDetailError("");

    setMessages([]);

    setMessagesError("");



    fetchConversations();

  }



  // Ch?n cu?c trò chuy?n: t?i chi ti?t (participant)

  // và l?ch s? tin nh?n t? Backend.

  async function handleSelectConversation(conversation) {

    const conversationId = conversation?.conversationId;



    if (!conversationId) {

      return;

    }



    setSelectedConversation(conversation);

    setSelectedConversationId(conversationId);



    setConversationDetail(null);

    setConversationDetailError("");



    setMessages([]);

    setMessagesError("");



    setConversationDetailLoading(true);

    setMessagesLoading(true);



    try {

      // GET /api/conversations/{id}

      const detail = await getConversation(conversationId);



      setConversationDetail(detail);

    } catch (error) {

      console.error(

        "Fetch conversation detail failed:",

        error

      );



      setConversationDetail(null);



      setConversationDetailError(

        error.status === 403

          ? "B?n không ph?i participant c?a cu?c trò chuy?n này."

          : error.message ||

            "Không th? t?i chi ti?t cu?c trò chuy?n."

      );

    } finally {

      setConversationDetailLoading(false);

    }



    try {

      // GET /api/conversations/{conversationId}/messages

      const data = await getConversationMessages(conversationId);



      setMessages(Array.isArray(data) ? data : []);

      // Đánh dấu tin nhắn đã đọc và reset unreadCount
      try {
        await markMessagesAsRead(conversationId);

        setConversations((previous) =>
          previous.map((c) => {
            if (
              String(c?.conversationId ?? "") !== conversationId
            ) {
              return c;
            }

            return {
              ...c,
              unreadCount: 0,
            };
          })
        );
      } catch (markError) {
        console.error("Mark messages as read failed:", markError);
      }

    } catch (error) {

      console.error("Fetch messages failed:", error);



      setMessages([]);



      setMessagesError(

        error.status === 403

          ? "B?n không ph?i participant c?a cu?c trò chuy?n này."

          : error.message ||

            "Không th? t?i l?ch s? tin nh?n."

      );

    } finally {

      setMessagesLoading(false);

    }

  }



  // =====================================================

  // SIGNALR CHAT (MODULE 5 / BATCH 3)

  // =====================================================



  // Nh?n tin nh?n realtime t? /hubs/chat.

  // Tin nh?n dã du?c Hub luu DB tru?c khi broadcast,

  // nên ngu?i nh?n offline v?n xem du?c history.

  function handleReceiveMessage(message) {

    if (!message?.conversationId) {

      return;

    }



    const conversationId = String(message.conversationId);



    // Tin nh?n thu?c cu?c trò chuy?n dang m?

    // ? thêm vào l?ch s? tin nh?n hi?n th?.

    setMessages((previous) => {

      if (

        String(selectedConversationIdRef.current ?? "") !==

        conversationId

      ) {

        return previous;

      }



      // Không thêm trùng tin nh?n dã có.

      if (

        previous.some(

          (item) =>

            String(item?.messageId ?? "") ===

            String(message.messageId ?? "")

        )

      ) {

        return previous;

      }



      return [

        ...previous,

        {

          messageId: message.messageId,

          senderId: message.senderId,

          senderName: message.senderName,

          content: message.content,

          sentAt: message.sentAt,

        },

      ];

    });



    // C?p nh?t tin nh?n cu?i / s? tin nh?n

    // chua d?c trong danh sách cu?c trò chuy?n.

    setConversations((previous) =>

      previous.map((conversation) => {

        if (

          String(conversation?.conversationId ?? "") !==

          conversationId

        ) {

          return conversation;

        }



        return {

          ...conversation,

          lastMessage: message.content,

          lastMessageAt: message.sentAt,

          unreadCount:

            String(selectedConversationIdRef.current ?? "") ===

            conversationId

              ? Number(conversation?.unreadCount ?? 0)

              : Number(conversation?.unreadCount ?? 0) + 1,

        };

      })

    );

  }



  // Nh?n thông báo realtime t? /hubs/chat (matching notification).



  function handleReceiveNotification(notification) {

    if (!notification) {

      return;

    }



    const newNotification = {

      notificationId: notification.id ?? notification.notificationId,

      type: notification.type,

      title: notification.title,

      message: notification.message,

      relatedId: notification.relatedId,

      isRead: false,

      createdAt: notification.createdAt || new Date().toISOString(),

    };



    // Thêm vào đầu danh sách thông báo, tránh trùng.

    setNotifications((previous) => {

      const exists = previous.some((item) => String(item?.notificationId ?? item?.id) === String(newNotification.notificationId));

      if (exists) return previous;

      return [newNotification, ...previous];

    });



    // Tăng số lượng chưa đọc.

    setUnreadCount((prev) => prev + 1);

  }



  // G?i tin nh?n realtime qua SignalR /hubs/chat.

  // Ngu?i g?i l?y t? JWT trên Hub, không g?i t? client.

  async function handleSendMessage(content) {

    const conversationId = selectedConversationIdRef.current;



    if (

      !chatConnection ||

      !conversationId ||

      !content ||

      sendingMessage

    ) {

      return;

    }



    setSendingMessage(true);

    setMessagesError("");



    try {

      await chatConnection.invoke(

        "SendMessage",

        conversationId,

        content

      );

    } catch (error) {

      console.error("Send message failed:", error);



      setMessagesError(

        "Không th? g?i tin nh?n. Vui lòng th? l?i."

      );

    } finally {

      setSendingMessage(false);

    }

  }



  // =====================================================

  // NOTIFICATIONS (MODULE 5 / BATCH 4)

  // =====================================================



  async function fetchNotifications() {

    setNotificationsLoading(true);

    setNotificationsError("");



    try {

      // GET /api/notifications

      const data = await getNotifications();



      setNotifications(Array.isArray(data) ? data : []);

    } catch (error) {

      console.error("Fetch notifications failed:", error);



      setNotifications([]);



      setNotificationsError(

        error.message || "Không th? t?i thông báo."

      );

    } finally {

      setNotificationsLoading(false);

    }

  }



  async function fetchUnreadNotifications() {

    try {

      // GET /api/notifications/unread

      const data = await getUnreadNotifications();



      setUnreadCount(Number(data?.unreadCount ?? 0) || 0);

    } catch (error) {

      console.error(

        "Fetch unread notifications failed:",

        error

      );

    }

  }



  function handleToggleNotifications() {

    setNotificationsOpen((open) => {

      const nextOpen = !open;



      if (nextOpen) {

        fetchNotifications();

        fetchUnreadNotifications();

      }



      return nextOpen;

    });

  }



  async function handleOpenNotification(notification) {

    const notificationId = notification?.notificationId;



    if (!notificationId) {

      return;

    }



    setNotificationActionId(notificationId);



    try {

      // PUT /api/notifications/{id}/read

      await markNotificationAsRead(notificationId);



      setNotifications((previous) =>

        previous.map((item) =>

          String(item?.notificationId ?? "") ===

          String(notificationId)

            ? { ...item, isRead: true }

            : item

        )

      );



      await fetchUnreadNotifications();

    } catch (error) {

      console.error(

        "Mark notification as read failed:",

        error

      );

    }



    // N?u thông báo liên quan d?n bài dang c?ng d?ng,

    // di?u hu?ng d?n trang c?ng d?ng và nh?n nhá bài dang dó.

    const relatedId = notification?.relatedId;

    if (notification?.type === "ConnectionRequest") {
      setPage("connections");
      setConnectionMode("received");
      setConnectionSuccess("");
      setConnectionError("");
      setSendError("");
      setReceiverId("");
      await fetchConnectionRequests();
      setNotificationActionId(null);
      return;
    }

    if (notification?.type === "Claim") {
      // Thông báo yêu cầu nhận đồ thất lạc: điều hướng đến trang MESSENGER → Kết nối (ConnectionRequests.jsx).
      setPage("connections");
      setConnectionMode("received");
      setConnectionSuccess("");
      setConnectionError("");
      setSendError("");
      setReceiverId("");
      await fetchConnectionRequests();
      setNotificationActionId(null);
      return;
    }

    const isPostRelated =

      notification?.type === "LostFoundMatch" ||
      notification?.type === "ReportReceived" ||
      notification?.type === "StudyMatch" ||
      notification?.type === "RoomMatch";

    if (isPostRelated && relatedId) {

      showAllPosts(relatedId);
    }


    setNotificationActionId(null);

  }



  async function handleMarkAllNotificationsAsRead() {

    setNotificationActionId("all");



    try {

      // PUT /api/notifications/read-all

      await markAllNotificationsAsRead();



      setNotifications((previous) =>

        previous.map((item) => ({

          ...item,

          isRead: true,

        }))

      );



      setUnreadCount(0);

    } catch (error) {

      console.error(

        "Mark all notifications as read failed:",

        error

      );

    } finally {

      setNotificationActionId(null);

    }

  }



  // =====================================================

  // KHO TÀI LI?U & SÁCH (MODULE 4 / BATCH 1)

  // =====================================================



  // Các hàm x? lý Library c?a Module 4

  // ti?p t?c d?t bên du?i ph?n này.========



  async function fetchBooks(mode, filters) {



    setBooksLoading(true);



    setBooksError("");



    const activeFilters = filters ?? bookFilters;



    try {



      // GET /api/library/books (có search/status)

      // ho?c GET /api/library/books/me

      const data =

        mode === "mine"

          ? await getMyBooks()

          : await getBooks(activeFilters);



      setBooks(data);



    } catch (error) {



      console.error(



        "Fetch books failed:",



        error



      );



      setBooks([]);



      setBooksError(



        error.message ||



        "Không th? t?i sàn d?i sách."



      );



    } finally {



      setBooksLoading(false);



    }



  }





  async function fetchBookMatches() {



    setBookMatchesLoading(true);



    setBookMatchesError("");



    try {



      // GET /api/library/books/exchange-matches

      const data = await getExchangeMatches();



      setBookMatches(data);



    } catch (error) {



      console.error(



        "Fetch exchange matches failed:",



        error



      );



      setBookMatches([]);



      setBookMatchesError(



        error.message ||



        "Không th? t?i chu?i d?i sách."



      );



    } finally {



      setBookMatchesLoading(false);



    }



  }





  function showLibrary() {



    setPage("library");



    setError("");



    setSuccess("");



    setBooksSuccess("");



    setDocumentsSuccess("");



    setBookFormOpen(false);



    setBookDetailOpen(false);



    setDocumentFormOpen(false);



    setDocumentDetailOpen(false);



    fetchBooks(libraryMode);



    fetchBookMatches();



    fetchDocuments(documentMode);



  }





  // Chuy?n gi?a sàn d?i sách và kho tài li?u s?.

  function handleChangeLibrarySection(section) {



    const targetSection = section === "documents"

      ? "documents"

      : "books";



    setLibrarySection(targetSection);



    setBooksSuccess("");



    setDocumentsSuccess("");



    setBookFormOpen(false);



    setBookDetailOpen(false);



    setDocumentFormOpen(false);



    setDocumentDetailOpen(false);



    if (targetSection === "documents") {

      fetchDocuments(documentMode);

    } else {

      fetchBooks(libraryMode);

      fetchBookMatches();

    }



  }





  // Chuy?n gi?a t?t c? bài dang và bài dang c?a tôi.

  function handleChangeLibraryMode(mode) {



    const targetMode = mode || "all";



    setLibraryMode(targetMode);



    setBooksSuccess("");



    setBookFormOpen(false);



    setBookDetailOpen(false);



    fetchBooks(targetMode);



  }





  // B? l?c ch? áp d?ng cho GET /api/library/books.

  function handleBookFilterChange(nextFilters) {



    const filters = {



      search: nextFilters.search ?? "",



      status: nextFilters.status ?? "",



    };



    setBookFilters(filters);



    setBooksSuccess("");



    fetchBooks("all", filters);



  }





  function handleResetBookFilters() {



    const filters = {



      search: "",



      status: "",



    };



    setBookFilters(filters);



    setBooksSuccess("");



    fetchBooks(libraryMode, filters);



  }





  function openBookForm(book) {



    setEditingBook(book || null);



    setBookFormOpen(true);



    setBooksError("");



    setBooksSuccess("");



    setBookDetailOpen(false);



  }





  function closeBookForm() {



    setBookFormOpen(false);



    setEditingBook(null);



  }





  async function handleSubmitBook(formData) {



    setBooksSaving(true);



    setBooksError("");



    setBooksSuccess("");



    try {



      if (editingBook) {



        // PUT /api/library/books/{id}

        await updateBook(editingBook.id, formData);



        setBooksSuccess("Bài d?i sách dã du?c c?p nh?t.");



      } else {



        // POST /api/library/books

        await createBook(formData);



        setBooksSuccess("Bài d?i sách dã du?c dang.");



      }



      closeBookForm();



      await fetchBooks(libraryMode);



      await fetchBookMatches();



    } catch (error) {



      console.error(



        "Save book error:",



        error



      );



      setBooksError(getBookErrorMessage(error));



    } finally {



      setBooksSaving(false);



    }



  }





  async function handleDeleteBook(book) {



    const confirmed = window.confirm(

      "Xóa bài d?i sách này? Hành d?ng không th? hoàn tác."

    );



    if (!confirmed) {

      return;

    }



    setBooksSaving(true);



    setBooksError("");



    setBooksSuccess("");



    try {



      // DELETE /api/library/books/{id}

      await deleteBook(book.id);



      setBookDetailOpen(false);



      setBooksSuccess("Bài d?i sách dã du?c xóa.");



      await fetchBooks(libraryMode);



      await fetchBookMatches();



    } catch (error) {



      console.error(



        "Delete book error:",



        error



      );



      setBooksError(getBookErrorMessage(error));



    } finally {



      setBooksSaving(false);



    }



  }





  function getBookErrorMessage(error) {



    if (error.status === 403) {

      return "B?n không ph?i ch? c?a bài d?i sách này.";

    }



    if (error.status === 404) {

      return "Không tìm th?y bài d?i sách.";

    }



    if (error.status === 400) {

      return "D? li?u không h?p l?, vui lòng ki?m tra l?i.";

    }



    return error.message || "Thao tác v?i bài d?i sách th?t b?i.";

  }



  async function handleOpenBookDetail(bookId) {



    // Ði?u hu?ng t? Sàn d?i sách sang trang C?ng d?ng (T?t c? bài dang)

    // và hi?n th? bài dang tuong ?ng (dùng LibraryPostId d? kh?p).

    setPage("posts");



    setPostMode("all");



    setError("");



    setSuccess("");



    setPostsSuccess("");



    setPostFormOpen(false);



    setDetailOpen(false);



    setTargetPostId(bookId);



    setTargetPostHighlight(true);



    setPostsLoading(true);



    setPostsError("");



    try {



      // GET /api/posts — t?t c? bài dang c?ng d?ng.

      const data = await getPosts({});



      setPosts(data);



      setPostLikes(await loadPostLikes(data));



      // T?i kèm danh sách yêu c?u k?t n?i cho nút "Yêu c?u k?t n?i".

      fetchConnectionRequests();



      // Tìm bài dang c?ng d?ng liên k?t v?i bài d?i sách này

      // qua LibraryPostId, r?i m? chi ti?t trên trang C?ng d?ng.

      const communityPost = (data ?? []).find(

        (p) => String(p?.libraryPostId ?? p?.LibraryPostId) === String(bookId)

      );



      if (communityPost) {

        handleOpenPostDetail(communityPost.id ?? communityPost.Id);

      }



    } catch (error) {



      console.error("Open book detail from library failed:", error);



      setPosts([]);



      setPostLikes({});



      setPostsError(



        error.message ||



        "Không th? m? chi ti?t bài dang."



      );



    } finally {



      setPostsLoading(false);



    }



  }





  // M? chi ti?t bài dang t? danh sách Exchange Match.

  function handleOpenBookMatch(match) {



    handleOpenBookDetail(match?.matchedPostId);



  }





  function closeBookDetail() {



    setBookDetailOpen(false);



    setBookDetail(null);



  }





  // =====================================================

  // TÀI LI?U S? (MODULE 4 / BATCH 2)

  // =====================================================



  async function fetchDocuments(mode, filters) {



    setDocumentsLoading(true);



    setDocumentsError("");



    const activeFilters = filters ?? documentFilters;



    try {



      // "mine" = GET /api/library/documents/me

      // "free" | "paid" = GET /api/library/documents?pricing=...

      // "all" = GET /api/library/documents (có search / subject / pricing)

      const targetMode = mode || "all";



      let data;



      if (targetMode === "mine") {



        data = await getMyDocuments();



      } else {



        data = await getDocuments({

          ...activeFilters,



          pricing:

            targetMode === "free"

              ? "Free"

              : targetMode === "paid"

                ? "Paid"

                : activeFilters.pricing,

        });



      }



      setDocuments(data);



    } catch (error) {



      console.error(



        "Fetch documents failed:",



        error



      );



      setDocuments([]);



      setDocumentsError(



        error.message ||



        "Không th? t?i kho tài li?u."



      );



    } finally {



      setDocumentsLoading(false);



    }



  }





  // Chuy?n gi?a t?t c? / mi?n phí / tr? phí / c?a tôi.

  function handleChangeDocumentMode(mode) {



    const targetMode = mode || "all";



    setDocumentMode(targetMode);



    setDocumentsSuccess("");



    setDocumentFormOpen(false);



    setDocumentDetailOpen(false);



    fetchDocuments(targetMode);



  }





  // B? l?c ch? áp d?ng cho GET /api/library/documents.

  function handleDocumentFilterChange(nextFilters) {



    const filters = {



      search: nextFilters.search ?? "",



      subject: nextFilters.subject ?? "",



      pricing: nextFilters.pricing ?? "",



    };



    setDocumentFilters(filters);



    setDocumentsSuccess("");



    if (documentMode === "mine") {

      return;

    }



    // pricing dã du?c ch?n qua chip Tài li?u nên

    // d?t l?i v? r?ng d? không l?c trùng hai l?n.

    if (filters.pricing) {

      setDocumentMode("all");

      fetchDocuments("all", {

        ...filters,

        pricing: "",

      });

      return;

    }



    fetchDocuments(documentMode, filters);



  }





  function handleResetDocumentFilters() {



    const filters = {



      search: "",



      subject: "",



      pricing: "",



    };



    setDocumentFilters(filters);



    setDocumentsSuccess("");



    fetchDocuments(documentMode, filters);



  }





  function openDocumentForm(document) {



    setEditingDocument(document || null);



    setDocumentFormOpen(true);



    setDocumentsError("");



    setDocumentsSuccess("");



    setDocumentDetailOpen(false);



  }





  function closeDocumentForm() {



    setDocumentFormOpen(false);



    setEditingDocument(null);



  }





  async function handleSubmitDocument(formData) {



    setDocumentsSaving(true);



    setDocumentsError("");



    setDocumentsSuccess("");



    try {



      if (editingDocument) {



        // PUT /api/library/documents/{id}  — ch? s?a metadata.

        await updateDocument(editingDocument.id, formData);



        setDocumentsSuccess("Tài li?u dã du?c c?p nh?t.");



      } else {



        // POST /api/library/documents  — multipart/form-data.

        await createDocument(formData);



        setDocumentsSuccess("Tài li?u dã du?c dang t?i.");



      }



      closeDocumentForm();



      await fetchDocuments(documentMode);



    } catch (error) {



      console.error(



        "Save document error:",



        error



      );



      setDocumentsError(getDocumentErrorMessage(error));



    } finally {



      setDocumentsSaving(false);



    }



  }





  async function handleDeleteDocument(document) {



    const confirmed = window.confirm(

      "Xóa tài li?u này? File t?i lên cung s? b? xóa và không th? khôi ph?c."

    );



    if (!confirmed) {

      return;

    }



    setDocumentsSaving(true);



    setDocumentsError("");



    setDocumentsSuccess("");



    try {



      // DELETE /api/library/documents/{id}

      await deleteDocument(document.id);



      setDocumentDetailOpen(false);



      setDocumentsSuccess("Tài li?u dã du?c xóa.");



      await fetchDocuments(documentMode);



    } catch (error) {



      console.error(



        "Delete document error:",



        error



      );



      setDocumentsError(getDocumentErrorMessage(error));



    } finally {



      setDocumentsSaving(false);



    }



  }





  function getDocumentErrorMessage(error) {



    if (error.status === 403) {

      return "B?n không ph?i ch? c?a tài li?u này.";

    }



    if (error.status === 404) {

      return "Không tìm th?y tài li?u.";

    }



    // Backend tr? v? nguyên nhân c? th? cho file l?i.

    if (error.status === 400) {

      return (

        error.message ||



        "Tài li?u không h?p l?, vui lòng ki?m tra l?i file."

      );

    }



    return error.message || "Thao tác v?i tài li?u th?t b?i.";

  }





  async function handleOpenDocumentDetail(documentId) {



    setDocumentDetailOpen(true);



    setDocumentDetailLoading(true);



    setDocumentDetailError("");



    setDocumentDetail(null);



    setDocumentFormOpen(false);



    resetDocumentReviews();



    try {



      // GET /api/library/documents/{id}

      const data = await getDocumentById(documentId);



      setDocumentDetail(data);



      // GET /api/library/documents/{id}/reviews

      await fetchDocumentReviews(documentId);



    } catch (error) {



      console.error(



        "Fetch document detail failed:",



        error



      );



      setDocumentDetailError(getDocumentErrorMessage(error));



    } finally {



      setDocumentDetailLoading(false);



    }



  }





  function closeDocumentDetail() {



    setDocumentDetailOpen(false);



    setDocumentDetail(null);



    setDocumentDownloadError("");



    setDocumentDownloadSuccess("");



    resetDocumentReviews();



  }





  // GET /api/library/documents/{id}/download

  // Tài li?u mi?n phí t?i th?ng, tài li?u tr? phí Backend

  // ki?m tra di?m r?i m?i tr? file dã dóng d?u watermark.

  async function handleDownloadDocument(document) {



    if (!document?.id) {



      return;



    }



    setDownloadingDocumentId(document.id);



    setDocumentDownloadError("");



    setDocumentDownloadSuccess("");



    try {



      const result = await downloadDocument(document.id);



      saveDownloadedFile(

        result,

        document.fileName

      );



      setDocumentDownloadSuccess(

        document.pricingType === "Paid"

          ? `Ðã t?i tài li?u, dã tr? ${document.price} di?m.`

          : "Ðã t?i tài li?u, file du?c dóng d?u watermark."

      );



    } catch (error) {



      console.error("Download document failed:", error);



      setDocumentDownloadError(

        getDocumentDownloadErrorMessage(error)

      );



    } finally {



      setDownloadingDocumentId("");



    }



  }





  function getDocumentDownloadErrorMessage(error) {



    if (error.status === 404) {

      return "Tài li?u ho?c file tài li?u không còn t?n t?i.";

    }



    // Backend tr? v? nguyên nhân c? th? cho tài li?u tr? phí.

    if (error.status === 400) {

      return (

        error.message ||

        "B?n không d? di?m d? t?i tài li?u này."

      );

    }



    if (error.status === 409) {

      return (

        error.message ||

        "H? th?ng di?m chua s?n sàng, chua th? t?i tài li?u tr? phí."

      );

    }



    if (error.status === 401) {

      return "Phiên dang nh?p dã h?t h?n, vui lòng dang nh?p l?i.";

    }



    return (

      error.message ||

      "T?i tài li?u th?t b?i, vui lòng th? l?i."

    );



  }





  // =====================================================

  // ÐÁNH GIÁ TÀI LI?U (MODULE 4 / BATCH 4)

  // =====================================================



  // GET /api/library/documents/{id}/reviews

  async function fetchDocumentReviews(documentId) {



    if (!documentId) {

      return;

    }



    setDocumentReviewsLoading(true);



    setDocumentReviewsError("");



    try {



      const data = await getDocumentReviews(documentId);



      setDocumentReviews(data);



    } catch (error) {



      console.error("Fetch document reviews failed:", error);



      setDocumentReviews([]);



      setDocumentReviewsError(

        getDocumentReviewErrorMessage(error)

      );



    } finally {



      setDocumentReviewsLoading(false);



    }



  }





  // Xóa tr?ng thái dánh giá khi dóng ho?c d?i tài li?u dang xem.

  function resetDocumentReviews() {



    setDocumentReviews([]);



    setDocumentReviewsError("");



    setDocumentReviewsSuccess("");



    setDocumentReviewFormError("");



    setEditingDocumentReviewId(null);



    setDeletingDocumentReviewId(null);



  }





  function getDocumentReviewErrorMessage(error) {



    if (error.status === 403) {

      return "B?n không ph?i ngu?i vi?t dánh giá này.";

    }



    if (error.status === 404) {

      return "Không tìm th?y tài li?u ho?c dánh giá.";

    }



    // Backend tr? v? nguyên nhân c? th? khi di?m không h?p l?.

    if (error.status === 400) {

      return (

        error.message ||

        "Ði?m dánh giá ph?i n?m trong kho?ng 1 d?n 5."

      );

    }



    // M?i ngu?i ch? dánh giá m?t tài li?u dúng m?t l?n.

    if (error.status === 409) {

      return (

        error.message ||

        "B?n dã dánh giá tài li?u này r?i, hãy s?a dánh giá c?a b?n."

      );

    }



    return error.message || "Thao tác v?i dánh giá th?t b?i.";



  }





  // Backend tr? kèm di?m trung bình và s? dánh giá m?i

  // sau khi t?o / s?a review.

  function applyDocumentRatingSummary(rating, reviewCount) {



    setDocumentDetail((previous) =>

      previous

        ? {

            ...previous,

            rating: Number(rating ?? 0),

            reviewCount: Number(reviewCount ?? 0),

          }

        : previous

    );



  }





  // Xóa review ch? tr? message nên t?i l?i chi ti?t tài li?u

  // d? c?p nh?t di?m trung bình và s? dánh giá.

  async function refreshDocumentRatingSummary(documentId) {



    if (!documentId) {

      return;

    }



    try {



      const data = await getDocumentById(documentId);



      setDocumentDetail((previous) =>

        previous?.id === data?.id ? data : previous

      );



    } catch (error) {



      console.error(

        "Refresh document rating failed:",

        error

      );



    }



  }





  function handleEditDocumentReview(review) {



    setEditingDocumentReviewId(review?.id ?? null);



    setDocumentReviewsSuccess("");



    setDocumentReviewFormError("");



  }





  function handleCancelEditDocumentReview() {



    setEditingDocumentReviewId(null);



    setDocumentReviewFormError("");



  }





  // POST /api/library/documents/{id}/reviews

  async function handleSubmitDocumentReview(formData) {



    const documentId = documentDetail?.id;



    if (!documentId) {

      return;

    }



    setDocumentReviewsSaving(true);



    setDocumentReviewsSuccess("");



    setDocumentReviewFormError("");



    try {



      const data = await createDocumentReview(

        documentId,

        formData

      );



      setDocumentReviewsSuccess(

        "Ðã ghi nh?n dánh giá c?a b?n."

      );



      applyDocumentRatingSummary(

        data?.documentRating,

        data?.documentReviewCount

      );



      await fetchDocumentReviews(documentId);



    } catch (error) {



      console.error("Create document review failed:", error);



      setDocumentReviewFormError(

        getDocumentReviewErrorMessage(error)

      );



    } finally {



      setDocumentReviewsSaving(false);



    }



  }





  // PUT /api/library/reviews/{reviewId}

  async function handleSubmitEditDocumentReview(formData) {



    const reviewId = editingDocumentReviewId;



    const documentId = documentDetail?.id;



    if (!reviewId || !documentId) {

      return;

    }



    setDocumentReviewsSaving(true);



    setDocumentReviewsSuccess("");



    setDocumentReviewFormError("");



    try {



      const data = await updateDocumentReview(

        reviewId,

        formData

      );



      setEditingDocumentReviewId(null);



      setDocumentReviewsSuccess(

        "Ðánh giá c?a b?n dã du?c c?p nh?t."

      );



      applyDocumentRatingSummary(

        data?.documentRating,

        data?.documentReviewCount

      );



      await fetchDocumentReviews(documentId);



    } catch (error) {



      console.error("Update document review failed:", error);



      setDocumentReviewFormError(

        getDocumentReviewErrorMessage(error)

      );



    } finally {



      setDocumentReviewsSaving(false);



    }



  }





  // DELETE /api/library/reviews/{reviewId}

  async function handleDeleteDocumentReview(review) {



    if (!review?.id) {

      return;

    }



    const confirmed = window.confirm(

      "Xóa dánh giá c?a b?n? Hành d?ng không th? hoàn tác."

    );



    if (!confirmed) {

      return;

    }



    const documentId = documentDetail?.id;



    setDeletingDocumentReviewId(review.id);



    setDocumentReviewsSuccess("");



    setDocumentReviewFormError("");



    try {



      await deleteDocumentReview(review.id);



      if (editingDocumentReviewId === review.id) {



        setEditingDocumentReviewId(null);



      }



      setDocumentReviewsSuccess("Ðánh giá dã du?c xóa.");



      await refreshDocumentRatingSummary(documentId);



      await fetchDocumentReviews(documentId);



    } catch (error) {



      console.error("Delete document review failed:", error);



      setDocumentReviewFormError(

        getDocumentReviewErrorMessage(error)

      );



    } finally {



      setDeletingDocumentReviewId(null);



    }



  }





  // =====================================================

  // RENDER

  // =====================================================



  return (



    <>



      {/* ================================================

          TRANG ĐĂNG NHẬP

      ================================================= */}



      {page === "login" && (



        <main className="auth-page">



          <div className="auth-background-shape shape-one" />



          <div className="auth-background-shape shape-two" />





          <SiteHeader />





          <section className="auth-layout">



            {/* LEFT */}



            <div className="welcome-panel">



              <span className="eyebrow">

                CAMPUS LIFE, CONNECTED

              </span>



              <h1>

                Kết nối sinh viên.

                <br />



                <span>

                  Chia sẻ cơ hội.

                </span>

              </h1>



              <p>

                Một không gian dành cho sinh viên

                để tìm bạn học, chia sẻ tài liệu

                và kết nối cuộc sống trong khuôn viên trường.

              </p>



            </div>





            {/* RIGHT */}



            <div className="auth-panel">



              {loading && (



                <div className="loading-banner">

                  Ðang x? lý...

                </div>



              )}





              {/* LOGIN */}



              {page === "login" && (



                <LoginForm

                  onLogin={handleLogin}

                  onSwitchToRegister={showRegister}

                  loading={loading}

                  error={error}

                />



              )}



            </div>



          </section>





          {success && (



            <div className="message message-success auth-success-message">

              {success}

            </div>



          )}





          <footer className="site-footer">

            CampusEcomSystemMini · Student & Campus Utility

          </footer>



        </main>



      )}





      {/* ================================================

          TRANG ÐANG KÝ

      ================================================= */}



      {page === "register" && (



        <main className="auth-page">



          <div className="auth-background-shape shape-one" />



          <div className="auth-background-shape shape-two" />





          <SiteHeader />





          <section className="auth-layout">



            {/* LEFT */}



            <div className="welcome-panel">



              <span className="eyebrow">

                JOIN THE COMMUNITY

              </span>



              <h1>



                T?o tài kho?n.

                <br />



                <span>

                  K?t n?i campus.

                </span>



              </h1>



              <p>

                Ðang ký tài kho?n d? b?t d?u

                s? d?ng các ti?n ích dành cho sinh viên.

              </p>



            </div>





            {/* RIGHT */}



            <div className="auth-panel">



              {loading && (



                <div className="loading-banner">

                  Ðang x? lý...

                </div>



              )}





              <RegisterForm

                onRegister={handleRegister}

                onSwitchToLogin={showLogin}

                loading={loading}

                error={error}

                success=""

              />



            </div>



          </section>





          <footer className="site-footer">

            CampusEcomSystemMini · Student & Campus Utility

          </footer>



        </main>



      )}





      {/* ================================================

          TRANG CH?

      ================================================= */}

       {page === "home" && user && (



<HomePage

            user={user}

            onLogout={handleLogout}

            onGoHome={showHome}

            onViewProfile={showProfile}

            onSetupPreferences={showPreferences}

            onViewMyPosts={showMyPosts}

            onOpenAllPosts={showAllPosts}

            onOpenMatching={showSmartMatching}

            onOpenLostFound={showLostFound}

            onOpenMessenger={showMessenger}

            onOpenLibrary={showLibrary}

            unreadCount={unreadCount}

          />



       )}





       {/* ================================================

           TRANG SMART MATCHING

       ================================================= */}



       {page === "smart-matching" && user && (



         <main className="auth-page">



           <div className="auth-background-shape shape-one" />



           <div className="auth-background-shape shape-two" />





           <SiteHeader onGoHome={showHome} onLogout={handleLogout} />





           <section className="pref-main">



<SmartMatching

                mode={matchingMode}
                preferences={preferences}

                onChangeMode={handleChangeMatchingMode}

                matches={matches}

                loading={matchesLoading}

                error={matchesError}

                detailOpen={matchDetailOpen}

                detail={matchDetail}

                detailLoading={matchDetailLoading}

                detailError={matchDetailError}

                onOpenDetail={(postId) => {

                  if (!postId) {

                    return;

                  }

                  setPage("posts");

                  setPostMode("all");

                  setError("");

                  setSuccess("");

                  setPostsSuccess("");

                  setPostFormOpen(false);

                  setTargetPostId(postId);

                  setTargetPostHighlight(true);

                  fetchPosts("all");

                  handleOpenPostDetail(postId);

                }}

                onCloseDetail={closeMatchDetail}

                roomMatches={roomMatches}

                roomLoading={roomMatchesLoading}

                roomError={roomMatchesError}

                roomDetailOpen={roomMatchDetailOpen}

                roomDetail={roomMatchDetail}

                roomDetailLoading={roomMatchDetailLoading}

                roomDetailError={roomMatchDetailError}

                onOpenRoomDetail={(postId) => {

                  if (!postId) {

                    return;

                  }

                  setPage("posts");

                  setPostMode("all");

                  setError("");

                  setSuccess("");

                  setPostsSuccess("");

                  setPostFormOpen(false);

                  setTargetPostId(postId);

                  setTargetPostHighlight(true);

                  fetchPosts("all");

                  handleOpenPostDetail(postId);

                }}

                onCloseRoomDetail={closeRoomMatchDetail}

                onSave={handleSavePreferences}
                onRunStudyMatching={handleRunStudyMatching}
                onRunRoomMatching={handleRunRoomMatching}
                onBack={showHome}
                onCreatePost={(type) => openPostForm(null, type)}

              />



           </section>





           <footer className="site-footer">

             CampusEcomSystemMini · Student & Campus Utility

           </footer>



         </main>



       )}









       {/* ================================================

           TRANG CAMPUS LOST & FOUND

       ================================================= */}



       {page === "lost-found" && user && (



         <main className="auth-page">



           <div className="auth-background-shape shape-one" />



           <div className="auth-background-shape shape-two" />





           <SiteHeader onGoHome={showHome} onLogout={handleLogout} />





           <section className="pref-main">



<LostFoundPage

                filter={lostFoundFilter}

                onFilterChange={handleLostFoundFilterChange}

                items={lostFoundItems}

                loading={lostFoundLoading}

                error={lostFoundError}

                pins={lostFoundPins}

                mapLoading={lostFoundMapLoading}

                mapError={lostFoundMapError}

                user={user}

                secretItem={secretItem}

                secretMode={secretMode}

                secretQuestion={secretQuestion}

                secretLoading={secretLoading}

                secretSaving={secretSaving}

                secretError={secretError}

                onOpenSecretQuestion={handleOpenSecretQuestion}

                onCloseSecretQuestion={closeSecretQuestion}

                onSubmitSecretQuestion={handleSubmitSecretQuestion}

                onAnswerSecretQuestion={handleAnswerSecretQuestion}

                claimItem={claimItem}

                claimQuestion={claimQuestion}

                claimSaving={claimSaving}

                claimError={claimError}

                success={lostFoundSuccess}

                onSubmitClaim={handleSubmitClaim}

                onCloseClaim={closeClaim}

                 claimsItem={claimsItem}

                 claims={claims}

                 claimsLoading={claimsLoading}

                 claimsError={claimsError}

                 claimsActionId={claimsActionId}

                 onOpenClaims={handleOpenClaims}

                 onCloseClaims={closeClaims}

                 onApproveClaim={handleApproveClaim}

                 onRejectClaim={handleRejectClaim}

                 onMarkReturned={handleMarkReturned}

 onBack={showHome}

                 connectionRequests={connectionRequests}

                 connectionSendingId={connectionSendingId}

                 onRequestConnection={handleRequestConnection}

                 onCreate={(type) => openPostForm(null, type)}

                 onViewMatches={handleViewMatches}

                 onViewDetail={handleViewLostFoundDetail}

                 verifiedPostIds={verifiedPostIds}

               />



            </section>





            <footer className="site-footer">

              CampusEcomSystemMini · Student & Campus Utility

            </footer>



          </main>



        )}





       {/* ================================================

    TRANG K?T N?I (MODULE 5 / BATCH 1)

================================================= */}



{page === "connections" && user && (



  <main className="auth-page">



    <div className="auth-background-shape shape-one" />



    <div className="auth-background-shape shape-two" />



    <SiteHeader onGoHome={showHome} onLogout={handleLogout} />



    <section className="pref-main">



      <ConnectionRequests

        mode={connectionMode}

        onChangeMode={handleConnectionModeChange}

        requests={connectionRequests}

        loading={connectionLoading}

        error={connectionError}

        success={connectionSuccess}

        currentUserId={user?.id ?? user?.Id ?? ""}

        actionId={connectionActionId}

        receiverId={receiverId}

        sending={sending}

        sendError={sendError}

        onReceiverIdChange={setReceiverId}

        onSend={handleSendConnectionRequest}

        onAccept={handleAcceptConnectionRequest}

        onReject={handleRejectConnectionRequest}

        onOpenMessenger={showMessenger}

        onBack={showMessenger}

      />



    </section>



    <footer className="site-footer">

      CampusEcomSystemMini · Student & Campus Utility

    </footer>



  </main>



)}



{/* ================================================

    TRANG KHO TÀI LI?U & SÁCH (MODULE 4)

================================================= */}



{page === "library" && user && (



  <main className="auth-page">



    <div className="auth-background-shape shape-one" />



    <div className="auth-background-shape shape-two" />



    <SiteHeader onGoHome={showHome} onLogout={handleLogout} />



    <section className="pref-main">



      <LibraryPage

        section={librarySection}

        onChangeSection={handleChangeLibrarySection}

        count={

          librarySection === "documents"

            ? documents.length

            : books.length

        }

        success={

          librarySection === "documents"

            ? documentsSuccess

            : booksSuccess

        }

        onCreate={() =>

          librarySection === "documents"

            ? openDocumentForm(null)

            : openBookForm(null)

        }

        onBack={showHome}



        bookExchange={{

          mode: libraryMode,

          onChangeMode: handleChangeLibraryMode,

          books,

          user,

          loading: booksLoading,

          saving: booksSaving,

          error: booksError,

          filters: bookFilters,

          onFilterChange: handleBookFilterChange,

          onResetFilters: handleResetBookFilters,

          onEdit: openBookForm,

          onDelete: handleDeleteBook,

          onSubmitBook: handleSubmitBook,

          onOpenDetail: (book) =>

            handleOpenBookDetail(book.id),

          onCloseForm: closeBookForm,

          onCloseDetail: closeBookDetail,

          formOpen: bookFormOpen,

          formBook: editingBook,

          detailOpen: bookDetailOpen,

          detail: bookDetail,

          detailLoading: bookDetailLoading,

          detailError: bookDetailError,

          matches: bookMatches,

          matchesLoading: bookMatchesLoading,

          matchesError: bookMatchesError,

          onOpenMatch: handleOpenBookMatch,

        }}



        documentPanel={{

          mode: documentMode,

          onChangeMode: handleChangeDocumentMode,

          documents,

          user,

          loading: documentsLoading,

          saving: documentsSaving,

          error: documentsError,

          filters: documentFilters,

          onFilterChange: handleDocumentFilterChange,

          onResetFilters: handleResetDocumentFilters,

          onEdit: openDocumentForm,

          onDelete: handleDeleteDocument,

          onSubmitDocument: handleSubmitDocument,

          onOpenDetail: (document) =>

            handleOpenDocumentDetail(document.id),

          onDownload: handleDownloadDocument,

          onCloseForm: closeDocumentForm,

          onCloseDetail: closeDocumentDetail,

          formOpen: documentFormOpen,

          formDocument: editingDocument,

          detailOpen: documentDetailOpen,

          detail: documentDetail,

          detailLoading: documentDetailLoading,

          detailError: documentDetailError,

          downloadingId: downloadingDocumentId,

          downloadError: documentDownloadError,

          downloadSuccess: documentDownloadSuccess,

          reviews: documentReviews,

          reviewsLoading: documentReviewsLoading,

          reviewsError: documentReviewsError,

          reviewsSaving: documentReviewsSaving,

          reviewsSuccess: documentReviewsSuccess,

          reviewFormError: documentReviewFormError,

          editingReviewId: editingDocumentReviewId,

          deletingReviewId: deletingDocumentReviewId,

          onEditReview: handleEditDocumentReview,

          onCancelEditReview: handleCancelEditDocumentReview,

          onDeleteReview: handleDeleteDocumentReview,

          onSubmitReview: handleSubmitDocumentReview,

          onSubmitEditReview: handleSubmitEditDocumentReview,

        }}

      />



    </section>



    <footer className="site-footer">

      CampusEcomSystemMini · Student & Campus Utility

    </footer>



  </main>



)}



        {/* ================================================

            TRANG MESSENGER (MODULE 5 / BATCH 2)

        ================================================= */}



        {page === "messenger" && user && (



          <main className="auth-page">



            <div className="auth-background-shape shape-one" />



            <div className="auth-background-shape shape-two" />



            <SiteHeader onGoHome={showHome} onLogout={handleLogout} />





            <section className="pref-main">



              <MessengerPage

                conversations={conversations}

                loading={conversationsLoading}

                error={conversationsError}

                selectedConversation={selectedConversation}

                selectedConversationId={selectedConversationId}

                detail={conversationDetail}

                detailLoading={conversationDetailLoading}

                detailError={conversationDetailError}

                messages={messages}

                messagesLoading={messagesLoading}

                messagesError={messagesError}

                currentUserId={user?.id ?? user?.Id ?? ""}

                chatConnected={chatConnected}

                sendingMessage={sendingMessage}

                onSendMessage={handleSendMessage}

                unreadCount={unreadCount}

                notifications={notifications}

                notificationsLoading={notificationsLoading}

                notificationsError={notificationsError}

                notificationsOpen={notificationsOpen}

                notificationActionId={notificationActionId}

                onToggleNotifications={handleToggleNotifications}

                onOpenNotification={handleOpenNotification}

                onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}

                onSelectConversation={handleSelectConversation}

                onOpenConnections={showConnections}

                onBack={showHome}

              />



            </section>





            <footer className="site-footer">

              CampusEcomSystemMini · Student & Campus Utility

            </footer>



          </main>



        )}





        {/* ================================================

            TRANG BÀI ÐANG

        ================================================= */}



       {page === "posts" && user && postMode === "all" && (



         <AllPostsPage

           user={user}

           posts={posts}

           loading={postsLoading}

           saving={postsSaving}

           error={postsError}

           success={postsSuccess}

           formOpen={postFormOpen}

           formPost={editingPost}

           detailOpen={detailOpen}

           detailPost={detailPost}

           detailLoading={detailLoading}

           detailError={detailError}

           postLikes={postLikes}

           likingPostId={likingPostId}

           unreadCount={unreadCount}

           filters={postFilters}

           currentUserId={user?.id ?? user?.Id ?? ""}

           connectionRequests={connectionRequests}

           connectionSendingId={connectionSendingId}

           onRequestConnection={handleRequestConnection}

           onFilterChange={handleFilterChange}

           onCreate={() => openPostForm(null)}

           onEdit={openPostForm}

           onDelete={handleDeletePost}

           onToggleLike={handleToggleLike}

           onSubmitPost={handleSubmitPost}

           onOpenDetail={handleOpenPostDetail}

           onCloseForm={closePostForm}

           onCloseDetail={closePostDetail}

           onGoHome={showHome}

           onViewProfile={showProfile}

           onViewMyPosts={showMyPosts}

           onOpenMatching={showSmartMatching}

           onOpenLostFound={showLostFound}

           onOpenLibrary={showLibrary}

            onOpenMessenger={showMessenger}

            onLogout={handleLogout}

           targetPostId={targetPostId}

           targetPostHighlight={targetPostHighlight}

           onClearTargetPost={() => { setTargetPostId(null); setTargetPostHighlight(false); }}

         />



       )}





       {/* ================================================

           BÀI ÐANG C?A TÔI (gi? nguyên giao di?n cu)

       ================================================= */}



       {page === "posts" && user && postMode !== "all" && (



         <main className="auth-page">



           <div className="auth-background-shape shape-one" />



           <div className="auth-background-shape shape-two" />





           <SiteHeader onGoHome={showHome} onLogout={handleLogout} />





           <section className="pref-main">



<PostsPage

                mode={postMode}

                posts={posts}

                user={user}

                loading={postsLoading}

                saving={postsSaving}

                error={postsError}

                success={postsSuccess}

                formOpen={postFormOpen}

                formPost={editingPost}

                detailOpen={detailOpen}

                detailPost={detailPost}

                detailLoading={detailLoading}

                detailError={detailError}

                postLikes={postLikes}

                likingPostId={likingPostId}

                filters={postFilters}

                onFilterChange={handleFilterChange}

                onCreate={() => openPostForm(null)}

                onEdit={openPostForm}

                onDelete={handleDeletePost}

                onToggleLike={handleToggleLike}

                onSubmitPost={handleSubmitPost}

                onOpenDetail={handleOpenPostDetail}

                onCloseForm={closePostForm}

                onCloseDetail={closePostDetail}

                onSwitchMode={switchPostMode}

                onBack={showHome}

                postFormDefaultType={postFormDefaultType}

              />



           </section>





           <footer className="site-footer">

             CampusEcomSystemMini · Student & Campus Utility

           </footer>



         </main>



       )}





       {/* ================================================

           TRANG H? SO

       ================================================= */}



       {(page === "profile" || page === "edit-profile" || page === "change-password") && (



         <main className="auth-page">



           <div className="auth-background-shape shape-one" />



           <div className="auth-background-shape shape-two" />





           <SiteHeader onGoHome={showHome} onLogout={handleLogout} />





           <section className="auth-layout">



             <div className="welcome-panel">



               <span className="eyebrow">

                 CAMPUS LIFE, CONNECTED

               </span>



               <h1>

                 Tài kho?n & ho?t d?ng.

                 <br />



                 <span>

                   Qu?n lý cá nhân.

                 </span>

               </h1>



               <p>

                 C?p nh?t thông tin cá nhân,

                 d?i m?t kh?u và qu?n lý

                 ho?t d?ng c?a b?n trên

                 CampusEcomSystemMini.

               </p>



             </div>





             <div className="auth-panel">



               {loading && (



                 <div className="loading-banner">

                  Đang xử lý...
                 </div>



               )}





               {/* PROFILE */}



               {page === "profile" && user && (



<UserProfile

                    user={user}

                    onBack={showHome}

                    onLogout={handleLogout}

                    onEditProfile={showEditProfile}

                    onChangePassword={showChangePassword}

                    onOpenPreferences={showPreferences}

                    onViewMyPosts={showMyPosts}

                    onOpenMatching={showSmartMatching}

                    onViewLikedPosts={showLikedPosts}

                    loading={loading}

                    error={error}

                  />



               )}





               {/* EDIT PROFILE */}



               {page === "edit-profile" && user && (



                 <EditProfile

                   user={user}

                   onSave={handleUpdateProfile}

                   onCancel={showProfile}

                   loading={loading}

                   error={error}

                 />



               )}





               {/* CHANGE PASSWORD */}



               {page === "change-password" && (



                 <ChangePassword

                   onSave={handleChangePassword}

                   onCancel={showProfile}

                   loading={loading}

                   error={error}

                 />



               )}





               {success && (



                 <div className="message message-success auth-success-message">

                   {success}

                 </div>



               )}



             </div>



           </section>





           <footer className="site-footer">

             CampusEcomSystemMini · Student & Campus Utility

           </footer>



         </main>



)}





        {/* ================================================

            TRANG L?CH S? ÐÃ THÍCH (MODULE 1)

        ================================================= */}



{page === "liked-posts" && user && (



          <main className="auth-page">



            <div className="auth-background-shape shape-one" />



            <div className="auth-background-shape shape-two" />





            <SiteHeader onGoHome={showHome} onLogout={handleLogout} />





            <section className="pref-main">



              <LikedPostsPage

                likedPosts={likedPosts}

                likedPostsLoading={likedPostsLoading}

                likedPostsError={likedPostsError}

                currentUserId={user?.id ?? user?.Id ?? ""}

                 onBack={showProfile}

                 onOpenDetail={handleOpenLikedPostDetail}

                onToggleLike={handleToggleLike}

                postLikes={postLikes}

                likingPostId={likingPostId}

                onRefresh={fetchLikedPosts}

                detailOpen={detailOpen}

                detailPost={detailPost}

                detailLoading={detailLoading}

                detailError={detailError}

                onCloseDetail={closePostDetail}

              />



            </section>





            <footer className="site-footer">

              CampusEcomSystemMini · Student & Campus Utility

            </footer>



          </main>



        )}





        {/* ================================================

            TRANG VECTOR NHU C?U

        ================================================= */}



{page === "preferences" && user && (



          <main className="auth-page">



            <div className="auth-background-shape shape-one" />



            <div className="auth-background-shape shape-two" />





            <SiteHeader onGoHome={showHome} onLogout={handleLogout} />





            <section className="pref-main">



              <Preferences
                preferences={preferences}
                loading={preferencesLoading}
                saving={preferencesSaving}
                error={preferencesError}
                success={preferencesSuccess}
                onSave={handleSavePreferences}
                onDelete={handleDeletePreferences}
                onBack={showHome}
              />



            </section>





            <footer className="site-footer">

              CampusEcomSystemMini · Student & Campus Utility

            </footer>



          </main>



        )}



        {/* ================================================

            TRANG BÁO CÁO C?A MÌNH (MODULE 6 / BATCH 3)

        ================================================= */}



        {page === "my-reports" && user && (



          <main className="auth-page">



            <div className="auth-background-shape shape-one" />



            <div className="auth-background-shape shape-two" />





            <SiteHeader onGoHome={showHome} onLogout={handleLogout} />





            <section className="pref-main">



              <MyReports

                reports={myReports}

                loading={myReportsLoading}

                error={myReportsError}

              />



            </section>





            <footer className="site-footer">

              CampusEcomSystemMini · Student & Campus Utility

            </footer>



          </main>



        )}



        {/* ================================================

            FORM BÁO CÁO BÀI ÐANG (MODULE 6 / BATCH 3)

        ================================================= */}



        {reportFormOpen && user && (

          <div className="modal-overlay" onClick={closeReportForm}>

            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

              <ReportForm

                postId={reportPostId}

                postTitle={reportPostTitle}

                onSubmit={handleSubmitReport}

                onCancel={closeReportForm}

                loading={reportSaving}

                error={reportError}

                success={reportSuccess}

              />

            </div>

          </div>

        )}



        {/* =====================================================

            ADMIN HUB — B?NG ÐI?U KHI?N (MODULE 6 / BATCH 4)

        ================================================= */}



        {page === "admin-dashboard" && user && user?.role === "Admin" && (



          <main className="auth-page">



            <div className="auth-background-shape shape-one" />



            <div className="auth-background-shape shape-two" />





            <SiteHeader onGoHome={showHome} onLogout={handleLogout} />





            <section className="pref-main">



              <AdminDashboard

                stats={adminStats}

                loading={adminStatsLoading}

                error={adminStatsError}

                onBack={showHome}

                onOpenSection={handleAdminOpenSection}

              />



            </section>





            <footer className="site-footer">

              CampusEcomSystemMini · Student & Campus Utility

            </footer>



          </main>



        )}



        {/* =====================================================

            ADMIN HUB — QU?N LÝ NGU?I DÙNG (MODULE 6 / BATCH 4)

        ================================================= */}



        {page === "admin-users" && user && user?.role === "Admin" && (



          <main className="auth-page">



            <div className="auth-background-shape shape-one" />



            <div className="auth-background-shape shape-two" />





            <SiteHeader onGoHome={showHome} onLogout={handleLogout} />





            <section className="pref-main">



              <AdminUsers

                users={adminUsers}

                loading={adminUsersLoading}

                error={adminUsersError}

                page={adminUsersPage}

                pageSize={adminUsersPageSize}

                totalPages={adminUsersTotalPages}

                search={adminUsersSearch}

                status={adminUsersStatus}

                onSearchChange={handleAdminUserSearchChange}
                onStatusChange={handleAdminUserStatusChange}
                onIssueWarning={handleAdminUserWarning}
                onSuspendUser={handleAdminUserSuspend}
                onReactivateUser={handleAdminUserReactivate}
                onPageChange={handleAdminUserPageChange}
                onPageSizeChange={handleAdminUserPageSizeChange}
                onViewDetail={handleAdminUserViewDetail}
                onBack={showAdminDashboard}
              />



            </section>





            <footer className="site-footer">

              CampusEcomSystemMini · Student & Campus Utility

            </footer>



          </main>



        )}



        {/* =====================================================

            ADMIN HUB — QU?N LÝ BÀI ÐANG (MODULE 6 / BATCH 4)

        ================================================= */}



        {page === "admin-posts" && user && user?.role === "Admin" && (



          <main className="auth-page">



            <div className="auth-background-shape shape-one" />



            <div className="auth-background-shape shape-two" />





            <SiteHeader onGoHome={showHome} onLogout={handleLogout} />





            <section className="pref-main">



              <AdminPosts

                posts={adminPosts}

                loading={adminPostsLoading}

                error={adminPostsError}

                page={adminPostsPage}

                pageSize={adminPostsPageSize}

                totalPages={adminPostsTotalPages}

                type={adminPostsType}

                status={adminPostsStatus}

                search={adminPostsSearch}

                onTypeChange={handleAdminPostTypeChange}

                onStatusChange={handleAdminPostStatusChange}

                onSearchChange={handleAdminPostSearchChange}

                onPageChange={handleAdminPostPageChange}

                onPageSizeChange={handleAdminPostPageSizeChange}

                onViewDetail={handleAdminPostViewDetail}

                onToggleHidden={handleAdminPostToggleHidden}

                onDelete={handleAdminPostDelete}

                onBack={showAdminDashboard}

              />



            </section>





            <footer className="site-footer">

              CampusEcomSystemMini · Student & Campus Utility

            </footer>



          </main>



        )}



        {/* =====================================================

            ADMIN HUB — QU?N LÝ BÁO CÁO (MODULE 6 / BATCH 4)

        ================================================= */}



        {page === "admin-reports" && user && user?.role === "Admin" && (



          <main className="auth-page">



            <div className="auth-background-shape shape-one" />



            <div className="auth-background-shape shape-two" />





            <SiteHeader onGoHome={showHome} onLogout={handleLogout} />





            <section className="pref-main">



              <AdminReports

                reports={adminReports}

                loading={adminReportsLoading}

                error={adminReportsError}

                status={adminReportsStatus}

                onStatusChange={handleAdminReportsStatusChange}

                onViewDetail={handleAdminReportViewDetail}

                onApprove={handleAdminReportApprove}

                onReject={handleAdminReportReject}

                onBack={showAdminDashboard}

              />



            </section>





            <footer className="site-footer">

              CampusEcomSystemMini · Student & Campus Utility

            </footer>



          </main>



        )}



        {/* =====================================================

            ADMIN HUB — NH?T KÝ KI?M TRA (MODULE 6 / BATCH 4)

        ================================================= */}



        {page === "admin-audit-logs" && user && user?.role === "Admin" && (



          <main className="auth-page">



            <div className="auth-background-shape shape-one" />



            <div className="auth-background-shape shape-two" />





            <SiteHeader onGoHome={showHome} onLogout={handleLogout} />





            <section className="pref-main">



              <AdminAuditLogs

                logs={adminAuditLogs}

                loading={adminAuditLogsLoading}

                error={adminAuditLogsError}

                onBack={showAdminDashboard}

              />



            </section>





            <footer className="site-footer">

              CampusEcomSystemMini · Student & Campus Utility

            </footer>



          </main>



        )}



        {postFormOpen && (

          <PostFormModal

            key={editingPost ? editingPost.id : "new"}

            post={editingPost}

            saving={postsSaving}

            error={postsError}

            onSubmit={handleSubmitPost}

            onClose={closePostForm}

            defaultType={postFormDefaultType}

          />

        )}



      </>



  );

}








