import { CarouselDemo } from './carousel';
import * as React from 'react';

export default function ListenDebate() {
  
  const items = [
    {
      title: 'Can alternative energy effectively replace fossil fuels?',
      description: 'An SEO podcast by Wix',
      tags: ['Technology', 'AI', 'Technology', 'Technology Technology'],
      date: 'May 16, 2024',
      duration: '60 MIN',
      progress: '2%',
    },
    {
      title: 'Should K-12 students dissect animals in science classrooms?',
      description: 'An SEO podcast by Wix',
      tags: ['Technology', 'AI'],
      date: 'May 16, 2024',
      duration: '60 MIN',
      progress: '80%',
    },
    {
      title:
        'Your weekly dose of SEO insights with a tinge of fun and something for everyone.',
      description: 'An SEO podcast by Wix',
      tags: ['Technology', 'AI'],
      date: 'May 16, 2024',
      duration: '60 MIN',
      progress: '2%',
    },
    {
      title:
        'Your weekly dose of SEO insights with a tinge of fun and something for everyone.',
      description: 'An SEO podcast by Wix',
      tags: ['Technology', 'AI'],
      date: 'May 16, 2024',
      duration: '60 MIN',
      progress: '2%',
    },
    {
      title:
        'Your weekly dose of SEO insights with a tinge of fun and something for everyone.',
      description: 'An SEO podcast by Wix',
      tags: ['Technology', 'AI'],
      date: 'May 16, 2024',
      duration: '60 MIN',
      progress: '2%',
    },
  ];

  return (
    <div className="sm:px-8 mx-auto w-full p-2 sm:p-10 bg-white">
      <CarouselDemo items={items} />
    </div>
  );
}

