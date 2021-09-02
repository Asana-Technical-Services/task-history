import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/client";

export function Header() {
  const [session, loading] = useSession();

  return (
    <div>
      {!session && (
        <div>
          Not signed in <br />
          <button onClick={() => signIn()}>Connect to Asana</button>
        </div>
      )}
      {session && (
        <div>
          Signed in as {session.user?.name} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </div>
      )}
    </div>
  );
}
