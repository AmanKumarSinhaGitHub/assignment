import Link from "next/link";
import { FaGithub, FaLinkedin, FaEnvelope, FaTwitter } from "react-icons/fa";
import { FC } from "react";

interface SocialLink {
  href: string;
  icon: FC<{ className?: string }>;
  label: string;
  external?: boolean;
}

interface FooterProps {
  className?: string;
}

const Footer: FC<FooterProps> = ({ className = "" }) => {
  const currentYear: number = new Date().getFullYear();

  const socialLinks: SocialLink[] = [
    {
      href: "https://github.com/AmanKumarSinhaGitHub",
      icon: FaGithub,
      label: "GitHub Profile",
      external: true,
    },
    {
      href: "https://www.linkedin.com/in/amankumarsinha/",
      icon: FaLinkedin,
      label: "LinkedIn Profile",
      external: true,
    },
    {
      href: "mailto:contactamankumarsinha@gmail.com",
      icon: FaEnvelope,
      label: "Email Contact",
    },
    {
      href: "https://twitter.com/AmanKumarSinha_",
      icon: FaTwitter,
      label: "Twitter Profile",
      external: true,
    },
  ];

  const renderSocialLink = (link: SocialLink, index: number) => {
    const IconComponent = link.icon;
    const linkProps = link.external
      ? {
        target: "_blank" as const,
        rel: "noopener noreferrer" as const,
      }
      : {};

    return (
      <Link
        key={index}
        href={link.href}
        {...linkProps}
        aria-label={link.label}
        className="group"
      >
        <IconComponent className="cursor-pointer transition-colors duration-200 hover:text-primary group-focus:text-primary" />
      </Link>
    );
  };

  return (
    <footer
      className={`lg:px-15 border-t border-gray-200 bg-white px-6 py-6 text-gray-900 dark:border-gray-600 dark:bg-gray-950 dark:text-white ${className}`}
      role="contentinfo"
    >
      <div className="flex items-center justify-center gap-4 text-lg">
        {socialLinks.map(renderSocialLink)}
      </div>

      <div className="mt-2 flex items-center justify-center text-base">
        <span>&copy; {currentYear} Aman Kumar Sinha</span>
        <span className="hidden sm:block">&nbsp;•&nbsp;All rights reserved</span>
      </div>
    </footer>
  );
};

export default Footer;