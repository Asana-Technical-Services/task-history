import { useEffect } from "react";
import { useRouter } from "next/router";
import { getProviders, useSession, signIn } from "next-auth/client";

export default function SignIn({ providers }) {
  const [session, loadingsession] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [session]);
  return (
    <div>
      <div>Task History Tool</div>
      <div>
        <button onClick={() => signIn("asana")}>Sign in with Asana</button>
      </div>
    </div>
  );
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
