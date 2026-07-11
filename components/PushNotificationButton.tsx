'use client';
import { useState } from "react";
import { getMessaging, getToken } from "firebase/messaging";
import { app } from "../src/firebaseConfig";

const VAPID_KEY = "BLXzbiEngOJD_P2fmmayxsVmYgozOYRkxvQ7aB66O_btajyFkdzL-_cfo2ykGPk222Lt-7MPR1oOjOReoWnm2_E";

export default function PushNotificationButton() {
  const [enabled, setEnabled] = useState(false);
  const [error, setError] = useState("");

  async function enablePush() {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setError("Push notification permission not granted!");
        return;
      }
      const messaging = getMessaging(app);
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: await navigator.serviceWorker.ready,
      });
      console.log("PushToken:", token);
      setEnabled(true);
      setError("");
      alert("Push notifications enabled!\nToken:\n" + token);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div>
      <button
        onClick={enablePush}
        className="px-6 py-2 rounded-xl bg-blue-700 text-white font-bold shadow-lg"
        disabled={enabled}
      >{enabled ? "Push On" : "Enable Push Notification"}</button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
}