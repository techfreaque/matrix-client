"use client";
import RoomList from "../Widgets/RoomList";
import { Dispatch, SetStateAction, useState } from "react";
import Login from "./Login";
import MessageRoom from "../Widgets/MessagingComponent";

// import global from "global";
import SignUp from "../Widgets/SignUp";
import { SplitHomeScreen } from "../Widgets/PageLayout";
import { MatrixClient } from "matrix-js-sdk";

export default function Home() {
  (window as Window).global = window;
  const [client, setClient] = useState<MatrixClient | undefined>(undefined);
  const [selectedRoom, setSelectedRoom] = useState<string | undefined>("test");
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <SplitHomeScreen
      sideBarContent={
        <Sidebar
          client={client}
          isSignUp={isSignUp}
          setClient={setClient}
          setSelectedRoom={setSelectedRoom}
          setIsSignUp={setIsSignUp}
        />
      }
      mainContent={
        selectedRoom ? (
          <MessageRoom roomId={selectedRoom} client={client} />
        ) : (
          <></>
        )
      }
    />
  );
}

function Sidebar({
  client,
  isSignUp,
  setClient,
  setSelectedRoom,
  setIsSignUp,
}: {
  client: MatrixClient | undefined;
  isSignUp: boolean;
  setClient: Dispatch<SetStateAction<MatrixClient | undefined>>;
  setSelectedRoom: Dispatch<SetStateAction<string | undefined>>;
  setIsSignUp: Dispatch<SetStateAction<boolean>>;
}) {
  if (!client) {
    return (
      <div>
        {isSignUp ? (
          <SignUp onSignUpSuccess={setClient} />
        ) : (
          <Login onLoginSuccess={setClient} />
        )}
        <button onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp
            ? "Already have an account? Log in"
            : "Don't have an account? Sign up"}
        </button>
      </div>
    );
  }

  return (
    <div>
      <RoomList client={client} />
      <button onClick={() => setSelectedRoom("!someRoomId:matrix.org")}>
        reload Rooms
      </button>
      <button onClick={() => setSelectedRoom("!someRoomId:matrix.org")}>
        Go to Room
      </button>
    </div>
  );
}

interface MatrixWindow extends Window {
  global: Window;
}

declare let window: MatrixWindow;
