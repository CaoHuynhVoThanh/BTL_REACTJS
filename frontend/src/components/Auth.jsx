import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';
import { apiPath } from '../utils/api';

const API = apiPath('/auth');
const LOGO_SRC = '/FUJIFILM-Logo-white.png';

/* ─────────────────────────── helpers ──────────────────────────── */
function Toast({ msg, type }) {
    if (!msg) return null;
    return <div className={`auth-toast ${type}`}>{msg}</div>;
}

/* ═══════════════════════════ LOGIN ════════════════════════════════ */
function LoginForm({ onSwitch, onClose }) {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${API}/login/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('access', data.tokens.access);
                localStorage.setItem('refresh', data.tokens.refresh);
                localStorage.setItem('user', JSON.stringify(data.user));
                onClose();
                window.location.reload();
            } else {
                const msg = data.non_field_errors?.[0] || data.detail || 'Đăng nhập thất bại.';
                setError(msg);
            }
        } catch {
            setError('Lỗi kết nối máy chủ.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-card">
            <button className="auth-close-btn" onClick={onClose}>✕</button>
            <div className="auth-logo">
                <img src={LOGO_SRC} alt="Fujifilm" />
            </div>
            <h2 className="auth-title">Đăng nhập</h2>
            <p className="auth-subtitle">Chào mừng bạn trở lại!</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
                <div className="auth-field">
                    <label>Email</label>
                    <input type="email" name="email" value={form.email}
                        onChange={handleChange} placeholder="example@email.com" required />
                </div>
                <div className="auth-field">
                    <label>Mật khẩu</label>
                    <input type="password" name="password" value={form.password}
                        onChange={handleChange} placeholder="Nhập mật khẩu" required />
                </div>
                <div className="auth-forgot">
                    <button type="button" className="auth-link-btn" onClick={() => onSwitch('forgot')}>
                        Quên mật khẩu?
                    </button>
                </div>
                <button type="submit" className="auth-submit-btn" disabled={loading}>
                    {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
            </form>

            <p className="auth-switch">
                Chưa có tài khoản?{' '}
                <button className="auth-link-btn" onClick={() => onSwitch('register')}>Đăng ký ngay</button>
            </p>
        </div>
    );
}

/* ════════════════════════ REGISTER ════════════════════════════════ */
function RegisterForm({ onSwitch, onClose }) {
    const [form, setForm] = useState({
        email: '', username: '', first_name: '', last_name: '',
        phone: '', password: '', confirm_password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirm_password) {
            setError('Mật khẩu xác nhận không khớp!');
            return;
        }
        setLoading(true);
        try {
            const { confirm_password, ...payload } = form;
            const res = await fetch(`${API}/register/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('access', data.tokens.access);
                localStorage.setItem('refresh', data.tokens.refresh);
                localStorage.setItem('user', JSON.stringify(data.user));
                onClose();
                window.location.reload();
            } else {
                // Flatten DRF error object
                const msgs = Object.entries(data)
                    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
                    .join('\n');
                setError(msgs);
            }
        } catch {
            setError('Lỗi kết nối máy chủ.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-card">
            <button className="auth-close-btn" onClick={onClose}>✕</button>
            <div className="auth-logo">
                <img src={LOGO_SRC} alt="Fujifilm" />
            </div>
            <h2 className="auth-title">Tạo tài khoản</h2>
            <p className="auth-subtitle">Đăng ký để trải nghiệm mua sắm tốt hơn</p>

            {error && <div className="auth-error" style={{ whiteSpace: 'pre-line' }}>{error}</div>}

            <form onSubmit={handleSubmit} className="auth-form">
                <div className="auth-row">
                    <div className="auth-field">
                        <label>Họ</label>
                        <input type="text" name="last_name" value={form.last_name}
                            onChange={handleChange} placeholder="Nguyễn" />
                    </div>
                    <div className="auth-field">
                        <label>Tên</label>
                        <input type="text" name="first_name" value={form.first_name}
                            onChange={handleChange} placeholder="Văn A" />
                    </div>
                </div>
                <div className="auth-field">
                    <label>Tên đăng nhập <span className="req">*</span></label>
                    <input type="text" name="username" value={form.username}
                        onChange={handleChange} placeholder="username" required />
                </div>
                <div className="auth-field">
                    <label>Email <span className="req">*</span></label>
                    <input type="email" name="email" value={form.email}
                        onChange={handleChange} placeholder="example@email.com" required />
                </div>
                <div className="auth-field">
                    <label>Số điện thoại</label>
                    <input type="tel" name="phone" value={form.phone}
                        onChange={handleChange} placeholder="0901234567" />
                </div>
                <div className="auth-field">
                    <label>Mật khẩu <span className="req">*</span></label>
                    <input type="password" name="password" value={form.password}
                        onChange={handleChange} placeholder="Ít nhất 8 ký tự" required minLength={8} />
                </div>
                <div className="auth-field">
                    <label>Xác nhận mật khẩu <span className="req">*</span></label>
                    <input type="password" name="confirm_password" value={form.confirm_password}
                        onChange={handleChange} placeholder="Nhập lại mật khẩu" required />
                </div>
                <button type="submit" className="auth-submit-btn" disabled={loading}>
                    {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                </button>
            </form>

            <p className="auth-switch">
                Đã có tài khoản?{' '}
                <button className="auth-link-btn" onClick={() => onSwitch('login')}>Đăng nhập</button>
            </p>
        </div>
    );
}

/* ════════════════════ FORGOT PASSWORD ═════════════════════════════ */
const FORGOT_STEP = { EMAIL: 'email', OTP: 'otp', NEW_PASS: 'new_pass', DONE: 'done' };

function ForgotForm({ onSwitch, onClose }) {
    const [step, setStep] = useState(FORGOT_STEP.EMAIL);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [toast, setToast] = useState('');
    const [countdown, setCountdown] = useState(0);

    const showToast = msg => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    const startCountdown = () => {
        setCountdown(60);
        const interval = setInterval(() => {
            setCountdown(c => {
                if (c <= 1) { clearInterval(interval); return 0; }
                return c - 1;
            });
        }, 1000);
    };

    /* Step 1: Send OTP */
    const handleSendOTP = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${API}/send-otp/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, purpose: 'reset_password' }),
            });
            const data = await res.json();
            if (res.ok) {
                setStep(FORGOT_STEP.OTP);
                startCountdown();
                showToast(`OTP đã gửi tới ${email}`);
            } else {
                setError(data.detail || 'Không thể gửi OTP.');
            }
        } catch {
            setError('Lỗi kết nối.');
        } finally {
            setLoading(false);
        }
    };

    /* Step 2: Verify OTP */
    const handleVerifyOTP = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await fetch(`${API}/verify-otp/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, purpose: 'reset_password' }),
            });
            const data = await res.json();
            if (res.ok) {
                setResetToken(data.reset_token);
                setStep(FORGOT_STEP.NEW_PASS);
            } else {
                setError(data.detail || 'OTP không đúng.');
            }
        } catch {
            setError('Lỗi kết nối.');
        } finally {
            setLoading(false);
        }
    };

    /* Step 3: Reset password */
    const handleResetPassword = async e => {
        e.preventDefault();
        setError('');
        if (newPass !== confirmPass) { setError('Mật khẩu xác nhận không khớp!'); return; }
        setLoading(true);
        try {
            const res = await fetch(`${API}/reset-password/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, reset_token: resetToken, new_password: newPass }),
            });
            const data = await res.json();
            if (res.ok) {
                setStep(FORGOT_STEP.DONE);
            } else {
                setError(data.detail || 'Không thể đặt lại mật khẩu.');
            }
        } catch {
            setError('Lỗi kết nối.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-card">
            <button className="auth-close-btn" onClick={onClose}>✕</button>
            <div className="auth-logo">
                <img src={LOGO_SRC} alt="Fujifilm" />
            </div>

            {/* Progress dots */}
            <div className="forgot-steps">
                {['email', 'otp', 'new_pass'].map((s, i) => (
                    <div key={s} className={`step-dot ${Object.values(FORGOT_STEP).indexOf(step) >= i ? 'active' : ''}`} />
                ))}
            </div>

            {toast && <Toast msg={toast} type="success" />}

            {step === FORGOT_STEP.EMAIL && (
                <>
                    <h2 className="auth-title">Quên mật khẩu</h2>
                    <p className="auth-subtitle">Nhập email để nhận mã OTP xác minh</p>
                    {error && <div className="auth-error">{error}</div>}
                    <form onSubmit={handleSendOTP} className="auth-form">
                        <div className="auth-field">
                            <label>Email tài khoản</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                placeholder="example@email.com" required />
                        </div>
                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? 'Đang gửi...' : 'Gửi mã OTP'}
                        </button>
                    </form>
                </>
            )}

            {step === FORGOT_STEP.OTP && (
                <>
                    <h2 className="auth-title">Nhập mã OTP</h2>
                    <p className="auth-subtitle">Mã OTP đã được gửi tới <strong>{email}</strong></p>
                    {error && <div className="auth-error">{error}</div>}
                    <form onSubmit={handleVerifyOTP} className="auth-form">
                        <div className="auth-field">
                            <label>Mã OTP (6 chữ số)</label>
                            <input type="text" value={otp} onChange={e => setOtp(e.target.value)}
                                placeholder="xxxxxx" maxLength={6} required className="otp-input" />
                        </div>
                        <div className="otp-resend">
                            {countdown > 0
                                ? <span className="otp-countdown">Gửi lại sau {countdown}s</span>
                                : <button type="button" className="auth-link-btn" onClick={handleSendOTP}>Gửi lại OTP</button>
                            }
                        </div>
                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? 'Đang xác minh...' : 'Xác minh OTP'}
                        </button>
                    </form>
                </>
            )}

            {step === FORGOT_STEP.NEW_PASS && (
                <>
                    <h2 className="auth-title">Đặt mật khẩu mới</h2>
                    <p className="auth-subtitle">Mật khẩu phải có ít nhất 8 ký tự</p>
                    {error && <div className="auth-error">{error}</div>}
                    <form onSubmit={handleResetPassword} className="auth-form">
                        <div className="auth-field">
                            <label>Mật khẩu mới</label>
                            <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)}
                                placeholder="Ít nhất 8 ký tự" required minLength={8} />
                        </div>
                        <div className="auth-field">
                            <label>Xác nhận mật khẩu</label>
                            <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)}
                                placeholder="Nhập lại mật khẩu" required />
                        </div>
                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? 'Đang cập nhật...' : 'Đặt lại mật khẩu'}
                        </button>
                    </form>
                </>
            )}

            {step === FORGOT_STEP.DONE && (
                <div className="auth-done">
                    <div className="auth-done-icon">✅</div>
                    <h2 className="auth-title">Thành công!</h2>
                    <p className="auth-subtitle">Mật khẩu đã được đặt lại. Vui lòng đăng nhập lại.</p>
                    <button className="auth-submit-btn" onClick={() => onSwitch('login')}>
                        Đăng nhập ngay
                    </button>
                </div>
            )}

            <p className="auth-switch" style={{ marginTop: '20px' }}>
                <button className="auth-link-btn" onClick={() => onSwitch('login')}>← Quay lại đăng nhập</button>
            </p>
        </div>
    );
}

/* ════════════════════════ MAIN AUTH ════════════════════════════════ */
export default function Auth({ onClose }) {
    const [view, setView] = useState('login'); // 'login' | 'register' | 'forgot'

    return (
        <div className="auth-page">
            <div className="auth-bg" />
            <div className="auth-wrapper">
                {view === 'login' && <LoginForm onSwitch={setView} onClose={onClose} />}
                {view === 'register' && <RegisterForm onSwitch={setView} onClose={onClose} />}
                {view === 'forgot' && <ForgotForm onSwitch={setView} onClose={onClose} />}
            </div>
        </div>
    );
}
