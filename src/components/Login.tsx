import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/client";

export function Login() {
  const [session, loading] = useSession();
  
  useEffect(() => {
    console.log(session);
  }, [session]);

  return (
    <div>
      {!session && (
        <div>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
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
