
//logic ghép các COMPONENTS lại với nhauuuuu


import { useEffect, useRef, useState } from "react";

import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import HomePage from "./components/HomePage";
import UserProfile from "./components/UserProfile";
import EditProfile from "./components/EditProfile";
import ChangePassword from "./components/ChangePassword";
import Preferences from "./components/Preferences";
import PostsPage from "./components/PostsPage";
import SmartMatching from "./components/SmartMatching";
import LostFoundPage from "./components/LostFoundPage";
import Leaderboard from "./components/gamification/Leaderboard";

import ConnectionRequests from "./components/ConnectionRequests";
import MessengerPage from "./components/messenger/MessengerPage.jsx";
import LibraryPage from "./components/library/LibraryPage";
import {
  getMe,
  getToken,
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
} from "./services/lostFoundService";

import {
  getMyPoints,
  getPointHistory,
} from "./services/gamificationService";

import {
  getLeaderboard,
  getMyRank,
} from "./services/leaderboardService";

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
import "./styles/auth.css";
import "./styles/preferences.css";
import "./styles/posts.css";
import "./styles/matching.css";
import "./styles/lostFound.css";
import "./styles/gamification.css";
import "./styles/messenger.css";
import "./styles/library.css";

export default function App() {

  const [page, setPage] = useState("login");

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // =====================================================
  // VECTOR NHU CẦU (PREFERENCES)
  // =====================================================

  const [preferences, setPreferences] = useState(null);

  const [preferencesLoading, setPreferencesLoading] = useState(false);

  const [preferencesSaving, setPreferencesSaving] = useState(false);

  const [preferencesError, setPreferencesError] = useState("");

  const [preferencesSuccess, setPreferencesSuccess] = useState("");

  // =====================================================
  // BÀI ĐĂNG (POSTS)
  // =====================================================

  const [postMode, setPostMode] = useState("all");

  const [posts, setPosts] = useState([]);

  const [postsLoading, setPostsLoading] = useState(false);

  const [postsSaving, setPostsSaving] = useState(false);

  const [postsError, setPostsError] = useState("");

  const [postsSuccess, setPostsSuccess] = useState("");

  const [postFormOpen, setPostFormOpen] = useState(false);

  const [editingPost, setEditingPost] = useState(null);

  const [detailOpen, setDetailOpen] = useState(false);

  const [detailPost, setDetailPost] = useState(null);

  const [detailLoading, setDetailLoading] = useState(false);

  const [detailError, setDetailError] = useState("");

  // Lượt thích theo từng bài đăng: { [postId]: { count, likedByMe } }
  const [postLikes, setPostLikes] = useState({});

  const [likingPostId, setLikingPostId] = useState(null);

  // Bộ lọc GET /api/posts?type=...&time=...
  const [postFilters, setPostFilters] = useState({
    type: "",
    time: "",
  });

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

  // Chế độ Smart Matching: tìm nhóm học hoặc tìm trọ / ở ghép
  const [matchingMode, setMatchingMode] = useState("students");

  const [roomMatches, setRoomMatches] = useState([]);

  const [roomMatchesLoading, setRoomMatchesLoading] = useState(false);

  const [roomMatchesError, setRoomMatchesError] = useState("");

  const [roomMatchDetailOpen, setRoomMatchDetailOpen] = useState(false);

  const [roomMatchDetail, setRoomMatchDetail] = useState(null);

  const [roomMatchDetailLoading, setRoomMatchDetailLoading] = useState(false);

  const [roomMatchDetailError, setRoomMatchDetailError] = useState("");

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

  // Câu hỏi bí mật: "create" (chủ bài đăng Found)
  // hoặc "view" (người bị mất đồ xem câu hỏi).
  const [secretMode, setSecretMode] = useState(null);

  const [secretItem, setSecretItem] = useState(null);

  const [secretQuestion, setSecretQuestion] = useState("");

  const [secretLoading, setSecretLoading] = useState(false);

  const [secretSaving, setSecretSaving] = useState(false);

  const [secretError, setSecretError] = useState("");

  // Yêu cầu nhận đồ (MODULE_3 / BATCH 3)
  const [claimItem, setClaimItem] = useState(null);

  const [claimQuestion, setClaimQuestion] = useState("");

  const [claimSaving, setClaimSaving] = useState(false);

  const [claimError, setClaimError] = useState("");

  // Danh sách yêu cầu nhận đồ của chủ bài đăng Found
  const [claimsItem, setClaimsItem] = useState(null);

  const [claims, setClaims] = useState([]);

  const [claimsLoading, setClaimsLoading] = useState(false);

  const [claimsError, setClaimsError] = useState("");

// Yêu cầu đang được duyệt / từ chối, hoặc "returned"
  // khi chủ bài đăng xác nhận đã trả đồ.
  const [claimsActionId, setClaimsActionId] = useState(null);

  // =====================================================
  // CONNECTION REQUESTS (MODULE 5 / BATCH 1)
  // =====================================================

  // Tab: "received" (nhận được) | "sent" (đã gửi)
  const [connectionMode, setConnectionMode] = useState("received");

  const [connectionRequests, setConnectionRequests] = useState([]);

  const [connectionLoading, setConnectionLoading] = useState(false);

  const [connectionError, setConnectionError] = useState("");

  const [connectionSuccess, setConnectionSuccess] = useState("");

  // Yêu cầu đang được chấp nhận / từ chối
  const [connectionActionId, setConnectionActionId] = useState(null);

  // Form gửi yêu cầu kết nối
  const [receiverId, setReceiverId] = useState("");

  const [sending, setSending] = useState(false);

  const [sendError, setSendError] = useState("");

  // =====================================================
  // MESSENGER (MODULE 5 / BATCH 2)
  // =====================================================

  const [conversations, setConversations] = useState([]);

  const [conversationsLoading, setConversationsLoading] = useState(false);

  const [conversationsError, setConversationsError] = useState("");

  // Cuộc trò chuyện đang được chọn trong Messenger
  const [selectedConversation, setSelectedConversation] = useState(null);

  const [selectedConversationId, setSelectedConversationId] = useState(null);

  // Chi tiết cuộc trò chuyện (participant)
  const [conversationDetail, setConversationDetail] = useState(null);

  const [conversationDetailLoading, setConversationDetailLoading] =
    useState(false);

  const [conversationDetailError, setConversationDetailError] =
    useState("");

  // Lịch sử tin nhắn của cuộc trò chuyện đang chọn
  const [messages, setMessages] = useState([]);

  const [messagesLoading, setMessagesLoading] = useState(false);

  const [messagesError, setMessagesError] = useState("");

  // =====================================================
  // SIGNALR REALTIME CHAT (MODULE 5 / BATCH 3)
  // =====================================================

  // Kết nối SignalR đến /hubs/chat.
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

  // Thông báo đang được đánh dấu đã đọc.
  const [notificationActionId, setNotificationActionId] =
    useState(null);

  // =====================================================
  // KHO TÀI LIỆU & SÁCH — MODULE 4
  // =====================================================

  // "books" hoặc "documents"
  const [librarySection, setLibrarySection] = useState("books");

  // "all" = GET /api/library/books, "mine" = GET /api/library/books/me
  const [libraryMode, setLibraryMode] = useState("all");

  const [books, setBooks] = useState([]);

  const [booksLoading, setBooksLoading] = useState(false);

  const [booksSaving, setBooksSaving] = useState(false);

  const [booksError, setBooksError] = useState("");

  const [booksSuccess, setBooksSuccess] = useState("");

  // Bộ lọc GET /api/library/books?search=...&status=...
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

  // Chuỗi đổi sách của người đang đăng nhập
  const [bookMatches, setBookMatches] = useState([]);

  const [bookMatchesLoading, setBookMatchesLoading] = useState(false);

  const [bookMatchesError, setBookMatchesError] = useState("");

  // =====================================================
  // TÀI LIỆU SỐ — MODULE 4 / BATCH 2 + BATCH 3
  // =====================================================

  // "all" | "free" | "paid" = GET /api/library/documents
  // "mine" = GET /api/library/documents/me
  const [documentMode, setDocumentMode] = useState("all");

  const [documents, setDocuments] = useState([]);

  const [documentsLoading, setDocumentsLoading] = useState(false);

  const [documentsSaving, setDocumentsSaving] = useState(false);

  const [documentsError, setDocumentsError] = useState("");

  const [documentsSuccess, setDocumentsSuccess] = useState("");

  // Bộ lọc GET /api/library/documents?search=...&subject=...&pricing=...
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

  // Đang tải tài liệu: lưu id để disable đúng nút tải.
  const [downloadingDocumentId, setDownloadingDocumentId] =
    useState("");

  const [documentDownloadError, setDocumentDownloadError] = useState("");

  const [documentDownloadSuccess, setDocumentDownloadSuccess] =
    useState("");

  // =====================================================
  // ĐÁNH GIÁ TÀI LIỆU — MODULE 4 / BATCH 4
  // =====================================================

  // Đánh giá của tài liệu đang mở chi tiết.
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

  // Review đang sửa, null = không sửa review nào.
  const [editingDocumentReviewId, setEditingDocumentReviewId] =
    useState(null);

  // Review đang xóa, dùng để disable đúng nút xóa.
  const [deletingDocumentReviewId, setDeletingDocumentReviewId] =
    useState(null);


  // =====================================================
  // GAMIFICATION (MODULE 6 / BATCH 1)
  // =====================================================

  // Điểm uy tín hiện tại.
  const [points, setPoints] = useState(null);

  const [pointsLoading, setPointsLoading] = useState(false);

  const [pointsError, setPointsError] = useState("");

  // Lịch sử cộng / trừ điểm.
  const [pointHistory, setPointHistory] = useState([]);

  const [pointHistoryLoading, setPointHistoryLoading] = useState(false);

  const [pointHistoryError, setPointHistoryError] = useState("");


  // =====================================================
  // LEADERBOARD (MODULE 6 / BATCH 2)
  // =====================================================

  // "month" | "year"
  const [leaderboardPeriod, setLeaderboardPeriod] = useState("month");

  const [leaderboardEntries, setLeaderboardEntries] = useState([]);

  const [leaderboardMyRank, setLeaderboardMyRank] = useState(null);

  const [leaderboardLoading, setLeaderboardLoading] = useState(false);

  const [leaderboardError, setLeaderboardError] = useState("");


  // =====================================================
  // KIỂM TRA JWT KHI MỞ / REFRESH TRANG
  // =====================================================

  useEffect(() => {

    async function restoreLogin() {

      const token = getToken();

      // Không có token
      if (!token) {
        return;
      }

      setLoading(true);
      setError("");

      try {

        const currentUser = await getMe();

        setUser(currentUser);

        // Có token + /me thành công
        // => vào trang chủ
        setPage("home");

      } catch (error) {

        console.error(
          "Restore login failed:",
          error
        );

        setUser(null);

        // Đặt lại trạng thái notification
        // khi restore login thất bại.
        setNotifications([]);
        setUnreadCount(0);
        setNotificationsOpen(false);

        setPage("login");

      } finally {

        setLoading(false);

      }
    }

    restoreLogin();

  }, []);


  // =====================================================
  // SIGNALR /hubs/chat — KẾT NỐI THEO LOGIN / LOGOUT
  // (MODULE_5 / BATCH 3)
  // =====================================================

  // Ref luôn trỏ đến cuộc trò chuyện đang chọn,
  // để handler SignalR không dùng closure cũ.
  const selectedConversationIdRef = useRef(null);

  useEffect(() => {
    selectedConversationIdRef.current = selectedConversationId;
  }, [selectedConversationId]);

  // Ref luôn trỏ đến phiên bản mới nhất của
  // handler nhận tin nhắn realtime.
  const receiveMessageRef = useRef(null);

  useEffect(() => {
    receiveMessageRef.current = handleReceiveMessage;
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    let cancelled = false;

    // Tạo kết nối SignalR. JWT được gửi qua
    // accessTokenFactory (query string access_token).
    const connection = createChatConnection(
      (message) => {
        receiveMessageRef.current?.(message);
      }
    );

    setChatConnection(connection);

    connection
      .start()
      .then(() => {
        if (!cancelled) {
          setChatConnected(true);
        }
      })
      .catch((error) => {
        console.error("Chat connect failed:", error);

        if (!cancelled) {
          setChatConnected(false);
        }
      });

    // Logout / chuyển user → dừng HubConnection.
    return () => {
      cancelled = true;

      setChatConnected(false);

      setChatConnection(null);

      connection.stop().catch((error) => {
        console.error("Chat stop failed:", error);
      });
    };
  }, [user]);


  // =====================================================
  // UNREAD NOTIFICATION COUNT KHI ĐĂNG NHẬP / REFRESH
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

      // 1. Gọi POST /api/auth/login
      const loginResult =
        await login(credentials);

      console.log(
        "Login response:",
        loginResult
      );


      // 2. Login thành công
      // authService đã lưu JWT vào localStorage


      // 3. Gọi GET /api/auth/me
      const currentUser =
        await getMe();


      // 4. Lưu user vào React state
      setUser(currentUser);


      // 5. CHUYỂN SANG TRANG CHỦ
      setPage("home");


    } catch (error) {

      console.error(
        "Login error:",
        error
      );

        setUser(null);

        // Đặt lại trạng thái notification
        // khi đăng nhập thất bại.
        setNotifications([]);
        setUnreadCount(0);
        setNotificationsOpen(false);

        setError(
          error.message ||
          "Đăng nhập thất bại."
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


      // Đăng ký thành công
      setSuccess(
        "Đăng ký thành công! Hãy đăng nhập bằng tài khoản vừa tạo."
      );


      // Chuyển về LOGIN
      setPage("login");


    } catch (error) {

      console.error(
        "Register error:",
        error
      );

      setError(
        error.message ||
        "Đăng ký thất bại."
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

      // Xóa user khỏi React
      setUser(null);

      // Dừng chuông thông báo khi đăng xuất.
      setNotifications([]);
      setUnreadCount(0);
      setNotificationsOpen(false);

      // Quay lại Login
      setPage("login");

      setSuccess("");

      setLoading(false);

    }
  }


  // =====================================================
  // CHUYỂN LOGIN
  // =====================================================

  function showLogin() {

    setPage("login");

    setError("");

    setSuccess("");

  }


  // =====================================================
  // CHUYỂN REGISTER
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

        "Không thể tải hồ sơ."

      );

    } finally {

      setLoading(false);

    }
  }


  async function fetchGamification() {

    setPointsLoading(true);

    setPointsError("");

    setPointHistoryLoading(true);

    setPointHistoryError("");

    try {

      // GET /api/gamification/me
      setPoints(await getMyPoints());

    } catch (error) {

      console.error(

        "Fetch my points failed:",

        error

      );

      setPoints(null);

      setPointsError(

        error.message ||

        "Không thể tải điểm uy tín."

      );

    } finally {

      setPointsLoading(false);

    }

    try {

      // GET /api/gamification/history
      setPointHistory(await getPointHistory());

    } catch (error) {

      console.error(

        "Fetch point history failed:",

        error

      );

      setPointHistory([]);

      setPointHistoryError(

        error.message ||

        "Không thể tải lịch sử điểm."

      );

    } finally {

      setPointHistoryLoading(false);

    }

  }


  function showProfile() {

    setPage("profile");

    setError("");

    setSuccess("");

    fetchProfile();

    fetchGamification();

  }


  // Bảng xếp hạng và thứ hạng của bản thân,
  // cả hai dùng cùng một kỳ để số thứ hạng khớp nhau.
  async function fetchLeaderboard(period) {

    setLeaderboardLoading(true);

    setLeaderboardError("");

    try {

      // GET /api/leaderboard?period=month | year
      setLeaderboardEntries(await getLeaderboard(period));

    } catch (error) {

      console.error("Fetch leaderboard failed:", error);

      setLeaderboardEntries([]);

      setLeaderboardError(
        error.message || "Không thể tải bảng xếp hạng."
      );

    }

    try {

      // GET /api/leaderboard/me?period=month | year
      setLeaderboardMyRank(await getMyRank(period));

    } catch (error) {

      console.error("Fetch my rank failed:", error);

      setLeaderboardMyRank(null);

      setLeaderboardError(
        error.message || "Không thể tải thứ hạng của bạn."
      );

    } finally {

      setLeaderboardLoading(false);

    }

  }


  function showLeaderboard() {

    setPage("leaderboard");

    setError("");

    setSuccess("");

    setLeaderboardPeriod("month");

    fetchLeaderboard("month");

  }


  // Đổi kỳ xếp hạng: Tháng / Năm.
  async function handleChangeLeaderboardPeriod(period) {

    if (period === leaderboardPeriod) {
      return;
    }

    setLeaderboardPeriod(period);

    await fetchLeaderboard(period);

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

        "Không thể tải vector nhu cầu."

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

      const payload = {

        interestedSubjects: formData.interestedSubjects,

        habits: formData.habits,

        goals: formData.goals,

        preferredRentalArea: formData.preferredRentalArea,

        monthlyRentalBudget: formData.monthlyRentalBudget,

      };

      // Đã có vector nhu cầu => PUT, chưa có => POST
      const saved = preferences

        ? await updatePreferences(payload)

        : await createPreferences(payload);

      setPreferences(saved);

      setPreferencesSuccess(

        preferences

          ? "Vector nhu cầu đã được cập nhật."

          : "Vector nhu cầu đã được tạo."

      );

    } catch (error) {

      console.error(

        "Save preferences error:",

        error

      );

      setPreferencesError(

        error.message ||

        "Lưu vector nhu cầu thất bại."

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

      setPreferencesSuccess("Vector nhu cầu đã được xóa.");

    } catch (error) {

      console.error(

        "Delete preferences error:",

        error

      );

      setPreferencesError(

        error.message ||

        "Xóa vector nhu cầu thất bại."

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

      // Cập nhật thông tin cá nhân
      const updated = await updateProfile({

        fullName: formData.fullName,

        email: formData.email,

        phone: formData.phone,

      });

      // Cập nhật avatar nếu có URL mới
      if (formData.avatarUrl) {

        await updateAvatar({

          avatarUrl: formData.avatarUrl,

        });

        updated.avatarUrl = formData.avatarUrl;

      }

      // Cập nhật React state
      setUser(updated);

      setSuccess("Hồ sơ đã được cập nhật.");

      setPage("profile");

    } catch (error) {

      console.error(

        "Update profile error:",

        error

      );

      setError(

        error.message ||

        "Cập nhật hồ sơ thất bại."

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

      setSuccess("Mật khẩu đã được thay đổi.");

      setPage("profile");

    } catch (error) {

      console.error(

        "Change password error:",

        error

      );

      setError(

        error.message ||

        "Đổi mật khẩu thất bại."

      );

    } finally {

      setLoading(false);

    }
  }


  // =====================================================
  // BÀI ĐĂNG (POSTS)
  // =====================================================

  // Rút gọn danh sách lượt thích thành số lượng + đã thích hay chưa.
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

        try {

          // GET /api/posts/{id}/likes
          const likes = await getPostLikes(post.id);

          return [post.id, summarizeLikes(likes)];

        } catch (error) {

          console.error(

            "Fetch post likes failed:",

            post.id,

            error

          );

          return [post.id, { count: 0, likedByMe: false }];

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

      // GET /api/posts (có type/time) hoặc GET /api/posts/me
      const data =
        mode === "mine"
          ? await getMyPosts()
          : await getPosts(activeFilters);

      setPosts(data);

      setPostLikes(await loadPostLikes(data));

    } catch (error) {

      console.error(

        "Fetch posts failed:",

        error

      );

      setPosts([]);

      setPostLikes({});

      setPostsError(

        error.message ||

        "Không thể tải danh sách bài đăng."

      );

    } finally {

      setPostsLoading(false);

    }

  }


  function showPosts(mode) {

    const targetMode = mode || "all";

    setPage("posts");

    setError("");

    setSuccess("");

    setPostMode(targetMode);

    setPostsSuccess("");

    setPostFormOpen(false);

    setDetailOpen(false);

    fetchPosts(targetMode);

  }


  function showMyPosts() {

    showPosts("mine");

  }


  // Bộ lọc chỉ áp dụng cho GET /api/posts.
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


  function openPostForm(post) {

    setEditingPost(post || null);

    setPostFormOpen(true);

    setPostsError("");

    setPostsSuccess("");

    setDetailOpen(false);

  }


  function closePostForm() {

    setPostFormOpen(false);

    setEditingPost(null);

  }


  async function handleSubmitPost(formData) {

    setPostsSaving(true);

    setPostsError("");

    setPostsSuccess("");

    try {

      if (editingPost) {

        // PUT /api/posts/{id}
        await updatePost(editingPost.id, formData);

        setPostsSuccess("Bài đăng đã được cập nhật.");

      } else {

        // POST /api/posts
        await createPost(formData);

        setPostsSuccess("Bài đăng đã được tạo.");

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

        "Lưu bài đăng thất bại."

      );

    } finally {

      setPostsSaving(false);

    }

  }


  async function handleDeletePost(post) {

    const confirmed = window.confirm(
      "Xóa bài đăng này? Hành động không thể hoàn tác."
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

      setPostsSuccess("Bài đăng đã được xóa.");

      await fetchPosts(postMode);

    } catch (error) {

      console.error(

        "Delete post error:",

        error

      );

      setPostsError(

        error.message ||

        "Xóa bài đăng thất bại."

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

        "Không tìm thấy bài đăng."

      );

    } finally {

      setDetailLoading(false);

    }

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

        "Thao tác thích bài đăng thất bại."

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

        "Không thể tải kết quả Smart Matching."

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


  // Đổi chế độ Smart Matching: nhóm học hoặc tìm trọ / ở ghép
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

        "Không tìm thấy người phù hợp."

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

        "Không thể tải kết quả tìm trọ / ở ghép."

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

        "Không tìm thấy ứng viên tìm trọ / ở ghép."

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

        "Không thể tải dữ liệu bản đồ Lost & Found."

      );

    } finally {

      setLostFoundMapLoading(false);

    }

  }


  async function fetchLostFound(filter) {

    setLostFoundLoading(true);

    setLostFoundError("");

    try {

      // GET /api/lost-found?type=... hoặc ?status=Returned
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

        "Không thể tải dữ liệu Lost & Found."

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


  // Backend là nơi lọc dữ liệu, không lọc lại ở React.
  async function handleLostFoundFilterChange(filter) {

    setLostFoundSuccess("");

    setLostFoundFilter(filter);

    await fetchLostFound(filter);

  }


  // =====================================================
  // CÂU HỎI BÍ MẬT (MODULE 3 / BATCH 2)
  // =====================================================

  function closeSecretQuestion() {

    setSecretMode(null);

    setSecretItem(null);

    setSecretQuestion("");

    setSecretError("");

    setSecretLoading(false);

    setSecretSaving(false);

  }


  // Chủ bài đăng Found tạo câu hỏi, người khác chỉ xem câu hỏi.
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
          ? "Người nhặt đồ chưa tạo câu hỏi bí mật."
          : error.message ||
            "Không thể tải câu hỏi bí mật."

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
      return "Câu hỏi bí mật của bài đăng này đã tồn tại.";
    }

    if (error.status === 403) {
      return "Bạn không phải chủ bài đăng này.";
    }

    return error.message || "Không thể lưu câu hỏi bí mật.";
  }


  // =====================================================
  // YÊU CẦU NHẬN ĐỒ (MODULE 3 / BATCH 3)
  // =====================================================

  function closeClaim() {

    setClaimItem(null);

    setClaimQuestion("");

    setClaimError("");

    setClaimSaving(false);

  }


  // Từ câu hỏi bí mật sang form gửi câu trả lời.
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

      setLostFoundSuccess(
        `Đã gửi yêu cầu nhận đồ (${data?.status ?? "Pending"}).`
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
    // Backend chỉ trả lời sai khi câu trả lời không khớp.
    if (error.status === 400) {
      return "Câu trả lời không đúng với câu hỏi bí mật.";
    }

    if (error.status === 409) {
      return "Người nhặt đồ chưa tạo câu hỏi bí mật cho bài đăng này.";
    }

    if (error.status === 403) {
      return "Bạn không thể gửi yêu cầu nhận đồ cho bài đăng của mình.";
    }

    return error.message || "Không thể gửi yêu cầu nhận đồ.";
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
      return "Bạn không phải chủ bài đăng này.";
    }

    if (error.status === 409) {
      return "Bài đăng này không nhận yêu cầu nhận đồ.";
    }

    return error.message || "Không thể tải yêu cầu.";
  }


  // Backend là nguồn sự thật: sau khi duyệt / từ chối,
  // danh sách yêu cầu được tải lại từ API.
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
  // DUYỆT / TỪ CHỐI / ĐÃ TRẢ ĐỒ (MODULE 3 / BATCH 4)
  // =====================================================

  function getClaimActionErrorMessage(error, fallback) {
    if (error.status === 403) {
      return "Bạn không phải chủ bài đăng này.";
    }

    if (error.status === 409) {
      return error.message ||
        "Yêu cầu này không còn ở trạng thái chờ.";
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
        `Đã duyệt yêu cầu (${data?.status ?? "Approved"}).`
      );

    } catch (error) {

      console.error(

        "Approve claim failed:",

        error

      );

      setClaimsError(
        getClaimActionErrorMessage(
          error,
          "Không thể duyệt yêu cầu nhận đồ."
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
        `Đã từ chối yêu cầu (${data?.status ?? "Rejected"}).`
      );

    } catch (error) {

      console.error(

        "Reject claim failed:",

        error

      );

      setClaimsError(
        getClaimActionErrorMessage(
          error,
          "Không thể từ chối yêu cầu nhận đồ."
        )
      );

    } finally {

      setClaimsActionId(null);

    }

  }


  async function handleMarkReturned(item) {

    const confirmed = window.confirm(
      "Xác nhận đã trao trả đồ? Bài đăng sẽ chuyển sang trạng thái Đã Trao Trả."
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

      // Tải lại danh sách, tin và bản đồ từ Backend.
      await reloadClaims(item?.postId);

      await fetchLostFound(lostFoundFilter);

      await fetchLostFoundMap();

      setLostFoundSuccess("Đã xác nhận trao trả đồ.");

    } catch (error) {

      console.error(

        "Mark returned failed:",

        error

      );

      setClaimsError(
        getClaimActionErrorMessage(
          error,
          "Không thể xác nhận đã trả đồ."
        )
      );

    } finally {

      setClaimsActionId(null);

    }

  }


   // =====================================================
  // CONNECTION REQUESTS (MODULE 5 / BATCH 1)
  // =====================================================

  // Backend là nguồn sự thật: sau mỗi thao tác,
  // danh sách yêu cầu được tải lại từ API.
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
        error.message || "Không thể tải yêu cầu kết nối."
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

  function handleConnectionModeChange(mode) {
    setConnectionMode(mode);
    setConnectionSuccess("");
    setConnectionError("");
  }

  function getConnectionErrorMessage(error) {
    if (error.status === 400) {
      return "Không thể gửi yêu cầu kết nối cho chính mình.";
    }

    if (error.status === 404) {
      return "Người nhận không tồn tại.";
    }

    if (error.status === 409) {
      return "Đã có yêu cầu kết nối đang chờ với người này.";
    }

    return error.message || "Không thể gửi yêu cầu kết nối.";
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
        `Đã gửi yêu cầu kết nối đến ${
          data?.receiverName ?? "người nhận"
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
      await acceptConnectionRequest(connectionRequestId);

      setConnectionSuccess(
        `Đã đồng ý kết nối với ${
          request?.senderName ?? "người gửi"
        }.`
      );

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
        `Đã từ chối yêu cầu kết nối từ ${
          request?.senderName ?? "người gửi"
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
      return "Chỉ người nhận yêu cầu mới được thực hiện thao tác này.";
    }

    if (error.status === 404) {
      return "Yêu cầu kết nối không tồn tại.";
    }

    if (error.status === 409) {
      return "Yêu cầu này không còn ở trạng thái chờ.";
    }

    return error.message || "Không thể xử lý yêu cầu kết nối.";
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

      setConversations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch conversations failed:", error);

      setConversations([]);

      setConversationsError(
        error.message ||
          "Không thể tải danh sách cuộc trò chuyện."
      );
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

  // Chọn cuộc trò chuyện: tải chi tiết (participant)
  // và lịch sử tin nhắn từ Backend.
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
          ? "Bạn không phải participant của cuộc trò chuyện này."
          : error.message ||
            "Không thể tải chi tiết cuộc trò chuyện."
      );
    } finally {
      setConversationDetailLoading(false);
    }

    try {
      // GET /api/conversations/{conversationId}/messages
      const data = await getConversationMessages(conversationId);

      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch messages failed:", error);

      setMessages([]);

      setMessagesError(
        error.status === 403
          ? "Bạn không phải participant của cuộc trò chuyện này."
          : error.message ||
            "Không thể tải lịch sử tin nhắn."
      );
    } finally {
      setMessagesLoading(false);
    }
  }

  // =====================================================
  // SIGNALR CHAT (MODULE 5 / BATCH 3)
  // =====================================================

  // Nhận tin nhắn realtime từ /hubs/chat.
  // Tin nhắn đã được Hub lưu DB trước khi broadcast,
  // nên người nhận offline vẫn xem được history.
  function handleReceiveMessage(message) {
    if (!message?.conversationId) {
      return;
    }

    const conversationId = String(message.conversationId);

    // Tin nhắn thuộc cuộc trò chuyện đang mở
    // → thêm vào lịch sử tin nhắn hiển thị.
    setMessages((previous) => {
      if (
        String(selectedConversationIdRef.current ?? "") !==
        conversationId
      ) {
        return previous;
      }

      // Không thêm trùng tin nhắn đã có.
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

    // Cập nhật tin nhắn cuối / số tin nhắn
    // chưa đọc trong danh sách cuộc trò chuyện.
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
            Number(conversation?.unreadCount ?? 0) + 1,
        };
      })
    );
  }

  // Gửi tin nhắn realtime qua SignalR /hubs/chat.
  // Người gửi lấy từ JWT trên Hub, không gửi từ client.
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
        "Không thể gửi tin nhắn. Vui lòng thử lại."
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
        error.message || "Không thể tải thông báo."
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
    } finally {
      setNotificationActionId(null);
    }
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
  // KHO TÀI LIỆU & SÁCH (MODULE 4 / BATCH 1)
  // =====================================================

  // Các hàm xử lý Library của Module 4
  // tiếp tục đặt bên dưới phần này.========

  async function fetchBooks(mode, filters) {

    setBooksLoading(true);

    setBooksError("");

    const activeFilters = filters ?? bookFilters;

    try {

      // GET /api/library/books (có search/status)
      // hoặc GET /api/library/books/me
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

        "Không thể tải sàn đổi sách."

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

        "Không thể tải chuỗi đổi sách."

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


  // Chuyển giữa sàn đổi sách và kho tài liệu số.
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


  // Chuyển giữa tất cả bài đăng và bài đăng của tôi.
  function handleChangeLibraryMode(mode) {

    const targetMode = mode || "all";

    setLibraryMode(targetMode);

    setBooksSuccess("");

    setBookFormOpen(false);

    setBookDetailOpen(false);

    fetchBooks(targetMode);

  }


  // Bộ lọc chỉ áp dụng cho GET /api/library/books.
  function handleBookFilterChange(nextFilters) {

    const filters = {

      search: nextFilters.search ?? "",

      status: nextFilters.status ?? "",

    };

    setBookFilters(filters);

    setBooksSuccess("");

        <HomePage
          user={user}
          onLogout={handleLogout}
          onViewProfile={showProfile}
          onSetupPreferences={showPreferences}
          onViewMyPosts={showMyPosts}
          onOpenMatching={showSmartMatching}
          onOpenLostFound={showLostFound}
          onOpenMessenger={showMessenger}
        />

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

        setBooksSuccess("Bài đổi sách đã được cập nhật.");

      } else {

        // POST /api/library/books
        await createBook(formData);

        setBooksSuccess("Bài đổi sách đã được đăng.");

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
      "Xóa bài đổi sách này? Hành động không thể hoàn tác."
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

      setBooksSuccess("Bài đổi sách đã được xóa.");

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
      return "Bạn không phải chủ của bài đổi sách này.";
    }

    if (error.status === 404) {
      return "Không tìm thấy bài đổi sách.";
    }

    if (error.status === 400) {
      return "Dữ liệu không hợp lệ, vui lòng kiểm tra lại.";
    }

    return error.message || "Thao tác với bài đổi sách thất bại.";
  }


  async function handleOpenBookDetail(bookId) {

    setBookDetailOpen(true);

    setBookDetailLoading(true);

    setBookDetailError("");

    setBookDetail(null);

    setBookFormOpen(false);

    try {

      // GET /api/library/books/{id}
      const data = await getBookById(bookId);

      setBookDetail(data);

    } catch (error) {

      console.error(

        "Fetch book detail failed:",

        error

      );

      setBookDetailError(getBookErrorMessage(error));

    } finally {

      setBookDetailLoading(false);

    }

  }


  // Mở chi tiết bài đăng từ danh sách Exchange Match.
  function handleOpenBookMatch(match) {

    handleOpenBookDetail(match?.matchedPostId);

  }


  function closeBookDetail() {

    setBookDetailOpen(false);

    setBookDetail(null);

  }


  // =====================================================
  // TÀI LIỆU SỐ (MODULE 4 / BATCH 2)
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

        "Không thể tải kho tài liệu."

      );

    } finally {

      setDocumentsLoading(false);

    }

  }


  // Chuyển giữa tất cả / miễn phí / trả phí / của tôi.
  function handleChangeDocumentMode(mode) {

    const targetMode = mode || "all";

    setDocumentMode(targetMode);

    setDocumentsSuccess("");

    setDocumentFormOpen(false);

    setDocumentDetailOpen(false);

    fetchDocuments(targetMode);

  }


  // Bộ lọc chỉ áp dụng cho GET /api/library/documents.
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

    // pricing đã được chọn qua chip Tài liệu nên
    // đặt lại về rỗng để không lọc trùng hai lần.
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

        // PUT /api/library/documents/{id}  — chỉ sửa metadata.
        await updateDocument(editingDocument.id, formData);

        setDocumentsSuccess("Tài liệu đã được cập nhật.");

      } else {

        // POST /api/library/documents  — multipart/form-data.
        await createDocument(formData);

        setDocumentsSuccess("Tài liệu đã được đăng tải.");

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
      "Xóa tài liệu này? File tải lên cũng sẽ bị xóa và không thể khôi phục."
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

      setDocumentsSuccess("Tài liệu đã được xóa.");

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
      return "Bạn không phải chủ của tài liệu này.";
    }

    if (error.status === 404) {
      return "Không tìm thấy tài liệu.";
    }

    // Backend trả về nguyên nhân cụ thể cho file lỗi.
    if (error.status === 400) {
      return (
        error.message ||

        "Tài liệu không hợp lệ, vui lòng kiểm tra lại file."
      );
    }

    return error.message || "Thao tác với tài liệu thất bại.";
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
  // Tài liệu miễn phí tải thẳng, tài liệu trả phí Backend
  // kiểm tra điểm rồi mới trả file đã đóng dấu watermark.
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
          ? `Đã tải tài liệu, đã trừ ${document.price} điểm.`
          : "Đã tải tài liệu, file được đóng dấu watermark."
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
      return "Tài liệu hoặc file tài liệu không còn tồn tại.";
    }

    // Backend trả về nguyên nhân cụ thể cho tài liệu trả phí.
    if (error.status === 400) {
      return (
        error.message ||
        "Bạn không đủ điểm để tải tài liệu này."
      );
    }

    if (error.status === 409) {
      return (
        error.message ||
        "Hệ thống điểm chưa sẵn sàng, chưa thể tải tài liệu trả phí."
      );
    }

    if (error.status === 401) {
      return "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.";
    }

    return (
      error.message ||
      "Tải tài liệu thất bại, vui lòng thử lại."
    );

  }


  // =====================================================
  // ĐÁNH GIÁ TÀI LIỆU (MODULE 4 / BATCH 4)
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


  // Xóa trạng thái đánh giá khi đóng hoặc đổi tài liệu đang xem.
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
      return "Bạn không phải người viết đánh giá này.";
    }

    if (error.status === 404) {
      return "Không tìm thấy tài liệu hoặc đánh giá.";
    }

    // Backend trả về nguyên nhân cụ thể khi điểm không hợp lệ.
    if (error.status === 400) {
      return (
        error.message ||
        "Điểm đánh giá phải nằm trong khoảng 1 đến 5."
      );
    }

    // Mỗi người chỉ đánh giá một tài liệu đúng một lần.
    if (error.status === 409) {
      return (
        error.message ||
        "Bạn đã đánh giá tài liệu này rồi, hãy sửa đánh giá của bạn."
      );
    }

    return error.message || "Thao tác với đánh giá thất bại.";

  }


  // Backend trả kèm điểm trung bình và số đánh giá mới
  // sau khi tạo / sửa review.
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


  // Xóa review chỉ trả message nên tải lại chi tiết tài liệu
  // để cập nhật điểm trung bình và số đánh giá.
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
        "Đã ghi nhận đánh giá của bạn."
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
        "Đánh giá của bạn đã được cập nhật."
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
      "Xóa đánh giá của bạn? Hành động không thể hoàn tác."
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

      setDocumentReviewsSuccess("Đánh giá đã được xóa.");

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


          <header className="site-header">

            <div className="brand">

              <span className="brand-icon">
                C
              </span>

              <span>
                Campus
                <span className="brand-highlight">
                  Ecom
                </span>
              </span>

            </div>

            <span className="header-label">
              STUDENT COMMUNITY
            </span>

          </header>


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
                  Đang xử lý...
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
          TRANG ĐĂNG KÝ
      ================================================= */}

      {page === "register" && (

        <main className="auth-page">

          <div className="auth-background-shape shape-one" />

          <div className="auth-background-shape shape-two" />


          <header className="site-header">

            <div className="brand">

              <span className="brand-icon">
                C
              </span>

              <span>
                Campus
                <span className="brand-highlight">
                  Ecom
                </span>
              </span>

            </div>

            <span className="header-label">
              STUDENT COMMUNITY
            </span>

          </header>


          <section className="auth-layout">

            {/* LEFT */}

            <div className="welcome-panel">

              <span className="eyebrow">
                JOIN THE COMMUNITY
              </span>

              <h1>

                Tạo tài khoản.
                <br />

                <span>
                  Kết nối campus.
                </span>

              </h1>

              <p>
                Đăng ký tài khoản để bắt đầu
                sử dụng các tiện ích dành cho sinh viên.
              </p>

            </div>


            {/* RIGHT */}

            <div className="auth-panel">

              {loading && (

                <div className="loading-banner">
                  Đang xử lý...
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
          TRANG CHỦ
      ================================================= */}
       {page === "home" && user && (

         <HomePage
           user={user}
           onLogout={handleLogout}
           onViewProfile={showProfile}
           onSetupPreferences={showPreferences}
onViewMyPosts={showMyPosts}
onOpenMatching={showSmartMatching}
           onOpenLostFound={showLostFound}
           onOpenLibrary={showLibrary}
         />

       )}


       {/* ================================================
           TRANG SMART MATCHING
       ================================================= */}

       {page === "smart-matching" && user && (

         <main className="auth-page">

           <div className="auth-background-shape shape-one" />

           <div className="auth-background-shape shape-two" />


           <header className="site-header">

             <div className="brand">

               <span className="brand-icon">
                 C
               </span>

               <span>
                 Campus
                 <span className="brand-highlight">
                   Ecom
                 </span>
               </span>

             </div>

             <span className="header-label">
               STUDENT COMMUNITY
             </span>

           </header>


           <section className="pref-main">

<SmartMatching
                mode={matchingMode}
                onChangeMode={handleChangeMatchingMode}
                matches={matches}
                loading={matchesLoading}
                error={matchesError}
                detailOpen={matchDetailOpen}
                detail={matchDetail}
                detailLoading={matchDetailLoading}
                detailError={matchDetailError}
                onOpenDetail={handleOpenMatchDetail}
                onCloseDetail={closeMatchDetail}
                roomMatches={roomMatches}
                roomLoading={roomMatchesLoading}
                roomError={roomMatchesError}
                roomDetailOpen={roomMatchDetailOpen}
                roomDetail={roomMatchDetail}
                roomDetailLoading={roomMatchDetailLoading}
                roomDetailError={roomMatchDetailError}
                onOpenRoomDetail={handleOpenRoomMatchDetail}
                onCloseRoomDetail={closeRoomMatchDetail}
onEditPreferences={showPreferences}
                onBack={showProfile}
              />

           </section>


           <footer className="site-footer">
             CampusEcomSystemMini · Student & Campus Utility
           </footer>

         </main>

       )}


       {/* ================================================
           TRANG BẢNG XẾP HẠNG (MODULE 6 / BATCH 2)
       ================================================= */}

       {page === "leaderboard" && user && (

         <main className="auth-page">

           <div className="auth-background-shape shape-one" />

           <div className="auth-background-shape shape-two" />


           <header className="site-header">

             <div className="brand">

               <span className="brand-icon">
                 C
               </span>

               <span>
                 Campus
                 <span className="brand-highlight">
                   Ecom
                 </span>
               </span>

             </div>

             <span className="header-label">
               STUDENT COMMUNITY
             </span>

           </header>


           <section className="pref-main">

             <Leaderboard
               period={leaderboardPeriod}
               onChangePeriod={handleChangeLeaderboardPeriod}
               entries={leaderboardEntries}
               myRank={leaderboardMyRank}
               loading={leaderboardLoading}
               error={leaderboardError}
               onBack={showProfile}
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


           <header className="site-header">

             <div className="brand">

               <span className="brand-icon">
                 C
               </span>

               <span>
                 Campus
                 <span className="brand-highlight">
                   Ecom
                 </span>
               </span>

             </div>

             <span className="header-label">
               STUDENT COMMUNITY
             </span>

           </header>


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
                onBack={showProfile}
              />

            </section>


            <footer className="site-footer">
              CampusEcomSystemMini · Student & Campus Utility
            </footer>

          </main>

        )}


        {/* ================================================
            TRANG KẾT NỐI (MODULE 5 / BATCH 1)
        ================================================= */}

        {page === "connections" && user && (

          // GIỮ NGUYÊN TOÀN BỘ CODE TRANG KẾT NỐI Ở ĐÂY

        )}

        {/* ================================================
            TRANG KHO TÀI LIỆU & SÁCH (MODULE 4)
        ================================================= */}

        {page === "library" && user && (

          // GIỮ NGUYÊN TOÀN BỘ CODE TRANG KHO TÀI LIỆU & SÁCH Ở ĐÂY

        )}

          <main className="auth-page">

            <div className="auth-background-shape shape-one" />

            <div className="auth-background-shape shape-two" />


            <header className="site-header">

              <div className="brand">

                <span className="brand-icon">
                  C
                </span>

                <span>
                  Campus
                  <span className="brand-highlight">
                    Ecom
                  </span>
                </span>
              </div>

              <span className="header-label">
                STUDENT COMMUNITY
              </span>
            </header>

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
                onBack={showProfile}
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

            <header className="site-header">

              <div className="brand">

                <span className="brand-icon">
                  C
                </span>

                <span>
                  Campus
                  <span className="brand-highlight">
                    Ecom
                  </span>
                </span>
              </div>

              <span className="header-label">
                STUDENT COMMUNITY
              </span>
     </header>


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
                onBack={showProfile}
              />

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
                onBack={showProfile}
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
              />

            </section>


            <footer className="site-footer">
              CampusEcomSystemMini · Student & Campus Utility
            </footer>

          </main>

        )}


        {/* ================================================
            TRANG BÀI ĐĂNG
        ================================================= */}

       {page === "posts" && user && (

         <main className="auth-page">

           <div className="auth-background-shape shape-one" />

           <div className="auth-background-shape shape-two" />


           <header className="site-header">

             <div className="brand">

               <span className="brand-icon">
                 C
               </span>

               <span>
                 Campus
                 <span className="brand-highlight">
                   Ecom
                 </span>
               </span>

             </div>

             <span className="header-label">
               STUDENT COMMUNITY
             </span>

           </header>


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
               onBack={showProfile}
             />

           </section>


           <footer className="site-footer">
             CampusEcomSystemMini · Student & Campus Utility
           </footer>

         </main>

       )}


       {/* ================================================
           TRANG HỒ SƠ
       ================================================= */}

       {(page === "profile" || page === "edit-profile" || page === "change-password") && (

         <main className="auth-page">

           <div className="auth-background-shape shape-one" />

           <div className="auth-background-shape shape-two" />


           <header className="site-header">

             <div className="brand">

               <span className="brand-icon">
                 C
               </span>

               <span>
                 Campus
                 <span className="brand-highlight">
                   Ecom
                 </span>
               </span>

             </div>

             <span className="header-label">
               STUDENT COMMUNITY
             </span>

           </header>


           <section className="auth-layout">

             <div className="welcome-panel">

               <span className="eyebrow">
                 CAMPUS LIFE, CONNECTED
               </span>

               <h1>
                 Tài khoản & hoạt động.
                 <br />

                 <span>
                   Quản lý cá nhân.
                 </span>
               </h1>

               <p>
                 Cập nhật thông tin cá nhân,
                 đổi mật khẩu và quản lý
                 hoạt động của bạn trên
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
                   onLogout={handleLogout}
                   onEditProfile={showEditProfile}
                   onChangePassword={showChangePassword}
                    onOpenPreferences={showPreferences}
                    onViewMyPosts={showMyPosts}
                    onOpenMatching={showSmartMatching}
                    onOpenLeaderboard={showLeaderboard}
                    loading={loading}
                    error={error}
                    points={points}
                    pointsLoading={pointsLoading}
                    pointsError={pointsError}
                    history={pointHistory}
                    historyLoading={pointHistoryLoading}
                    historyError={pointHistoryError}
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
           TRANG VECTOR NHU CẦU
       ================================================= */}

       {page === "preferences" && user && (

         <main className="auth-page">

           <div className="auth-background-shape shape-one" />

           <div className="auth-background-shape shape-two" />


           <header className="site-header">

             <div className="brand">

               <span className="brand-icon">
                 C
               </span>

               <span>
                 Campus
                 <span className="brand-highlight">
                   Ecom
                 </span>
               </span>

             </div>

             <span className="header-label">
               STUDENT COMMUNITY
             </span>

           </header>


           <section className="pref-main">

             <Preferences
               key={preferences?.id ?? "new"}
               preferences={preferences}
               loading={preferencesLoading}
               saving={preferencesSaving}
               error={preferencesError}
               success={preferencesSuccess}
               onSave={handleSavePreferences}
               onDelete={handleDeletePreferences}
               onBack={showProfile}
             />

           </section>


           <footer className="site-footer">
             CampusEcomSystemMini · Student & Campus Utility
           </footer>

         </main>

       )}


      </>

  );
}