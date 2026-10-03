
//logic ghép các COMPONENTS lại với nhauuuuu


import { useEffect, useState } from "react";

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
} from "./services/libraryService";

import "./styles/auth.css";
import "./styles/preferences.css";
import "./styles/posts.css";
import "./styles/matching.css";
import "./styles/lostFound.css";
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
  // TÀI LIỆU SỐ — MODULE 4 / BATCH 2
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

        setPage("login");

      } finally {

        setLoading(false);

      }
    }

    restoreLogin();

  }, []);


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


  function showProfile() {

    setPage("profile");

    setError("");

    setSuccess("");

    fetchProfile();

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
  // KHO TÀI LIỆU & SÁCH (MODULE 4 / BATCH 1)
  // =====================================================

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

    if (libraryMode !== "all") {
      return;
    }

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

    try {

      // GET /api/library/documents/{id}
      const data = await getDocumentById(documentId);

      setDocumentDetail(data);

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
            TRANG KHO TÀI LIỆU & SÁCH
        ================================================= */}

        {page === "library" && user && (

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
                  onCloseForm: closeDocumentForm,
                  onCloseDetail: closeDocumentDetail,
                  formOpen: documentFormOpen,
                  formDocument: editingDocument,
                  detailOpen: documentDetailOpen,
                  detail: documentDetail,
                  detailLoading: documentDetailLoading,
                  detailError: documentDetailError,
                }}
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