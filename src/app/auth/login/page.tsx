"use client";

import Link from "next/link";
import Image from "next/image";
import LoginForm from "@/components/auth/login-form";
import { Card, CardContent } from "@/components/ui/card";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100">
      <div className="flex flex-col items-center w-full max-w-md gap-6">
        <Card className="w-full">
          <CardContent className="flex flex-col gap-4 pt-6">
            <div className=" w-full flex justify-center items-center flex-col">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/logo.webp"
                  alt="Cardone Capital Logo"
                  width={200}
                  height={80}
                  className="object-contain"
                />
              </Link>
              <div className="text-center mt-4 mb-3 pt-1 font-normal text-[1.4rem] leading-tight text-[#333] font-sans">
                Log in to your Investor Portal
              </div>
            </div>
            <LoginForm />
            <div className="text-center text-sm mt-4">
              Not registered?{" "}
              <Link
                href="/auth/register"
                className="text-primary underline hover:no-underline font-medium"
              >
                Create an account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
