import { useState } from "react";
import logo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

export default function HomeSignUp() {
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-5">
      {/* Header */}
      <header className="w-full max-w-6xl flex items-center px-6 py-4 mb-3">
        <div className="flex items-center space-x-3">
       
          {/* Text */}
          <h1 className="text-2xl font-bold text-gray-800">BetaTesting</h1>
        </div>
      </header>
      <div className="w-full border-b border-gray-300"></div>
      {/* Title */}
      <div className="mt-10 text-center">
        <span className="bg-purple-200 text-purple-800 px-3 py-1 rounded-md text-sm font-medium">
          Let&apos;s get you signed up!
        </span>
        <h2 className="mt-6 text-2xl font-bold">Which best describes you?</h2>
      </div>

      {/* Options */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full px-6">
        {/* Company Card */}
        <div
          onClick={() => navigate("/signup")}
          className={`cursor-pointer border rounded-xl p-8 text-center hover:shadow-md transition $ {
            role === "company" ? "border-purple-600" : "border-gray-300"
          }`}
        >
          <h3 className="text-lg font-semibold mb-3">Company</h3>
          <p className="text-gray-600">
            I work for a company and want to use BetaTesting for testing or user
            research for our products.
          </p>
          <div className="mt-6 flex justify-center">
            <div className="w-12 h-12 border-2 border-gray-500 rounded-md flex items-center justify-center">
              <div className="grid grid-cols-2 gap-1 w-8 h-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="border border-gray-400"></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Beta Tester Card */}
        <div
          onClick={() => setRole("tester")}
          className={`cursor-pointer border rounded-xl p-8 text-center hover:shadow-md transition $ {
            role === "tester" ? "border-purple-600" : "border-gray-300"
          }`}
        >
          <h3 className="text-lg font-semibold mb-3">Beta Tester</h3>
          <p className="text-gray-600">
            I want to sign up as a Beta Tester and get paid to test and provide
            feedback.
          </p>
          <div className="mt-6 flex justify-center">
            <div className="grid grid-cols-3 gap-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-8 border border-gray-500 rounded-md"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
