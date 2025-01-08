"use client";
import React, { useEffect } from "react";
import RegisterForm from "../Components/auth/RegisterForm/RegisterForm";
import { useUserContext } from "@/context/userContext";
import { useRouter } from "next/navigation";


function page() {
  const { user } = useUserContext();
  const router = useRouter();
  // Kullanıcı oturum açtıysa ana sayfaya yönlendir
  useEffect(() => {
    if (user && user._id) {
      router.push("/");
    }
  }, [user, router]);

  // Kullanıcı giriş yaptıysa boş dön
  if (user && user._id) {
    return null;
  }

  return (
    <div className="auth-page w-full h-full flex justify-center items-center">
      <RegisterForm />
    </div>
  );
}

export default page;
