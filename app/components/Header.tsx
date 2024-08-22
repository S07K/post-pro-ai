"use client";
import React, { useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@nextui-org/react";
import Link from "next/link";

export default function Header({children}: any) {

  const [user, setUser] = React.useState<any>({});

    const logOut = () => {
      axios
      .post("/api/logout")
      .then((response) => {
        // console.log(response);
        if (response.data.status === "success") {
          window.location.href = "/login";
        } else {
          if (response.data.status === "error") {
            toast.error(response.data.message);
          } else {
            toast.error("An error occurred");
          }
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("An error occurred");
      });
    };

    const fetchUser = async () => {
      axios
      .get("/api/user")
      .then((response) => {
        // console.log(response);
        if (response.data.status === "success") {
          // console.log('User data: ', response.data);
          setUser(response.data.user);
        } else {
          if (response.data.status === "error") {
            toast.error(response.data.message);
          } else {
            toast.error("An error occurred");
          }
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("An error occurred");
      });
    }

    useEffect(() => {
      fetchUser();
    }, []);

    return (
      <>
        <Toaster />
        <Navbar className="bg-[#000]">
          <NavbarContent justify="start">
            <NavbarBrand className="mr-4">
              <Link href="/">
                <p className="font-display font-semibold text-2xl">PostProAI</p>
              </Link>
            </NavbarBrand>
          </NavbarContent>
          {/* <NavbarContent justify="center" className="hidden md:flex">
            <Input
              classNames={{
                base: "w-full h-10",
                mainWrapper: "h-full",
                input: "text-small sm:min-w-[300px] w-full",
                inputWrapper:
                  "post-pro h-full font-normal text-primary-200 bg-primary-50/20 dark:bg-primary-100",
              }}
              placeholder="Type to search..."
              size="sm"
              startContent={<SearchIcon size={18} />}
              type="search"
            />
          </NavbarContent> */}
          <NavbarContent as="div" className="items-center" justify="end">
            {children}
            <Dropdown placement="bottom-start" className="post-pro bg-primary-900">
              <DropdownTrigger>
                <Avatar
                  className="hover:cursor-pointer"
                  isBordered
                  src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions">
                {
                  user.email &&
                  <DropdownItem textValue="Profile" key="profile" className="h-14 gap-2">
                    <p className="font-bold">Signed in as</p>
                    <p className="font-bold">{user.email}</p>
                  </DropdownItem>
                }
                <DropdownItem textValue="Settings" key="settings">Settings</DropdownItem>
                <DropdownItem textValue="Projects" key="team_settings" href="/projects">Projects</DropdownItem>
                <DropdownItem textValue="Analytics" key="analytics" href="/#analytics">Analytics</DropdownItem>
                <DropdownItem textValue="Help & Feedback" key="help_and_feedback">Help & Feedback</DropdownItem>
                <DropdownItem textValue="Log Out" key="logout" color="danger" onClick={logOut}>
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarContent>
        </Navbar>
        <Toaster />
      </>
    );
  }