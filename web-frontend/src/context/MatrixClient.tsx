import {
  getRoomMessages,
  getRooms,
  initializeMatrixClient,
  loginToMatrix,
  registerMatrixUser,
  sendMessage,
} from "@/lib/matrixClient/MatrixClient";
import {
  LoginResponse,
  MatrixClient,
  MatrixEvent,
  RegisterResponse,
  Room,
  RoomState,
} from "matrix-js-sdk";

import { create, StoreApi, UseBoundStore } from "zustand";

interface MatrixClientType {
  client: MatrixClient | undefined;
  server: string;
  rooms: {
    [roomId: string]: {
      room: Room
      messages: MatrixEvent[];
    };
  };

  init: () => void;
  registerMatrixUser: (username: string, password: string) => Promise<void>;
  registerResponse: RegisterResponse | undefined;
  loginToMatrix: (username: string, password: string) => Promise<void>;
  loginResponse: LoginResponse | undefined;
  initRooms: (roomId: string) => void;
  initRoom: (roomId: string) => void;
  sendMessage: (roomId: string, message: string) => Promise<void>;
}

const matrixClient = create<MatrixClientType>((set) => ({
  client: undefined,
  server: "https://matrix.org",

  rooms: {},

  init: () =>
    set((state) => ({
      ...state,
      client: initializeMatrixClient(state.server),
    })),

  registerResponse: undefined,
  registerMatrixUser: async (username, password) => {
    // Handle registration asynchronously
    const response = await registerMatrixUser(username, password); // Your registration function
    set((state) => ({
      ...state,
      registerResponse: response, // Update the state with the response
    }));
  },
  loginToMatrix: async (username, password) => {
    // Handle registration asynchronously
    const response = await loginToMatrix(username, password); // Your registration function
    set((state) => ({
      ...state,
      registerResponse: response, // Update the state with the response
    }));
  },
  initRooms: () =>
    set((state) => {
      const newState = {...state}
      const roomList: Room[] = getRooms()
      roomList.forEach((room) => {
        newState.rooms[room.id] = {room, messages: []};
      })
    }),
  loginResponse: undefined,
  initRoom: (roomId) =>
    set((state) => {
      const newState = { ...state };
      if (state.client) {
        if (!state.client) {
          throw new Error("Matrix client is not initialized!");
        }

        const room = state.client.getRoom(roomId);
        if (!room) {
          throw new Error(`Room with id ${roomId} not found!`);
        }

        // Load initial timeline
        const messages = room.getLiveTimeline().getEvents();

        // const messages = getRoomMessages(roomId, onNewMessage);
        newState.rooms[roomId] = {
          messages,
        };
        const onNewMessage = (roomState: RoomState) => {
          set((state) => {
            const newState = { ...state }
            if (!newState.rooms[roomId].messages) {
              throw new Error("Room not initialized yet");
            }
            newState.rooms[roomId].messages.append(roomState)
          }
        };

        // Register event listener for new messages
        matrixClient.on(RoomStateEvent.Update, (roomState: RoomState) => {
          onNewMessage(roomState);
        });

        // return () => client.off(RoomEvent.Timeline, onMessage);
      }
      return newState;
    }),
  sendMessageResponses: [],
  sendMessage: async (roomId, message) => {
    const sendMessageResponses = await sendMessage(roomId, message);
    set((state) => ({
      ...state,
      sendMessageResponses,
    }));
  },
}));

export const messenger: {
  matrixClient: UseBoundStore<StoreApi<MatrixClientType>>;
} = {
  matrixClient,
};


function useFetchRooms() {
  const { client } = useContext(MatricClientContext);
  const { setRooms } = useContext(RoomsContext);
  useEffect(() => {
    if (client) {
      const roomList: Room[] = getRooms();
      console.log(roomList);
      setRooms(roomList);
    }
  }, [client, setRooms]);
}

function useRestoreMatrixCLient() {
  useEffect(() => {
    if (!client) {
      setClient(initializeMatrixClient(serverUrl));
    }
  }, [client, serverUrl]);
}

export default function MatrixProvider({
  children,
}: {
  children: JSX.Element;
}) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [client, setClient] = useState<MatrixClient | undefined>(undefined);
  const [serverUrl, setServerUrl] = useState<string>("https://matrix.org"); // Use your server here

  useFetchRooms();

  return (
    <RoomsContext.Provider
      value={{
        rooms,
        setRooms,
      }}
    >
      <MatricClientContext.Provider
        value={{
          client,
          setClient,
        }}
      >
        {children}
      </MatricClientContext.Provider>
    </RoomsContext.Provider>
  );
}
