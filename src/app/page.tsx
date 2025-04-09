import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 bg-[#f5f5f2] text-[#2f2f2f] font-sans">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {/* <Image
          src="/devhub-logo.svg"
          alt="DevHub logo"
          width={200}
          height={40}
          priority
        /> */}

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-center sm:text-left text-[#22543d]">
          Chào mừng đến với <span className="text-[#6b4f3b]">DevHub</span>
        </h1>

        <p className="max-w-[500px] text-center sm:text-left text-sm text-[#444] leading-relaxed">
          Nơi kết nối lập trình viên, chia sẻ kiến thức và trò chuyện mọi lúc mọi nơi.
          Hãy đăng nhập hoặc tạo tài khoản để bắt đầu cuộc trò chuyện cùng cộng đồng.
        </p>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <Link
            href="/login"
            className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-[#38a169] hover:bg-[#2f855a] text-white font-semibold text-sm sm:text-base h-10 sm:h-12 px-6 sm:px-8 w-full sm:w-auto"
          >
            Đăng nhập
          </Link>

          <Link
            href="/signup"
            className="rounded-full border border-[#6b4f3b] text-[#6b4f3b] hover:bg-[#eee4d8] transition-colors flex items-center justify-center font-semibold text-sm sm:text-base h-10 sm:h-12 px-6 sm:px-8 w-full sm:w-auto"
          >
            Đăng ký
          </Link>
        </div>
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-sm text-[#6b4f3b]">
        <a
          className="flex items-center gap-2 hover:underline underline-offset-4"
          href="https://devhub-docs.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          📚 Tài liệu
        </a>
        <a
          className="flex items-center gap-2 hover:underline underline-offset-4"
          href="https://github.com/devhub"
          target="_blank"
          rel="noopener noreferrer"
        >
          🌐 GitHub
        </a>
        <a
          className="flex items-center gap-2 hover:underline underline-offset-4"
          href="https://devhub.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          🏠 Trang chủ
        </a>
      </footer>
    </div>
  );
}
