"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button, Input, Link } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { register } from "@/lib/api/client";
import AuthCard, { authCardItem } from "../components/AuthCard";

const Register: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPasswordChange] = useState("");
  const [formError, setFormError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordError("");
    setConfirmPasswordChange(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent | React.MouseEvent) => {
    event.preventDefault();
    if (!email || !password || !confirmPassword) {
      setFormError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }
    setPasswordError("");
    setFormError("");
    setIsRegistering(true);
    try {
      await register(email, password);
      toast.success("Account created successfully");
      setTimeout(() => {
        setIsRegistering(false);
        router.push("/login");
      }, 2000);
    } catch (error) {
      setIsRegistering(false);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  return (
    <>
      <Toaster />
      <AuthCard eyebrow="Get started" title="Create your account">
        <div className="flex flex-col gap-4">
          {formError && (
            <motion.div variants={authCardItem} className="text-danger-500 text-sm">
              {formError}
            </motion.div>
          )}
          <motion.div variants={authCardItem}>
            <Input label="Email" variant="bordered" value={email} onChange={handleEmailChange} />
          </motion.div>
          <motion.div variants={authCardItem}>
            <Input label="Password" type="password" variant="bordered" value={password} onChange={handlePasswordChange} />
          </motion.div>
          <motion.div variants={authCardItem}>
            <Input
              label="Confirm Password"
              isInvalid={Boolean(passwordError)}
              errorMessage={passwordError}
              type="password"
              variant="bordered"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </motion.div>
          <motion.div variants={authCardItem}>
            <Link href="/login" size="sm" className="font-mono text-primary-500">
              Already have an account?
            </Link>
          </motion.div>
          <motion.div variants={authCardItem}>
            <Button className="w-full post-pro bg-primary-500 text-primary-50 font-mono" onClick={handleSubmit} isLoading={isRegistering}>
              Sign up
            </Button>
          </motion.div>
        </div>
      </AuthCard>
    </>
  );
};

export default Register;
