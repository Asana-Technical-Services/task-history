import type { NextPage } from "next";
import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Header } from "../src/components/Header";
import timeMachineImage from "./../public/time-machine.png";
import Image from "next/image";

const LandingPage: NextPage = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace("/home");
    }
  }, [session]);

  return (
    <div className="container flex-col">
      <Header />
      <div className="splash-container">
        <div className="splash-image">
          <Image src={timeMachineImage} />
        </div>
        <div className="splash-desc">
          <div>
            <h2>Task History</h2>
            <p>
              the task history tool allows you to roll back edits to view a task
              as it existed during diffent periods of time
            </p>
            <p>sign in with asana to get started viewing your tasks:</p>
            <button
              onClick={() => {
                signIn();
              }}
            >
              Sign in with Asana
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
