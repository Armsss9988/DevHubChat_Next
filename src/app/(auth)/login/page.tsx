import LoginForm from "@/components/Auth/LoginForm";
export default function LoginPage() {
  return (
    <div className="flex p-10 rounded-3xl flex-col items-center justify-center bg-white shadow-black shadow-2xl">
      <h2 className="font-bold mb-2">DevHub Chat App</h2>
      <h6 className="font-bold mb-5">Login </h6>
      <LoginForm />
    </div>
  );
}
