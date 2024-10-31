import React, { useState, useEffect } from "react";
import { getRooms } from "../lib/matrixClient/MatrixClient";
import { Room } from "matrix-js-sdk";

const RoomList = ({ client }: { client: any }) => {
  return (
    <div>
      <h2>Your Rooms</h2>
      <ul>
        {rooms.map((room) => (
          <li key={room.roomId}>{room.name || room.roomId}</li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;
