import React from "react";

interface Props {
  src: string;
  text: string;
  desctiption: string;
  content?: any;
}

const ReusablePlaceholder = ({ content, desctiption, src, text }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="text-center">
        {
          <div className="mt-4">
            <div className="h-64 w-full">
              <lottie-player
                src={src}
                background=""
                speed="1"
                autoplay
                className="bg-gradient-to-r from-slate-100 to-pink-200"
              />
            </div>
            {
              <div className="flex flex-col items-center justify-center gap-7">
                <h2 className="text-2xl font-semibold text-gray-800">{text}</h2>
                <p className={`text-gray-600 md:w-[30rem] w-full`}>
                  {desctiption}
                </p>
                {content}
              </div>
            }
          </div>
        }
      </div>
    </div>
  );
};

export default ReusablePlaceholder;
