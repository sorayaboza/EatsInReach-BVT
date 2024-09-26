"use client";

import { useState } from "react";

export default function Footer() {
  const sections = [
    {
      title: "Bay Valley Tech", href: 'https://www.bayvalleytech.com/'
    },
    {
      title: "Free Code Academy", href: 'https://www.bayvalleytech.com/about'
    },
    {
      title: "Contact", href: '/Pages/Contact'
    },
    {
      title: "About", href: '/Pages/About'
    },
    {
      items: [
        { text: "Instagram", imgSrc: '../../images/logo-instagram.svg', href: "https://www.instagram.com/bayvalleytech/" },
        { text: "Facebook", imgSrc: '../../images/logo-facebook.svg', href: "https://www.facebook.com/BayValleyTech" },
        { text: "LinkedIn", imgSrc: '../../images/logo-linkedin.svg', href: "https://www.linkedin.com/company/bay-valley-tech/posts/?feedView=all" },
      ],
    },
  ];

  return (
    <div className="bg-Yellow-Green w-full h-full">
      <div className="flex pt-4 pb-6 sm:flex">
        {sections.map((section, index) => (
          <div key={index} className="flex justify-center items-center">
            {section.title && (
            <a key={index} href={section.href} className="font-light px-3 text-[#4B5E54] hover:underline">{section.title}</a>
            )}
          </div>
        ))}
        <div className="ml-auto flex items-center">
  {sections[4].items.map((item, idx) => (
    <a key={idx} href={item.href} className="inline-flex justify-end px-3 py-3 hover:underline">
      <img 
        src={item.imgSrc} 
        className="w-10 h-10 sm:w-16 sm:h-16 md:w-10 md:h-10 mr-2 opacity-60" 
      />
    </a>
  ))}
</div>


      </div>
    </div>
  );
}