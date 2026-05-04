import Link from "next/link";
import { Cloud, Mail, MapPin, Phone } from "lucide-react";
import { GithubIcon, LinkedinIcon, XIcon } from "@/assets/icons/icons";

export function Footer() {
  return (
    <footer className="w-full bg-zinc-950 text-zinc-400 py-16 border-t border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="flex gap-12 mb-16">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 text-white">
              <Cloud className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold tracking-tighter italic">
                CloudVault
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Empowering the world with secure, decentralized, and
              lightning-fast cloud storage solutions. Your data, your control.
            </p>
            <div className="flex items-center gap-4">
              <SocialLink
                href="https://github.com/mm040401"
                icon={<GithubIcon className="h-5 w-5" />}
              />
              <SocialLink
                href="https://www.linkedin.com/in/mohammad-ali-1a7653245/"
                icon={<LinkedinIcon className="h-5 w-5" />}
              />
            </div>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-medium">
          <p className="text-zinc-500">
            &copy; {new Date().getFullYear()} Cloud Vault Inc. All rights
            reserved.
          </p>
          <div className="flex items-center gap-8">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="hover:text-white transition-colors"
            >
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all border border-zinc-800"
    >
      {icon}
    </Link>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="hover:text-white transition-colors block">
      {children}
    </Link>
  );
}
