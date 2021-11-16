import { signIn, signOut, useSession } from "next-auth/react";
import styled from "styled-components";
import Image from "next/image";
import { profile } from "console";

export function Header() {
  const { data: session } = useSession();
  console.log(session);

  return (
    <div className="header-wrapper">
      <div className="head-title">
        <h2>🕰 Task History</h2>
      </div>
      <div className="head-info">
        {session ? (
          <div className="head-profile">
            <img
              className="profile-image"
              src={
                session?.user?.image ||
                "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/200px-Question_mark_%28black%29.svg.png"
              }
            ></img>
            <p className="profile-name">{session.user?.name}</p>
            <button onClick={() => signOut({ callbackUrl: "/" })}>
              Sign out
            </button>
          </div>
        ) : (
          <div className="head-signin">
            <button onClick={() => signIn()}>Sign In</button>
          </div>
        )}
      </div>
    </div>
  );
}
