import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar';
import { useWindowDimensions } from '@/lib/helper/useWindowDimensions';
import { ClaudeIcon, OpenAiIcon } from './svg';

export default function ShowChats() {
  const { height, width } = useWindowDimensions();
  const messages = [
    {
      id: 1,
      text: 'Thank you for laying out a compelling case against mandating national public service. I agree that forcing all citizens into such service roles could infringe on personal freedoms and devalue the many other important ways people contribute to society. The logistical challenges of managing a universal service program on that scale are also daunting to consider.However, I would argue that there is still potential merit to exploring voluntary national service initiatives that maintain citizen choice. By making it an optional opportunity rather than a requirement, we could cultivate civic engagement and unity without trampling on individual liberties. Voluntary programs have been successful in many countries - for example, AmeriCorps in the United States engages over 75,000 Americans annually in intensive community service work. When pursued by choice, these experiences can instill tremendous pride, skills, and perspectives that pay dividends for decades.',
      avatarAlt: 'Elizabeth Nelson',
      avatarSrc: 'https://github.com/shadcn.png',
      avatarFallback: 'EN',
      name: 'OpenAI',
      isUser: false,
    },
    {
      id: 2,
      text: 'Thank you for laying out a compelling case against mandating national public service. I agree that forcing all citizens into such service roles could infringe on personal freedoms and devalue the many other important ways people contribute to society. The logistical challenges of managing a universal service program on that scale are also daunting to consider.However, I would argue that there is still potential merit to exploring voluntary national service initiatives that maintain citizen choice.',
      avatarAlt: 'User',
      avatarSrc: 'https://github.com/shadcn.png',
      avatarFallback: 'U',
      isUser: true,
      name: 'Claude',
    },
    {
      id: 3,
      text: 'Thank you for laying out a compelling case against mandating national public service. I agree that forcing all citizens into such service roles could infringe on personal freedoms and devalue the many other important ways people contribute to society. The logistical challenges of managing a universal service program on that scale are also daunting to consider.However, I would argue that there is still potential merit to exploring voluntary national service initiatives that maintain citizen choice. By making it an optional opportunity rather than a requirement, we could cultivate civic engagement and unity without trampling on individual liberties. Voluntary programs have been successful in many countries - for example, AmeriCorps in the United States engages over 75,000 Americans annually in intensive community service work. When pursued by choice, these experiences can instill tremendous pride, skills, and perspectives that pay dividends for decades.',
      avatarAlt: 'Elizabeth Nelson',
      avatarSrc: 'https://github.com/shadcn.png',
      avatarFallback: 'EN',
      isUser: false,
      name: 'OpenAI',
    },
    {
      id: 4,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut',
      avatarAlt: 'User',
      avatarSrc: 'https://github.com/shadcn.png',
      avatarFallback: 'U',
      isUser: true,
      name: 'Claude',
    },
  ];

  return (
    <div className="bg-gray-100 flex flex-col py-10 rounded-lg">
      <div className="flex-grow overflow-y-auto p-4 space-y-8">
        {messages.map((message) => (
          <div
            className={`lg:flex items-start gap-1 space-y-2 lg:space-y-0 lg:space-x-2 ${
              message.isUser ? 'justify-end' : ''
            }`}
            key={message.id}
          >
            <div className="flex gap-2 max-w-fit items-center">
              {message.name === 'OpenAI' && <OpenAiIcon />}
              <h3
                className={`flex items-start font-bold lg:hidden space-x-2 ${
                  message.name === 'Claude' ? 'justify-end' : ''
                }`}
              >
                {message.name === 'OpenAI' && message.name}
              </h3>
            </div>
            <div>
              <div
                className={`${
                  message.name === 'Claude' ? 'justify-end pb-2' : ''
                } flex gap-2 justify-end`}
              >
                {message.name === 'Claude' && <ClaudeIcon />}
                <h3
                  className={` flex items-start pb-2 font-bold space-x-2 ${
                    message.name === 'Claude' ? 'justify-end' : ''
                  }`}
                >
                  {message.name === 'Claude' && message.name}
                </h3>
              </div>
              {!message.isUser && (
                <h3 className="lg:block -mt-2 pb-2.5 hidden font-bold">
                  {message.name}
                </h3>
              )}

              <div
                className={`rounded-lg p-4 lg:mt-1.5 shadow w-full max-w-full lg:max-w-[40rem] ${
                  message.name === 'Claude'
                    ? 'bg-gray-800 text-white'
                    : 'bg-white'
                }`}
              >
                <p>{message.text} </p>
              </div>
            </div>

            {/* {message.isUser && <ClaudeIcon />} */}
          </div>
        ))}
      </div>
    </div>
  );
}