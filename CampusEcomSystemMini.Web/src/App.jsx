
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
} from "./services/lostFoundService";

import "./styles/auth.css";
import "./styles/preferences.css";
import "./styles/posts.css";
import "./styles/matching.css";
import "./styles/lostFound.css";

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

    setLostFoundFilter("");

    fetchLostFound("");

    fetchLostFoundMap();

  }


  // Backend là nơi lọc dữ liệu, không lọc lại ở React.
  async function handleLostFoundFilterChange(filter) {

    setLostFoundFilter(filter);

    await fetchLostFound(filter);

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
               onBack={showProfile}
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