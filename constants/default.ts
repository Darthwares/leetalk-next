import { Cards, Category, Message } from "@/types/types";
import {
  UserGroupIcon,
  NewspaperIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export function guid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function formatDate(timestamp: string) {
  const date = new Date(timestamp);
  const optionsDate: any = { day: "2-digit", month: "short", year: "numeric" };
  const optionsTime: any = { hour: "2-digit", minute: "2-digit", hour12: true };
  const formattedDate = date.toLocaleDateString("en-US", optionsDate);
  const formattedTime = date.toLocaleTimeString("en-US", optionsTime);
  return `${formattedDate}, ${formattedTime}`;
}

export function processMessages(messages: Message[]) {
  let conclusion;

  const lastMessageWithFinalAnswer = messages?.find((message) =>
    message?.message_text?.includes("FINAL ANSWER")
  );
  let hasFinalAnswer = lastMessageWithFinalAnswer ? true : false;
  if (hasFinalAnswer) {
    conclusion = lastMessageWithFinalAnswer!.message_text;
  }

  const remainingMessages = messages?.filter(
    (message) => !message?.message_text?.includes("FINAL ANSWER")
  );

  return { conclusion, remainingMessages };
}

export function timeAgo(dateParam: string) {
  const date = new Date(dateParam);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000; // Calculate the number of years
  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000; // Calculate the number of months
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400; // Calculate the number of days
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600; // Calculate the number of hours
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60; // Calculate the number of minutes
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago"; // Calculate the number of seconds
}

export function getFormattedDate() {
  const date = new Date();

  // Build the date and time parts
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const milliseconds = date.getMilliseconds().toString().padEnd(5, '0'); // Ensure milliseconds are 5 digits

  // Get the timezone offset in hours and minutes
  const timezoneOffset = -date.getTimezoneOffset();
  const offsetHours = Math.floor(timezoneOffset / 60).toString().padStart(2, '0');
  const offsetMinutes = Math.abs(timezoneOffset % 60).toString().padStart(2, '0');
  const timezoneSign = timezoneOffset >= 0 ? '+' : '-';

  // Combine all parts
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneSign}${offsetHours}:${offsetMinutes}`;
}


export const cards: Cards = {
  "Personal Finance": [
    {
      imgUrl:
        "https://images.pexels.com/photos/210600/pexels-photo-210600.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Finance 1",
    },
    {
      imgUrl:
        "https://images.pexels.com/photos/290275/pexels-photo-290275.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Finance 2",
    },
    {
      imgUrl:
        "https://images.pexels.com/photos/731164/pexels-photo-731164.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Finance 3",
    },
    {
      imgUrl:
        "https://images.pexels.com/photos/4452375/pexels-photo-4452375.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Finance 4",
    },
    {
      imgUrl:
        "https://images.pexels.com/photos/3808249/pexels-photo-3808249.jpeg?auto=compress&cs=tinysrgb&w=400",
      title: "Finance 5",
    },
    {
      imgUrl:
        "https://images.pexels.com/photos/4515793/pexels-photo-4515793.jpeg?auto=compress&cs=tinysrgb&w=400",
      title: "Finance 6",
    },
    {
      imgUrl:
        "https://images.pexels.com/photos/4607597/pexels-photo-4607597.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      title: "Finance 7",
    },
  ],
  Historical: [
    {
      imgUrl:
        "https://images.pexels.com/photos/3652801/pexels-photo-3652801.jpeg?auto=compress&cs=tinysrgb&w=400",
      title: "Historical 1",
    },
    {
      imgUrl:
        "https://images.pexels.com/photos/3018992/pexels-photo-3018992.jpeg?auto=compress&cs=tinysrgb&w=400",
      title: "Historical 2",
    },
    {
      imgUrl:
        "https://images.pexels.com/photos/2761152/pexels-photo-2761152.jpeg?auto=compress&cs=tinysrgb&w=400",
      title: "Historical 3",
    },
    {
      imgUrl:
        "https://images.pexels.com/photos/1576001/pexels-photo-1576001.jpeg?auto=compress&cs=tinysrgb&w=400",
      title: "Historical 4",
    },
    {
      imgUrl:
        "https://images.pexels.com/photos/8832092/pexels-photo-8832092.jpeg?auto=compress&cs=tinysrgb&w=400",
      title: "Historical 5",
    },
    {
      imgUrl:
        "https://images.pexels.com/photos/10906342/pexels-photo-10906342.jpeg?auto=compress&cs=tinysrgb&w=400",
      title: "Historical 6",
    },
    {
      imgUrl:
        "https://images.pexels.com/photos/14310463/pexels-photo-14310463.jpeg?auto=compress&cs=tinysrgb&w=400",
      title: "Historical 7",
    },
  ],
  Information: [
    {
      imgUrl:
        "https://images.pexels.com/photos/4170628/pexels-photo-4170628.jpeg?auto=compress&cs=tinysrgb&w=400",
      title: "Information 1",
    },
    {
      imgUrl:
        "https://images.pexels.com/photos/2002217/pexels-photo-2002217.jpeg?auto=compress&cs=tinysrgb&w=400",
      title: "Information 2",
    },
    {
      imgUrl:
        "https://images.pexels.com/photos/57749/pexels-photo-57749.jpeg?auto=compress&cs=tinysrgb&w=400",
      title: "Information 3",
    },
    {
      imgUrl:
        "https://images.pexels.com/photos/4059426/pexels-photo-4059426.jpeg?auto=compress&cs=tinysrgb&w=400",
      title: "Information 4",
    },
    {
      imgUrl:
        "https://images.pexels.com/photos/4307849/pexels-photo-4307849.jpeg?auto=compress&cs=tinysrgb&w=400",
      title: "Information 5",
    },
    {
      imgUrl:
        "https://images.pexels.com/photos/2168293/pexels-photo-2168293.jpeg?auto=compress&cs=tinysrgb&w=600",
      title: "Information 6",
    },
    {
      imgUrl:
        "https://images.pexels.com/photos/15139464/pexels-photo-15139464/free-photo-of-piles-of-different-newspapers.jpeg?auto=compress&cs=tinysrgb&w=400",
      title: "Information 7",
    },
  ],
};


export const categories: Category[] = [
  { name: "Personal Finance", icon: UserGroupIcon },
  { name: "Historical", icon: NewspaperIcon },
  { name: "Information", icon: ChartBarIcon },
];