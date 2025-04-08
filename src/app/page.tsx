import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black p-4">
      <div className="w-full max-w-4xl rounded-lg p-8">
        <div className="flex flex-col items-center justify-center">
          {/* SN Logo */}
          <div className="mt-8 mb-16">
            <Image
              src="/SN-logo.png"
              alt="SN Logo"
              width={400}
              height={300}
              priority
              className="mx-auto"
            />
          </div>

          {/* Buttons */}
          <div className="mt-8 flex w-full flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-8">
            <Link
              href="/create-agent"
              className="font-calibre-medium block max-w-[200px] rounded-lg bg-white px-4 py-2 text-lg text-black transition-all hover:bg-gray-200"
            >
              Create Agent
            </Link>

            <Link
              href="/dashboard"
              className="block bg-white text-black px-4 py-2 rounded-lg font-calibre-medium text-lg hover:bg-gray-200 transition-all max-w-[200px]"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
