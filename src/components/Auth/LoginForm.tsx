"use client";

import { useState } from "react";
import { useLogin } from "@/hooks/useAuth";
import { Button } from "antd"; // Import Ant Design Button

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login, isPending, error } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2"
      />
      <Button
        type="primary"
        htmlType="submit"
        loading={isPending}
        className="p-2"
      >
        Login
      </Button>
      {error && <p className="text-red-500">Login failed. Try again.</p>}
    </form>
  );
}
