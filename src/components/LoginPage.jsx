// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../contexts/AuthContext";  // ✅ AuthContext'dan import
import StudyImg from "../assets/imgs/study.svg";
import Logo from "../assets/imgs/newlogotype.png";
import axios from 'axios';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();  // ✅ Context'dan login funksiyasi
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.phone || !formData.password) {
      setError('Iltimos, barcha maydonlarni to\'ldiring');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/v1/auth/login", {
        phone: formData.phone,
        password: formData.password,
      });

      if (response.data.success) {
        const token = response.data.accessToken;
        const role = response.data.data?.role || '';
        
        // ✅ Context orqali global state yangilash + localStorage
        login(token);
        localStorage.setItem('role', role);
        
        console.log('Login success:', response);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error.response?.data?.message || 'Login yoki parol noto\'g\'ri';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between w-full h-dvh">
      {/* Chap taraf - Rasm */}
      <div className="w-1/2 bg-blue-900 flex items-center">
        <img className="w-full" src={StudyImg} alt="StudyImg" />
      </div>

      {/* O'ng taraf - Forma */}
      <div className="w-1/2 flex flex-col justify-center items-center">
        <div className="w-[70%] max-w-md flex flex-col justify-center items-center text-center gap-6 mb-48">
          <h1 className="text-xl font-bold text-gray-800">
            MUHAMMAD AL-XORAZMIY NOMIDAGI<br />
            TOSHKENT AXBOROT TEXNOLOGIYALARI<br />
            UNIVERSITETI
          </h1>
          <img src={Logo} alt="logo" className="w-20 h-20" />
          <h2 className="text-lg font-semibold text-gray-600">
            LEARNING MANAGEMENT SYSTEM
          </h2>

          {/* Xatolik xabari */}
          {error && (
            <div className="w-full bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Forma */}
          <form onSubmit={handleSubmit} className="text-left w-full">
            {/* Telefon input */}
            <div className="mb-6">
              <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                Telefon raqam
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+998901234567"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Parol input + Ko'zcha */}
            <div className="mb-8">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
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
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m-3.65 8.122L3 21m3.228-3.228l3.65-3.65" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Yuklanmoqda...
                </div>
              ) : (
                'Kirish'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Copyright © 2021 of Tashkent University of Information Technologies
          </p>
        </div>
      </div>
    </div>
  );
}



























// // src/pages/LoginPage.jsx
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import StudyImg from "../assets/imgs/study.svg";
// import Logo from "../assets/imgs/newlogotype.png";
// import axios from 'axios';

// export default function LoginPage() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [showPassword, setShowPassword] = useState(false); // 👈 Ko'zcha uchun
//   const [formData, setFormData] = useState({
//     phone: '',
//     password: '',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     if (!formData.phone || !formData.password) {
//       setError('Iltimos, barcha maydonlarni to\'ldiring');
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.post("http://localhost:3000/api/v1/auth/login", {
//         phone: formData.phone,
//         password: formData.password,
//       });

//       if (response.data.success) {
//         localStorage.setItem('token', response.data.accessToken);
//         localStorage.setItem('role', response.data.data?.role || '');
//         console.log('Login success:', response);
//         navigate('/dashboard');
//       }
//     } catch (error) {
//       console.error('Login failed:', error);
//       const errorMessage = error.response?.data?.message || 'Login yoki parol noto\'g\'ri';
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-between w-full h-dvh">
//       {/* Chap taraf - Rasm */}
//       <div className="w-1/2 bg-blue-900 flex items-center">
//         <img className="w-full" src={StudyImg} alt="StudyImg" />
//       </div>

//       {/* O'ng taraf - Forma */}
//       <div className="w-1/2 flex flex-col justify-center items-center">
//         <div className="w-[70%] max-w-md flex flex-col justify-center items-center text-center gap-6 mb-48">
//           <h1 className="text-xl font-bold text-gray-800">
//             MUHAMMAD AL-XORAZMIY NOMIDAGI<br />
//             TOSHKENT AXBOROT TEXNOLOGIYALARI<br />
//             UNIVERSITETI
//           </h1>
//           <img src={Logo} alt="logo" className="w-20 h-20" />
//           <h2 className="text-lg font-semibold text-gray-600">
//             LEARNING MANAGEMENT SYSTEM
//           </h2>

//           {/* Xatolik xabari */}
//           {error && (
//             <div className="w-full bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm">
//               {error}
//             </div>
//           )}

//           {/* Forma */}
//           <form onSubmit={handleSubmit} className="text-left w-full">
//             {/* Telefon input */}
//             <div className="mb-6">
//               <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
//                 Telefon raqam
//               </label>
//               <input
//                 id="phone"
//                 name="phone"
//                 type="tel"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 placeholder="+998901234567"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//               />
//             </div>

//             {/* Parol input + Ko'zcha */}
//             <div className="mb-8">
//               <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
//                 Parol
//               </label>
//               <div className="relative">
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="Parolni kiriting"
//                   className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition"
//                 >
//                   {showPassword ? (
//                     // Ko'zcha yopiq (parol ko'rinadi)
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                   ) : (
//                     // Ko'zcha ochiq (parol yashirin)
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m-3.65 8.122L3 21m3.228-3.228l3.65-3.65" />
//                     </svg>
//                   )}
//                 </button>
//               </div>
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <div className="flex items-center justify-center gap-2">
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   Yuklanmoqda...
//                 </div>
//               ) : (
//                 'Kirish'
//               )}
//             </button>
//           </form>
//         </div>

//         {/* Footer */}
//         <div className="text-center mt-8">
//           <p className="text-gray-500 text-sm">
//             Copyright © 2021 of Tashkent University of Information Technologies
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }







// import StudyImg from "../assets/imgs/study.svg"
// import Logo from "../assets/imgs/newlogotype.png"


// export default function LoginPage(){
//   return(
//     <div className="flex justify-between w-full h-dvh">


//       <div className="w-1/2 bg-blue-900 flex items-center">
//         <img className="w-full" src={StudyImg} alt="StudyImg" />
//       </div>



//       <div className="flex flex-col justify-center items-center">
//         <div className="w-1/2 flex flex-col justify-center items-center text-center gap-6 mb-48">
//           <h1>
//           MUHAMMAD AL-XORAZMIY NOMIDAGI TOSHKENT AXBOROT TEXNOLOGIYALARI UNIVERSITETI
//           </h1>
//           <img src={Logo} alt="logo" />
//           <h1>LEARNING MANAGMENT SYSTEM</h1>
     
//           <form className="text-left w-full">
//             <div className="mb-8">
//               <label htmlFor="login">Login</label>
//               <input 
//                 id="login"
//                 name="login"
//                 type="text" 
//                 placeholder="Loginni kiriting" 
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg"
//               />
//             </div>

//             <div className="mb-8">
//               <label htmlFor="password">Parol</label>
//               <input 
//                 id="password"
//                 name="password"
//                 type="password" 
//                 placeholder="Parolni kiriting" 
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg"
//               />
//             </div>

//             <button type="submit"
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.02]"
//             >Kirish</button>
//           </form>

//         </div>

//         {/* Footer */}
//           <div className="text-center">
//             <p className="text-gray-500 text-sm">
//               Copyright © 2021 of Tashkent University of Information Technologies
//             </p>
//           </div>


//       </div>
          

//     </div>
//   )
// }