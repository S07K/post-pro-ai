"use client";
import React, { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { register } from "@/lib/api/client";
import AuthCard from "../components/AuthCard";

const Register: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleConfirmPasswordChange = (value: string) => {
    setPasswordError("");
    setConfirmPassword(value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
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
      <AuthCard title="Create a new account" subtitle="It's quick and easy.">
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
          />
          <Input
            type="password"
            autoComplete="new-password"
            label="Password"
            labelPlacement="outside"
            placeholder="At least 8 characters"
            variant="bordered"
            size="lg"
            value={password}
            onValueChange={setPassword}
          />
          <Input
            type="password"
            autoComplete="new-password"
            label="Confirm password"
            labelPlacement="outside"
            placeholder="Re-enter your password"
            variant="bordered"
            size="lg"
            isInvalid={Boolean(passwordError)}
            errorMessage={passwordError}
            value={confirmPassword}
            onValueChange={handleConfirmPasswordChange}
          />
          <div className="flex justify-center pt-1">
            <Button type="submit" color="success" size="lg" isLoading={isRegistering} className="min-w-[194px] text-[17px] font-semibold">
              Sign up
            </Button>
          </div>
          <NextLink href="/login" className="text-center text-sm text-primary-600 hover:underline">
            Already have an account?
          </NextLink>
        </form>
      </AuthCard>
    </>
  );
};

export default Register;
