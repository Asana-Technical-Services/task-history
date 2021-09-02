import { useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import { getProviders, useSession, signIn, providers } from "next-auth/client";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-content: center;
  border: red 2px solid;
  background: rgb(255, 171, 100);
  background: linear-gradient(
    186deg,
    rgba(255, 171, 100, 1) 0%,
    rgba(246, 72, 141, 1) 100%
  );
`;

const SignInBox = styled.div`
  margin: auto;
  align-self: center;
  text-align: center;
  padding: 1.5rem;
  background: white;
  border-radius: 0.5rem;
`;

const ConnectButton = styled.button`
  margin-top: 1rem;
  margin-bottom: 1rem;

  padding: 5px 10px;
`;

const FinePrint = styled.p`
  text-align: center;
  font-size: 0.7rem;
`;

export default function SignIn({}) {
  const [session, loadingsession] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [session]);

  return (
    <Container>
      <SignInBox>
        <h2>Task History Tool</h2>
        <div>
          <ConnectButton onClick={() => signIn("asana")}>
            Connect with Asana
          </ConnectButton>
        </div>
        <FinePrint>this will redirect you to Asana to verify the app</FinePrint>
      </SignInBox>
    </Container>
  );
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
