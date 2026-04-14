<template>
  <div class="login-bg">
    <div class="login-card">

      <!-- LEFT PANEL -->
      <div class="left-panel">
        <div class="left-top">
          <div class="brand">
            <img src="/img/Medistock2.png" alt="MediStock Logo" height="40" style="object-fit: contain;" />
          </div>

          <div class="left-headline">
            <h1>Sistem terpercaya<br />manajemen farmasi.</h1>
            <p>Pengelolaan inventaris apotek yang akurat, cepat, dan aman dengan metode FEFO.</p>
          </div>

          <div class="feature-badge">
            <div class="badge-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <div class="badge-title">Akses Aman</div>
              <div class="badge-sub">Hak akses berbasis peran staf</div>
            </div>
          </div>
        </div>

        <div class="left-illustration">
          <div class="illustration-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/></svg>
            <div class="illus-lines">
              <div class="illus-line"></div>
              <div class="illus-line short"></div>
              <div class="illus-line"></div>
              <div class="illus-line short"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- RIGHT PANEL -->
      <div class="right-panel">
        <div class="right-content">
          <div class="right-header">
            <h2>Selamat Datang</h2>
            <p>Masukkan kredensial akun untuk mengakses sistem.</p>
          </div>

          <form class="login-form" @submit.prevent="handleLogin">
            <!-- Email -->
            <div class="field-group">
              <label>ALAMAT EMAIL</label>
              <div class="input-wrap">
                <svg class="field-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <input
                  v-model="email"
                  type="email"
                  placeholder="staf@rumahsakit.com"
                  required
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- Password -->
            <div class="field-group">
              <div class="label-row">
                <label>PASSWORD</label>
                <a href="#" class="forgot-link">Lupa?</a>
              </div>
              <div class="input-wrap">
                <svg class="field-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  required
                  :disabled="loading"
                />
                <button type="button" class="eye-btn" @click="showPassword = !showPassword">
                  <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                </button>
              </div>
            </div>

            <!-- Info note -->
            <div class="info-note">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              <span>Tingkat akses ditentukan berdasarkan peran yang terdaftar: <strong>Admin</strong> (kendali penuh) atau <strong>Staf Farmasi</strong> (inventaris).</span>
            </div>

            <!-- Error -->
            <div v-if="errorMessage" class="error-note">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              <span>{{ errorMessage }}</span>
            </div>

            <button type="submit" class="btn-login" :disabled="loading">
              <span v-if="!loading">Masuk ke Portal</span>
              <span v-else class="spinner"></span>
            </button>
          </form>

          <div class="right-footer">
            <p>Sistem Internal. Akses tidak sah dilarang.</p>
            <p>© 2026 MediStock v1.0.0</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })

const supabase = useSupabaseClient()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)

const user = useSupabaseUser()
watchEffect(() => {
  if (user.value) router.push('/dashboard')
})

async function handleLogin() {
  loading.value = true
  errorMessage.value = ''
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })
  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      errorMessage.value = 'Email atau password salah. Silakan coba lagi.'
    } else if (error.message.includes('Email not confirmed')) {
      errorMessage.value = 'Email belum dikonfirmasi. Periksa inbox Anda.'
    } else {
      errorMessage.value = error.message
    }
    loading.value = false
  } else {
    router.push('/dashboard')
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

/* BACKGROUND */
.login-bg {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e8eaf6 0%, #fce4ec 30%, #e3f2fd 60%, #e8f5e9 100%);
  font-family: 'Poppins', system-ui, -apple-system, sans-serif;
  padding: 1rem;
}

/* CARD */
.login-card {
  display: flex;
  width: 100%;
  max-width: 1380px;
  min-height: 800px;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.2), 0 12px 32px rgba(0, 0, 0, 0.12);
}

/* ====== LEFT PANEL ====== */
.left-panel {
  width: 44%;
  background: url('/img/pic4.jpg') center center / cover no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3.5rem 3rem 0;
  position: relative;
  overflow: hidden;
}

/* Dark blue overlay on top of the photo */
.left-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, rgba(15, 30, 80, 0.82) 0%, rgba(21, 60, 160, 0.75) 60%, rgba(10, 50, 120, 0.80) 100%);
  z-index: 0;
}

.left-panel::after {
  content: '';
  position: absolute;
  top: -60px; right: -60px;
  width: 240px; height: 240px;
  background: radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;
}

.left-top {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: relative;
  z-index: 1;
}

.brand img { filter: brightness(0) invert(1); }

.left-headline h1 {
  font-size: 2.6rem;
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
}

.left-headline p {
  font-size: 1.05rem;
  color: rgba(255,255,255,0.72);
  line-height: 1.7;
}

.feature-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 10px;
  padding: 0.85rem 1rem;
  backdrop-filter: blur(4px);
}

.badge-icon {
  width: 30px; height: 30px;
  background: rgba(255,255,255,0.15);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.badge-title {
  font-size: 0.82rem;
  font-weight: 600;
  color: #fff;
}

.badge-sub {
  font-size: 0.72rem;
  color: rgba(255,255,255,0.6);
  margin-top: 2px;
}

/* Illustration */
.left-illustration {
  margin-top: auto;
  background: rgba(255,255,255,0.08);
  border-radius: 14px 14px 0 0;
  padding: 1.75rem 1.5rem;
  border: 1px solid rgba(255,255,255,0.12);
  border-bottom: none;
  position: relative;
  z-index: 1;
}

.illustration-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.illus-lines {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.illus-line {
  height: 6px;
  background: rgba(255,255,255,0.15);
  border-radius: 4px;
}

.illus-line.short { width: 60%; }

/* ====== RIGHT PANEL ====== */
.right-panel {
  flex: 1;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 3.5rem;
}

.right-content {
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
}

.right-header h2 {
  font-size: 2.6rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.6rem;
  letter-spacing: -0.03em;
}

.right-header p {
  font-size: 1rem;
  color: #64748b;
  font-weight: 400;
}

/* FORM */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.field-group label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.06em;
}

.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-link {
  font-size: 0.78rem;
  font-weight: 600;
  color: #1b4fad;
  text-decoration: none;
}

.forgot-link:hover { text-decoration: underline; }

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.field-icon {
  position: absolute;
  left: 0.875rem;
  color: #94a3b8;
  pointer-events: none;
}

.input-wrap input {
  width: 100%;
  padding: 0.72rem 2.75rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  font-size: 0.9rem;
  color: #0f172a;
  background: #f8fafc;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  outline: none;
}

.input-wrap input:focus {
  border-color: #1b4fad;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(27, 79, 173, 0.1);
}

.input-wrap input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.eye-btn {
  position: absolute;
  right: 0.875rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  display: flex;
  align-items: center;
  padding: 0;
  transition: color 0.2s;
}

.eye-btn:hover { color: #475569; }

/* INFO NOTE */
.info-note {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  background: #f1f5f9;
  border-radius: 8px;
  padding: 0.75rem 0.9rem;
  color: #475569;
  font-size: 0.78rem;
  line-height: 1.5;
}

.info-note svg { flex-shrink: 0; margin-top: 2px; }
.info-note strong { color: #0f172a; }

/* ERROR NOTE */
.error-note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 0.7rem 0.9rem;
  color: #dc2626;
  font-size: 0.8rem;
}

/* LOGIN BUTTON */
.btn-login {
  width: 100%;
  padding: 0.85rem;
  background: #1b4fad;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  letter-spacing: 0.01em;
  box-shadow: 0 4px 14px rgba(27, 79, 173, 0.35);
}

.btn-login:hover:not(:disabled) {
  background: #1740a0;
  box-shadow: 0 6px 18px rgba(27, 79, 173, 0.45);
}

.btn-login:active:not(:disabled) { transform: scale(0.99); }
.btn-login:disabled { opacity: 0.65; cursor: not-allowed; }

/* SPINNER */
.spinner {
  width: 18px; height: 18px;
  border: 2.5px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* FOOTER */
.right-footer {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.right-footer p {
  font-size: 0.75rem;
  color: #94a3b8;
}

/* RESPONSIVE */
@media (max-width: 640px) {
  .left-panel { display: none; }
  .login-card { max-width: 420px; }
  .right-panel { padding: 2rem 1.5rem; }
}
</style>
