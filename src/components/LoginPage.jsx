import StudyImg from "../assets/imgs/study.svg"
import Logo from "../assets/imgs/newlogotype.png"


export default function LoginPage(){
  return(
    <div className="flex justify-between w-full h-dvh">


      <div className="w-1/2 bg-blue-900 flex items-center">
        <img className="w-full" src={StudyImg} alt="StudyImg" />
      </div>



      <div className="flex flex-col justify-center items-center">
        <div className="w-1/2 flex flex-col justify-center items-center text-center gap-6 mb-48">
          <h1>
          MUHAMMAD AL-XORAZMIY NOMIDAGI TOSHKENT AXBOROT TEXNOLOGIYALARI UNIVERSITETI
          </h1>
          <img src={Logo} alt="logo" />
          <h1>LEARNING MANAGMENT SYSTEM</h1>
     
          <form className="text-left w-full">
            <div className="mb-8">
              <label htmlFor="login">Login</label>
              <input 
                id="login"
                name="login"
                type="text" 
                placeholder="Loginni kiriting" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="mb-8">
              <label htmlFor="password">Parol</label>
              <input 
                id="password"
                name="password"
                type="password" 
                placeholder="Parolni kiriting" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            <button type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out transform hover:scale-[1.02]"
            >Kirish</button>
          </form>

        </div>

        {/* Footer */}
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Copyright © 2021 of Tashkent University of Information Technologies
            </p>
          </div>


      </div>
          

    </div>
  )
}