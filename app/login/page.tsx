"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button, Input, Link } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { LockIcon } from "../icons/LockIcon";
import { MailIcon } from "../icons/MailIcon";
import toast, { Toaster } from "react-hot-toast";
import AuthCard, { authCardItem } from "../components/AuthCard";

const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent | React.MouseEvent) => {
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
      <AuthCard eyebrow="Welcome back" title="Sign in to your account">
        <div className="flex flex-col gap-4">
          {formError && (
            <motion.div variants={authCardItem} className="text-danger-500 text-sm">
              {formError}
            </motion.div>
          )}
          <motion.div variants={authCardItem}>
            <Input
              autoFocus
              endContent={<MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
              label="Email"
              variant="bordered"
              value={email}
              onChange={handleEmailChange}
            />
          </motion.div>
          <motion.div variants={authCardItem}>
            <Input
              endContent={<LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />}
              label="Password"
              type="password"
              variant="bordered"
              value={password}
              onChange={handlePasswordChange}
            />
          </motion.div>
          <motion.div variants={authCardItem}>
            <Link href="/register" size="sm" className="font-mono text-primary-500">
              Create an account
            </Link>
          </motion.div>
          <motion.div variants={authCardItem}>
            <Button className="w-full post-pro bg-primary-500 text-primary-50 font-mono" isLoading={isLoggingIn} onClick={handleSubmit}>
              Sign in
            </Button>
          </motion.div>
        </div>
      </AuthCard>
    </>
  );
};

export default Login;
