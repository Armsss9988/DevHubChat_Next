"use client";

import SignUpForm from "@/components/Auth/SignupForm";

export default function SignUp() {
  return (
    <div className="flex p-10 rounded-3xl flex-col items-center justify-center bg-white shadow-black shadow-2xl">
      <h2 className="font-bold mb-2">DevHub Chat App</h2>
      <h6 className="font-bold mb-5">Signup </h6>
      <SignUpForm />
    </div>
  );
}
