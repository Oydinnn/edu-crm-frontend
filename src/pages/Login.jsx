import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Slide from "@mui/material/Slide";
import { useAuth } from "../contexts/AuthContext";
import StudyImg from "../assets/imgs/study.svg";
import Logo from "../assets/imgs/logo.png";
import api from "../services/axios";

const initialFormData = {
  phone: '',
  password: '',
};

const initialForgotState = {
  phone: '',
  otp: '',
  password: '',
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorOpen, setErrorOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState('phone');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotMessage, setForgotMessage] = useState('');
  const [forgotForm, setForgotForm] = useState(initialForgotState);
  const [secondsLeft, setSecondsLeft] = useState(60);

  const slideTransition = (props) => <Slide {...props} direction="left" />;

  useEffect(() => {
    if (!forgotOpen || forgotStep !== 'otp' || secondsLeft <= 0) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [forgotOpen, forgotStep, secondsLeft]);

  const resetForgotFlow = () => {
    setForgotStep('phone');
    setForgotLoading(false);
    setForgotError('');
    setForgotMessage('');
    setForgotForm(initialForgotState);
    setSecondsLeft(60);
  };

  const openForgotModal = () => {
    resetForgotFlow();
    setForgotOpen(true);
  };

  const closeForgotModal = () => {
    setForgotOpen(false);
    resetForgotFlow();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleForgotChange = (e) => {
    const { name, value } = e.target;
    setForgotForm((prev) => ({ ...prev, [name]: value }));
    setForgotError('');
    setForgotMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');
    setErrorOpen(false);
    setSuccessOpen(false);

    if (!formData.phone || !formData.password) {
      setError('Iltimos, barcha maydonlarni to\'ldiring');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/login", {
        phone: formData.phone,
        password: formData.password,
      });

      if (response.data.success) {
        const token = response.data.accessToken;
        const role = response.data.role || response.data.data?.role || '';
        const userData = response.data.data;

        login(token, role, userData);
        setSuccessMessage("Tizimga muvaffaqiyatli kirdingiz!");
        setSuccessOpen(true);

        window.setTimeout(() => {
          if (role === 'TEACHER') {
            navigate('/teacher/groups');
          } else if (role === 'STUDENT') {
            navigate('/student/groups');
          } else {
            navigate('/dashboard');
          }
        }, 900);
      }
    } catch (requestError) {
      const errorMessage = requestError.response?.data?.message || "Login yoki parol noto'g'ri!";
      setError(errorMessage);
      setErrorOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    if (!forgotForm.phone) {
      setForgotError('Telefon raqamni kiriting');
      return;
    }

    setForgotLoading(true);
    setForgotError('');
    setForgotMessage('');

    try {
      await api.post('/auth/send-otp', {
        phone: forgotForm.phone,
      });
      setForgotStep('otp');
      setSecondsLeft(60);
      setForgotMessage('Tasdiqlash kodi yuborildi');
    } catch (requestError) {
      setForgotError(requestError.response?.data?.message || 'SMS yuborilmadi');
    } finally {
      setForgotLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!forgotForm.otp) {
      setForgotError('SMS kodni kiriting');
      return;
    }

    setForgotLoading(true);
    setForgotError('');
    setForgotMessage('');

    try {
      await api.post('/auth/verify-otp', {
        phone: forgotForm.phone,
        otp: forgotForm.otp,
      });
      setForgotStep('password');
      setForgotMessage('Kod tasdiqlandi. Yangi parol kiriting');
    } catch (requestError) {
      setForgotError(requestError.response?.data?.message || 'Kod noto\'g\'ri');
    } finally {
      setForgotLoading(false);
    }
  };

  const changePassword = async () => {
    if (!forgotForm.password) {
      setForgotError('Yangi parolni kiriting');
      return;
    }

    setForgotLoading(true);
    setForgotError('');
    setForgotMessage('');

    try {
      await api.put('/auth/change-password', {
        phone: forgotForm.phone,
        password: forgotForm.password,
      });
      setForgotMessage('Parol muvaffaqiyatli yangilandi');
      setTimeout(() => {
        closeForgotModal();
      }, 1200);
    } catch (requestError) {
      setForgotError(requestError.response?.data?.message || 'Parol yangilanmadi');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh w-full bg-slate-50">
      <div className="hidden w-1/2 items-center justify-center bg-gradient-to-br from-blue-950 via-blue-900 to-cyan-800 lg:flex">
        <img className="w-full max-w-2xl" src={StudyImg} alt="Study" />
      </div>

      <div className="flex w-full items-center justify-center px-4 py-10 lg:w-1/2">
        <div className="w-full max-w-md rounded-3xl bg-white/95 p-8 shadow-[0_25px_70px_rgba(15,23,42,0.12)] ring-1 ring-slate-200/70">
          <div className="flex flex-col items-center gap-5 text-center">
            <h1 className="text-xl font-bold text-slate-800">
              MUHAMMAD AL-XORAZMIY NOMIDAGI<br />
              TOSHKENT AXBOROT TEXNOLOGIYALARI<br />
              UNIVERSITETI
            </h1>
            <img src={Logo} alt="logo" className="h-20 w-20" />
            <h2 className="text-base font-semibold tracking-[0.24em] text-slate-500">
              LEARNING MANAGEMENT SYSTEM
            </h2>

            <form onSubmit={handleSubmit} className="w-full text-left">
              <div className="mb-5">
                <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-700">
                  Telefon raqam
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+998901234567"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
                  Parol
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Parolni kiriting"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-blue-600"
                  >
                    {showPassword ? 'Yashirish' : 'Ko\'rsatish'}
                  </button>
                </div>
              </div>

              <div className="mb-6 flex items-center justify-end">
                <button
                  type="button"
                  onClick={openForgotModal}
                  className="text-sm font-medium text-blue-600 transition hover:text-blue-700 hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Yuklanmoqda...' : 'Kirish'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-800">Parolni tiklash</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Telefon raqam, SMS kod va yangi parol orqali tiklash.
                </p>
              </div>
              <button
                type="button"
                onClick={closeForgotModal}
                className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {forgotError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {forgotError}
                </div>
              )}

              {forgotMessage && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {forgotMessage}
                </div>
              )}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Telefon raqam
                </label>
                <input
                  name="phone"
                  type="tel"
                  value={forgotForm.phone}
                  onChange={handleForgotChange}
                  placeholder="+998903551116"
                  disabled={forgotStep !== 'phone'}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100"
                />
              </div>

              {forgotStep === 'phone' && (
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={forgotLoading}
                  className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {forgotLoading ? 'SMS yuborilmoqda...' : 'SMS kod yuborish'}
                </button>
              )}

              {forgotStep === 'otp' && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      SMS kod
                    </label>
                    <input
                      name="otp"
                      type="text"
                      inputMode="numeric"
                      value={forgotForm.otp}
                      onChange={handleForgotChange}
                      placeholder="123456"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      {secondsLeft > 0 ? `Qolgan vaqt: ${secondsLeft} soniya` : 'SMS vaqti tugadi'}
                    </span>
                    {secondsLeft === 0 && (
                      <button
                        type="button"
                        onClick={sendOtp}
                        disabled={forgotLoading}
                        className="font-medium text-blue-600 transition hover:text-blue-700 hover:underline"
                      >
                        Qayta SMS yuborish
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={verifyOtp}
                    disabled={forgotLoading}
                    className="w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {forgotLoading ? 'Tekshirilmoqda...' : 'SMS kodni tasdiqlash'}
                  </button>
                </>
              )}

              {forgotStep === 'password' && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Yangi parol
                    </label>
                    <input
                      name="password"
                      type="password"
                      value={forgotForm.password}
                      onChange={handleForgotChange}
                      placeholder="Yangi parol"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={changePassword}
                    disabled={forgotLoading}
                    className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {forgotLoading ? 'Yangilanmoqda...' : 'Parolni yangilash'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <Snackbar
        open={errorOpen}
        autoHideDuration={3000}
        onClose={() => setErrorOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={slideTransition}
      >
        <Alert
          onClose={() => setErrorOpen(false)}
          severity="error"
          sx={{
            width: '100%',
            bgcolor: '#e81411ff',
            color: '#fff',
            '& .MuiAlert-icon': { color: '#fff' },
          }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={successOpen}
        autoHideDuration={2000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={slideTransition}
      >
        <Alert
          onClose={() => setSuccessOpen(false)}
          severity="success"
          sx={{
            width: '100%',
            bgcolor: '#0fbe18ff',
            color: '#fff',
            '& .MuiAlert-icon': { color: '#fff' },
          }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
