"use server";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import HeaderClient from "./HeaderClient";
import { getCurrentUser } from "../auth/nextjs/currentUser";

const Header = async () => {
  const fullUser = await getCurrentUser();

  return <HeaderClient fullUser={fullUser} />;
};

export default Header;
