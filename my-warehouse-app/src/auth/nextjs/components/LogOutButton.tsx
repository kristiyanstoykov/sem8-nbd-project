"use client";

import { Button } from "@/components/ui/button";
import { logOut } from "../actions";

export function LogOutButton() {
  return (
    <Button
      variant="destructive"
      className="px-3 py-1 bg-red-600 hover:text-black text-white rounded hover:bg-red-200 transition-colors"
      onClick={async () => await logOut()}
    >
      Log Out
    </Button>
  );
}
