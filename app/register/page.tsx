"use client";
import React, { useState } from "react";
import { Button, Checkbox, Input, Link } from "@nextui-org/react";
import loginImg from "@/app/assets/images/registerImg.png";
import Image from "next/image";
import { LockIcon } from "../icons/LockIcon";
import { MailIcon } from "../icons/MailIcon";

const Login: React.FC = (props) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPasswordChange] = useState("");

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const handleConfirmPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPasswordChange(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Perform login logic here
  };

  return (
    <section className={`w-full h-screen flex`}>
      <div className="login-img w-[60%] bg-default-50 hidden md:flex">
        <Image
          className="!w-auto"
          src={loginImg}
          alt="login"
          layout="fill"
          objectFit="cover"
        />
        <p className="absolute z-10 text-[#737373] left-2 bottom-2 text-sm">Created by PostProAI</p>
      </div>
      <div className="w-full md:w-[40%] flex flex-col items-center justify-center p-6 bg-default-50 z-10">
        <div className="w-full flex flex-col gap-4 max-w-[440px]">
          <Link href="/">
            <p className="font-display font-semibold text-4xl text-default-900">
              PostProAI
            </p>
          </Link>
          <p className="font-display font-normal text-md text-default-600">
            Create an account to get started.
          </p>
          <Input
            autoFocus
            className="text-default-900"
            label="Name"
            // placeholder="Enter your name"
            variant="bordered"
            value={name}
            onChange={handleNameChange}
          />
          <Input
            className="text-default-900"
            label="Email"
            // placeholder="Enter your email"
            variant="bordered"
            value={username}
            onChange={handleUsernameChange}
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
            className="text-default-900"
            label="Confirm Password"
            // placeholder="Re-enter your password"
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
          <Button className="bg-foreground text-background" color="primary" onClick={handleSubmit}>
            Sign up
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Login;
