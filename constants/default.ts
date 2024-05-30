import { Cards, Category, Message } from "@/types/types";
import {
  UserGroupIcon,
  NewspaperIcon,
  ChartBarIcon,
  CodeBracketIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import {
  Code,
  Leaf,
  Globe,
  Book,
  Heart,
  Microscope,
  Gamepad2,
  DollarSign,
  Film,
  Shield,
  Newspaper,
  Gavel,
  Users,
  Clock,
  AlertCircle,
  OctagonIcon,
} from "lucide-react";
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  SignalIcon,
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
    message?.message_text?.includes("Thank you for the debate.")
  );
  let hasFinalAnswer = lastMessageWithFinalAnswer ? true : false;
  if (hasFinalAnswer) {
    conclusion = lastMessageWithFinalAnswer!.message_text;
  }

  const remainingMessages = messages?.filter(
    (message) => !message?.message_text?.includes("Thank you for the debate.")
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
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  const milliseconds = date.getMilliseconds().toString().padEnd(5, "0"); // Ensure milliseconds are 5 digits

  // Get the timezone offset in hours and minutes
  const timezoneOffset = -date.getTimezoneOffset();
  const offsetHours = Math.floor(timezoneOffset / 60)
    .toString()
    .padStart(2, "0");
  const offsetMinutes = Math.abs(timezoneOffset % 60)
    .toString()
    .padStart(2, "0");
  const timezoneSign = timezoneOffset >= 0 ? "+" : "-";

  // Combine all parts
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${timezoneSign}${offsetHours}:${offsetMinutes}`;
}

export const cards: Cards = {
  "Finance": [
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
  { name: "Technology", icon: CodeBracketIcon },
  { name: "Historical", icon: NewspaperIcon },
  { name: "Social", icon: UsersIcon },
];

export const testimonials = [
  {
    name: "Alex Johnson",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=80&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDF8fHByb2ZpbGV8ZW58MHx8fHwxNjQyNjk0NDMy&ixlib=rb-1.2.1&q=80&w=80",
    quote: "Insightful Discussions",
    feedback:
      "The debate sessions with LLMs provide incredibly insightful discussions. The models offer diverse perspectives that enrich my understanding of various topics.",
  },
  {
    name: "Maria Garcia",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=1727&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quote: "Engaging and Thought-Provoking",
    feedback:
      "I find the debates with LLMs to be highly engaging and thought-provoking. The depth of analysis and the different viewpoints presented are truly impressive.",
  },
  {
    name: "Liam Smith",
    image:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    quote: "Broadened Horizons",
    feedback:
      "Participating in LLM debates has significantly broadened my horizons. The models' ability to argue from multiple perspectives is fascinating and educational.",
  },
];

export const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 664 },
    items: 2,
    slidesToSlide: 2,
  },
  mobile: {
    breakpoint: { max: 664, min: 0 },
    items: 1,
    slidesToSlide: 1,
  },
};

export const topDebates = [
  {
    title: 'The Impact of AI on Society',
    dateAdded: '2024-05-20T07:35:10.960Z',
    id: guid(),
    time: '10:00 AM',
    imageUrl: 'https://source.unsplash.com/featured/?ai', // AI related image
  },
  {
    title: 'Climate Change and Its Effects',
    dateAdded: '2024-05-20T07:35:10.960Z',
    id: guid(),
    time: '2:00 PM',
    imageUrl: 'https://source.unsplash.com/featured/?climate', // Climate change related image
  },
  {
    title: 'The Future of Education',
    dateAdded: '2024-05-20T07:35:10.960Z',
    id: guid(),
    time: '11:00 AM',
    imageUrl: 'https://source.unsplash.com/featured/?education', // Education related image
  },
  {
    title: 'Healthcare Reform',
    dateAdded: '2024-05-20T07:35:10.960Z',
    id: guid(),
    time: '3:00 PM',
    imageUrl: 'https://source.unsplash.com/featured/?healthcare', // Healthcare related image
  },
  {
    title: 'Economic Policies and Growth',
    dateAdded: '2024-05-20T07:35:10.960Z',
    id: guid(),
    time: '1:00 PM',
    imageUrl: 'https://source.unsplash.com/featured/?economics', // Economics related image
  },
];

export const categoryPage = [
  { name: "Technology", href: "#", current: true, icon: Code },
  { name: "Historical", href: "#", current: false, icon: NewspaperIcon },
  { name: "Education", href: "#", current: false, icon: Book },
  { name: "Health", href: "#", current: false, icon: Heart },
  { name: "Sports", href: "#", current: false, icon: Gamepad2 },
  { name: "Economics", href: "#", current: false, icon: DollarSign },
  { name: "Social", href: "#", current: false, icon: UserGroupIcon },
  { name: "Others", href: "#", current: false, icon: OctagonIcon },
];

export const navigation = [
  { name: "Usage", href: "#", icon: ChartBarSquareIcon, current: false },
  { name: "Activity", href: "#", icon: SignalIcon, current: true },
  { name: "Settings", href: "#", icon: Cog6ToothIcon, current: false },
];

export const generateImageUrl = (topic: string) => {
  const query = topic.split(" ").join(",");
  return `https://source.unsplash.com/featured/?${query}`;
};

export function formatDateAndTime(dateString: string): string {
  let parsedDate: Date;

  const parts = dateString.split("/");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    parsedDate = new Date(year, month, day);
  } else {
    parsedDate = new Date(dateString);
  }

  if (isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };

  return parsedDate.toLocaleDateString("en-US", options);
}

export const extractPlaylist = (messages: Message[]) => {
  return messages
    ?.filter((message) => message?.audio_url)
    .map((message) => ({
      src: message?.audio_url as string,
      sender: message?.sender,
    }));
};


export const comments = [
  { id: 1, user: 'User 1', comment: 'Great point!', time: '2 hours ago' },
  {
    id: 2,
    user: 'User 2',
    comment: 'I disagree with this.',
    time: '1 day ago',
  },
  {
    id: 3,
    user: 'User 3',
    comment: 'Could you provide more details?',
    time: '3 days ago',
  },
  {
    id: 3,
    user: 'User 3',
    comment: 'Could you provide more details?',
    time: '3 days ago',
  },
  {
    id: 3,
    user: 'User 3',
    comment: 'Could you provide more details?',
    time: '3 days ago',
  },
  {
    id: 3,
    user: 'User 3',
    comment: 'Could you provide more details?',
    time: '3 days ago',
  },
];




