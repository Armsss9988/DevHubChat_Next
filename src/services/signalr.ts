import * as signalR from "@microsoft/signalr";

const connection = new signalR.HubConnectionBuilder()
  .withUrl(`${process.env.NEXT_PUBLIC_API_URL}/chathub`, {
    skipNegotiation: true,
    transport: signalR.HttpTransportType.WebSockets,
  })
  .withAutomaticReconnect()
  .build();

export const startSignalR = async () => {
  try {
    await connection.start();
    console.log("SignalR connected");
  } catch (err) {
    console.error("SignalR Connection Error: ", err);
  }
};

export default connection;
