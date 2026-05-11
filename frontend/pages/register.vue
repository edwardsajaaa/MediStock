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
            <h1>Bergabung dengan<br />tim farmasi digital.</h1>
            <p>Daftarkan akun Anda untuk mulai menggunakan sistem manajemen inventaris MediStock.</p>
          </div>

          <div class="feature-badge">
            <div class="badge-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <div class="badge-title">Multi-Role</div>
              <div class="badge-sub">Admin dan Staf Farmasi dalam satu sistem</div>
            </div>
          </div>
        </div>

        <div class="left-illustration">
          <div class="illustration-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg>
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
            <h2>Buat Akun Baru</h2>
            <p>Lengkapi data berikut untuk mendaftarkan akun sistem.</p>
          </div>

          <form class="login-form" @submit.prevent="handleRegister">
            <!-- Name -->
            <div class="field-group">
              <label>NAMA LENGKAP</label>
              <div class="input-wrap">
                <svg class="field-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input
                  v-model="fullName"
                  type="text"
                  placeholder="Nama lengkap Anda"
                  required
                  :disabled="loading"
                />
              </div>
            </div>

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

            <!-- Role -->
            <div class="field-group">
              <label>PERAN</label>
              <div class="input-wrap">
                <svg class="field-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <select v-model="role" class="select-role" :disabled="loading">
                  <option value="staf">Staf Farmasi</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <!-- Password -->
            <div class="field-group">
              <label>PASSWORD</label>
              <div class="input-wrap">
                <svg class="field-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Minimal 6 karakter"
                  required
                  :disabled="loading"
                />
                <button type="button" class="eye-btn" @click="showPassword = !showPassword">
                  <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                </button>
              </div>
            </div>

            <!-- Confirm Password -->
            <div class="field-group">
              <label>KONFIRMASI PASSWORD</label>
              <div class="input-wrap">
                <svg class="field-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  v-model="confirmPassword"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Ulangi password Anda"
                  required
                  :disabled="loading"
                />
              </div>
            </div>

            <!-- Success -->
            <div v-if="successMessage" class="success-note">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <span>{{ successMessage }}</span>
            </div>

            <!-- Error -->
            <div v-if="errorMessage" class="error-note">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              <span>{{ errorMessage }}</span>
            </div>

            <button type="submit" class="btn-login" :disabled="loading">
              <span v-if="!loading">Daftarkan Akun</span>
              <span v-else class="spinner"></span>
            </button>
          </form>

          <div class="register-link-section">
            <p>Sudah punya akun? <NuxtLink to="/login" class="link-green">Masuk di sini</NuxtLink></p>
          </div>

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
definePageMeta({
  layout: false,
  middleware: 'guest',
})

const supabase = useSupabaseClient()
const router = useRouter()

const fullName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('staf')
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showPassword = ref(false)

const user = useSupabaseUser()
watchEffect(() => {
  if (user.value) router.push('/dashboard')
})

async function handleRegister() {
  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  if (password.value.length < 6) {
    errorMessage.value = 'Password harus minimal 6 karakter.'
    loading.value = false
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Password dan konfirmasi tidak cocok.'
    loading.value = false
    return
  }

  try {
    const { error } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          full_name: fullName.value,
          role: role.value,
        }
      }
    })

    if (error) {
      if (error.message.includes('already registered')) {
        errorMessage.value = 'Email sudah terdaftar. Silakan gunakan email lain.'
      } else {
        errorMessage.value = error.message
      }
    } else {
      successMessage.value = 'Akun berhasil dibuat! Silakan periksa email untuk konfirmasi, lalu masuk.'
      fullName.value = ''
      email.value = ''
      password.value = ''
      confirmPassword.value = ''
      role.value = 'staf'
    }
  } finally {
    loading.value = false
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
  background:
    radial-gradient(circle at 15% 20%, rgba(74, 222, 128, 0.14) 0%, transparent 45%),
    linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  font-family: 'Poppins', system-ui, -apple-system, sans-serif;
  padding: 1rem;
}

/* CARD */
.login-card {
  --brand-dark: #080f1a;
  --brand-dark-soft: #0f172a;
  --brand-surface: #f8fafc;
  --brand-muted: #64748b;
  --brand-muted-light: #94a3b8;
  --brand-green: #22c55e;
  --brand-green-hover: #16a34a;
  display: flex;
  width: 100%;
  max-width: 1380px;
  min-height: 800px;
  border-radius: 28px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 34px 80px rgba(8, 15, 26, 0.22), 0 12px 26px rgba(15, 23, 42, 0.16);
}

/* ====== LEFT PANEL ====== */
.left-panel {
  width: 44%;
  background: url('/img/pic1.jpg') center center / cover no-repeat;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 3.5rem 3rem 0;
  position: relative;
  overflow: hidden;
}

.left-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(8, 15, 26, 0.94) 12%, rgba(8, 15, 26, 0.72) 62%, rgba(8, 15, 26, 0.48) 100%);
  z-index: 0;
}

.left-panel::after {
  content: '';
  position: absolute;
  top: -120px;
  right: -80px;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(74, 222, 128, 0.16) 0%, transparent 72%);
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
  font-weight: 600;
  color: #fff;
  line-height: 1.14;
  margin-bottom: 1rem;
  letter-spacing: -0.03em;
}

.left-headline p {
  font-size: 1.05rem;
  font-weight: 300;
  color: rgba(255,255,255,0.62);
  line-height: 1.8;
}

.feature-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(74, 222, 128, 0.28);
  border-radius: 10px;
  padding: 0.85rem 1rem;
  backdrop-filter: blur(6px);
}

.badge-icon {
  width: 30px; height: 30px;
  background: rgba(34, 197, 94, 0.18);
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
  color: rgba(255,255,255,0.7);
  margin-top: 2px;
}

/* Illustration */
.left-illustration {
  margin-top: auto;
  background: rgba(255,255,255,0.06);
  border-radius: 14px 14px 0 0;
  padding: 1.75rem 1.5rem;
  border: 1px solid rgba(74, 222, 128, 0.2);
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
  background: linear-gradient(180deg, #ffffff 0%, var(--brand-surface) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 3.5rem;
}

.right-content {
  width: 100%;
  max-width: 460px;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.right-header h2 {
  font-size: 2.4rem;
  font-weight: 600;
  color: var(--brand-dark-soft);
  margin-bottom: 0.5rem;
  letter-spacing: -0.03em;
}

.right-header p {
  font-size: 1rem;
  color: var(--brand-muted);
  font-weight: 300;
}

/* FORM */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-group label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--brand-muted-light);
  letter-spacing: 0.06em;
}

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

.input-wrap input,
.select-role {
  width: 100%;
  padding: 0.72rem 2.75rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #0f172a;
  background: #f8fafc;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  outline: none;
  font-family: inherit;
}

.input-wrap input:focus,
.select-role:focus {
  border-color: var(--brand-green);
  background: #fff;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.14);
}

.input-wrap input:disabled,
.select-role:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.select-role {
  appearance: none;
  cursor: pointer;
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

/* SUCCESS NOTE */
.success-note {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  background: #ecfdf5;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 0.75rem 0.9rem;
  color: #14532d;
  font-size: 0.78rem;
  line-height: 1.5;
}

.success-note svg { flex-shrink: 0; margin-top: 2px; }

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
  padding: 0.9rem 1.2rem;
  background: var(--brand-green);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s, box-shadow 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  letter-spacing: 0.01em;
  box-shadow: 0 6px 16px rgba(34, 197, 94, 0.35);
  font-family: inherit;
}

.btn-login:hover:not(:disabled) {
  background: var(--brand-green-hover);
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(22, 163, 74, 0.45);
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

/* Register Link */
.register-link-section {
  text-align: center;
}

.register-link-section p {
  font-size: 0.85rem;
  color: var(--brand-muted);
}

.link-green {
  color: var(--brand-green-hover);
  font-weight: 600;
  text-decoration: none;
}

.link-green:hover {
  text-decoration: underline;
}

/* FOOTER */
.right-footer {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.right-footer p {
  font-size: 0.75rem;
  color: var(--brand-muted-light);
}

.right-footer p:last-child {
  color: #64748b;
}

/* RESPONSIVE */
@media (max-width: 640px) {
  .left-panel { display: none; }
  .login-card { max-width: 420px; }
  .right-panel { padding: 2rem 1.5rem; }
}
</style>
