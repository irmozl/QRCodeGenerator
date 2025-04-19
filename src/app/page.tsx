"use client";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { FiDownload, FiCopy, FiSend } from "react-icons/fi";

export default function Home() {
  const [qrCode, setQrCode] = useState("");
  const [url, setUrl] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isValidUrl = (url: string) => {
    const pattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/;
    return pattern.test(url.trim());
  };

  // Check for dark mode preference
  useEffect(() => {
    const prefersDarkMode = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setIsDarkMode(prefersDarkMode);
  }, []);


  const generatedQrCode = async () => {
    setErrorMessage("");
    setQrCode("");

    if (url.trim() === "" || !isValidUrl(url)) {
      setErrorMessage(
        "❗ Please write an url adress (exp: https://www.site.com)"
      );
      return;
    }

    setLoading(true);
    try {
      const qrCodeData = await QRCode.toDataURL(url);
      setQrCode(qrCodeData);
    } catch (error) {
      console.error("Failed to copy QR code:", error);
      setErrorMessage("🚫 Failed to copy QR code.");
    } finally {
      setLoading(false);
    }
  };

  const QrDownload = () => {
    const link = document.createElement("a");
    link.href = qrCode;
    link.download = "qrCode.png";
    link.click();
  };

  const QrCopy = async () => {
    if (qrCode) {
      try {
        await navigator.clipboard.writeText(qrCode);
        alert("Qr Code copied to clipboard");
      } catch (error) {
        console.error("Failed to copy QR code:", error);
      }
    }
  };

  return (
    <main
      className={`${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      } min-h-screen flex items-center justify-center p-4`}
    >
      <div>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={` absolute top-4 right-4 p-2 rounded-full ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } transition duration-300`}
        >
          {isDarkMode ? "🌙" : "☀️"}
        </button>
        <div
          className={`backdrop-blur-lg ${
            isDarkMode
              ? "bg-white/10 border-gray-700"
              : "bg-white border-gray-200"
          } rounded-2xl shadow-xl p-8 max-w-md w-full text-center space-y-6 border`}
        >
          <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-300 drop-shadow">
            QR Code Generator
          </h1>
          <input
            type="text"
            placeholder="Please write an URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition ${
              isDarkMode
                ? "text-white bg-gray-800 border-gray-700"
                : "text-gray-800 bg-white border-gray-300"
            }`}
          />
          <button
            onClick={generatedQrCode}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full transition transform hover:scale-105 shadow-md flex items-center justify-center space-x-2"
          >
            <FiSend />
            <span>Generate</span>
          </button>
          {errorMessage && (
            <div className="bg-red-100 text-red-700 border border-red-400 p-3 rounded-md mt-2 animate-pulse">
              {errorMessage}
            </div>
          )}
          {qrCode && (
            <p className="text-green-500 font-semibold">✅ QR Ready!</p>
          )}

          {qrCode && (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative animate-pulse">
                <img
                  src={qrCode}
                  alt="QrCode"
                  width={200}
                  height={200}
                  className="rounded-xl shadow-lg border border-purple-300 dark:border-purple-600"
                />
                <div className="absolute inset-0 rounded-xl border-4 border-dashed border-white opacity-20 animate-spin-slow"></div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 w-full justify-center">
                <button
                  onClick={QrDownload}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full transition hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <FiDownload />
                  <span>Download</span>
                </button>

                <button
                  onClick={QrCopy}
                  className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-full transition hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <FiCopy />
                  <span>Copy</span>
                </button>
              </div>
            </div>
          )}
          {loading && (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-8 w-8 text-purple-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              <span className="ml-2 text-purple-500 font-medium">
                QR oluşturuluyor...
              </span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
