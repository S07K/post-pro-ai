"use client";
import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
} from "@nextui-org/react";
// import { SearchIcon } from "./SearchIcon";
import { AddIcon } from "./AddIcon";

export default function Header() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  return (
    <Navbar className="bg-[#000]">
      <NavbarContent justify="start">
        <NavbarBrand className="mr-4">
          <p className="font-display font-semibold text-2xl">PostProAI</p>
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
        <Button onPress={onOpen} className="post-pro bg-default-50 text-md" endContent={<AddIcon />}>
          New
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="lg">
          <ModalContent className="text-default-800">
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Create New Project
                </ModalHeader>
                <ModalBody>
                  <Input type="text" variant={'underlined'} label="Choose a topic" description="Enter a topic you want to post on." />
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="number" variant={'underlined'} label="Caption Limit" description="Enter a limit for your post caption." />
                    <Input type="number" variant={'underlined'} label="No. of post" description="Enter how many post you want to generate." />
                  </div>
                  <Checkbox defaultSelected>Add hashtags?</Checkbox>
                </ModalBody>
                <ModalFooter>
                  <Button className="text-default-800 post-pro bg-primary-100" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button className="post-pro bg-primary-500 text-default-50" onPress={onClose}>
                    Save
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        <Dropdown placement="bottom-start" className="post-pro bg-primary-900">
          <DropdownTrigger>
            <Avatar
              className="hover:cursor-pointer"
              isBordered
              src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="User Actions">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-bold">Signed in as</p>
              <p className="font-bold">@tonyreichert</p>
            </DropdownItem>
            <DropdownItem key="settings">Settings</DropdownItem>
            <DropdownItem key="team_settings">Projects</DropdownItem>
            <DropdownItem key="analytics">Analytics</DropdownItem>
            <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
            <DropdownItem key="logout" color="danger">
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </Navbar>
  );
}
