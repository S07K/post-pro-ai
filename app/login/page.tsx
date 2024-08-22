"use client";
import React, { useState } from "react";
import { Button, Checkbox, Input, Link } from "@nextui-org/react";
import loginImg from "@/app/assets/images/loginImg.png";
import Image from "next/image";
import { LockIcon } from "../icons/LockIcon";
import { MailIcon } from "../icons/MailIcon";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const Login: React.FC = (props) => {
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

  // window.addEventListener("keypress", (event) => {
  //   if (event.key === "Enter" && !isLoggingIn) {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     handleSubmit(event);
  //   }
  // });

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (!email || !password) {
      setFormError("Please fill in all fields");
    }
    setIsLoggingIn(true);
    axios
      .post("/api/login", {
        email,
        password,
      })
      .then((response) => {
        // console.log(response);
        if (response.data.status === "success") {
          window.location.href = "/dashboard";
        } else {
          setIsLoggingIn(false);
          if (response.data.status === "error") {
            toast.error(response.data.message);
          } else {
            toast.error("An error occurred");
          }
        }
      })
      .catch((error) => {
        setIsLoggingIn(false);
        console.error(error);
        toast.error("An error occurred");
      });
  };

  return (
    <>
      <Toaster />
      <section className={`w-full h-screen flex`}>
        <div className="login-img w-[60%] bg-default-50 hidden md:flex">
          <Image
            className="!w-auto"
            src={loginImg}
            alt="login"
            layout="fill"
            objectFit="cover"
          />
          <p className="absolute z-10 text-[#4e4e4e] left-2 bottom-2 text-sm">Created by PostProAI</p>
        </div>
        <div className="w-full md:w-[40%] flex flex-col items-center justify-center p-4 bg-default-50 z-10">
          <div className="w-full flex flex-col gap-4 max-w-[440px]">
            <Link href="/">
              <p className="font-display font-semibold text-4xl text-default-900">
                PostProAI
              </p>
            </Link>
            <p className="font-display font-normal text-md text-default-600">
              Welcome back! Please login to your account.
            </p>
            {formError && (
                <div className="post-pro text-danger-500">
                  {formError}
                </div>
              )}
            <Input
              autoFocus
                endContent={
                  <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
              className="text-default-900"
              label="Email"
              // placeholder="Enter your email"
              variant="bordered"
              value={email}
              onChange={handleEmailChange}
            />
            <Input
                endContent={
                  <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                }
              className="text-default-900"
              label="Password"
              // placeholder="Enter your password"
              type="password"
              variant="bordered"
              value={password}
              onChange={handlePasswordChange}
            />
            <div className="flex flex-col gap-4 py-2 px-1">
              <Link color="primary" href="/register" size="sm">
                Create an account
              </Link>
              <Link color="primary" href="/forgot-password" size="sm">
                Forgot password?
              </Link>
            </div>
            <Button className="bg-foreground text-background" color="primary" isLoading={isLoggingIn} onClick={handleSubmit}>
              Sign in
            </Button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
