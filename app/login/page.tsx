"use client";
import React, { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { LockIcon } from "../icons/LockIcon";
import { MailIcon } from "../icons/MailIcon";
import toast, { Toaster } from "react-hot-toast";
import AuthCard from "../components/AuthCard";

const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
      setFormError("Please fill in all fields");
      return;
    }
    setFormError("");
    setIsLoggingIn(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setIsLoggingIn(false);
    if (result?.ok) {
      router.push("/dashboard");
      router.refresh();
    } else {
      toast.error("Invalid email or password");
    }
  };

  return (
    <>
      <Toaster />
      <AuthCard title="Log in to PostProAI" subtitle="Welcome back! Enter your details to continue.">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          {formError && (
            <div role="alert" className="rounded-md border border-danger-200 bg-danger-50 px-3 py-2 text-sm text-danger-700">
              {formError}
            </div>
          )}
          <Input
            autoFocus
            type="email"
            autoComplete="email"
            label="Email address"
            labelPlacement="outside"
            placeholder="you@company.com"
            variant="bordered"
            size="lg"
            value={email}
            onValueChange={setEmail}
            endContent={<MailIcon className="pointer-events-none flex-shrink-0 text-xl text-default-400" />}
          />
          <Input
            type="password"
            autoComplete="current-password"
            label="Password"
            labelPlacement="outside"
            placeholder="Enter your password"
            variant="bordered"
            size="lg"
            value={password}
            onValueChange={setPassword}
            endContent={<LockIcon className="pointer-events-none flex-shrink-0 text-xl text-default-400" />}
          />
          <Button type="submit" color="primary" size="lg" fullWidth isLoading={isLoggingIn} className="mt-1 text-[17px] font-semibold">
            Log in
          </Button>
        </form>
        <hr className="my-5 border-divider" />
        <div className="flex justify-center">
          <Button as={NextLink} href="/register" color="success" size="lg" className="px-6 font-semibold">
            Create new account
          </Button>
        </div>
      </AuthCard>
    </>
  );
};

export default Login;
