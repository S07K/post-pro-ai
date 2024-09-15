"use client";
import React, { useState } from "react";
import { Button, Chip, Input, Link } from "@nextui-org/react";
import loginImg from "@/app/assets/images/registerImg.png";
import Image from "next/image";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Login: React.FC = (props) => {
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
  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordError("");
    setConfirmPasswordChange(event.target.value);
  };

  // window.addEventListener("keydown", (event) => {
  //   if (event.key === "Enter" && !isRegistering) {
  //     event.preventDefault();
  //     handleSubmit(event);
  //   }
  // });

  const handleSubmit = (event: any) => {
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
    setIsRegistering(true);
    axios
      .post("/api/register", {
        email,
        password,
      })
      .then((response) => {
        if (response.data.status === "success") {
          toast.success("Account created successfully");
          setTimeout(() => {
            setIsRegistering(false);
            window.location.href = "/login";
          }, 2000);
        } else {
          setIsRegistering(false);
          if (response.data.status === "error") {
            toast.error(response.data.message);
          } else {
            toast.error("An error occurred");
          }
        }
      })
      .catch((error) => {
        setIsRegistering(false);
        console.error(error);
      });
  };

  return (
    <>
      <Toaster />
      <section className={`w-full h-screen flex post-pro`}>
        <div className="login-img w-[60%] bg-default-50 hidden md:flex">
          <Image
            className="!w-auto"
            src={loginImg}
            alt="login"
            layout="fill"
            objectFit="cover"
          />
          <p className="absolute z-10 text-[#737373] left-2 bottom-2 text-sm">
            Created by PostProAI
          </p>
        </div>
        <div className="w-full md:w-[40%] flex flex-col items-center justify-center p-6 bg-default-50 z-10">
          <div className="w-full flex flex-col gap-4 max-w-[440px]">
            <Link href="/" className="flex items-center">
              <p className="font-display font-semibold text-4xl text-default-900">
                PostProAI
              </p>
              <Chip color="warning" variant="dot" classNames={
                {
                  base: "ml-2",
                }
              }>Beta</Chip>
            </Link>
            <p className="font-display font-normal text-md text-default-600">
              Create an account to get started.
            </p>
            {formError && (
              <div className="post-pro text-danger-500">
                {formError}
              </div>
            )}
            <Input
              className="text-default-900"
              label="Email"
              // placeholder="Enter your email"
              variant="bordered"
              value={email}
              onChange={handleEmailChange}
            />
            <Input
              className="text-default-900"
              label="Password"
              // placeholder="Enter your password"
              type="password"
              variant="bordered"
              value={password}
              onChange={handlePasswordChange}
            />
            <Input
              className={!passwordError ? `text-default-900` : `text-danger-500`}
              label="Confirm Password"
              // placeholder="Re-enter your password"
              isInvalid={passwordError ? true : false}
              errorMessage={passwordError}
              type="password"
              variant="bordered"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            <div className="flex justify-between py-2 px-1">
              <Link color="primary" href="/login" size="sm">
                Already have an account?
              </Link>
            </div>
            <Button
              className="bg-foreground text-background"
              color="primary"
              onClick={handleSubmit}
              isLoading={isRegistering}
            >
              Sign up
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
