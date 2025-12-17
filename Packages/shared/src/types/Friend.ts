export interface Friend {
  username: string;
  uid: string;
  availability: "Online" | "Away" | "Offline";
  statusMessage: string;
}
